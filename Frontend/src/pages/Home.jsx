import React, { useState, useRef, useEffect } from "react";
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
        padding: "clamp(40px, 8vw, 80px) clamp(16px, 4vw, 32px)",
        borderRadius: "24px",
        marginBottom: "32px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Main Headline */}
        <div style={{ textAlign: "center", marginBottom: "clamp(32px, 6vw, 64px)" }}>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 5rem)",
              fontWeight: 900,
              color: COLORS.cream,
              lineHeight: 1.1,
              marginBottom: "clamp(24px, 5vw, 48px)",
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
              gap: "12px",
              marginBottom: "clamp(32px, 6vw, 64px)",
            }}
          >
            <p
              style={{
                fontSize: "clamp(1rem, 2vw, 1.75rem)",
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
                fontSize: "clamp(1rem, 2vw, 1.75rem)",
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
                fontSize: "clamp(1rem, 2vw, 1.75rem)",
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
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
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
                  padding: "clamp(24px, 3vw, 32px) 20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "160px",
                  cursor: "pointer",
                  transition: "all 0.3s ease-out",
                  transform: isHovered ? "translateY(-8px)" : "translateY(0)",
                  boxShadow: isHovered
                    ? "0 12px 30px rgba(0, 0, 0, 0.25)"
                    : "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <IconComponent
                  size={48}
                  color={COLORS.cream}
                  strokeWidth={1.5}
                  style={{ marginBottom: "12px" }}
                />
                <span
                  style={{
                    fontSize: "clamp(0.95rem, 1.5vw, 1.125rem)",
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
    <svg width="100%" height="100%" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="70" width="200" height="60" rx="8" fill="#E17854" />
      <circle cx="75" cy="55" r="18" fill="#F4D5B5" />
      <circle cx="145" cy="55" r="18" fill="#D9B08C" />
      <rect x="60" y="80" width="30" height="40" rx="6" fill="#15394B" />
      <rect x="130" y="80" width="30" height="40" rx="6" fill="#15394B" />
      <rect x="96" y="95" width="28" height="10" rx="5" fill="#F4D5B5" />
    </svg>
  ),
  consumerGoods: (
    <svg width="100%" height="100%" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <svg width="100%" height="100%" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="70" width="200" height="60" rx="8" fill="#4A6B5E" />
      <circle cx="70" cy="90" r="18" fill="#D9B08C" />
      <rect x="60" y="108" width="20" height="20" rx="3" fill="#7A5335" />
      <rect x="100" y="70" width="90" height="50" rx="6" stroke="#0F2A3A" strokeWidth="6" fill="none" />
      <rect x="135" y="122" width="20" height="8" rx="2" fill="#0F2A3A" />
    </svg>
  ),
  retail: (
    <svg width="100%" height="100%" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="70" width="200" height="60" rx="8" fill="#E88A4A" />
      <circle cx="80" cy="95" r="18" fill="#E17854" />
      <rect x="70" y="113" width="20" height="18" rx="3" fill="#586D81" />
      <circle cx="140" cy="92" r="18" fill="#F4D5B5" />
      <rect x="120" y="102" width="40" height="22" rx="4" fill="#15394B" />
      <rect x="70" y="120" width="100" height="14" rx="6" fill="#6A8CA1" />
    </svg>
  ),
  banking: (
    <svg width="100%" height="100%" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="70" width="200" height="60" rx="8" fill="#5B7B92" />
      <rect x="85" y="105" width="50" height="12" rx="4" fill="#7A5335" />
      <circle cx="95" cy="80" r="16" fill="#1E354B" />
      <circle cx="115" cy="82" r="16" fill="#D9B08C" />
      <circle cx="135" cy="80" r="16" fill="#E17854" />
    </svg>
  ),
  mutualFund: (
    <svg width="100%" height="100%" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <svg width="100%" height="100%" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  },
];

const IndustryCard = ({ industry }) => {
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
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          backgroundColor: industry.color,
          height: "180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        {industry.illustration}
      </div>
      <div
        style={{
          padding: "20px",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: "clamp(1rem, 1.8vw, 1.25rem)",
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
  const videoRef = useRef(null);
  const [showPlayOverlay, setShowPlayOverlay] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Try to play unmuted; if autoplay with sound is blocked by browser,
    // mute playback and show an overlay so the user can enable audio.
    v.muted = false;
    const p = v.play();
    if (p !== undefined) {
      p
        .then(() => {
          setShowPlayOverlay(false);
        })
        .catch(() => {
          v.muted = true;
          setShowPlayOverlay(true);
        });
    }
  }, []);

  const handleEnableAudio = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v
      .play()
      .then(() => setShowPlayOverlay(false))
      .catch(() => setShowPlayOverlay(true));
  };

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${COLORS.heroTealStart} 0%, ${COLORS.heroTealEnd} 100%)`,
        padding: "clamp(40px, 8vw, 80px) clamp(16px, 4vw, 32px)",
        borderRadius: "24px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <style>
          {`
            @media (min-width: 769px) {
              .header-video-section {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 48px;
                align-items: center;
                margin-bottom: 64px;
              }
            }
            @media (max-width: 768px) {
              .header-video-section {
                display: flex;
                flex-direction: column;
                gap: 32px;
                margin-bottom: 48px;
              }
              .video-container-wrapper {
                height: 360px !important;
              }
            }
          `}
        </style>

        {/* Header + Video Row */}
        <div className="header-video-section">
          {/* Section Header */}
          <div>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 4vw, 3.5rem)",
                fontWeight: 900,
                color: COLORS.cream,
                lineHeight: 1.2,
                marginBottom: "20px",
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
                fontSize: "clamp(1rem, 1.8vw, 1.5rem)",
                color: COLORS.creamDark,
                fontWeight: 500,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Practice real sales decisions across diverse industries
            </p>
          </div>

          {/* Video Section */}
          <div style={{ width: "100%" }}>
            <div
              className="video-container-wrapper"
              style={{
                position: "relative",
                background: "rgba(0, 0, 0, 0.3)",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
                height: "460px",
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                loop
                playsInline
                controls
                preload="auto"
                crossOrigin="anonymous"
                controlsList="nodownload"
                disablePictureInPicture
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  pointerEvents: "auto",
                }}
                onContextMenu={(e) => e.preventDefault()}
              >
                <source
                  src="https://dntsugcjjxkyqlaufwyw.supabase.co/storage/v1/object/public/xactin%20vd/xactvideo.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

              {showPlayOverlay && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 12,
                    background: "rgba(0,0,0,0.35)",
                  }}
                >
                  <button
                    onClick={handleEnableAudio}
                    style={{
                      background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                      color: "white",
                      border: "none",
                      padding: "0.75rem 1.25rem",
                      borderRadius: 10,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Enable Sound
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Industry Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "24px",
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
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            alignItems: "stretch",
          }}
        >
          {/* CTA Left Side */}
          <div
            style={{
              background: COLORS.cream,
              borderRadius: "12px",
              padding: "clamp(32px, 5vw, 48px) clamp(24px, 4vw, 32px)",
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
                fontSize: "clamp(1.75rem, 3vw, 3rem)",
                fontWeight: 900,
                color: COLORS.tealText,
                marginBottom: "12px",
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
                fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
                color: COLORS.tealText,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 500,
              }}
            >
              One platform. Multiple industries
            </p>
          </div>

          {/* Automotive Card Right Side */}
          <IndustryCard industry={section2Industries[6]} />
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
        padding: "clamp(16px, 3vw, 32px)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <HeroSection />
      <LearningSection />

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          marginTop: "clamp(32px, 5vw, 48px)",
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: "0.875rem",
          padding: "0 16px",
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
