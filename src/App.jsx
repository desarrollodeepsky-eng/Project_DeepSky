import { useState, useEffect, useRef } from "react";

// ── PALETTE & TOKENS ──────────────────────────────────────────────
const C = {
  bg:       "#0d0d1a",
  surface:  "#12112b",
  card:     "#1a1836",
  cardHov:  "#201e42",
  sidebar:  "#100f26",
  accent:   "#7c5cbf",
  accentLt: "#9b7de0",
  accentDk: "#5a3f9a",
  gold:     "#c9a84c",
  red:      "#c0392b",
  green:    "#27ae60",
  text:     "#e8e6f0",
  muted:    "#8884a8",
  border:   "#2a2650",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; color: ${C.text}; font-family: 'Inter', sans-serif; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${C.surface}; }
  ::-webkit-scrollbar-thumb { background: ${C.accent}; border-radius: 3px; }
  .ds-title { font-family: 'Space Grotesk', sans-serif; }
  input, textarea { outline: none; border: none; background: transparent; color: ${C.text}; font-family: 'Inter', sans-serif; }
  input::placeholder, textarea::placeholder { color: ${C.muted}; }
  button { cursor: pointer; font-family: 'Inter', sans-serif; border: none; }

  /* Animated radar sweep */
  @keyframes radarSweep {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%,100% { opacity:.6; } 50% { opacity:1; }
  }
  @keyframes fadeIn {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .fade-in { animation: fadeIn .25s ease; }

  /* orbit animation */
  @keyframes orbit1 { from{transform:rotate(0deg) translateX(90px) rotate(0deg)} to{transform:rotate(360deg) translateX(90px) rotate(-360deg)} }
  @keyframes orbit2 { from{transform:rotate(0deg) translateX(130px) rotate(0deg)} to{transform:rotate(360deg) translateX(130px) rotate(-360deg)} }
  @keyframes orbit3 { from{transform:rotate(0deg) translateX(170px) rotate(0deg)} to{transform:rotate(360deg) translateX(170px) rotate(-360deg)} }
  @keyframes orbit4 { from{transform:rotate(0deg) translateX(215px) rotate(0deg)} to{transform:rotate(360deg) translateX(215px) rotate(-360deg)} }
  @keyframes orbit5 { from{transform:rotate(0deg) translateX(260px) rotate(0deg)} to{transform:rotate(360deg) translateX(260px) rotate(-360deg)} }

  .tag { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; letter-spacing:.4px; }
  .tag-cosmos   { background:#1e1a4a; color:#9b7de0; border:1px solid #3a2f80; }
  .tag-planets  { background:#1a3040; color:#4fc3f7; border:1px solid #1565c0; }
  .tag-stars    { background:#2a1a1a; color:#ef9a9a; border:1px solid #6d2020; }
  .tag-earth    { background:#1a2e1a; color:#81c784; border:1px solid #2e5a2e; }
  .tag-eclipse  { background:#2e2200; color:#c9a84c; border:1px solid #5a4200; }
  .tag-galaxy   { background:#1e1a4a; color:#ce93d8; border:1px solid #4a1a6a; }
  .tag-nebula   { background:#1a1e3a; color:#80cbc4; border:1px solid #1a4a4a; }
  .tag-active   { background:#0d2a1a; color:#66bb6a; border:1px solid #1b5e20; }

  .btn-primary { background: linear-gradient(135deg,${C.accent},${C.accentDk}); color:#fff; padding:9px 20px; border-radius:8px; font-size:13px; font-weight:600; transition:opacity .2s; }
  .btn-primary:hover { opacity:.85; }
  .btn-ghost { background:rgba(124,92,191,.15); color:${C.accentLt}; padding:9px 20px; border-radius:8px; font-size:13px; font-weight:600; border:1px solid rgba(124,92,191,.3); transition:background .2s; }
  .btn-ghost:hover { background:rgba(124,92,191,.25); }
  .btn-danger { background:rgba(192,57,43,.15); color:#e57373; padding:6px 14px; border-radius:6px; font-size:12px; font-weight:600; border:1px solid rgba(192,57,43,.3); transition:background .2s; }
  .btn-danger:hover { background:rgba(192,57,43,.3); }
  .btn-success { background:rgba(39,174,96,.15); color:#66bb6a; padding:6px 14px; border-radius:6px; font-size:12px; font-weight:600; border:1px solid rgba(39,174,96,.3); transition:background .2s; }
  .btn-success:hover { background:rgba(39,174,96,.3); }

  .input-field { background:rgba(255,255,255,.05); border:1px solid ${C.border}; border-radius:8px; padding:10px 14px; font-size:13px; color:${C.text}; width:100%; transition:border-color .2s; }
  .input-field:focus { border-color:${C.accent}; }

  .card { background:${C.card}; border-radius:14px; border:1px solid ${C.border}; }

  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.7); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:1000; }
  .modal { background:${C.surface}; border:1px solid ${C.border}; border-radius:16px; padding:28px; min-width:380px; max-width:540px; width:90%; }

  .sidebar-item { display:flex; align-items:center; gap:12px; padding:10px 16px; border-radius:10px; cursor:pointer; font-size:13.5px; color:${C.muted}; transition:all .18s; }
  .sidebar-item:hover { background:rgba(124,92,191,.12); color:${C.text}; }
  .sidebar-item.active { background:rgba(124,92,191,.22); color:#fff; }

  .nav-icon-btn { width:52px; height:52px; border-radius:14px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; border:1px solid ${C.border}; background:${C.surface}; color:${C.muted}; }
  .nav-icon-btn.active { border-color:${C.accent}; color:${C.accentLt}; background:rgba(124,92,191,.15); }
  .nav-icon-btn:hover { border-color:${C.accentLt}; color:${C.text}; }

  .filter-chip { padding:5px 14px; border-radius:20px; font-size:12px; font-weight:500; cursor:pointer; border:1px solid ${C.border}; background:rgba(255,255,255,.04); color:${C.muted}; transition:all .18s; }
  .filter-chip:hover { border-color:${C.accent}; color:${C.text}; }
  .filter-chip.active { background:${C.accent}; border-color:${C.accent}; color:#fff; }

  .thread-row { background:${C.card}; border:1px solid ${C.border}; border-radius:12px; padding:16px 20px; cursor:pointer; transition:border-color .18s, background .18s; }
  .thread-row:hover { border-color:${C.accent}; background:${C.cardHov}; }

  .img-card { border-radius:12px; overflow:hidden; position:relative; cursor:pointer; border:1px solid ${C.border}; aspect-ratio:1; }
  .img-card img { width:100%; height:100%; object-fit:cover; transition:transform .3s; }
  .img-card:hover img { transform:scale(1.05); }
  .img-card-overlay { position:absolute; bottom:0; left:0; right:0; padding:10px 12px; background:linear-gradient(0deg,rgba(0,0,0,.85),transparent); }

  .comment-bubble { background:rgba(255,255,255,.04); border:1px solid ${C.border}; border-radius:10px; padding:12px 16px; }
  .sub-comment { margin-left:36px; background:rgba(124,92,191,.07); border:1px solid rgba(124,92,191,.15); border-radius:8px; padding:10px 14px; }

  .planet-info-panel { background:rgba(16,14,38,.95); border:1px solid ${C.border}; border-radius:16px; padding:20px; }
  .info-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid ${C.border}; font-size:13px; }
  .info-row:last-child { border-bottom:none; }

  .cal-day { width:36px; height:36px; display:flex; align-items:center; justify-content:center; border-radius:50%; font-size:13px; cursor:pointer; position:relative; transition:all .15s; }
  .cal-day:hover { background:rgba(124,92,191,.2); }
  .cal-day.selected { background:${C.accent}; color:#fff; }
  .cal-day.has-event::after { content:''; position:absolute; bottom:2px; width:4px; height:4px; background:${C.accentLt}; border-radius:50%; }

  .challenge-card { border-radius:14px; overflow:hidden; position:relative; cursor:pointer; border:1px solid ${C.border}; aspect-ratio:16/9; }
  .challenge-card img { width:100%; height:100%; object-fit:cover; }
  .challenge-card-overlay { position:absolute; inset:0; background:linear-gradient(0deg,rgba(0,0,0,.8) 40%,transparent); padding:12px; display:flex; flex-direction:column; justify-content:flex-end; }

  .neo-dot { position:absolute; width:10px; height:10px; border-radius:50%; transform:translate(-50%,-50%); cursor:pointer; transition:transform .2s; }
  .neo-dot:hover { transform:translate(-50%,-50%) scale(1.6); }

  .star-bg { position:fixed; inset:0; z-index:0; overflow:hidden; pointer-events:none; }
  .main-layout { position:relative; z-index:1; display:flex; min-height:100vh; }
`;

// ── ICONS (SVG inline) ─────────────────────────────────────────────
const Icon = {
  Home:     ()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Search:   ()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Users:    ()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  Calendar: ()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Trophy:   ()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M6 9H4a2 2 0 01-2-2V5h4"/><path d="M18 9h2a2 2 0 002-2V5h-4"/><path d="M6 9a6 6 0 0012 0"/><path d="M12 15v6"/><path d="M8 21h8"/></svg>,
  Radar:    ()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="2" x2="12" y2="6"/></svg>,
  Cube:     ()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
  User:     ()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Heart:    ()=><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  HeartFill:()=><svg width="14" height="14" fill="#9b7de0" stroke="#9b7de0" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  X:        ()=><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ChevL:    ()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevR:    ()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevD:    ()=><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>,
  ChevU:    ()=><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>,
  Send:     ()=><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Plus:     ()=><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  ArrowL:   ()=><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Upload:   ()=><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>,
  Star:     ()=><svg width="14" height="14" fill="#c9a84c" stroke="#c9a84c" strokeWidth="1" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Trophy2:  ()=><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M6 9H4a2 2 0 01-2-2V5h4M18 9h2a2 2 0 002-2V5h-4M6 9a6 6 0 0012 0M12 15v6M8 21h8"/></svg>,
  Bell:     ()=><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  Logout:   ()=><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Eye:      ()=><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff:   ()=><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Info:     ()=><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  Scope:    ()=><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><circle cx="11" cy="11" r="5"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="6" x2="11" y2="2"/><line x1="6" y1="11" x2="2" y2="11"/><line x1="16" y1="11" x2="20" y2="11"/><line x1="11" y1="16" x2="11" y2="20"/></svg>,
  Satelite: ()=><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M6.3 6.3a8 8 0 000 11.4"/><path d="M17.7 6.3a8 8 0 010 11.4"/><path d="M3.5 3.5a14 14 0 000 17"/><path d="M20.5 3.5a14 14 0 010 17"/></svg>,
};

// ── MOCK DATA ──────────────────────────────────────────────────────
const PHOTOS_OF_DAY = [
  { id:1, title:"El Núcleo Galáctico — Vía Láctea", desc:"El centro de nuestra galaxia, la Vía Láctea, fotografiado desde una zona de baja contaminación lumínica. La densa concentración de estrellas, gas y polvo interestelar forma la característica banda luminosa que atraviesa el cielo nocturno de lado a lado.", src:"https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=900&q=80", comments:[{id:1,user:"Andrés M.",text:"Increíble detalle en esta toma, el núcleo galáctico es perfectamente visible.",replies:[{id:11,user:"Lucía R.",text:"Totalmente de acuerdo, se nota la resolución de las cámaras modernas."},{id:12,user:"Lucía R.",text:"Esta exposición fue de 30 segundos desde 3000 m de altitud."}]},{id:2,user:"Carlos V.",text:"¿Alguien puede identificar cuál nebulosa aparece a la derecha?",replies:[{id:21,user:"Elena S.",text:"Por el tamaño y posición creo que es la nebulosa de Orión."},{id:22,user:"Andrés M.",text:"Coincido con Elena, los colores también apuntan a Orión."}]}]},
  { id:2, title:"Los Anillos de Saturno — Sonda Cassini", desc:"Mientras orbitaba Saturno, la sonda Cassini registró con asombroso detalle la disposición de anillos, mapas y sombras del gigante gaseoso. Esta imagen fue capturada en 2005 y revelada por la misión Cassini de la NASA.", src:"https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=900&q=80", comments:[{id:3,user:"Andrés M.",text:"Increíble detalle en los anillos, la división de Cassini es perfectamente visible.",replies:[{id:31,user:"Lucía R.",text:"Totalmente de acuerdo, se nota la resolución de las cámaras ISS."},{id:32,user:"Lucía R.",text:"Cassini orbitó Saturno durante 13 años. Una misión verdaderamente extraordinaria."}]},{id:4,user:"Carlos V.",text:"¿Alguien puede identificar cuál luna aparece a la derecha? ¿Mimas o Tetis?",replies:[{id:41,user:"Elena S.",text:"Por el tamaño y posición creo que es Tetis. Mimas suele aparecer más pequeña."},{id:42,user:"Andrés M.",text:"Coincido con Elena, el craterismo visible también apunta a Tetis."}]}]},
];

const SEARCH_IMAGES = [
  { id:1, title:"Vía Láctea", author:"Shot by Carqueira", src:"https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=600&q=80", cat:"galaxias" },
  { id:2, title:"Estrella Gigante", author:"arnaud giraud", src:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80", cat:"estrellas" },
  { id:3, title:"Nebulosa Verde-Azul", author:"Steve Gribble", src:"https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=600&q=80", cat:"nebulosas" },
  { id:4, title:"Galaxia Espiral", author:"Andrew Orange", src:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80", cat:"galaxias" },
  { id:5, title:"Hubble — Cúmulo", author:"NASA Hubble", src:"https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80", cat:"nebulosas" },
  { id:6, title:"Nebulosa Oscura", author:"Beat Schuler", src:"https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600&q=80", cat:"nebulosas" },
  { id:7, title:"Sistema Solar", author:"NASA Hubble", src:"https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&q=80", cat:"planetas" },
  { id:8, title:"Luna en Cuarto", author:"Ivan Karpov", src:"https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=600&q=80", cat:"planetas" },
  { id:9, title:"Supernova Remanente", author:"ESA/Hubble", src:"https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=600&q=80", cat:"estrellas" },
];

const FORUM_THREADS = [
  { id:1, cat:"cosmos", tag:"tag-cosmos", author:"Lucía R.", time:"hace 2 h", title:"¿Qué hay más allá del universo observable?", body:"El universo observable tiene un radio de 46 500 millones de años luz. Pero más allá podría haber infinitamente más universo, o incluso otros universos burbuja en un multiverso eterno.", replies:1 },
  { id:2, cat:"estrellas", tag:"tag-stars", author:"Elena S.", time:"hace 30 min", title:"Betelgeuse: ¿cuándo explotará en supernova?", body:"Betelgeuse es una supergigante roja que se encuentra en las últimas etapas de su vida. Se estima que podría explotar en cualquier momento de los próximos 100 000 años. Cuando ocurra, será visible a plena luz del día.", replies:1 },
  { id:3, cat:"tierra", tag:"tag-earth", author:"Marco T.", time:"hace 4 h", title:"Auroras boreales: cómo se forman y dónde verlas", body:"Las auroras se forman cuando partículas cargadas del viento solar colisionan con la atmósfera terrestre. Este año el Sol está en máximo solar, lo que aumenta significativamente la actividad auroral.", replies:1 },
  { id:4, cat:"cosmos", tag:"tag-cosmos", author:"Carlos V.", time:"hace 5 h", title:"La expansión acelerada del universo y la energía oscura", body:"La energía oscura representa aproximadamente el 68% del contenido energético del universo y es responsable de su expansión acelerada. Aún no sabemos qué es exactamente, pero su efecto es medible.", replies:0 },
  { id:5, cat:"estrellas", tag:"tag-stars", author:"Marco T.", time:"hace 7 h", title:"Las estrellas de neutrones: más densas que el núcleo atómico", body:"Una estrella de neutrones típica tiene una masa de 1.4 masas solares comprimida en una esfera de apenas 10 km de diámetro. Una cucharada de su material pesaría mil millones de toneladas.", replies:0 },
];

const THREAD_DETAIL = {
  id:6, cat:"planetas", tag:"tag-planets", author:"Andrés M.", time:"hace 1 h",
  title:"¿Podría existir vida en Europa, la luna de Júpiter?",
  body:"Europa tiene un océano de agua líquida bajo su corteza de hielo, lo que lo convierte en un candidato muy serio para albergar vida microbiana. La misión Europa Clipper de la NASA podría darnos respuestas definitivas.",
  replies:[
    { id:1, user:"Lucía R.", time:"hace 45 min", text:"Un océano bajo el hielo es exactamente el ambiente que necesitamos explorar." },
    { id:2, user:"Carlos V.", time:"hace 30 min", text:"La sonda Europa Clipper podría detectar biomarcadores en los próximos años." },
  ]
};

const EVENTS = [
  { id:1, day:3, title:"Conjunción Luna-Júpiter", type:"Conjunción", color:"#9b7de0" },
  { id:2, day:18, title:"Eclipse Lunar Penumbral", type:"Eclipse", color:C.gold, time:"22:10–01:30 UTC", location:"Europa y América", desc:"La Luna entra en la zona penumbral de la sombra terrestre. El oscurecimiento es sutil pero perceptible en el limbo lunar." },
  { id:3, day:25, title:"Oposición de Saturno", type:"Oposición", color:"#4fc3f7" },
];

const CHALLENGES = [
  { id:1, title:"Galaxias Profundas", cat:"galaxy", tag:"tag-galaxy", participants:4, likes:10, active:true, src:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80" },
  { id:2, title:"Luna en Detalle", cat:"luna", tag:"tag-planets", participants:3, likes:23, active:true, src:"https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=600&q=80", participating:true },
  { id:3, title:"Nebulosas de Colores", cat:"nebula", tag:"tag-nebula", participants:1, likes:27, active:true, src:"https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=600&q=80" },
  { id:4, title:"Amanecer Planetario", cat:"planetas", tag:"tag-planets", participants:2, likes:11, active:true, src:"https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&q=80" },
];

const CHALLENGE_GALLERY = [
  { id:1, user:"Alex G.", pos:1, likes:38, src:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80" },
  { id:2, user:"Lucía R.", pos:2, likes:38, src:"https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&q=80" },
  { id:3, user:"Carlos V.", pos:3, likes:29, src:"https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600&q=80" },
  { id:4, user:"Elena S.", pos:4, likes:21, src:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80" },
  { id:5, user:"Joaquín N.", pos:5, likes:0, src:"https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80", review:true },
];

const PLANETS = [
  { id:"mercury", name:"Mercurio", color:"#b0b0b0", size:8, orbitR:90, speed:4.8, orbitT:4, desc:"El planeta más pequeño y más cercano al Sol. Carece de atmósfera real.", diam:"4 879 km", dist:"77 M km", year:"88 días", moons:0, temp:"430 °C" },
  { id:"venus", name:"Venus", color:"#e8c87e", size:12, orbitR:130, speed:7.4, orbitT:6, desc:"El más caliente del Sistema Solar, con una densa atmósfera de CO₂.", diam:"12 104 km", dist:"261 M km", year:"225 días", moons:0, temp:"462 °C" },
  { id:"earth", name:"Tierra", color:"#4fc3f7", size:13, orbitR:170, speed:4.0, orbitT:8, desc:"Nuestro hogar. El único planeta conocido con vida.", diam:"12 742 km", dist:"150 M km", year:"365 días", moons:1, temp:"15 °C" },
  { id:"mars", name:"Marte", color:"#e57373", size:10, orbitR:215, speed:5.6, orbitT:11, desc:"El planeta rojo. Posee el volcán más alto del Sistema Solar: Olympus Mons.", diam:"6 779 km", dist:"225 M km", year:"687 días", moons:2, temp:"-65 °C" },
  { id:"jupiter", name:"Júpiter", color:"#c9a84c", size:24, orbitR:265, speed:8.1, orbitT:14, desc:"El planeta más grande. Su Gran Mancha Roja es una tormenta que dura siglos.", diam:"139 820 km", dist:"588 M km", year:"12 años", moons:95, temp:"-108 °C" },
  { id:"saturn", name:"Saturno", color:"#d4c07a", size:20, orbitR:310, speed:12.0, orbitT:18, desc:"Conocido por su impresionante sistema de anillos, compuesto principalmente de hielo y roca. Es el planeta menos denso del Sistema Solar, tan liviano que flotaría en agua.", diam:"116 460 km", dist:"1 432 M km", year:"29 años", moons:146, temp:"-178 °C" },
  { id:"uranus", name:"Urano", color:"#80deea", size:16, orbitR:360, speed:14.0, orbitT:22, desc:"Rota de costado con una inclinación axial de 98°.", diam:"50 724 km", dist:"2 724 M km", year:"84 años", moons:28, temp:"-197 °C" },
  { id:"neptune", name:"Neptuno", color:"#5c6bc0", size:15, orbitR:405, speed:16.0, orbitT:26, desc:"El planeta más lejano con los vientos más fuertes del Sistema Solar.", diam:"49 244 km", dist:"4 351 M km", year:"165 años", moons:16, temp:"-200 °C" },
];

const NEO_OBJECTS = [
  { id:"1994pc1", name:"1994 PC1", x:55, y:32, color:"#e57373", risk:"RIESGO MEDIO", diam:"1.05 km", vel:"19.6 km/s", dist:"1 930 440 km", approach:"2022-01-18" },
  { id:"apophis", name:"Apophis", x:48, y:55, color:"#c9a84c", risk:"RIESGO BAJO", diam:"0.37 km", vel:"7.4 km/s", dist:"31 600 km", approach:"2029-04-13" },
  { id:"2025bk1", name:"2025 BK1", x:42, y:45, color:"#9b7de0", risk:"Bajo", diam:"0.12 km", vel:"12.1 km/s", dist:"500 000 km", approach:"2025-03-02" },
  { id:"2024nk", name:"2024 NK", x:60, y:48, color:"#4fc3f7", risk:"Bajo", diam:"0.08 km", vel:"9.8 km/s", dist:"800 000 km", approach:"2024-07-15" },
  { id:"2022dz2", name:"2022 DZ2", x:50, y:38, color:"#81c784", risk:"Mín", diam:"0.05 km", vel:"6.2 km/s", dist:"1 200 000 km", approach:"2023-03-25" },
];

// ── STAR BACKGROUND ───────────────────────────────────────────────
function StarField() {
  const stars = Array.from({length:120},(_,i)=>({
    x: Math.random()*100, y: Math.random()*100,
    s: Math.random()*1.8+0.3, o: Math.random()*.7+.2,
    d: Math.random()*3
  }));
  return (
    <div className="star-bg">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {stars.map((s,i)=>(
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.s} fill="white" opacity={s.o}
            style={{animation:`pulse ${2+s.d}s ease-in-out infinite`}}/>
        ))}
      </svg>
      <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 70% 30%, rgba(124,92,191,.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(79,125,191,.08) 0%, transparent 50%)`}}/>
    </div>
  );
}

// ── TOPBAR ────────────────────────────────────────────────────────
function Topbar({page, sidebarOpen, setSidebarOpen, onAccount}) {
  const pageLabels = {fotoDia:"FOTO DEL DÍA", busqueda:"BÚSQUEDA", foro:"FORO COMUNITARIO", foroThread:"FORO COMUNITARIO", calendario:"CALENDARIO DE EVENTOS", retos:"RETO ASTRONÓMICO", neos:"RADAR NEOs", modelo3d:"MODELO SISTEMA SOLAR"};
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px",borderBottom:`1px solid ${C.border}`,background:"rgba(13,13,26,.85)",backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:50}}>
      <div style={{display:"flex",alignItems:"center",gap:16}}>
        <button onClick={()=>setSidebarOpen(v=>!v)} style={{background:"none",display:"flex",alignItems:"center",gap:8,color:C.text}}>
          <Icon.Satelite/>
          <span className="ds-title" style={{fontWeight:700,fontSize:18,letterSpacing:1}}>DeepSky</span>
        </button>
        {sidebarOpen && <button onClick={()=>setSidebarOpen(false)} style={{background:"none",color:C.muted}}><Icon.X/></button>}
        {pageLabels[page] && <span style={{color:C.muted,fontSize:13,marginLeft:8}}>| {pageLabels[page]}</span>}
      </div>
      <button className="btn-ghost" style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px"}} onClick={onAccount}>
        <Icon.User/><span style={{fontSize:13}}>MI CUENTA</span>
      </button>
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────────────
function Sidebar({page, setPage, open}) {
  if(!open) return null;
  const items = [
    {key:"busqueda",label:"Búsqueda",icon:<Icon.Search/>},
    {key:"fotoDia",label:"Foto del Día",icon:<Icon.Satelite/>},
    {key:"foro",label:"Foro Comunitario",icon:<Icon.Users/>},
    {key:"calendario",label:"Calendario de Eventos",icon:<Icon.Calendar/>},
    {key:"retos",label:"Retos astronómicos",icon:<Icon.Trophy/>},
    {key:"neos",label:"Objetos NEOs",icon:<Icon.Radar/>},
    {key:"modelo3d",label:"Modelo 3D",icon:<Icon.Cube/>},
  ];
  return (
    <div style={{width:200,minWidth:200,background:C.sidebar,borderRight:`1px solid ${C.border}`,padding:"16px 10px",display:"flex",flexDirection:"column",gap:4}}>
      {items.map(it=>(
        <div key={it.key} className={`sidebar-item ${page===it.key||page==='foroThread'&&it.key==='foro'?'active':''}`} onClick={()=>setPage(it.key)}>
          {it.icon}<span>{it.label}</span>
          {(page===it.key)||page==='foroThread'&&it.key==='foro' ? <span style={{marginLeft:"auto",color:C.accent}}>›</span>:null}
        </div>
      ))}
      <div style={{marginTop:"auto",fontSize:11,color:C.muted,padding:"10px 6px"}}>DEEPSKY © 2025 — Exploración del cosmos</div>
    </div>
  );
}

// ── LEFT NAV ICONS ────────────────────────────────────────────────
function LeftNav({page, setPage}) {
  const items = [
    {key:"fotoDia",icon:<Icon.Home/>},
    {key:"busqueda",icon:<Icon.Search/>},
    {key:"foro",icon:<Icon.Users/>},
    {key:"calendario",icon:<Icon.Calendar/>},
    {key:"retos",icon:<Icon.Trophy/>},
    {key:"neos",icon:<Icon.Radar/>},
    {key:"modelo3d",icon:<Icon.Cube/>},
  ];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:8,padding:"12px 10px",borderRight:`1px solid ${C.border}`,background:"rgba(13,13,26,.6)"}}>
      {items.map(it=>(
        <button key={it.key} className={`nav-icon-btn ${page===it.key||(page==='foroThread'&&it.key==='foro')?'active':''}`} onClick={()=>setPage(it.key)}>
          {it.icon}
        </button>
      ))}
    </div>
  );
}

// ── FOTO DEL DÍA ──────────────────────────────────────────────────
function FotoDelDia() {
  const [idx,setIdx] = useState(0);
  const [commentsOpen,setCommentsOpen] = useState(false);
  const [commentText,setCommentText] = useState("");
  const [replyText,setReplyText] = useState("");
  const [replyingTo,setReplyingTo] = useState(null);
  const [photos,setPhotos] = useState(PHOTOS_OF_DAY);
  const [myComments,setMyComments] = useState([]);
  const photo = photos[idx];

  const sendComment = () => {
    if(!commentText.trim()) return;
    const updated = photos.map((p,i)=>i===idx?{...p,comments:[...p.comments,{id:Date.now(),user:"Mi cuenta",text:commentText,replies:[]}]}:p);
    setPhotos(updated); setCommentText("");
  };
  const sendReply = (cid) => {
    if(!replyText.trim()) return;
    const updated = photos.map((p,i)=>i===idx?{...p,comments:p.comments.map(c=>c.id===cid?{...c,replies:[...c.replies,{id:Date.now(),user:"Mi cuenta",text:replyText}]}:c)}:p);
    setPhotos(updated); setReplyText(""); setReplyingTo(null);
  };
  const deleteComment = (cid) => {
    const updated = photos.map((p,i)=>i===idx?{...p,comments:p.comments.filter(c=>c.id!==cid)}:p);
    setPhotos(updated);
  };

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative",overflowY:"auto"}}>
      <div style={{flex:1,padding:"28px 40px",display:"flex",flexDirection:"column",gap:20}}>
        <div style={{position:"relative",borderRadius:16,overflow:"hidden",border:`1px solid ${C.border}`,maxHeight:420}}>
          <img src={photo.src} alt={photo.title} style={{width:"100%",height:420,objectFit:"cover",display:"block"}}/>
          <button onClick={()=>setIdx(i=>(i-1+photos.length)%photos.length)} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,.5)",border:`1px solid ${C.border}`,borderRadius:"50%",width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",backdropFilter:"blur(4px)"}}><Icon.ChevL/></button>
          <button onClick={()=>setIdx(i=>(i+1)%photos.length)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,.5)",border:`1px solid ${C.border}`,borderRadius:"50%",width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",backdropFilter:"blur(4px)"}}><Icon.ChevR/></button>
        </div>
        <div className="card" style={{padding:20}}>
          <h2 className="ds-title" style={{fontSize:20,fontWeight:700,marginBottom:8}}>{photo.title}</h2>
          <p style={{fontSize:13.5,color:C.muted,lineHeight:1.6}}>{photo.desc}</p>
        </div>
      </div>

      {/* Comments panel */}
      <div style={{background:"rgba(30,20,60,.95)",borderTop:`1px solid ${C.border}`,borderRadius:"20px 20px 0 0"}}>
        <button onClick={()=>setCommentsOpen(v=>!v)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 28px",background:"none",color:C.text,fontSize:16,fontWeight:600}}>
          <span>Comentarios</span>
          {commentsOpen?<Icon.ChevU/>:<Icon.ChevD/>}
        </button>
        {commentsOpen && (
          <div style={{maxHeight:380,overflowY:"auto",padding:"0 28px 20px"}}>
            {photo.comments.map(c=>(
              <div key={c.id} style={{marginBottom:16}}>
                <div className="comment-bubble" style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon.User/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13,marginBottom:4,color:C.accentLt}}>{c.user}</div>
                    <div style={{fontSize:13,color:C.text}}>{c.text}</div>
                    <div style={{display:"flex",gap:12,marginTop:6}}>
                      <button onClick={()=>setReplyingTo(replyingTo===c.id?null:c.id)} style={{background:"none",color:C.muted,fontSize:12}}>↩ Responder</button>
                      {c.replies.length>0 && <span style={{color:C.muted,fontSize:12}}>{c.replies.length} respuesta{c.replies.length>1?"s":""}</span>}
                      {c.user==="Mi cuenta" && <button className="btn-danger" style={{padding:"2px 8px",fontSize:11}} onClick={()=>deleteComment(c.id)}>Eliminar</button>}
                    </div>
                  </div>
                </div>
                {c.replies.map(r=>(
                  <div key={r.id} className="sub-comment" style={{marginTop:8,display:"flex",gap:8,alignItems:"flex-start"}}>
                    <div style={{width:26,height:26,borderRadius:"50%",background:C.accentDk,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:10}}><Icon.User/></div>
                    <div>
                      <div style={{fontWeight:600,fontSize:12,color:C.accentLt,marginBottom:2}}>{r.user}</div>
                      <div style={{fontSize:12,color:C.text}}>{r.text}</div>
                    </div>
                  </div>
                ))}
                {replyingTo===c.id && (
                  <div style={{display:"flex",gap:8,marginTop:8,marginLeft:36}}>
                    <input className="input-field" value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Escribe tu respuesta..." style={{flex:1}} onKeyDown={e=>e.key==='Enter'&&sendReply(c.id)}/>
                    <button className="btn-primary" style={{padding:"8px 14px"}} onClick={()=>sendReply(c.id)}><Icon.Send/></button>
                  </div>
                )}
              </div>
            ))}
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <input className="input-field" value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Escribe un comentario..." style={{flex:1}} onKeyDown={e=>e.key==='Enter'&&sendComment()}/>
              <button className="btn-primary" style={{padding:"8px 14px"}} onClick={sendComment}><Icon.Send/></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── BÚSQUEDA ──────────────────────────────────────────────────────
function Busqueda({onDetail}) {
  const [tab,setTab]=useState("busqueda");
  const [query,setQuery]=useState("");
  const [cat,setCat]=useState("todos");
  const [favs,setFavs]=useState([]);
  const cats=["todos","galaxias","nebulosas","planetas","estrellas"];

  const filtered = SEARCH_IMAGES.filter(img=>{
    const matchCat = cat==="todos"||img.cat===cat;
    const matchQ = query===""||img.title.toLowerCase().includes(query.toLowerCase());
    if(tab==="favoritos") return favs.includes(img.id) && matchCat && matchQ;
    return matchCat && matchQ;
  });

  const toggleFav = (id,e) => { e.stopPropagation(); setFavs(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]); };

  return (
    <div style={{flex:1,overflowY:"auto",padding:"24px 32px"}}>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {["busqueda","favoritos"].map(t=>(
          <button key={t} className={`filter-chip ${tab===t?'active':''}`} onClick={()=>setTab(t)}>
            {t==="busqueda"?<><Icon.Search/>&nbsp;BÚSQUEDA</>:<><Icon.HeartFill/>&nbsp;FAVORITOS {favs.length>0?`(${favs.length})`:""}</>}
          </button>
        ))}
      </div>
      {tab==="busqueda" && (
        <div style={{position:"relative",marginBottom:14}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.muted}}><Icon.Search/></span>
          <input className="input-field" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar imágenes astronómicas..." style={{paddingLeft:40}}/>
        </div>
      )}
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {cats.map(c=><button key={c} className={`filter-chip ${cat===c?'active':''}`} onClick={()=>setCat(c)} style={{textTransform:"capitalize"}}>{c}</button>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        {filtered.map(img=>(
          <div key={img.id} className="img-card fade-in" onClick={()=>onDetail(img)}>
            <img src={img.src} alt={img.title}/>
            <div className="img-card-overlay">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                <div>
                  <div style={{fontWeight:600,fontSize:13}}>{img.title}</div>
                  <div style={{fontSize:11,color:C.muted}}>{img.author}</div>
                </div>
                <button onClick={e=>toggleFav(img.id,e)} style={{background:"none",color:favs.includes(img.id)?C.accentLt:C.muted}}>
                  {favs.includes(img.id)?<Icon.HeartFill/>:<Icon.Heart/>}
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length===0 && <div style={{color:C.muted,gridColumn:"1/-1",textAlign:"center",paddingTop:40}}>No se encontraron imágenes.</div>}
      </div>
    </div>
  );
}

// ── IMAGEN DETAIL ─────────────────────────────────────────────────
function ImageDetail({img, onBack}) {
  const [saved,setSaved]=useState(false);
  const descs = {
    "Estrella Gigante":"Las estrellas gigantes son astros que han evolucionado más allá de la secuencia principal y han expandido sus capas externas. Su luminosidad puede superar en miles de veces a la de nuestro Sol. Son fundamentales para la distribución de elementos pesados en el universo al final de su ciclo de vida.",
    "Vía Láctea":"La Vía Láctea es nuestra galaxia espiral barrada, hogar de entre 100 000 y 400 000 millones de estrellas. El Sol se encuentra en el Brazo de Orión, a unos 26 000 años luz del centro galáctico.",
    "Sistema Solar":"Nuestro Sistema Solar se formó hace unos 4 600 millones de años a partir de una nube de gas y polvo. Está compuesto por el Sol, ocho planetas, sus lunas y millones de cuerpos menores.",
  };
  return (
    <div style={{flex:1,overflowY:"auto",padding:"24px 32px"}} className="fade-in">
      <button onClick={onBack} style={{background:"none",color:C.muted,display:"flex",alignItems:"center",gap:6,fontSize:13,marginBottom:20}}>
        <Icon.ArrowL/> VOLVER
      </button>
      <div style={{maxWidth:640,margin:"0 auto"}}>
        <div style={{borderRadius:16,overflow:"hidden",position:"relative",marginBottom:20,border:`1px solid ${C.border}`}}>
          <img src={img.src} alt={img.title} style={{width:"100%",maxHeight:500,objectFit:"cover"}}/>
          <button onClick={()=>setSaved(v=>!v)} style={{position:"absolute",bottom:14,left:14,background:saved?"rgba(124,92,191,.6)":"rgba(0,0,0,.5)",border:`1px solid ${saved?C.accent:C.border}`,borderRadius:8,padding:"7px 14px",display:"flex",alignItems:"center",gap:6,color:"#fff",fontSize:13,backdropFilter:"blur(4px)"}}>
            {saved?<Icon.HeartFill/>:<Icon.Heart/>} {saved?"GUARDADO":"GUARDAR"}
          </button>
        </div>
        <div className="card" style={{padding:20}}>
          <h2 className="ds-title" style={{fontSize:20,fontWeight:700,marginBottom:6}}>{img.title}</h2>
          <div style={{height:2,width:80,background:C.accent,borderRadius:2,marginBottom:14}}/>
          <p style={{fontSize:13.5,color:C.muted,lineHeight:1.7}}>{descs[img.title]||"Una impresionante imagen del cosmos capturada con equipamiento de alta resolución."}</p>
        </div>
      </div>
    </div>
  );
}

// ── FORO ──────────────────────────────────────────────────────────
function Foro({onThread}) {
  const [cat,setCat]=useState("todos");
  const [showModal,setShowModal]=useState(false);
  const [threads,setThreads]=useState(FORUM_THREADS);
  const [newThread,setNewThread]=useState({title:"",body:"",cat:"cosmos"});
  const cats=["todos","planetas","cosmos","tierra","estrellas"];

  const filtered = threads.filter(t=>cat==="todos"||t.cat===cat);

  const publish = () => {
    if(!newThread.title||!newThread.body) return;
    setThreads(v=>[{id:Date.now(),cat:newThread.cat,tag:"tag-cosmos",author:"Mi cuenta",time:"ahora",title:newThread.title,body:newThread.body,replies:0},...v]);
    setNewThread({title:"",body:"",cat:"cosmos"}); setShowModal(false);
  };

  return (
    <div style={{flex:1,overflowY:"auto",padding:"24px 32px"}}>
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <Icon.Users/><h2 className="ds-title" style={{fontSize:20,fontWeight:700}}>Foro Comunitario</h2>
        </div>
        <p style={{fontSize:13,color:C.muted}}>Discusiones de la comunidad DeepSky</p>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {cats.map(c=><button key={c} className={`filter-chip ${cat===c?'active':''}`} onClick={()=>setCat(c)} style={{textTransform:"uppercase",fontSize:11}}>● {c.toUpperCase()}</button>)}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
        {filtered.map(t=>(
          <div key={t.id} className="thread-row fade-in" onClick={()=>onThread(t)}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span className={`tag ${t.tag}`}>● {t.cat.toUpperCase()}</span>
              <span style={{fontSize:12,color:C.muted}}>{t.author} · {t.time}</span>
            </div>
            <h3 style={{fontSize:15,fontWeight:600,marginBottom:4}}>{t.title}</h3>
            <p style={{fontSize:13,color:C.muted,lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{t.body}</p>
            <div style={{marginTop:8,fontSize:12,color:C.muted}}>💬 {t.replies} respuesta{t.replies!==1?"s":""}</div>
          </div>
        ))}
      </div>
      <button className="btn-primary" style={{width:"100%",padding:"14px",display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={()=>setShowModal(true)}>
        <Icon.Plus/> CREAR NUEVO HILO
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal fade-in">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h3 className="ds-title" style={{fontWeight:700}}>Hilo de Chat</h3>
              <button onClick={()=>setShowModal(false)} style={{background:"none",color:C.muted}}><Icon.X/></button>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:12,color:C.muted,marginBottom:8}}>CATEGORÍA</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {["planetas","cosmos","tierra","estrellas"].map(c=>(
                  <button key={c} className={`filter-chip ${newThread.cat===c?'active':''}`} onClick={()=>setNewThread(v=>({...v,cat:c}))} style={{textTransform:"capitalize"}}>● {c}</button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:12,color:C.muted,marginBottom:6}}>TÍTULO</div>
              <input className="input-field" value={newThread.title} onChange={e=>setNewThread(v=>({...v,title:e.target.value}))} placeholder="Título del hilo..."/>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,color:C.muted,marginBottom:6}}>COMENTARIO</div>
              <textarea className="input-field" value={newThread.body} onChange={e=>setNewThread(v=>({...v,body:e.target.value}))} placeholder="Describe tu hilo de discusión..." rows={4} style={{resize:"vertical"}}/>
            </div>
            <button className="btn-primary" style={{width:"100%",padding:12}} onClick={publish}><Icon.Plus/> PUBLICAR HILO</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── THREAD DETAIL ─────────────────────────────────────────────────
function ForoThread({thread, onBack}) {
  const [replies,setReplies]=useState(thread.replies||THREAD_DETAIL.replies);
  const [text,setText]=useState("");
  const t = {...THREAD_DETAIL, ...thread};

  const send = () => {
    if(!text.trim()) return;
    setReplies(v=>[...v,{id:Date.now(),user:"Mi cuenta",time:"ahora",text}]);
    setText("");
  };

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <div style={{flex:1,overflowY:"auto",padding:"24px 32px"}}>
        <button onClick={onBack} style={{background:"none",color:C.muted,display:"flex",alignItems:"center",gap:6,fontSize:13,marginBottom:16}}>
          <Icon.ArrowL/> VOLVER AL FORO
        </button>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
          {t.icon && <span>{t.icon}</span>}
          <span className={`tag ${t.tag||'tag-planets'}`}>● {(t.cat||"planetas").toUpperCase()}</span>
          <span style={{fontSize:12,color:C.muted}}>{t.author} · {t.time}</span>
        </div>
        <h2 className="ds-title" style={{fontSize:20,fontWeight:700,marginBottom:16}}>{t.title}</h2>
        <div style={{background:"rgba(124,92,191,.1)",border:`1px solid rgba(124,92,191,.3)`,borderRadius:12,padding:16,marginBottom:20,fontSize:14,lineHeight:1.7}}>
          {t.body}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {replies.map(r=>(
            <div key={r.id} className={`comment-bubble fade-in ${r.user==='Mi cuenta'?'':''}` } style={r.user==='Mi cuenta'?{background:"rgba(124,92,191,.1)",borderColor:"rgba(124,92,191,.3)"}:{}}>
              <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon.User/></div>
                <div>
                  <div style={{fontWeight:600,fontSize:13,color:r.user==='Mi cuenta'?C.accentLt:C.text,marginBottom:3}}>{r.user} <span style={{color:C.muted,fontWeight:400,fontSize:11}}>· {r.time}</span></div>
                  <div style={{fontSize:13,lineHeight:1.6}}>{r.text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"14px 32px",borderTop:`1px solid ${C.border}`,display:"flex",gap:10,background:"rgba(13,13,26,.9)"}}>
        <input className="input-field" value={text} onChange={e=>setText(e.target.value)} placeholder="Escribe tu respuesta..." style={{flex:1}} onKeyDown={e=>e.key==='Enter'&&send()}/>
        <button className="btn-primary" style={{padding:"10px 16px"}} onClick={send}><Icon.Send/></button>
      </div>
    </div>
  );
}

// ── CALENDARIO ────────────────────────────────────────────────────
function Calendario() {
  const [selectedDay,setSelectedDay]=useState(18);
  const [showModal,setShowModal]=useState(false);
  const [events,setEvents]=useState(EVENTS);
  const [form,setForm]=useState({title:"",time:"22:00 – 01:00 UTC",date:"",location:"Hemisferio Norte...",desc:"",type:"Eclipse"});

  const daysInJune=30; const firstDay=0;
  const days=[];
  for(let i=0;i<firstDay;i++) days.push(null);
  for(let i=1;i<=daysInJune;i++) days.push(i);

  const selEvents=events.filter(e=>e.day===selectedDay);
  const addEvent = () => {
    if(!form.title) return;
    setEvents(v=>[...v,{id:Date.now(),day:selectedDay,title:form.title,type:form.type,color:C.accentLt,...form}]);
    setShowModal(false); setForm({title:"",time:"22:00 – 01:00 UTC",date:"",location:"Hemisferio Norte...",desc:"",type:"Eclipse"});
  };

  return (
    <div style={{flex:1,overflowY:"auto",padding:"24px 32px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <Icon.Calendar/><h2 className="ds-title" style={{fontSize:20,fontWeight:700}}>Calendario de Eventos</h2>
          </div>
          <p style={{fontSize:13,color:C.muted}}>Fenómenos astronómicos destacados</p>
        </div>
        <button className="btn-primary" style={{display:"flex",alignItems:"center",gap:6}} onClick={()=>setShowModal(true)}>
          <Icon.Plus/> AÑADIR
        </button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:24}}>
        <div className="card" style={{padding:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <button style={{background:"none",color:C.muted}}><Icon.ChevL/></button>
            <div>
              <div className="ds-title" style={{fontWeight:700,fontSize:18,textAlign:"center"}}>Junio</div>
              <div style={{fontSize:12,color:C.muted,textAlign:"center"}}>2026</div>
            </div>
            <button style={{background:"none",color:C.muted}}><Icon.ChevR/></button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:8}}>
            {["D","L","M","X","J","V","S"].map(d=><div key={d} style={{textAlign:"center",fontSize:12,color:C.muted,padding:"4px"}}>{d}</div>)}
            {days.map((d,i)=>d==null?<div key={`e${i}`}/>:(
              <div key={d} className={`cal-day ${selectedDay===d?'selected':''} ${events.find(e=>e.day===d)?'has-event':''}`} onClick={()=>setSelectedDay(d)}>
                {d}
              </div>
            ))}
          </div>
          <div style={{marginTop:20,display:"flex",flexDirection:"column",gap:8}}>
            <div style={{fontSize:12,color:C.muted,marginBottom:4}}>JUN — {events.length} EVENTOS</div>
            {events.map(e=>(
              <div key={e.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>setSelectedDay(e.day)}>
                <div style={{width:28,height:28,borderRadius:"50%",background:e.color||C.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#000",flexShrink:0}}>{e.day}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>{e.title}</div>
                  <div style={{fontSize:11,color:C.muted}}>{e.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13}}>{selectedDay}</div>
              <div>
                <div style={{fontWeight:600,fontSize:13}}>{selectedDay} de Junio</div>
                <div style={{fontSize:11,color:C.muted}}>{selEvents.length} evento{selEvents.length!==1?"s":""}</div>
              </div>
            </div>
          </div>
          {selEvents.length===0?(
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,textAlign:"center"}}>
              <Icon.Calendar/>
              <div style={{fontSize:13,color:C.muted,marginTop:8}}>No hay eventos astronómicos este día.</div>
            </div>
          ):selEvents.map(e=>(
            <div key={e.id} style={{background:`linear-gradient(135deg,${e.color||C.accent}22,${C.card})`,border:`1px solid ${e.color||C.accent}44`,borderRadius:14,padding:16}}>
              <div style={{marginBottom:6}}><span className="tag tag-eclipse" style={{borderColor:e.color||C.accent,color:e.color||C.accentLt}}>{e.type?.toUpperCase()}</span></div>
              <h3 className="ds-title" style={{fontWeight:700,fontSize:16,marginBottom:12}}>{e.title}</h3>
              {e.time && <div style={{fontSize:12,color:C.muted,marginBottom:4}}>🕙 {e.time}</div>}
              {e.location && <div style={{fontSize:12,color:C.muted,marginBottom:10}}>📍 {e.location}</div>}
              {e.desc && <p style={{fontSize:12.5,color:C.muted,lineHeight:1.6}}>{e.desc}</p>}
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal fade-in">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h3 className="ds-title" style={{fontWeight:700,display:"flex",alignItems:"center",gap:8}}><Icon.Satelite/> Añadir Evento</h3>
              <button onClick={()=>setShowModal(false)} style={{background:"none",color:C.muted}}><Icon.X/></button>
            </div>
            {[["TIPO",null],["TÍTULO","title"],["HORA","time"],["FECHA","date"],["UBICACIÓN","location"],["DESCRIPCIÓN","desc"]].map(([label,key])=>(
              key===null?(
                <div key={label} style={{marginBottom:12}}>
                  <div style={{fontSize:12,color:C.muted,marginBottom:6}}>{label}</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {["Lluvia de Meteoritos","Eclipse","Conjunción","Oposición","Tránsito"].map(t=>(
                      <button key={t} className={`filter-chip ${form.type===t?'active':''}`} onClick={()=>setForm(v=>({...v,type:t}))} style={{fontSize:11}}>{t}</button>
                    ))}
                  </div>
                </div>
              ):(
                <div key={key} style={{marginBottom:12}}>
                  <div style={{fontSize:12,color:C.muted,marginBottom:6}}>{label}</div>
                  {key==="desc"?
                    <textarea className="input-field" value={form[key]} onChange={e=>setForm(v=>({...v,[key]:e.target.value}))} placeholder="Descripción del evento..." rows={3} style={{resize:"none"}}/>:
                    <input className="input-field" value={form[key]} onChange={e=>setForm(v=>({...v,[key]:e.target.value}))} placeholder={label==="HORA"?"22:00 – 01:00 UTC":label==="UBICACIÓN"?"Hemisferio Norte...":""}/>
                  }
                </div>
              )
            ))}
            <button className="btn-primary" style={{width:"100%",padding:12}} onClick={addEvent}><Icon.Plus/> AÑADIR EVENTO</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── RETOS ─────────────────────────────────────────────────────────
function Retos() {
  const [selectedChallenge,setSelectedChallenge]=useState(null);
  const [showUpload,setShowUpload]=useState(false);
  const [showCreate,setShowCreate]=useState(false);
  const [participating,setParticipating]=useState(["luna-en-detalle"]);
  const [gallery,setGallery]=useState(CHALLENGE_GALLERY);
  const [newReto,setNewReto]=useState({title:"",cat:"cosmos",desc:"",dateStart:"",dateEnd:""});

  const winners = [
    {pos:1,user:"Andrés M.",color:"#c9a84c"},{pos:2,user:"Elena R.",color:"#aaa"},{pos:3,user:"Carlos V.",color:"#c87941"}
  ];

  if(selectedChallenge) return (
    <div style={{flex:1,overflowY:"auto",padding:"24px 32px"}} className="fade-in">
      <button onClick={()=>setSelectedChallenge(null)} style={{background:"none",color:C.muted,display:"flex",alignItems:"center",gap:6,fontSize:13,marginBottom:16}}><Icon.ArrowL/> RETOS</button>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
        <span className={`tag ${selectedChallenge.tag}`}>● {selectedChallenge.cat.toUpperCase()}</span>
        <span style={{fontSize:12,color:"#66bb6a"}}>⏱ 12D 0H 9M</span>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
        <h2 className="ds-title" style={{fontSize:20,fontWeight:700}}>{selectedChallenge.title}</h2>
        <button className={participating.includes(selectedChallenge.id)?'btn-ghost':'btn-primary'} style={{display:"flex",alignItems:"center",gap:6}} onClick={()=>{setParticipating(v=>v.includes(selectedChallenge.id)?v.filter(x=>x!==selectedChallenge.id):[...v,selectedChallenge.id]);setShowUpload(true);}}>
          <Icon.Trophy/> {participating.includes(selectedChallenge.id)?"PARTICIPANDO":"PARTICIPAR"}
        </button>
      </div>
      <p style={{fontSize:13,color:C.muted,marginBottom:20}}>Captura la belleza de galaxias lejanas con tu equipo. Se valorará la profundidad del campo, el detalle en los brazos espirales y el procesado de imagen.</p>
      <div style={{fontSize:13,color:C.muted,marginBottom:16}}>GALERÍA DE PARTICIPANTES</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        {gallery.slice(0,3).map(g=>(
          <div key={g.id} className="img-card" style={{aspectRatio:"3/4"}}>
            <img src={g.src} alt={g.user}/>
            {g.pos<=3 && <div style={{position:"absolute",top:8,left:8,width:26,height:26,borderRadius:"50%",background:g.pos===1?"#c9a84c":g.pos===2?"#aaa":"#c87941",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,color:"#000"}}>{g.pos}</div>}
            <div className="img-card-overlay">
              <div style={{fontWeight:600,fontSize:13}}>{g.user}</div>
              <div style={{fontSize:11,color:C.muted,display:"flex",alignItems:"center",gap:4}}><Icon.Heart/> {g.likes}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginTop:14}}>
        {gallery.slice(3).map(g=>(
          <div key={g.id} className="img-card" style={{aspectRatio:"3/4",position:"relative"}}>
            <img src={g.src} alt={g.user} style={{filter:g.review?"blur(2px) brightness(.5)":"none"}}/>
            {g.review && (
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
                <Info/> <span style={{fontSize:12,color:"#fff",fontWeight:600}}>En revisión</span>
                <div style={{display:"flex",gap:8}}>
                  <button className="btn-danger" onClick={e=>{e.stopPropagation();setGallery(v=>v.filter(x=>x.id!==g.id));}}>RECHAZAR</button>
                  <button className="btn-success" onClick={e=>{e.stopPropagation();setGallery(v=>v.map(x=>x.id===g.id?{...x,review:false}:x));}}>ACEPTAR</button>
                </div>
              </div>
            )}
            {!g.review && <div className="img-card-overlay"><div style={{fontWeight:600,fontSize:13}}>{g.user}</div><div style={{fontSize:11,color:C.muted}}><Icon.Heart/> {g.likes}</div></div>}
          </div>
        ))}
      </div>

      {showUpload && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowUpload(false)}>
          <div className="modal fade-in" style={{maxWidth:440}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h3 className="ds-title" style={{fontWeight:700}}>Subir Fotografía</h3>
              <button onClick={()=>setShowUpload(false)} style={{background:"none",color:C.muted}}><Icon.X/></button>
            </div>
            <div style={{border:`2px dashed ${C.border}`,borderRadius:12,padding:40,textAlign:"center",marginBottom:16,cursor:"pointer",transition:"border-color .2s"}} onMouseEnter={e=>e.target.style.borderColor=C.accent} onMouseLeave={e=>e.target.style.borderColor=C.border}>
              <Icon.Upload/><div style={{fontSize:13,color:C.muted,marginTop:8}}>SELECCIONAR IMAGEN</div>
            </div>
            <button className="btn-primary" style={{width:"100%",padding:12,display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={()=>{setShowUpload(false);setGallery(v=>[...v,{id:Date.now(),user:"Mi cuenta",pos:v.length+1,likes:0,src:"https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=400&q=80",review:true}]);}}>
              <Icon.Trophy/> PARTICIPAR EN EL RETO
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{flex:1,overflowY:"auto",padding:"24px 32px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><Icon.Scope/><h2 className="ds-title" style={{fontWeight:700,fontSize:18}}>Astrofotografía</h2></div>
        <button className="btn-ghost" style={{fontSize:12,padding:"7px 14px",display:"flex",alignItems:"center",gap:6}} onClick={()=>setShowCreate(true)}><Icon.Plus/> NUEVO RETO</button>
      </div>
      <div style={{fontSize:12,color:"#66bb6a",marginBottom:20}}>● RETOS ACTIVOS</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14,marginBottom:28}}>
        {CHALLENGES.map(c=>(
          <div key={c.id} className="challenge-card" onClick={()=>setSelectedChallenge(c)}>
            <img src={c.src} alt={c.title}/>
            <div className="challenge-card-overlay">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"auto"}}>
                <span className="tag tag-active" style={{position:"absolute",top:10,right:10}}>ACTIVO</span>
              </div>
              <h3 style={{fontWeight:700,fontSize:15,marginBottom:4}}>{c.title}</h3>
              <div style={{display:"flex",gap:12,fontSize:12,color:C.muted}}>
                <span className={`tag ${c.tag}`} style={{fontSize:10,padding:"2px 8px"}}>{c.cat}</span>
                <span>❤ {c.likes}</span>
                <span>👥 {c.participants} part.</span>
                {participating.includes(c.id) && <span style={{color:"#66bb6a"}}>✓ Participando</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{fontSize:13,color:C.muted,marginBottom:12}}>🏆 GANADORES</div>
      {[{title:"Lluvia de Perseidas",participants:"5 participantes"},{title:"Vía Láctea Invernal",participants:"4 participantes · Vía Láctea"}].map((r,ri)=>(
        <div key={ri} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:10}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",height:80}}>
            {["Andrés M.","Elena R.","Carlos V."].map((u,i)=>(
              <div key={i} style={{background:`url(${SEARCH_IMAGES[i+3]?.src}) center/cover`,position:"relative"}}>
                <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)"}}/>
                <div style={{position:"absolute",top:6,left:6,width:20,height:20,borderRadius:"50%",background:i===0?"#c9a84c":i===1?"#aaa":"#c87941",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#000"}}>{i+1}</div>
                <div style={{position:"absolute",bottom:4,left:6,fontSize:11,color:"#fff",fontWeight:600}}>{u}</div>
              </div>
            ))}
          </div>
          <div style={{padding:"10px 14px",borderTop:`1px solid ${C.border}`}}>
            <div style={{fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6}}><span style={{color:C.gold}}>|</span>{r.title}</div>
            <div style={{fontSize:11,color:C.muted}}>{r.participants}</div>
          </div>
        </div>
      ))}

      {showCreate && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowCreate(false)}>
          <div className="modal fade-in">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h3 className="ds-title" style={{fontWeight:700,display:"flex",alignItems:"center",gap:8}}><Icon.Trophy/> Crear Reto</h3>
              <button onClick={()=>setShowCreate(false)} style={{background:"none",color:C.muted}}><Icon.X/></button>
            </div>
            <div style={{marginBottom:12}}><div style={{fontSize:12,color:C.muted,marginBottom:6}}>TÍTULO</div><input className="input-field" value={newReto.title} onChange={e=>setNewReto(v=>({...v,title:e.target.value}))} placeholder="Nombre del reto"/></div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:12,color:C.muted,marginBottom:6}}>CATEGORÍA</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {["Planetas","Cosmos","Tierra","Estrellas"].map(c=><button key={c} className={`filter-chip ${newReto.cat===c.toLowerCase()?'active':''}`} onClick={()=>setNewReto(v=>({...v,cat:c.toLowerCase()}))} style={{fontSize:11}}>● {c}</button>)}
              </div>
            </div>
            <div style={{marginBottom:12}}><div style={{fontSize:12,color:C.muted,marginBottom:6}}>FECHA INICIO</div><input className="input-field" type="date" value={newReto.dateStart} onChange={e=>setNewReto(v=>({...v,dateStart:e.target.value}))}/></div>
            <div style={{marginBottom:12}}><div style={{fontSize:12,color:C.muted,marginBottom:6}}>FECHA FIN</div><input className="input-field" type="date" value={newReto.dateEnd} onChange={e=>setNewReto(v=>({...v,dateEnd:e.target.value}))}/></div>
            <div style={{marginBottom:16}}><div style={{fontSize:12,color:C.muted,marginBottom:6}}>DESCRIPCIÓN</div><textarea className="input-field" value={newReto.desc} onChange={e=>setNewReto(v=>({...v,desc:e.target.value}))} placeholder="¿Qué deben fotografiar los participantes?" rows={3} style={{resize:"none"}}/></div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,color:C.muted,marginBottom:6}}>IMAGEN DE REFERENCIA</div>
              <div style={{border:`2px dashed ${C.border}`,borderRadius:12,padding:30,textAlign:"center",cursor:"pointer"}}><Icon.Upload/><div style={{fontSize:12,color:C.muted,marginTop:6}}>SELECCIONAR IMAGEN</div></div>
            </div>
            <button className="btn-primary" style={{width:"100%",padding:12}} onClick={()=>setShowCreate(false)}><Icon.Plus/> CREAR RETO</button>
          </div>
        </div>
      )}
    </div>
  );
}

// helper for review
function Info(){return <svg width="24" height="24" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;}

// ── NEOS ──────────────────────────────────────────────────────────
function Neos() {
  const [selected,setSelected]=useState(null);
  const angle = useRef(0);
  const [tick,setTick]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setTick(v=>v+1),50);return()=>clearInterval(id);},[]);

  const sel = NEO_OBJECTS.find(n=>n.id===selected);

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",padding:"16px 24px",gap:16}}>
      <div style={{display:"flex",gap:20,flex:1}}>
        {/* Radar */}
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{position:"relative",width:360,height:360}}>
            <svg width="360" height="360" viewBox="0 0 360 360">
              <circle cx="180" cy="180" r="170" fill="none" stroke="#1a3a4a" strokeWidth="1"/>
              <circle cx="180" cy="180" r="128" fill="none" stroke="#1a3a4a" strokeWidth="1"/>
              <circle cx="180" cy="180" r="85" fill="none" stroke="#1a3a4a" strokeWidth="1"/>
              <circle cx="180" cy="180" r="42" fill="none" stroke="#1a3a4a" strokeWidth="1"/>
              {[0,30,60,90,120,150].map(a=>(
                <line key={a} x1="180" y1="180" x2={180+170*Math.cos(a*Math.PI/180)} y2={180+170*Math.sin(a*Math.PI/180)} stroke="#1a3a4a" strokeWidth="1"/>
              ))}
              {/* sweep */}
              <defs>
                <radialGradient id="sweep" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00ff88" stopOpacity="0"/>
                  <stop offset="100%" stopColor="#00ff88" stopOpacity="0.15"/>
                </radialGradient>
              </defs>
              <g style={{transform:`rotate(${tick*2}deg)`,transformOrigin:"180px 180px"}}>
                <path d={`M180,180 L${180+170*Math.cos(-0.3)},${180+170*Math.sin(-0.3)} A170,170 0 0,1 ${180+170*Math.cos(0.3)},${180+170*Math.sin(0.3)} Z`} fill="url(#sweep)" opacity=".8"/>
                <line x1="180" y1="180" x2="350" y2="180" stroke="#00ff88" strokeWidth="1.5" opacity=".7"/>
              </g>
              {/* Earth */}
              <circle cx="180" cy="180" r="10" fill="#4fc3f7"/>
              <text x="180" y="200" fill="#4fc3f7" fontSize="10" textAnchor="middle">Tierra</text>
              {/* NEO dots */}
              {NEO_OBJECTS.map(n=>{
                const px=180+340*((n.x/100)-.5);
                const py=180+340*((n.y/100)-.5);
                return (
                  <g key={n.id} onClick={()=>setSelected(n.id===selected?null:n.id)} style={{cursor:"pointer"}}>
                    <circle cx={px} cy={py} r={selected===n.id?8:6} fill={n.color} opacity=".9" style={{filter:"drop-shadow(0 0 4px "+n.color+")"}}/>
                    <text x={px+10} y={py-5} fill={n.color} fontSize="9" fontWeight="600">{n.name}</text>
                  </g>
                );
              })}
            </svg>
            <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,.7)",border:`1px solid ${C.border}`,borderRadius:20,padding:"5px 14px",fontSize:11,color:C.muted,whiteSpace:"nowrap"}}>Toca un objeto para ver sus datos</div>
          </div>
        </div>

        {/* Info panel */}
        <div style={{width:280}}>
          {sel?(
            <div className="planet-info-panel fade-in">
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{width:12,height:12,borderRadius:"50%",background:sel.color}}/>
                <span style={{fontWeight:700,fontSize:16}}>{sel.name}</span>
              </div>
              <span className={`tag ${sel.risk.includes("MEDIO")?"tag-eclipse":sel.risk.includes("ALTO")?"tag-stars":"tag-active"}`} style={{marginBottom:14,display:"inline-block"}}>{sel.risk}</span>
              {[["DIÁMETRO",sel.diam],["VELOCIDAD",sel.vel],["DISTANCIA",sel.dist],["ACERCAMIENTO",sel.approach]].map(([l,v])=>(
                <div key={l} className="info-row">
                  <span style={{fontSize:12,color:C.muted}}>{l}</span>
                  <span style={{fontSize:13,fontWeight:600}}>{v}</span>
                </div>
              ))}
              <div style={{marginTop:14}}>
                <div style={{fontSize:11,color:C.muted,marginBottom:8}}>OTROS OBJETOS</div>
                {NEO_OBJECTS.filter(n=>n.id!==sel.id).map(n=>(
                  <div key={n.id} style={{display:"flex",justify:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}} onClick={()=>setSelected(n.id)}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:n.color}}/>
                      <span style={{fontSize:13}}>{n.name}</span>
                    </div>
                    <span style={{fontSize:11,color:n.risk.includes("MEDIO")?"#c9a84c":n.risk.includes("Bajo")?"#66bb6a":C.muted}}>{n.risk.split(" ")[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",color:C.muted,gap:10}}>
              <Icon.Radar/>
              <span style={{fontSize:13}}>Selecciona un objeto del radar</span>
            </div>
          )}
        </div>
      </div>

      {/* Historical chart */}
      <div className="card" style={{padding:16}}>
        <div style={{fontSize:12,color:C.muted,marginBottom:12}}>AVISTAMIENTOS HISTÓRICOS &nbsp;
          <span style={{color:"#4fc3f7"}}>● En órbita</span>&nbsp;
          <span style={{color:"#c9a84c"}}>● Pericélico</span>&nbsp;
          <span style={{color:"#e57373"}}>● Impacto</span>
        </div>
        <svg width="100%" height="80" viewBox="0 0 700 80">
          <line x1="0" y1="70" x2="700" y2="70" stroke={C.border} strokeWidth="1"/>
          {[2004,2007,2010,2013,2016,2019,2022,2025].map((y,i)=>(
            <text key={y} x={10+i*90} y="78" fill={C.muted} fontSize="10">{y}</text>
          ))}
          {[{x:10,y:65,c:"#c9a84c"},{x:100,y:60,c:"#e57373"},{x:190,y:50,c:"#4fc3f7"},{x:280,y:30,c:"#4fc3f7"},{x:370,y:55,c:"#c9a84c"},{x:460,y:40,c:"#4fc3f7"},{x:550,y:65,c:"#c9a84c"},{x:600,y:58,c:"#4fc3f7"},{x:640,y:62,c:"#c9a84c"},{x:680,y:60,c:"#e57373"}].map((p,i)=>(
            <circle key={i} cx={p.x} cy={p.y} r="5" fill={p.c} opacity=".9"/>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ── MODELO 3D ─────────────────────────────────────────────────────
function Modelo3D() {
  const [selected,setSelected]=useState(null);
  const [curiosities,setCuriosities]=useState({"saturn":["El único planeta que flotaría en el agua"]});
  const [newCur,setNewCur]=useState("");
  const [showEventModal,setShowEventModal]=useState(false);
  const [showCurBubble,setShowCurBubble]=useState(null);
  const [tick,setTick]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setTick(v=>v+1),30);return()=>clearInterval(id);},[]);

  const sel = PLANETS.find(p=>p.id===selected);

  const getPlanetPos = (p) => {
    const t = tick * 0.01 / p.orbitT;
    return {
      x: 300 + p.orbitR * Math.cos(t),
      y: 240 + p.orbitR * Math.sin(t) * 0.4,
    };
  };

  return (
    <div style={{flex:1,display:"flex",overflow:"hidden"}}>
      <div style={{flex:1,position:"relative",overflow:"hidden"}}>
        <svg width="100%" height="100%" viewBox="0 0 600 480" style={{cursor:"default"}}>
          {/* Orbit rings */}
          {PLANETS.map(p=>(
            <ellipse key={p.id} cx="300" cy="240" rx={p.orbitR} ry={p.orbitR*.4} fill="none" stroke={selected===p.id?"rgba(124,92,191,.4)":"rgba(255,255,255,.06)"} strokeWidth={selected===p.id?1.5:1}/>
          ))}
          {/* Sun */}
          <circle cx="300" cy="240" r="30" fill="#f59e0b" style={{filter:"drop-shadow(0 0 20px #f59e0b)"}}/>
          <circle cx="300" cy="240" r="30" fill="url(#sunGrad)"/>
          <defs>
            <radialGradient id="sunGrad" cx="40%" cy="40%">
              <stop offset="0%" stopColor="#fde68a"/>
              <stop offset="100%" stopColor="#d97706"/>
            </radialGradient>
          </defs>
          {/* Planets */}
          {PLANETS.map(p=>{
            const pos = getPlanetPos(p);
            const isSel = selected===p.id;
            return (
              <g key={p.id} onClick={()=>setSelected(p.id===selected?null:p.id)} style={{cursor:"pointer"}}>
                {p.id==="saturn" && (
                  <ellipse cx={pos.x} cy={pos.y} rx={p.size*1.8} ry={p.size*.5} fill="none" stroke={p.color} strokeWidth="2.5" opacity=".7"/>
                )}
                <circle cx={pos.x} cy={pos.y} r={p.size/2} fill={p.color} style={{filter:isSel?`drop-shadow(0 0 8px ${p.color})`:undefined}}/>
                {isSel && <circle cx={pos.x} cy={pos.y} r={p.size/2+4} fill="none" stroke={p.color} strokeWidth="1.5" strokeDasharray="4 3"/>}
              </g>
            );
          })}
        </svg>
        {!selected && (
          <div style={{position:"absolute",bottom:20,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,.7)",border:`1px solid ${C.border}`,borderRadius:20,padding:"7px 18px",fontSize:12,color:C.muted}}>
            Toca un planeta para explorar
          </div>
        )}
        {showCurBubble && (
          <div style={{position:"absolute",top:"30%",left:"20%",background:C.card,border:`1px solid ${C.gold}44`,borderRadius:12,padding:16,maxWidth:300}} className="fade-in">
            <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon.User/></div>
              <div>
                <div style={{fontSize:12,color:C.gold,marginBottom:4}}>Carlos V. <span style={{color:C.muted}}>· hace 30 min</span></div>
                <p style={{fontSize:13,lineHeight:1.6,color:C.text}}>{showCurBubble}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {sel && (
        <div className="planet-info-panel fade-in" style={{width:260,margin:"16px 16px 16px 0",overflowY:"auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:14,height:14,borderRadius:"50%",background:sel.color,flexShrink:0}}/>
              <span className="ds-title" style={{fontWeight:700,fontSize:17}}>{sel.name}</span>
            </div>
            <button onClick={()=>setSelected(null)} style={{background:"none",color:C.muted}}><Icon.X/></button>
          </div>
          <p style={{fontSize:12.5,color:C.muted,lineHeight:1.6,marginBottom:14}}>{sel.desc}</p>
          {[["DIÁMETRO",sel.diam],["DISTANCIA",sel.dist],["AÑO",sel.year],["LUNAS",sel.moons],["TEMP",sel.temp]].map(([l,v])=>(
            <div key={l} className="info-row"><span style={{fontSize:12,color:C.muted}}>{l}</span><span style={{fontSize:13,fontWeight:600}}>{v}</span></div>
          ))}
          <div style={{marginTop:14}}>
            <div style={{display:"flex",justify:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontSize:11,color:C.muted,display:"flex",alignItems:"center",gap:4}}><Icon.Star/> CURIOSIDADES</div>
              <button onClick={()=>setShowEventModal(true)} style={{background:"rgba(124,92,191,.2)",border:`1px solid ${C.accent}`,borderRadius:6,padding:"3px 10px",color:C.accentLt,fontSize:11}}>+ AÑADIR</button>
            </div>
            {(curiosities[sel.id]||[]).map((c,i)=>(
              <div key={i} style={{background:`${C.gold}18`,border:`1px solid ${C.gold}33`,borderRadius:8,padding:10,fontSize:12.5,lineHeight:1.5,marginBottom:6,cursor:"pointer"}} onClick={()=>setShowCurBubble(showCurBubble===c?null:c)}>
                {c}
              </div>
            ))}
            {(curiosities[sel.id]||[]).length===0 && <div style={{fontSize:12,color:C.muted,textAlign:"center",padding:10}}>Añade la primera curiosidad</div>}
          </div>

          {showEventModal && (
            <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowEventModal(false)}>
              <div className="modal fade-in" style={{minWidth:340}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <h3 className="ds-title" style={{fontWeight:700}}>Añadir Curiosidad</h3>
                  <button onClick={()=>setShowEventModal(false)} style={{background:"none",color:C.muted}}><Icon.X/></button>
                </div>
                <textarea className="input-field" value={newCur} onChange={e=>setNewCur(e.target.value)} placeholder="Escribe una curiosidad interesante..." rows={3} style={{marginBottom:14,resize:"none"}}/>
                <button className="btn-primary" style={{width:"100%",padding:11}} onClick={()=>{if(!newCur.trim())return;setCuriosities(v=>({...v,[sel.id]:[...(v[sel.id]||[]),newCur]}));setNewCur("");setShowEventModal(false);}}>
                  <Icon.Plus/> AÑADIR
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── AUTH ──────────────────────────────────────────────────────────
function Auth({onLogin}) {
  const [tab,setTab]=useState("login");
  const [form,setForm]=useState({user:"",pass:"",email:"",pass2:""});
  const [showPass,setShowPass]=useState(false);

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:`radial-gradient(ellipse at 60% 40%, #1a1040 0%, ${C.bg} 70%)`}}>
      <div style={{marginBottom:32,textAlign:"center"}}>
        <Icon.Satelite/>
        <h1 className="ds-title" style={{fontSize:52,fontWeight:700,letterSpacing:2,marginTop:8}}>DeepSky</h1>
      </div>
      <div style={{background:"rgba(16,14,38,.9)",border:`1px solid ${C.border}`,borderRadius:18,padding:"32px 36px",width:400,backdropFilter:"blur(12px)"}}>
        <div style={{display:"flex",borderRadius:10,overflow:"hidden",marginBottom:24,border:`1px solid ${C.border}`}}>
          {["login","registro"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"11px",fontWeight:600,fontSize:13,letterSpacing:.5,background:tab===t?C.accent:"transparent",color:tab===t?"#fff":C.muted,transition:"background .2s",textTransform:"uppercase"}}>
              {t==="login"?"INICIO DE SESIÓN":"REGISTRO"}
            </button>
          ))}
        </div>
        {tab==="login"?(
          <>
            <div style={{marginBottom:14}}><div style={{fontSize:11,color:C.muted,marginBottom:6,letterSpacing:.5}}>NOMBRE DE USUARIO</div><input className="input-field" value={form.user} onChange={e=>setForm(v=>({...v,user:e.target.value}))} placeholder="usuario"/></div>
            <div style={{marginBottom:6}}>
              <div style={{fontSize:11,color:C.muted,marginBottom:6,letterSpacing:.5}}>CONTRASEÑA</div>
              <div style={{position:"relative"}}>
                <input className="input-field" type={showPass?"text":"password"} value={form.pass} onChange={e=>setForm(v=>({...v,pass:e.target.value}))} placeholder="••••••••" style={{paddingRight:40}}/>
                <button onClick={()=>setShowPass(v=>!v)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",color:C.muted}}>{showPass?<Icon.EyeOff/>:<Icon.Eye/>}</button>
              </div>
            </div>
            <div style={{textAlign:"right",fontSize:12,color:C.accentLt,marginBottom:20,cursor:"pointer"}}>¿Olvidaste tu contraseña?</div>
            <button className="btn-primary" style={{width:"100%",padding:"13px",fontSize:14}} onClick={onLogin}>INICIAR SESIÓN</button>
            <div style={{textAlign:"center",fontSize:13,color:C.muted,marginTop:14}}>¿No tienes cuenta? <span style={{color:C.accentLt,cursor:"pointer"}} onClick={()=>setTab("registro")}>Regístrate</span></div>
          </>
        ):(
          <>
            {[["CORREO ELECTRÓNICO","email","correo@ejemplo.com"],["NOMBRE DE USUARIO","user","usuario"]].map(([l,k,ph])=>(
              <div key={k} style={{marginBottom:12}}><div style={{fontSize:11,color:C.muted,marginBottom:6,letterSpacing:.5}}>{l}</div><input className="input-field" value={form[k]} onChange={e=>setForm(v=>({...v,[k]:e.target.value}))} placeholder={ph}/></div>
            ))}
            {[["CONTRASEÑA","pass"],["CONFIRMAR CONTRASEÑA","pass2"]].map(([l,k])=>(
              <div key={k} style={{marginBottom:12}}>
                <div style={{fontSize:11,color:C.muted,marginBottom:6,letterSpacing:.5}}>{l}</div>
                <div style={{position:"relative"}}>
                  <input className="input-field" type={showPass?"text":"password"} value={form[k]} onChange={e=>setForm(v=>({...v,[k]:e.target.value}))} placeholder="••••••••" style={{paddingRight:40}}/>
                  <button onClick={()=>setShowPass(v=>!v)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",color:C.muted}}>{showPass?<Icon.EyeOff/>:<Icon.Eye/>}</button>
                </div>
              </div>
            ))}
            <button className="btn-primary" style={{width:"100%",padding:"13px",fontSize:14,marginTop:8}} onClick={onLogin}>CREAR CUENTA</button>
            <div style={{textAlign:"center",fontSize:13,color:C.muted,marginTop:14}}>¿Ya tienes cuenta? <span style={{color:C.accentLt,cursor:"pointer"}} onClick={()=>setTab("login")}>Inicia sesión</span></div>
          </>
        )}
      </div>
    </div>
  );
}

// ── PROFILE MODAL ─────────────────────────────────────────────────
function ProfileModal({onClose, onLogout}) {
  const [form,setForm]=useState({user:"Cazadora Estelar",email:"v.montes.cosmos@ejemplo.com",location:"Mérida, México",bio:"Apasionada de la astrofísica y la divulgación científica. Disfruto documentar el tránsito de exoplanetas, programar pequeños scripts para rastrear asteroides y compartir la belleza del cielo profundo con la comunidad. ¡Siempre con la mirada en las estrellas!"});
  const [notifs,setNotifs]=useState(true);
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal fade-in" style={{maxWidth:420}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon.User/></div>
            <div><div className="ds-title" style={{fontWeight:700}}>Mi Perfil</div><div style={{fontSize:11,color:C.muted}}>DeepSky · 23 agosto</div></div>
          </div>
          <button onClick={onClose} style={{background:"none",color:C.muted}}><Icon.X/></button>
        </div>
        {[["NOMBRE DE USUARIO","user"],["CORREO ELECTRÓNICO","email"],["UBICACIÓN","location"]].map(([l,k])=>(
          <div key={k} style={{marginBottom:12}}><div style={{fontSize:11,color:C.muted,marginBottom:6,letterSpacing:.5}}>{l}</div><input className="input-field" value={form[k]} onChange={e=>setForm(v=>({...v,[k]:e.target.value}))}/></div>
        ))}
        <div style={{marginBottom:16}}><div style={{fontSize:11,color:C.muted,marginBottom:6,letterSpacing:.5}}>BIOGRAFÍA</div><textarea className="input-field" value={form.bio} onChange={e=>setForm(v=>({...v,bio:e.target.value}))} rows={5} style={{resize:"none"}}/></div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><Icon.Bell/><span style={{fontSize:13,fontWeight:500}}>NOTIFICACIONES</span></div>
          <div onClick={()=>setNotifs(v=>!v)} style={{width:44,height:24,borderRadius:12,background:notifs?C.accent:C.border,cursor:"pointer",position:"relative",transition:"background .2s"}}>
            <div style={{position:"absolute",top:2,left:notifs?22:2,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
          </div>
        </div>
        <button onClick={onLogout} style={{width:"100%",padding:"12px",background:"rgba(192,57,43,.15)",border:"1px solid rgba(192,57,43,.3)",borderRadius:10,color:"#e57373",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:13}}>
          <Icon.Logout/> CERRAR SESIÓN
        </button>
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────
export default function App() {
  const [authed,setAuthed]=useState(false);
  const [page,setPage]=useState("fotoDia");
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [showProfile,setShowProfile]=useState(false);
  const [detailImg,setDetailImg]=useState(null);
  const [forumThread,setForumThread]=useState(null);
  const [deleteModal,setDeleteModal]=useState(null);

  if(!authed) return (
    <>
      <style>{styles}</style>
      <StarField/>
      <Auth onLogin={()=>setAuthed(true)}/>
    </>
  );

  const handleSetPage = (p) => { setPage(p); setDetailImg(null); setForumThread(null); };

  const renderMain = () => {
    if(page==="fotoDia") return <FotoDelDia/>;
    if(page==="busqueda") return detailImg ? <ImageDetail img={detailImg} onBack={()=>setDetailImg(null)}/> : <Busqueda onDetail={setDetailImg}/>;
    if(page==="foro") return forumThread ? <ForoThread thread={forumThread} onBack={()=>setForumThread(null)}/> : <Foro onThread={setForumThread}/>;
    if(page==="calendario") return <Calendario/>;
    if(page==="retos") return <Retos/>;
    if(page==="neos") return <Neos/>;
    if(page==="modelo3d") return <Modelo3D/>;
    return <FotoDelDia/>;
  };

  return (
    <>
      <style>{styles}</style>
      <StarField/>
      <div className="main-layout" style={{flexDirection:"column"}}>
        <Topbar page={page} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onAccount={()=>setShowProfile(true)}/>
        <div style={{display:"flex",flex:1,overflow:"hidden"}}>
          {sidebarOpen ? <Sidebar page={page} setPage={handleSetPage} open={sidebarOpen}/> : <LeftNav page={page} setPage={handleSetPage}/>}
          <div style={{flex:1,display:"flex",overflow:"hidden",position:"relative"}}>
            {renderMain()}
          </div>
        </div>
      </div>
      {showProfile && <ProfileModal onClose={()=>setShowProfile(false)} onLogout={()=>{setShowProfile(false);setAuthed(false);}}/>}
    </>
  );
}