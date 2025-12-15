import React, { useState } from "react";
import {
  Monitor,
  ShoppingCart,
  Store,
  Building,
  Umbrella,
  TrendingUp,
  Car,
  Refrigerator,
} from "lucide-react";

// ============== COLOR PALETTE ==============
const COLORS = {
  heroOrange: "#C4633E",
  heroTealStart: "#1B5B5F",
  heroTealEnd: "#246B6F",
  cream: "#F5E6D3",
  creamDark: "#E8D9C8",
  creamCta: "#F4C563",
  tealText: "#2B5F7C",
  white: "#FFFFFF",

  industry: {
    b2b: "#54606E",
    consumerGoods: "#E17741",
    consumerDurables: "#2B5F7C",
    retail: "#A5B581",
    banking: "#2C4056",
    insurance: "#A64444",
    mutualFund: "#5A7459",
    automotive: "#B85A3A",
  },

  industry2: {
    b2b: "#E17854",
    consumerGoods: "#F4B857",
    consumerDurables: "#4A6B5E",
    retail: "#E88A4A",
    banking: "#5B7B92",
    mutualFund: "#8B7B99",
    automotive: "#B54B3E",
  },
};

// ============== SECTION 1: HERO BANNER ==============
const section1Industries = [
  { name: "B2B", icon: Monitor, color: COLORS.industry.b2b },
  { name: "Consumer\nGoods", icon: ShoppingCart, color: COLORS.industry.consumerGoods },
  { name: "Consumer\nDurables", icon: Refrigerator, color: COLORS.industry.consumerDurables },
  { name: "Retail", icon: Store, color: COLORS.industry.retail },
  { name: "Banking", icon: Building, color: COLORS.industry.banking },
  { name: "Insurance", icon: Umbrella, color: COLORS.industry.insurance },
  { name: "Mutual\nFund", icon: TrendingUp, color: COLORS.industry.mutualFund },
  { name: "Automotive", icon: Car, color: COLORS.industry.automotive },
];

const HeroSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  return (
    <div
      style={{
        background: COLORS.heroOrange,
        padding: "80px 32px",
        borderRadius: "24px",
        marginBottom: "32px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Main Headline */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 900,
              color: COLORS.cream,
              lineHeight: 1.1,
              marginBottom: "48px",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            INDIA'S FIRST
            <br />
            SALES
            <br />
            SIMULATION
            <br />
            PLATFORM
          </h1>
          {/* Subheadings */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: "64px",
            }}
          >
            <p
              style={{
                fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                fontWeight: 600,
                color: COLORS.creamDark,
                margin: 0,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              YOU NAME THE SECTOR
            </p>
            <p
              style={{
                fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                fontWeight: 600,
                color: COLORS.creamDark,
                margin: 0,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              YOU CHOOSE THE PRODUCT
            </p>
            <p
              style={{
                fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                fontWeight: 600,
                color: COLORS.creamDark,
                margin: 0,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              WE CREATE A SALES SIMULATION FOR YOU
            </p>
          </div>
        </div>

        {/* Industry Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {section1Industries.map((industry, index) => {
            const IconComponent = industry.icon;
            const isHovered = hoveredIndex === index;
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  backgroundColor: industry.color,
                  borderRadius: "16px",
                  padding: "32px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "180px",
                  cursor: "pointer",
                  transition: "all 0.3s ease-out",
                  transform: isHovered ? "translateY(-8px)" : "translateY(0)",
                  boxShadow: isHovered
                    ? "0 12px 30px rgba(0, 0, 0, 0.25)"
                    : "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <IconComponent
                  size={56}
                  color={COLORS.cream}
                  strokeWidth={1.5}
                  style={{ marginBottom: "16px" }}
                />
                <span
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: COLORS.cream,
                    textAlign: "center",
                    whiteSpace: "pre-line",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {industry.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============== SECTION 2: LEARNING PLATFORM ==============
const industryIllustrations = {
  b2b: (
    <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="70" width="200" height="60" rx="8" fill="#E17854" />
      <circle cx="75" cy="55" r="18" fill="#F4D5B5" />
      <circle cx="145" cy="55" r="18" fill="#D9B08C" />
      <rect x="60" y="80" width="30" height="40" rx="6" fill="#15394B" />
      <rect x="130" y="80" width="30" height="40" rx="6" fill="#15394B" />
      <rect x="96" y="95" width="28" height="10" rx="5" fill="#F4D5B5" />
    </svg>
  ),
  consumerGoods: (
    <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="70" width="200" height="60" rx="8" fill="#F4B857" />
      <rect x="70" y="35" width="80" height="40" rx="4" fill="#E5E0D7" />
      <rect x="82" y="45" width="18" height="12" rx="2" fill="#E17854" />
      <rect x="104" y="45" width="18" height="12" rx="2" fill="#5B7B92" />
      <circle cx="95" cy="85" r="18" fill="#E17854" />
      <rect x="85" y="102" width="20" height="20" rx="3" fill="#7A5335" />
      <circle cx="150" cy="92" r="16" fill="#D9B08C" />
      <rect x="140" y="106" width="20" height="18" rx="3" fill="#5B7B92" />
    </svg>
  ),
  consumerDurables: (
    <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="70" width="200" height="60" rx="8" fill="#4A6B5E" />
      <circle cx="70" cy="90" r="18" fill="#D9B08C" />
      <rect x="60" y="108" width="20" height="20" rx="3" fill="#7A5335" />
      <rect x="100" y="70" width="90" height="50" rx="6" stroke="#0F2A3A" strokeWidth="6" fill="none" />
      <rect x="135" y="122" width="20" height="8" rx="2" fill="#0F2A3A" />
    </svg>
  ),
  retail: (
    <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="70" width="200" height="60" rx="8" fill="#E88A4A" />
      <circle cx="80" cy="95" r="18" fill="#E17854" />
      <rect x="70" y="113" width="20" height="18" rx="3" fill="#586D81" />
      <circle cx="140" cy="92" r="18" fill="#F4D5B5" />
      <rect x="120" y="102" width="40" height="22" rx="4" fill="#15394B" />
      <rect x="70" y="120" width="100" height="14" rx="6" fill="#6A8CA1" />
    </svg>
  ),
  banking: (
    <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="70" width="200" height="60" rx="8" fill="#5B7B92" />
      <rect x="85" y="105" width="50" height="12" rx="4" fill="#7A5335" />
      <circle cx="95" cy="80" r="16" fill="#1E354B" />
      <circle cx="115" cy="82" r="16" fill="#D9B08C" />
      <circle cx="135" cy="80" r="16" fill="#E17854" />
    </svg>
  ),
  mutualFund: (
    <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="70" width="200" height="60" rx="8" fill="#8B7B99" />
      <circle cx="82" cy="86" r="16" fill="#1E354B" />
      <circle cx="112" cy="88" r="16" fill="#F4D5B5" />
      <rect x="150" y="55" width="50" height="40" rx="4" fill="#F4F0E6" />
      <polyline points="156,85 168,72 182,78 194,65" stroke="#E17854" strokeWidth="5" fill="none" />
      <rect x="156" y="85" width="10" height="10" fill="#2B5F7C" />
      <rect x="170" y="80" width="10" height="15" fill="#4A6B5E" />
      <rect x="184" y="75" width="10" height="20" fill="#5B7B92" />
    </svg>
  ),
  automotive: (
    <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="70" width="200" height="60" rx="8" fill="#B54B3E" />
      <circle cx="90" cy="90" r="16" fill="#1E354B" />
      <circle cx="125" cy="95" r="16" fill="#F4D5B5" />
      <rect x="120" y="95" width="80" height="34" rx="18" fill="#E17854" />
      <rect x="150" y="90" width="40" height="14" rx="6" fill="#7AC4E9" />
      <circle cx="150" cy="120" r="10" fill="#1E354B" />
      <circle cx="184" cy="120" r="10" fill="#1E354B" />
    </svg>
  ),
};

const section2Industries = [
  {
    name: "B2B / Enterprise Sales",
    color: COLORS.industry2.b2b,
    illustration: industryIllustrations.b2b,
  },
  {
    name: "Consumer Goods",
    color: COLORS.industry2.consumerGoods,
    illustration: industryIllustrations.consumerGoods,
  },
  {
    name: "Consumer Durables",
    color: COLORS.industry2.consumerDurables,
    illustration: industryIllustrations.consumerDurables,
  },
  {
    name: "Retail",
    color: COLORS.industry2.retail,
    illustration: industryIllustrations.retail,
  },
  {
    name: "Banking",
    color: COLORS.industry2.banking,
    illustration: industryIllustrations.banking,
  },
  {
    name: "Mutual Fund",
    color: COLORS.industry2.mutualFund,
    illustration: industryIllustrations.mutualFund,
  },
  {
    name: "Automotive",
    color: COLORS.industry2.automotive,
    illustration: industryIllustrations.automotive,
    isWide: true,
  },
];

const IndustryCard = ({ industry, isWide }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: COLORS.cream,
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease-out",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 12px 30px rgba(0, 0, 0, 0.2)"
          : "0 4px 6px rgba(0, 0, 0, 0.1)",
        gridColumn: isWide ? "span 1" : undefined,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          backgroundColor: industry.color,
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {industry.illustration}
        </div>
      </div>
      <div
        style={{
          padding: "24px",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: COLORS.tealText,
            textAlign: "center",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {industry.name}
        </span>
      </div>
    </div>
  );
};

const LearningSection = () => {
  const [ctaHovered, setCtaHovered] = useState(false);
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${COLORS.heroTealStart} 0%, ${COLORS.heroTealEnd} 100%)`,
        padding: "80px 32px",
        borderRadius: "24px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header + Video Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "center",
            marginBottom: "64px",
          }}
          className="header-video-section"
        >
          {/* Section Header */}
          <div>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 900,
                color: COLORS.cream,
                lineHeight: 1.2,
                marginBottom: "24px",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              LEARN SALES THE WAY
              <br />
              IT'S ACTUALLY DONE –
              <br />
              SECTOR BY SECTOR
            </h2>
            <p
              style={{
                fontSize: "clamp(1rem, 2vw, 1.5rem)",
                color: COLORS.creamDark,
                fontWeight: 500,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Practice real sales decisions across diverse industries
            </p>
          </div>

          {/* Video Section */}
          <div
            style={{
              width: "100%",
            }}
          >
            <div
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
                height: "455px",
              }}
            >
              <video
                autoPlay
                loop
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  pointerEvents: "none",
                }}
                onContextMenu={(e) => e.preventDefault()}
              >
                <source
                  src="https://rrlsindetuurkyvmwijj.supabase.co/storage/v1/object/sign/xactionimg/xactvideo.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iM2Q4NmE4Ni1jNDQ1LTRkZWQtYWJiNi1hNGNkMmUyZDhlY2YiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ4YWN0aW9uaW1nL3hhY3R2aWRlby5tcDQiLCJpYXQiOjE3NjU4MDA3NzAsImV4cCI6MTc5NzMzNjc3MH0.79I2YD93pWrkaTdm00hrmI9pTWDlsxNP0FSOYP5Tqp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
        
        <style>
          {`
            @media (max-width: 768px) {
              .header-video-section {
                grid-template-columns: 1fr !important;
                gap: 32px !important;
              }
            }
          `}
        </style>

        {/* Industry Cards Grid - 3 Rows of 2 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {section2Industries.slice(0, 6).map((industry, index) => (
            <IndustryCard key={index} industry={industry} />
          ))}
        </div>

        {/* Bottom Section: CTA + Automotive Card */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            alignItems: "stretch",
          }}
        >
          {/* CTA Left Side */}
          <div
            style={{
              background: COLORS.cream,
              borderRadius: "12px",
              padding: "48px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              transition: "transform 0.3s ease-out, box-shadow 0.3s ease-out",
              transform: ctaHovered ? "translateY(-6px)" : "translateY(0)",
              boxShadow: ctaHovered
                ? "0 10px 24px rgba(0,0,0,0.2)"
                : "0 4px 6px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
          >
            <h3
              style={{
                fontSize: "clamp(2rem, 3vw, 3rem)",
                fontWeight: 900,
                color: COLORS.tealText,
                marginBottom: "16px",
                fontFamily: "'Poppins', sans-serif",
                lineHeight: 1.1,
              }}
            >
              SALES
              <br />
              SIMULATION
            </h3>
            <p
              style={{
                fontSize: "1.125rem",
                color: COLORS.tealText,
                marginBottom: "32px",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 500,
              }}
            >
              One platform. Multiple industries
            </p>
          </div>

          {/* Automotive Card Right Side */}
          <IndustryCard industry={section2Industries[6]} isWide />
        </div>
      </div>
    </div>
  );
};

// ============== MAIN COMPONENT ==============
const Home = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a237e 0%, #4285f4 50%, #90caf9 100%)",
        padding: "32px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <HeroSection />
      <LearningSection />

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          marginTop: "48px",
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: "0.875rem",
        }}
      >
        <p style={{ marginBottom: "8px" }}>© 2025 atkind. All rights reserved.</p>
        <p>
          Powered by{" "}
          <a
            href="https://atkind.com"
            style={{
              color: "#FFFFFF",
              fontWeight: "600",
              textDecoration: "underline",
            }}
          >
            atkind.com
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Home;
