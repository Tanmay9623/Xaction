import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Corporate Simulations Page
 * 
 * Displays various corporate training simulations for professional development.
 * Each simulation card represents a different corporate training scenario.
 */
const CorporateSimulations = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  // Corporate simulations data
  const corporateSimulations = [
    {
      id: 1,
      name: "Leadership & Management",
      description: "Develop leadership skills through strategic decision-making scenarios and team management challenges.",
      icon: "👔",
      color: "blue",
      duration: "6-8 weeks",
      level: "Advanced",
      participants: "20-30"
    },
    {
      id: 2,
      name: "Sales & Marketing Strategy",
      description: "Master modern sales techniques and marketing strategies in competitive business environments.",
      icon: "📊",
      color: "green",
      duration: "4-6 weeks",
      level: "Intermediate",
      participants: "15-25"
    },
    {
      id: 3,
      name: "Operations Management",
      description: "Optimize business operations, supply chain, and process management for maximum efficiency.",
      icon: "⚙️",
      color: "purple",
      duration: "5-7 weeks",
      level: "Advanced",
      participants: "10-20"
    },
    {
      id: 4,
      name: "Financial Planning & Analysis",
      description: "Navigate complex financial scenarios, budgeting, and investment decision-making processes.",
      icon: "💰",
      color: "amber",
      duration: "6-8 weeks",
      level: "Advanced",
      participants: "15-20"
    },
    {
      id: 5,
      name: "Human Resources Management",
      description: "Handle employee relations, talent acquisition, and organizational development challenges.",
      icon: "👥",
      color: "pink",
      duration: "4-6 weeks",
      level: "Intermediate",
      participants: "20-30"
    },
    {
      id: 6,
      name: "Project Management",
      description: "Lead cross-functional projects, manage resources, and deliver results within constraints.",
      icon: "📋",
      color: "indigo",
      duration: "5-6 weeks",
      level: "Intermediate",
      participants: "15-25"
    },
    {
      id: 7,
      name: "Digital Transformation",
      description: "Drive organizational change through technology adoption and digital innovation strategies.",
      icon: "🚀",
      color: "cyan",
      duration: "6-8 weeks",
      level: "Advanced",
      participants: "10-15"
    },
    {
      id: 8,
      name: "Crisis Management",
      description: "Respond to business emergencies and critical situations with effective leadership and communication.",
      icon: "🚨",
      color: "red",
      duration: "3-4 weeks",
      level: "Advanced",
      participants: "10-20"
    },
    {
      id: 9,
      name: "Customer Experience",
      description: "Design and implement customer-centric strategies to enhance satisfaction and loyalty.",
      icon: "⭐",
      color: "yellow",
      duration: "4-5 weeks",
      level: "Intermediate",
      participants: "15-25"
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: { 
        bg: 'bg-blue-50', 
        hover: 'hover:bg-blue-100', 
        border: 'border-blue-300', 
        text: 'text-blue-700', 
        badge: 'bg-blue-200',
        gradient: 'from-blue-500 to-blue-600'
      },
      green: { 
        bg: 'bg-green-50', 
        hover: 'hover:bg-green-100', 
        border: 'border-green-300', 
        text: 'text-green-700', 
        badge: 'bg-green-200',
        gradient: 'from-green-500 to-green-600'
      },
      purple: { 
        bg: 'bg-purple-50', 
        hover: 'hover:bg-purple-100', 
        border: 'border-purple-300', 
        text: 'text-purple-700', 
        badge: 'bg-purple-200',
        gradient: 'from-purple-500 to-purple-600'
      },
      amber: { 
        bg: 'bg-amber-50', 
        hover: 'hover:bg-amber-100', 
        border: 'border-amber-300', 
        text: 'text-amber-700', 
        badge: 'bg-amber-200',
        gradient: 'from-amber-500 to-amber-600'
      },
      pink: { 
        bg: 'bg-pink-50', 
        hover: 'hover:bg-pink-100', 
        border: 'border-pink-300', 
        text: 'text-pink-700', 
        badge: 'bg-pink-200',
        gradient: 'from-pink-500 to-pink-600'
      },
      indigo: { 
        bg: 'bg-indigo-50', 
        hover: 'hover:bg-indigo-100', 
        border: 'border-indigo-300', 
        text: 'text-indigo-700', 
        badge: 'bg-indigo-200',
        gradient: 'from-indigo-500 to-indigo-600'
      },
      cyan: { 
        bg: 'bg-cyan-50', 
        hover: 'hover:bg-cyan-100', 
        border: 'border-cyan-300', 
        text: 'text-cyan-700', 
        badge: 'bg-cyan-200',
        gradient: 'from-cyan-500 to-cyan-600'
      },
      red: { 
        bg: 'bg-red-50', 
        hover: 'hover:bg-red-100', 
        border: 'border-red-300', 
        text: 'text-red-700', 
        badge: 'bg-red-200',
        gradient: 'from-red-500 to-red-600'
      },
      yellow: { 
        bg: 'bg-yellow-50', 
        hover: 'hover:bg-yellow-100', 
        border: 'border-yellow-300', 
        text: 'text-yellow-700', 
        badge: 'bg-yellow-200',
        gradient: 'from-yellow-500 to-yellow-600'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  const getLevelColor = (level) => {
    const levelMap = {
      'Beginner': 'bg-green-100 text-green-700',
      'Intermediate': 'bg-blue-100 text-blue-700',
      'Advanced': 'bg-purple-100 text-purple-700'
    };
    return levelMap[level] || levelMap.Intermediate;
  };

  const handleSimulationClick = (simulation) => {
    // Store selected simulation in localStorage
    localStorage.setItem('selectedCorporateSimulation', JSON.stringify(simulation));
    // Navigate to corporate login page (separate from MBA simulation login)
    navigate('/corporate-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
              Corporate Simulations
            </h1>
            <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto text-blue-100">
              Transform your workforce with immersive, real-world business simulations designed for professional development and corporate training excellence.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm sm:text-base">
                🎯 Real-World Scenarios
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm sm:text-base">
                📈 Measurable Results
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm sm:text-base">
                👥 Team Collaboration
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulations Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {corporateSimulations.map((simulation) => {
            const colors = getColorClasses(simulation.color);
            const isHovered = hoveredCard === simulation.id;

            return (
              <div
                key={simulation.id}
                onClick={() => handleSimulationClick(simulation)}
                onMouseEnter={() => setHoveredCard(simulation.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`cursor-pointer ${colors.bg} ${colors.hover} border-2 ${colors.border} transition-all duration-300 p-5 sm:p-6 rounded-xl shadow-md hover:shadow-2xl transform hover:-translate-y-2 relative overflow-hidden`}
              >
                {/* Icon Circle */}
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-3xl sm:text-4xl mb-4 shadow-lg transform transition-transform duration-300 ${isHovered ? 'scale-110 rotate-12' : ''}`}>
                  {simulation.icon}
                </div>

                {/* Title */}
                <h2 className={`text-xl sm:text-2xl font-bold ${colors.text} mb-3`}>
                  {simulation.name}
                </h2>

                {/* Description */}
                <p className="text-gray-700 text-sm sm:text-base mb-4 line-clamp-3">
                  {simulation.description}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`${getLevelColor(simulation.level)} px-3 py-1 rounded-full text-xs font-semibold`}>
                    {simulation.level}
                  </span>
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                    ⏱️ {simulation.duration}
                  </span>
                </div>

                {/* Participants Info */}
                <div className="flex items-center text-gray-600 text-sm mb-4">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span>{simulation.participants} participants</span>
                </div>

                {/* Action Button */}
                <button className={`w-full ${colors.text} font-semibold py-3 px-4 rounded-lg border-2 ${colors.border} ${colors.hover} transition-all duration-300 text-sm sm:text-base ${isHovered ? 'transform scale-105' : ''}`}>
                  Start Simulation →
                </button>

                {/* Decorative corner element */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${colors.gradient} opacity-10 rounded-full transform transition-all duration-500 ${isHovered ? 'scale-150' : 'scale-100'}`}></div>
              </div>
            );
          })}
        </div>

        {/* Call to Action Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-center text-white shadow-2xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Ready to Transform Your Team?
          </h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto text-blue-100">
            Contact our corporate training team to customize simulations for your organization's specific needs.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-white text-blue-600 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            Contact Us for Enterprise Solutions
          </button>
        </div>

        {/* Back to Simulations */}
        <div className="text-center mt-8 sm:mt-12">
          <button
            onClick={() => navigate('/simulation')}
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm sm:text-base inline-flex items-center transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to MBA Simulations
          </button>
        </div>
      </div>
    </div>
  );
};

export default CorporateSimulations;
