import { supabase } from './supabaseClient';

/**
 * Saves game simulation data to Supabase.
 * @param {string} userId - Unique identifier for the user/session.
 * @param {string} round - Current round number.
 * @param {Object} data - The game state data to persist.
 */
export const saveGameState = async (userId, round, data) => {
  try {
    const { data: savedData, error } = await supabase
      .from('game_simulation_data')
      .upsert({ 
        user_id: userId, 
        round: round, 
        state_data: data,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id, round' });

    if (error) throw error;
    return { success: true, data: savedData };
  } catch (error) {
    console.error('Error saving game state:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Saves the final game result after Round 7.
 * Dual-write strategy:
 *   1. `game_final_results` — full data for the Admin Panel to display
 *   2. `user_game_results`  — just user_name, for GameLogin replay prevention
 */
export const saveFinalResult = async (userId, resultData) => {
  try {
    // ── Replay prevention check (GameLogin reads user_game_results) ──
    const { data: existing, error: checkError } = await supabase
      .from('user_game_results')
      .select('user_name')
      .eq('user_name', resultData.user_name)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existing) {
      console.log('User has already submitted results, skipping save.');
      return { success: true, alreadyExists: true, data: existing };
    }

    // ── Save full results to game_final_results (for Admin Panel) ──
    const { data: savedResult, error: insertError } = await supabase
      .from('game_final_results')
      .insert([{
        user_name: resultData.user_name,
        distributor_roi: resultData.distributor_roi,
        retailer_satisfaction: resultData.retailer_satisfaction,
        cash_in_hand: resultData.cash_in_hand,
        cash_flow_health: resultData.cash_flow_health,
        total_score: resultData.total_score,
        market_share: resultData.market_share,
        final_state_data: resultData.final_state_data,
        completed_at: new Date().toISOString(),
      }]);

    if (insertError) throw insertError;

    // ── Mark in user_game_results to block replay ──
    await supabase
      .from('user_game_results')
      .insert([{ user_name: resultData.user_name }]);

    return { success: true, data: savedResult };
  } catch (error) {
    console.error('Error saving final game result:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Checks if a user has already completed the game simulation.
 */
export const checkIfGameCompleted = async (userId) => {
  if (!userId) return false;
  try {
    const { data, error } = await supabase
      .from('game_final_results')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking game completion:', error.message);
    return false;
  }
};

/**
 * Fetches game simulation data from Supabase.
 * @param {string} userId - Unique identifier for the user/session.
 * @param {string} round - Round number to fetch (optional).
 */
export const getGameState = async (userId, round = null) => {
  try {
    let query = supabase
      .from('game_simulation_data')
      .select('*')
      .eq('user_id', userId);

    if (round) {
      query = query.eq('round', round);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching game state:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Logs a specific game decision or event.
 * @param {string} userId - Unique identifier for the user.
 * @param {string} eventType - Type of event (e.g., 'INVENTORY_PURCHASE').
 * @param {Object} details - Event details.
 */
export const logGameEvent = async (userId, eventType, details) => {
  try {
    const { data, error } = await supabase
      .from('game_events')
      .insert({
        user_id: userId,
        event_type: eventType,
        details: details,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error logging game event:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Tests the connection to Supabase.
 */
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('game_simulation_data').select('id').limit(1);
    if (error) {
      if (error.code === 'PGRST116') {
        // Table exists but is empty, connection is good
        console.log('Supabase connected successfully (Table exists but is empty)');
        return { success: true, message: 'Connected' };
      }
      throw error;
    }
    console.log('Supabase connected successfully!');
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection failed:', error.message);
    return { success: false, error: error.message };
  }
};
