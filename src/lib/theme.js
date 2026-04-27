// src/lib/theme.js
// Inyecta estas variables en el className del div raíz de App.jsx
// <div className={darkMode ? "hf-dark" : "hf-light"}>

export const THEME_CSS = `
  .hf-light {
    --bg:       #F0ECFF;
    --surf:     white;
    --card:     white;
    --sub:      #F5F3FF;
    --text:     #1A1A2E;
    --muted:    #6B7280;
    --hint:     #9CA3AF;
    --border:   #EDE9FE;
    --border2:  #DDD6FE;
    --inp:      #FAFAFF;
    --inp-b:    #EDE9FE;
    --hdr0:     #4C1D95;
    --hdr1:     #7C3AED;
    --nav:      white;
    --nav-b:    #EDE9FE;
  }

  .hf-dark {
    --bg:       #0C0B1A;
    --surf:     #1A1829;
    --card:     #221F38;
    --sub:      #18162C;
    --text:     #F0EDFF;
    --muted:    #9893B5;
    --hint:     #6B6888;
    --border:   #2E2A4A;
    --border2:  #3D3862;
    --inp:      #18162C;
    --inp-b:    #2E2A4A;
    --hdr0:     #2D1B6B;
    --hdr1:     #5B21B6;
    --nav:      #1A1829;
    --nav-b:    #2E2A4A;
  }
`;

// Cómo usar en inline styles:
// style={{ background: "var(--card)", color: "var(--text)" }}
// style={{ border: "1px solid var(--border)" }}
