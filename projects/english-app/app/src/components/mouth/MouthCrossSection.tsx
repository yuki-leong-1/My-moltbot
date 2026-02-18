"use client";

import { MouthParams } from "@/types";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpParams(a: MouthParams, b: MouthParams, t: number): MouthParams {
  return {
    lipRound: lerp(a.lipRound, b.lipRound, t),
    lipOpen: lerp(a.lipOpen, b.lipOpen, t),
    jawAngle: lerp(a.jawAngle, b.jawAngle, t),
    tongueTipX: lerp(a.tongueTipX, b.tongueTipX, t),
    tongueTipY: lerp(a.tongueTipY, b.tongueTipY, t),
    tongueBodyX: lerp(a.tongueBodyX, b.tongueBodyX, t),
    tongueBodyY: lerp(a.tongueBodyY, b.tongueBodyY, t),
    tongueShape: t < 0.5 ? a.tongueShape : b.tongueShape,
  };
}

// SVG sagittal cross-section of the mouth
// Coordinate system: viewBox "0 0 400 350", nose at right, throat at left
// Anatomical structures positioned based on medical sagittal diagrams

interface MouthCrossSectionProps {
  currentParams: MouthParams;
  showLabels?: boolean;
}

export default function MouthCrossSection({ currentParams, showLabels = true }: MouthCrossSectionProps) {
  const p = currentParams;
  const jawDrop = p.jawAngle * 30; // max 30px jaw drop

  // Tongue position mapping from normalized params to SVG coords
  // Back of mouth is left (~80), front is right (~280)
  // Top of mouth is ~100, bottom ~240
  const tongueTipX = 80 + p.tongueTipX * 200;  // 80-280
  const tongueTipY = 230 - p.tongueTipY * 120;  // 230-110 (inverted Y)
  const tongueBodyX = 80 + p.tongueBodyX * 160;  // 80-240
  const tongueBodyY = 230 - p.tongueBodyY * 110; // 230-120

  // Lip opening
  const lipOpenAmount = p.lipOpen * 20 + jawDrop * 0.3;
  const lipRound = p.lipRound;

  // Upper lip position (fixed mostly)
  const upperLipY = 165 - lipOpenAmount * 0.3;
  // Lower lip moves down with jaw
  const lowerLipY = 185 + lipOpenAmount * 0.7 + jawDrop * 0.3;

  // Upper structure (fixed): hard palate, soft palate, alveolar ridge, upper teeth, upper lip
  // Path goes from pharynx (left) along palate to front teeth to upper lip
  const upperPath = `
    M 60,155
    C 65,140 75,120 100,108
    Q 140,85 190,88
    Q 230,90 260,100
    Q 270,105 275,110
    L 278,118
    Q 282,128 280,140
    L 278,155
    L 285,155
    Q ${295 + lipRound * 8},${upperLipY - 5} ${300 + lipRound * 5},${upperLipY}
    Q ${295 + lipRound * 8},${upperLipY + 8} 285,${upperLipY + 5}
  `;

  // Upper teeth (small white block at alveolar ridge)
  const upperTeethPath = `
    M 275,110
    L 278,118
    Q 282,128 280,140
    L 278,155
    L 270,155
    L 268,135
    Q 268,118 272,110
    Z
  `;

  // Lower jaw + lower teeth + lower lip
  const lowerTeethTop = 175 + jawDrop * 0.5;
  const lowerTeethBottom = 195 + jawDrop * 0.5;
  const lowerTeethPath = `
    M 270,${lowerTeethTop}
    L 278,${lowerTeethTop}
    L 280,${lowerTeethBottom - 5}
    Q 278,${lowerTeethBottom} 270,${lowerTeethBottom}
    Z
  `;

  // Lower jaw outline
  const lowerJawPath = `
    M 285,${lowerLipY - 5}
    Q ${295 + lipRound * 8},${lowerLipY - 8} ${300 + lipRound * 5},${lowerLipY}
    Q ${295 + lipRound * 8},${lowerLipY + 5} 285,${lowerLipY + 5}
    L 278,${lowerTeethTop}
    L 270,${lowerTeethBottom}
    Q 250,${210 + jawDrop} 200,${225 + jawDrop}
    Q 150,${240 + jawDrop} 100,${235 + jawDrop}
    Q 70,${225 + jawDrop} 60,${200 + jawDrop * 0.5}
    L 60,185
  `;

  // Soft palate (velum) - hangs down from back of hard palate
  const velumPath = `
    M 100,108
    Q 95,115 90,130
    Q 85,145 88,155
    Q 92,148 98,135
    Q 105,118 110,108
  `;

  // Tongue shape - the main animated element
  // Tongue root at left (~75), tip at right, body curves based on params
  const tongueRootX = 70;
  const tongueRootY = 195 + jawDrop * 0.2;
  const tongueUnderY = tongueRootY + 10;

  // Control points for tongue body curve
  const bodyCtl1X = (tongueRootX + tongueBodyX) / 2;
  const bodyCtl1Y = tongueBodyY + 5;
  const bodyCtl2X = (tongueBodyX + tongueTipX) / 2;
  const bodyCtl2Y = Math.min(tongueBodyY, tongueTipY) - 8;

  // Retroflex: tip curls back
  const tipOffsetX = p.tongueShape === "retroflex" ? -15 : 0;
  const tipOffsetY = p.tongueShape === "retroflex" ? -12 : 0;

  const tonguePath = `
    M ${tongueRootX},${tongueRootY}
    C ${bodyCtl1X},${bodyCtl1Y} ${tongueBodyX - 20},${tongueBodyY + 5} ${tongueBodyX},${tongueBodyY}
    C ${bodyCtl2X},${bodyCtl2Y} ${tongueTipX - 30},${tongueTipY + 5} ${tongueTipX + tipOffsetX},${tongueTipY + tipOffsetY}
    Q ${tongueTipX + tipOffsetX + 5},${tongueTipY + tipOffsetY + 8} ${tongueTipX + tipOffsetX - 5},${tongueTipY + tipOffsetY + 15}
    C ${tongueTipX - 30},${tongueTipY + 30} ${bodyCtl2X},${tongueBodyY + 30} ${tongueBodyX},${tongueBodyY + 25}
    C ${tongueBodyX - 20},${tongueBodyY + 30} ${bodyCtl1X},${tongueUnderY + 5} ${tongueRootX},${tongueUnderY}
    Z
  `;

  // Pharynx/throat walls
  const pharynxPath = `
    M 55,100
    L 55,${220 + jawDrop * 0.3}
    L 65,${220 + jawDrop * 0.3}
    L 65,100
  `;

  // Nose hint (above palate)
  const nosePath = `
    M 200,80
    Q 250,72 290,78
    L 310,75
    L 310,70
    Q 290,65 250,65
    Q 210,68 190,75
    Z
  `;

  // Airflow indicators (small arrows)
  const airflowY = (upperLipY + lowerLipY) / 2;

  // Label positions
  const labels = showLabels ? [
    { x: 170, y: 78, text: "硬腭", sub: "Hard Palate", color: "#c2185b" },
    { x: 85, y: 98, text: "软腭", sub: "Soft Palate", color: "#c2185b" },
    { x: 263, y: 98, text: "齿龈", sub: "Alveolar Ridge", color: "#6a1b9a" },
    { x: 315, y: upperLipY - 12, text: "上唇", sub: "Upper Lip", color: "#b71c1c" },
    { x: 315, y: lowerLipY + 18, text: "下唇", sub: "Lower Lip", color: "#b71c1c" },
    { x: 290, y: 135, text: "上齿", sub: "Upper Teeth", color: "#555" },
    { x: 290, y: lowerTeethBottom + 14, text: "下齿", sub: "Lower Teeth", color: "#555" },
    { x: 42, y: 160, text: "咽", sub: "Pharynx", color: "#4a148c" },
    // Tongue labels based on position
    { x: tongueTipX + tipOffsetX + 5, y: tongueTipY + tipOffsetY - 12, text: "舌尖", sub: "Tip", color: "#d81b60" },
    { x: tongueBodyX, y: tongueBodyY - 15, text: "舌体", sub: "Body", color: "#d81b60" },
    { x: tongueRootX + 5, y: tongueRootY - 15, text: "舌根", sub: "Root", color: "#d81b60" },
  ] : [];

  return (
    <div className="w-full bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
      <svg
        viewBox="0 0 400 320"
        className="w-full h-auto"
        style={{ maxHeight: "400px" }}
      >
        <defs>
          <linearGradient id="palateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8bbd0" />
            <stop offset="100%" stopColor="#f48fb1" />
          </linearGradient>
          <linearGradient id="tongueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e91e63" />
            <stop offset="60%" stopColor="#c2185b" />
            <stop offset="100%" stopColor="#ad1457" />
          </linearGradient>
          <linearGradient id="lipGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c62828" />
            <stop offset="100%" stopColor="#d32f2f" />
          </linearGradient>
          <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8bbd0" />
            <stop offset="100%" stopColor="#fce4ec" />
          </linearGradient>
          <filter id="softShadow">
            <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="400" height="320" fill="#fafafa" />

        {/* Pharynx / throat */}
        <path d={pharynxPath} fill="#f8bbd0" stroke="#e91e63" strokeWidth="0.5" opacity="0.6" />

        {/* Nasal cavity hint */}
        <path d={nosePath} fill="#ffe0b2" stroke="#ffb74d" strokeWidth="0.5" opacity="0.4" />

        {/* Upper palate structure (hard palate + alveolar ridge outline) */}
        <path
          d={`
            M 60,155
            L 60,130
            Q 65,110 100,98
            Q 140,78 190,80
            Q 230,82 260,92
            Q 275,98 278,108
            Q 285,125 282,145
            L 280,155
            L 278,155
            L 278,140
            Q 280,128 275,115
            Q 272,108 262,102
            Q 232,90 190,88
            Q 140,85 102,108
            Q 80,120 68,140
            L 65,155
            Z
          `}
          fill="url(#palateGrad)"
          stroke="#e91e63"
          strokeWidth="1"
          filter="url(#softShadow)"
        />

        {/* Soft palate (velum) - dangly part */}
        <path
          d={`
            M 100,108
            Q 92,120 88,135
            Q 84,150 88,160
            Q 92,155 95,140
            Q 98,125 105,112
            Q 108,108 110,107
          `}
          fill="#f48fb1"
          stroke="#e91e63"
          strokeWidth="0.8"
        />

        {/* Upper teeth */}
        <path
          d={upperTeethPath}
          fill="#f5f5f0"
          stroke="#bdbdbd"
          strokeWidth="1"
          style={{ transition: "all 0.3s ease" }}
        />

        {/* Lower jaw floor */}
        <path
          d={`
            M 65,185
            L 65,${200 + jawDrop * 0.5}
            Q 100,${235 + jawDrop} 150,${240 + jawDrop}
            Q 200,${238 + jawDrop} 250,${220 + jawDrop}
            Q 270,${210 + jawDrop} 275,${lowerTeethBottom + 5}
            L 270,${lowerTeethBottom}
            Q 250,${210 + jawDrop - 5} 200,${225 + jawDrop - 5}
            Q 150,${235 + jawDrop - 5} 100,${230 + jawDrop - 5}
            Q 75,${220 + jawDrop - 5} 65,${195 + jawDrop * 0.4}
            Z
          `}
          fill="url(#floorGrad)"
          stroke="#e91e63"
          strokeWidth="0.5"
          style={{ transition: "all 0.3s ease" }}
        />

        {/* Lower teeth */}
        <path
          d={lowerTeethPath}
          fill="#f5f5f0"
          stroke="#bdbdbd"
          strokeWidth="1"
          style={{ transition: "all 0.3s ease" }}
        />

        {/* Tongue - main animated element */}
        <path
          d={tonguePath}
          fill="url(#tongueGrad)"
          stroke="#ad1457"
          strokeWidth="1.2"
          filter="url(#softShadow)"
          style={{ transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />

        {/* Tongue center line for dimension */}
        <path
          d={`
            M ${tongueRootX + 5},${tongueRootY + 3}
            C ${bodyCtl1X},${bodyCtl1Y + 8} ${tongueBodyX - 15},${tongueBodyY + 8} ${tongueBodyX},${tongueBodyY + 5}
            C ${bodyCtl2X - 5},${bodyCtl2Y + 10} ${tongueTipX - 25},${tongueTipY + 10} ${tongueTipX + tipOffsetX - 3},${tongueTipY + tipOffsetY + 6}
          `}
          fill="none"
          stroke="#880e4f"
          strokeWidth="0.6"
          opacity="0.3"
          style={{ transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />

        {/* Upper lip */}
        <ellipse
          cx={300 + lipRound * 5}
          cy={upperLipY}
          rx={10 + lipRound * 6}
          ry={6 + lipRound * 3}
          fill="url(#lipGrad)"
          stroke="#b71c1c"
          strokeWidth="0.8"
          style={{ transition: "all 0.3s ease" }}
        />

        {/* Lower lip */}
        <ellipse
          cx={300 + lipRound * 5}
          cy={lowerLipY}
          rx={10 + lipRound * 6}
          ry={6 + lipRound * 3}
          fill="url(#lipGrad)"
          stroke="#b71c1c"
          strokeWidth="0.8"
          style={{ transition: "all 0.3s ease" }}
        />

        {/* Alveolar ridge marker (small bump) */}
        <circle cx="270" cy="105" r="3" fill="#f48fb1" stroke="#e91e63" strokeWidth="0.5" />

        {/* Labels */}
        {labels.map((label, i) => (
          <g key={i} style={{ transition: "all 0.3s ease" }}>
            <text
              x={label.x}
              y={label.y}
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill={label.color}
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {label.text}
            </text>
            <text
              x={label.x}
              y={label.y + 10}
              textAnchor="middle"
              fontSize="6.5"
              fill="#888"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {label.sub}
            </text>
          </g>
        ))}

        {/* Airflow arrow hint */}
        <g opacity="0.3">
          <line x1="310" y1={airflowY} x2="340" y2={airflowY} stroke="#1565c0" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="#1565c0" />
            </marker>
          </defs>
          <text x="340" y={airflowY - 5} fontSize="7" fill="#1565c0">气流</text>
        </g>
      </svg>
    </div>
  );
}

export { lerpParams };
