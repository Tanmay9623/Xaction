import './App.css';
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import { useEffect } from 'react';

import Home from "./pages/Home";
import About from './pages/About';
import Contact from './pages/Contact';
import Simulation from './pages/Simulation';
import CorporateSimulations from './pages/CorporateSimulations';
import GameSimulation from './pages/GameSimulation';
import GameDistributionIntro from './pages/game-simulation/GameDistributionIntro';
import GameDistributionInventory from './pages/game-simulation/GameDistributionInventory';
import GameDistributionAcquisition from './pages/game-simulation/GameDistributionAcquisition';
import GameDistributionDecisions from './pages/game-simulation/GameDistributionDecisions';
import GameDistributionTradeScheme from './pages/game-simulation/GameDistributionTradeScheme';
import GameDistributionCreditControl from './pages/game-simulation/GameDistributionCreditControl';
import GameDistributionSalesTeam from './pages/game-simulation/GameDistributionSalesTeam';
import GameDistributionSupplyDiscipline from './pages/game-simulation/GameDistributionSupplyDiscipline';
import GameDistributionRoundResult from './pages/game-simulation/GameDistributionRoundResult';
import GameDistributionRound2Intro from './pages/game-simulation/GameDistributionRound2Intro';
import GameDistributionRound2Inventory from './pages/game-simulation/GameDistributionRound2Inventory';
import GameDistributionRound2Result from './pages/game-simulation/GameDistributionRound2Result';
import GameDistributionRound3Intro from './pages/game-simulation/GameDistributionRound3Intro';
import GameDistributionRound3Inventory from './pages/game-simulation/GameDistributionRound3Inventory';
import GameDistributionRound3TradeScheme from './pages/game-simulation/GameDistributionRound3TradeScheme';
import GameDistributionRound3CreditControl from './pages/game-simulation/GameDistributionRound3CreditControl';
import GameDistributionRound3SalesTeam from './pages/game-simulation/GameDistributionRound3SalesTeam';
import GameDistributionRound3SupplyDiscipline from './pages/game-simulation/GameDistributionRound3SupplyDiscipline';
import GameDistributionRound3Result from './pages/game-simulation/GameDistributionRound3Result';
import GameDistributionRound4Intro from './pages/game-simulation/GameDistributionRound4Intro';
import Registration from './pages/Registration';
import Login from './pages/Login';
import CorporateLogin from './pages/CorporateLogin';
import SuperAdminDashboard from './pages/SuperAdminDashboard.jsx/SuperAdminDashboard';
import Licenses from './pages/Licenses';
import EnhancedQuizBuilder from './components/EnhancedQuizBuilder';
import Reports from './components/Reports';
import Settings from './components/Settings';
import AdminDashboard from './components/AdminDashboard';
import EnhancedStudentDashboard from './components/student/EnhancedStudentDashboard';
import CollegeAdminDashboard from './components/CollegeAdminDashboard';
import CorporateParticipantDashboard from './components/corporate/CorporateParticipantDashboard';

function App() {
  useEffect(() => {
    // Suppression removed to allow debugging and standard UI alerts/confirms
  }, []);
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    return { isAuthenticated: !!token, role: userRole };
  };

  const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, role } = checkAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <QuizProvider>
      <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/about" element={<><Navbar /><About /></>} />
        <Route path="/registration" element={<><Navbar /><Registration /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /></>} />
        <Route path="/simulation" element={<><Navbar /><Simulation /></>} />
        <Route path="/corporate-simulations" element={<><Navbar /><CorporateSimulations /></>} />
        <Route path="/game-simulation" element={<><Navbar /><GameSimulation /></>} />
        <Route path="/game-distribution/intro" element={<GameDistributionIntro />} />
        <Route path="/game-distribution/inventory" element={<GameDistributionInventory />} />
        <Route path="/game-distribution/acquisition" element={<GameDistributionAcquisition />} />
        <Route path="/game-distribution/decisions" element={<GameDistributionDecisions />} />
        <Route path="/game-distribution/trade-scheme" element={<GameDistributionTradeScheme />} />
        <Route path="/game-distribution/credit-control" element={<GameDistributionCreditControl />} />
        <Route path="/game-distribution/sales-team" element={<GameDistributionSalesTeam />} />
        <Route path="/game-distribution/supply-discipline" element={<GameDistributionSupplyDiscipline />} />
        <Route path="/game-distribution/round-result" element={<GameDistributionRoundResult />} />
        <Route path="/game-distribution/round2-intro" element={<GameDistributionRound2Intro />} />
        <Route path="/game-distribution/round2-inventory" element={<GameDistributionRound2Inventory />} />
        <Route path="/game-distribution/round2-result" element={<GameDistributionRound2Result />} />
        <Route path="/game-distribution/round3-intro" element={<GameDistributionRound3Intro />} />
        <Route path="/game-distribution/round3-inventory" element={<GameDistributionRound3Inventory />} />
        <Route path="/game-distribution/round3-trade-scheme" element={<GameDistributionRound3TradeScheme />} />
        <Route path="/game-distribution/round3-credit-control" element={<GameDistributionRound3CreditControl />} />
        <Route path="/game-distribution/round3-sales-team" element={<GameDistributionRound3SalesTeam />} />
        <Route path="/game-distribution/round3-supply-discipline" element={<GameDistributionRound3SupplyDiscipline />} />
        <Route path="/game-distribution/round3-result" element={<GameDistributionRound3Result />} />
        <Route path="/game-distribution/round4-intro" element={<GameDistributionRound4Intro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/corporate-login" element={<CorporateLogin />} />

        {/* Protected Student Routes */}
        <Route path="/be/student/*" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Routes>
              <Route path="dashboard" element={<EnhancedStudentDashboard />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Alternative Student Route (without /be prefix) */}
        <Route path="/student/*" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Routes>
              <Route path="dashboard" element={<EnhancedStudentDashboard />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Protected Admin Routes */}
        <Route path="/be/admin/*" element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="management" element={<AdminDashboard activeTab="management" />} />
              <Route path="scores" element={<AdminDashboard activeTab="scores" />} />
              <Route path="quiz-management" element={<EnhancedQuizBuilder />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Alternative Admin Route (without /be prefix) */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="management" element={<AdminDashboard activeTab="management" />} />
              <Route path="scores" element={<AdminDashboard activeTab="scores" />} />
              <Route path="quiz-management" element={<EnhancedQuizBuilder />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Protected College Admin Routes */}
        <Route path="/college-admin/*" element={
          <ProtectedRoute allowedRoles={['collegeAdmin']}>
            <Routes>
              <Route path="/dashboard" element={<CollegeAdminDashboard />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Protected Super Admin Routes */}
        <Route path="/superadmin/*" element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <Routes>
              <Route path="/dashboard" element={<SuperAdminDashboard />} />
              <Route path="/licenses" element={<Licenses />} />
              <Route path="/quizzes" element={<EnhancedQuizBuilder />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Protected Corporate Participant Routes */}
        <Route path="/corporate/participant/*" element={
          <ProtectedRoute allowedRoles={['participant']}>
            <Routes>
              <Route path="dashboard" element={<CorporateParticipantDashboard />} />
            </Routes>
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
    </QuizProvider>
  );
}

export default App;