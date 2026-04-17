import { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";

// ─── Router Context ───────────────────────────────────────────────────────────
const RouterContext = createContext(null);
const AppContext = createContext(null);

function Router({ children }) {
  const [route, setRoute] = useState("home");
  const [params, setParams] = useState({});

  const navigate = useCallback((to, p = {}) => {
    setRoute(to);
    setParams(p);
    window.scrollTo(0, 0);
  }, []);

  return (
    <RouterContext.Provider value={{ route, params, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

function Route({ path, component: Component }) {
  const { route } = useContext(RouterContext);
  return route === path ? <Component /> : null;
}

function useRouter() { return useContext(RouterContext); }
function useApp() { return useContext(AppContext); }

// ─── Global Styles ────────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
    :root{
      --navy:#0A1628;--gold:#C8963E;--gold-light:#E8B86D;
      --frosted:rgba(255,255,255,0.08);--frosted-mid:rgba(255,255,255,0.12);
      --frosted-high:rgba(255,255,255,0.18);--border:rgba(255,255,255,0.15);
      --white:#FFF;--muted:rgba(255,255,255,0.6);--muted-low:rgba(255,255,255,0.35);
      --success:#2ECC71;--danger:#E74C3C;
      --shadow:0 8px 32px rgba(0,0,0,0.35);--shadow-deep:0 16px 48px rgba(0,0,0,0.5);
    }
    html,body{background:var(--navy);color:var(--white);min-height:100vh;overflow-x:hidden;font-family:'DM Sans',sans-serif}
    h1,h2,h3{font-family:'Playfair Display',serif}
    #root{max-width:430px;margin:0 auto;position:relative;min-height:100vh}

    .screen{padding-bottom:80px;min-height:100vh;overflow-y:auto;overflow-x:hidden;background:var(--navy)}

    /* Bottom Nav */
    .bottom-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;
      height:64px;background:rgba(10,22,40,0.95);backdrop-filter:blur(20px);
      border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-around;z-index:1000}
    .nav-item{display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;
      padding:8px 16px;border-radius:12px;transition:all 0.3s;opacity:0.5}
    .nav-item.active{opacity:1}
    .nav-item.active .nav-icon,.nav-item.active .nav-label{color:var(--gold)}
    .nav-icon{font-size:22px;transition:transform 0.3s}
    .nav-label{font-size:10px;font-weight:600;letter-spacing:0.5px;color:var(--muted)}
    .nav-item:hover .nav-icon{transform:translateY(-2px)}

    /* Glass */
    .glass{background:var(--frosted);backdrop-filter:blur(16px);border:1px solid var(--border);border-radius:20px;box-shadow:var(--shadow)}
    .glass-high{background:var(--frosted-high);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.25);border-radius:20px;box-shadow:var(--shadow-deep)}

    /* Buttons & forms */
    .back-btn{width:38px;height:38px;background:rgba(255,255,255,0.15);backdrop-filter:blur(12px);
      border:1px solid rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;
      justify-content:center;cursor:pointer;font-size:18px;transition:all 0.2s;z-index:10;
      flex-shrink:0;border:none;color:white}
    .back-btn:hover{background:rgba(255,255,255,0.25)}

    .form-label{font-size:12px;color:var(--muted);font-weight:600;letter-spacing:0.5px;
      text-transform:uppercase;margin-bottom:6px;display:block}
    .form-input{width:100%;background:var(--frosted-mid);border:1px solid var(--border);
      border-radius:12px;padding:12px 14px;color:var(--white);font-size:14px;
      font-family:'DM Sans',sans-serif;outline:none;transition:border-color 0.3s}
    .form-input:focus{border-color:var(--gold)}
    .form-input::placeholder{color:var(--muted-low)}
    select.form-input option{background:#0A1628}

    .submit-btn{width:100%;background:var(--gold);color:var(--navy);border:none;padding:16px;
      border-radius:16px;font-size:16px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;
      transition:all 0.3s;box-shadow:0 4px 20px rgba(200,150,62,0.4)}
    .submit-btn:hover{background:var(--gold-light);transform:translateY(-1px)}

    .chip{padding:8px 14px;border-radius:20px;font-size:13px;font-weight:500;cursor:pointer;
      border:1px solid var(--border);background:var(--frosted);transition:all 0.2s;color:var(--muted)}
    .chip.selected{background:rgba(200,150,62,0.25);border-color:var(--gold);color:var(--gold);font-weight:600}
    .chip-row{display:flex;gap:8px;flex-wrap:wrap}

    /* Overlay & Sheet */
    .overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:1100;opacity:0;pointer-events:none;
      transition:opacity 0.3s;backdrop-filter:blur(4px)}
    .overlay.visible{opacity:1;pointer-events:all}
    .bottom-sheet{position:fixed;bottom:0;left:50%;transform:translateX(-50%) translateY(100%);
      width:100%;max-width:430px;background:linear-gradient(180deg,rgba(15,30,55,0.98),rgba(10,22,40,0.99));
      backdrop-filter:blur(20px);border-radius:24px 24px 0 0;border-top:1px solid var(--border);
      padding:0 16px 40px;z-index:1200;transition:transform 0.4s cubic-bezier(0.32,0.72,0,1)}
    .bottom-sheet.visible{transform:translateX(-50%) translateY(0)}
    .sheet-handle{width:36px;height:4px;background:var(--border);border-radius:2px;margin:12px auto 20px}
    .sheet-title{font-size:20px;font-weight:700;font-family:'Playfair Display',serif;margin-bottom:20px}

    /* Modal */
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:1300;display:flex;
      align-items:flex-end;justify-content:center;opacity:0;pointer-events:none;
      transition:opacity 0.3s;backdrop-filter:blur(6px)}
    .modal-overlay.visible{opacity:1;pointer-events:all}
    .modal{background:linear-gradient(180deg,rgba(15,30,55,0.99),rgba(10,22,40,1));border-radius:24px 24px 0 0;
      border-top:1px solid var(--border);padding:20px 16px 40px;width:100%;max-width:430px;
      transform:translateY(100%);transition:transform 0.4s cubic-bezier(0.32,0.72,0,1)}
    .modal-overlay.visible .modal{transform:translateY(0)}

    /* Toast */
    .toast{position:fixed;top:60px;left:50%;transform:translateX(-50%) translateY(-100px);
      background:var(--gold);color:var(--navy);padding:12px 24px;border-radius:20px;
      font-size:14px;font-weight:700;z-index:9999;transition:transform 0.4s cubic-bezier(0.32,0.72,0,1);
      box-shadow:0 4px 20px rgba(200,150,62,0.4);max-width:300px;text-align:center}
    .toast.visible{transform:translateX(-50%) translateY(0)}

    /* FAB */
    .fab{position:fixed;bottom:80px;right:calc(50% - 197px);width:52px;height:52px;border-radius:50%;
      background:var(--gold);border:none;color:var(--navy);font-size:28px;cursor:pointer;
      display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(200,150,62,0.5);
      transition:all 0.3s;z-index:900}
    .fab:hover{transform:scale(1.1) rotate(90deg);background:var(--gold-light)}

    /* Countdown pill */
    .countdown-pill{background:rgba(200,150,62,0.2);border:1px solid rgba(200,150,62,0.5);
      border-radius:20px;padding:8px 14px;display:flex;align-items:center;gap:6px}
    .countdown-num{font-size:22px;font-weight:700;color:var(--gold);font-family:'Playfair Display',serif}
    .countdown-label{font-size:11px;color:var(--muted);line-height:1.3}

    /* Accordion */
    .day-body{overflow:hidden;max-height:0;transition:max-height 0.4s ease}
    .day-body.open{max-height:1200px}

    /* Bounce */
    @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    @keyframes shimmer{0%{background-position:-200px 0}100%{background-position:200px 0}}

    /* Fullscreen */
    .fullscreen-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:2000;
      display:flex;flex-direction:column;opacity:0;pointer-events:none;transition:opacity 0.3s}
    .fullscreen-overlay.visible{opacity:1;pointer-events:all}

    /* Dest scroll */
    .dest-scroll{display:flex;gap:12px;overflow-x:auto;padding:0 16px 16px;scrollbar-width:none;
      scroll-snap-type:x mandatory;scroll-behavior:smooth;cursor:grab}
    .dest-scroll:active{cursor:grabbing}
    .dest-scroll::-webkit-scrollbar{display:none}
    .dest-card-wrap{flex:0 0 160px;height:210px;border-radius:18px;overflow:hidden;position:relative;
      cursor:pointer;box-shadow:var(--shadow);transition:transform 0.3s;scroll-snap-align:start}
    .dest-card-wrap:hover{transform:scale(1.02)}

    /* Profile dropdown */
    .profile-dropdown{position:absolute;top:102px;right:12px;width:220px;padding:12px;border-radius:16px;
      background:rgba(20,20,40,0.95);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,0.1);
      box-shadow:0 10px 30px rgba(0,0,0,0.3);z-index:1000;
      animation:fadeIn 0.2s ease}
    @keyframes fadeIn{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}

    /* Activity card */
    .activity-card{display:flex;gap:12px;padding:12px;border-radius:12px;
      background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);
      margin-bottom:8px;cursor:pointer;transition:all 0.2s}
    .activity-card:hover{background:rgba(255,255,255,0.09)}
    .activity-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;
      justify-content:center;font-size:18px;flex-shrink:0}

    .trip-card-img{width:100%;height:160px;object-fit:cover;display:block}
    .trip-card-body{padding:16px;background:var(--frosted);backdrop-filter:blur(16px)}
    .trip-style-tag{font-size:10px;font-weight:700;padding:4px 10px;border-radius:12px;
      text-transform:uppercase;letter-spacing:0.5px}
    .tag-adventure{background:rgba(231,76,60,0.2);color:#E74C3C;border:1px solid rgba(231,76,60,0.4)}
    .tag-luxury{background:rgba(200,150,62,0.2);color:var(--gold);border:1px solid rgba(200,150,62,0.4)}
    .tag-beach{background:rgba(52,152,219,0.2);color:#5DADE2;border:1px solid rgba(52,152,219,0.4)}
    .tag-cultural{background:rgba(155,89,182,0.2);color:#BB8FCE;border:1px solid rgba(155,89,182,0.4)}

    .add-activity-btn{display:flex;align-items:center;gap:6px;background:transparent;
      border:1px dashed rgba(200,150,62,0.5);border-radius:10px;padding:10px 14px;color:var(--gold);
      font-size:13px;font-weight:500;cursor:pointer;width:100%;margin-top:4px;
      font-family:'DM Sans',sans-serif;transition:all 0.2s}
    .add-activity-btn:hover{background:rgba(200,150,62,0.1)}

    .expense-item{display:flex;align-items:center;gap:12px;padding:14px;border-radius:14px;
      margin-bottom:10px;cursor:pointer;transition:all 0.2s}
    .expense-item:hover{background:rgba(255,255,255,0.05)}

    .memory-card{border-radius:16px;overflow:hidden;position:relative;cursor:pointer;
      box-shadow:var(--shadow);transition:transform 0.3s}
    .memory-card:hover{transform:scale(1.02)}
    .memory-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,22,40,0.95) 0%,transparent 55%)}
    .memory-content{position:absolute;bottom:12px;left:12px;right:12px}
    .mood-tag{display:inline-block;background:rgba(200,150,62,0.3);border:1px solid rgba(200,150,62,0.6);
      border-radius:8px;font-size:10px;color:var(--gold);padding:3px 8px;font-weight:600;margin-bottom:6px}

    .photo-upload{width:100%;height:120px;border:2px dashed var(--border);border-radius:16px;
      display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;
      gap:8px;transition:all 0.3s;background:var(--frosted)}
    .photo-upload:hover{border-color:var(--gold);background:rgba(200,150,62,0.05)}

    .section-header{display:flex;justify-content:space-between;align-items:center;padding:24px 16px 12px}
    .section-title{font-size:20px;font-weight:700;font-family:'Playfair Display',serif}
    .see-all{font-size:13px;color:var(--gold);cursor:pointer;font-weight:500}

    .view-toggle{display:flex;margin:16px;background:var(--frosted);border:1px solid var(--border);
      border-radius:12px;padding:4px;gap:4px}
    .toggle-btn{flex:1;padding:10px;border-radius:9px;border:none;background:transparent;
      color:var(--muted);font-size:14px;font-weight:600;cursor:pointer;transition:all 0.3s;
      font-family:'DM Sans',sans-serif}
    .toggle-btn.active{background:var(--gold);color:var(--navy);box-shadow:0 2px 8px rgba(200,150,62,0.4)}
  `}</style>
);

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, visible }) {
  return <div className={`toast ${visible ? "visible" : ""}`}>{message}</div>;
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav() {
  const { route, navigate } = useRouter();
  const tabs = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "trips", icon: "✈️", label: "Trips" },
    { id: "budget", icon: "💰", label: "Budget" },
    { id: "journal", icon: "📖", label: "Journal" },
  ];
  return (
    <nav className="bottom-nav">
      {tabs.map((t) => (
        <div
          key={t.id}
          className={`nav-item ${route === t.id ? "active" : ""}`}
          onClick={() => navigate(t.id)}
        >
          <span className="nav-icon">{t.icon}</span>
          <span className="nav-label">{t.label}</span>
        </div>
      ))}
    </nav>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────
function HomeScreen() {
  const { navigate } = useRouter();
  const { trips, memories, totalBudget, showToast, profile, setShowProfileDropdown, showProfileDropdown } = useApp();
  const [countdown, setCountdown] = useState(0);
  const sliderRef = useRef(null);
  const autoSlideRef = useRef(null);

  const destinations = [
    { name: "Bali", country: "Indonesia", tag: "🌿 Wellness", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80" },
    { name: "Kyoto", country: "Japan", tag: "🌸 Cultural", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80" },
    { name: "Amalfi Coast", country: "Italy", tag: "☀️ Luxury", img: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=400&q=80" },
    { name: "Dubai", country: "UAE", tag: "✨ Luxury", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80" },
    { name: "Paris", country: "France", tag: "🗼 Romance", img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80" },
  ];

  useEffect(() => {
    const target = new Date("2026-06-14");
    const diff = Math.ceil((target - new Date()) / (1000 * 60 * 60 * 24));
    setCountdown(Math.max(0, diff));
  }, []);

  useEffect(() => {
    autoSlideRef.current = setInterval(() => {
      if (sliderRef.current) {
        const card = sliderRef.current.querySelector(".dest-card-wrap");
        if (card) sliderRef.current.scrollBy({ left: card.offsetWidth + 12, behavior: "smooth" });
      }
    }, 4000);
    return () => clearInterval(autoSlideRef.current);
  }, []);

  const scrollDest = (dir) => {
    if (!sliderRef.current) return;
    const card = sliderRef.current.querySelector(".dest-card-wrap");
    if (card) sliderRef.current.scrollBy({ left: dir * (card.offsetWidth + 12), behavior: "smooth" });
  };

  const countries = new Set(trips.map((t) => t.country).filter(Boolean));

  return (
    <div className="screen" style={{ position: "relative" }}>
      {/* Header */}
      <div style={{ padding: "52px 16px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 14, color: "var(--muted)" }}>Welcome back Wanderer,</div>
          <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>Where to next? 🌍</div>
        </div>
        <div style={{ position: "relative" }}>
          <div
            onClick={(e) => { e.stopPropagation(); setShowProfileDropdown((v) => !v); }}
            style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--gold-light))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "var(--navy)", cursor: "pointer", boxShadow: "0 4px 12px rgba(200,150,62,0.4)", overflow: "hidden" }}
          >
            {profile.imgSrc ? <img src={profile.imgSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="avatar" /> : profile.name ? profile.name[0].toUpperCase() : "👤"}
          </div>
          <ProfileDropdown />
        </div>
      </div>

      {/* Hero Card */}
      <div onClick={() => navigate("itinerary")} style={{ width: "100%", height: 340, position: "relative", overflow: "hidden", cursor: "pointer" }}>
        <img src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80" alt="Santorini" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,22,40,0.95) 0%,rgba(10,22,40,0.4) 50%,transparent 100%)" }} />
        <div style={{ position: "absolute", bottom: 20, left: 16, right: 16, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 18, padding: 18 }}>
          <div style={{ display: "inline-block", background: "var(--gold)", color: "var(--navy)", fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: "4px 10px", borderRadius: 20, marginBottom: 8, textTransform: "uppercase" }}>⭐ Next Trip</div>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display',serif", marginBottom: 4 }}>Santorini Escape</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>June 14 – June 24, 2026 · Greece</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="countdown-pill">
              <div><div className="countdown-num">{countdown}</div></div>
              <div className="countdown-label">days<br />to go</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--muted)" }}>
              <span>👥</span><span>2 travelers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Explore Destinations */}
      <div className="section-header">
        <div className="section-title">Explore Destinations</div>
        <div className="see-all" onClick={() => navigate("destinations")}>See all</div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "0 16px 8px" }}>
        <button onClick={() => scrollDest(-1)} style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--frosted)", color: "var(--white)", cursor: "pointer" }}>←</button>
        <button onClick={() => scrollDest(1)} style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--frosted)", color: "var(--white)", cursor: "pointer" }}>→</button>
      </div>
      <div ref={sliderRef} className="dest-scroll" style={{ margin: "0 10px" }}>
        {destinations.map((d, i) => (
          <div key={i} className="dest-card-wrap">
            <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,22,40,0.85) 0%,transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>{d.name}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{d.country}</div>
              <div style={{ display: "inline-block", background: "rgba(200,150,62,0.3)", border: "1px solid rgba(200,150,62,0.5)", borderRadius: 8, fontSize: 10, color: "var(--gold)", padding: "2px 7px", marginTop: 4 }}>{d.tag}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="section-header"><div className="section-title">Your Travel Stats</div></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "0 16px 24px" }}>
        {[
          { icon: "✈️", value: trips.length, label: "Active Trips", to: "trips" },
          { icon: "🌍", value: countries.size, label: "Countries Visited", to: null },
          { icon: "📸", value: memories.length, label: "Memories Saved", to: "journal" },
          { icon: "💰", value: "₹" + (totalBudget / 100000).toFixed(1) + "L", label: "Total Budget", to: "budget" },
        ].map((s, i) => (
          <div key={i} className="glass" onClick={() => s.to && navigate(s.to)}
            style={{ padding: 16, cursor: s.to ? "pointer" : "default", transition: "transform 0.2s", borderRadius: 20 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--gold)" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Profile Dropdown + Modal ─────────────────────────────────────────────────
function ProfileDropdown() {
  const { showProfileDropdown, setShowProfileDropdown, setShowProfileModal } = useApp();
  if (!showProfileDropdown) return null;
  return (
    <div className="profile-dropdown">
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 10, marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Riya Patel</div>
        <div style={{ fontSize: 11, opacity: 0.7 }}>riya@gmail.com</div>
      </div>
      <div onClick={() => { setShowProfileModal(true); setShowProfileDropdown(false); }}
        style={{ padding: "8px 10px", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
        ✏️ Edit Profile
      </div>
    </div>
  );
}

function ProfileModal() {
  const { showProfileModal, setShowProfileModal, profile, setProfile, showToast } = useApp();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [imgSrc, setImgSrc] = useState(profile.imgSrc);

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImgSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  const save = () => {
    setProfile({ name, email, imgSrc });
    setShowProfileModal(false);
    showToast("Profile saved! 👤");
  };

  return (
    <div className={`modal-overlay ${showProfileModal ? "visible" : ""}`} onClick={(e) => e.target === e.currentTarget && setShowProfileModal(false)}>
      <div className="modal">
        <div className="sheet-handle" />
        <div className="sheet-title">Edit Profile 👤</div>
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
          <div onClick={() => document.getElementById("p-img").click()}
            style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--frosted-mid)", border: "2px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden" }}>
            {imgSrc ? <img src={imgSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="profile" /> : <span style={{ fontSize: 28 }}>📷</span>}
          </div>
          <input type="file" id="p-img" accept="image/*" style={{ display: "none" }} onChange={handleImg} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label className="form-label">Name</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="submit-btn" onClick={save}>Save</button>
          <button onClick={() => setShowProfileModal(false)} style={{ flex: 1, padding: 10, borderRadius: 10, border: "none", background: "rgba(255,255,255,0.08)", color: "white", cursor: "pointer", fontSize: 14 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Destinations Screen ──────────────────────────────────────────────────────
function DestinationsScreen() {
  const { navigate } = useRouter();
  const destinations = [
    { name: "Bali", country: "Indonesia", tag: "🌿 Wellness", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80" },
    { name: "Kyoto", country: "Japan", tag: "🌸 Cultural", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80" },
    { name: "Amalfi Coast", country: "Italy", tag: "☀️ Luxury", img: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=400&q=80" },
    { name: "Dubai", country: "UAE", tag: "✨ Luxury", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80" },
    { name: "Paris", country: "France", tag: "🗼 Romance", img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80" },
  ];
  return (
    <div className="screen">
      <div style={{ padding: "52px 16px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <button className="back-btn" onClick={() => navigate("home")}>←</button>
        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>All Destinations</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: 16 }}>
        {destinations.map((d, i) => (
          <div key={i} style={{ height: 200, borderRadius: 18, overflow: "hidden", position: "relative", cursor: "pointer", boxShadow: "var(--shadow)" }}>
            <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,22,40,0.85) 0%,transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>{d.name}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{d.country}</div>
              <div style={{ display: "inline-block", background: "rgba(200,150,62,0.3)", border: "1px solid rgba(200,150,62,0.5)", borderRadius: 8, fontSize: 10, color: "var(--gold)", padding: "2px 7px", marginTop: 4 }}>{d.tag}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Trips Screen ─────────────────────────────────────────────────────────────
const TRIP_IMGS = {
  Adventure: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
  Luxury: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
  Beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
  Cultural: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80",
};

function TripCard({ trip, onClick }) {
  const tagClass = { Adventure: "tag-adventure", Luxury: "tag-luxury", Beach: "tag-beach", Cultural: "tag-cultural" };
  return (
    <div className="glass" onClick={onClick}
      style={{ margin: "0 16px 16px", overflow: "hidden", borderRadius: 20, cursor: "pointer", transition: "transform 0.3s" }}>
      <img className="trip-card-img" src={trip.img} alt={trip.name} />
      <div className="trip-card-body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>{trip.name}</div>
          <div className={`trip-style-tag ${tagClass[trip.style] || "tag-adventure"}`}>{trip.style}</div>
        </div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>📅 {trip.dates}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--muted)" }}>
          <span>👥 {trip.travelers} travelers</span><span>·</span><span>{trip.country}</span>
        </div>
      </div>
    </div>
  );
}

function TripsScreen() {
  const { navigate } = useRouter();
  const { trips, addTrip, showToast } = useApp();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dest, setDest] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [style, setStyle] = useState("Adventure");
  const styles = ["Adventure", "Luxury", "Beach", "Cultural"];

  const handleAdd = () => {
    if (!dest.trim()) { showToast("Enter a destination!"); return; }
    const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "TBD";
    addTrip({
      name: dest,
      dates: `${fmt(startDate)} – ${fmt(endDate)}`,
      travelers,
      style,
      country: "🌍 " + dest,
      img: TRIP_IMGS[style] || TRIP_IMGS.Adventure,
    });
    setSheetOpen(false);
    setDest(""); setStartDate(""); setEndDate(""); setTravelers(2); setStyle("Adventure");
    showToast("Trip created! 🗺️");
  };

  return (
    <div className="screen">
      <div style={{ padding: "52px 16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="back-btn" onClick={() => navigate("home")}>く</button>
          <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>My Trips</div>
        </div>
        <button onClick={() => setSheetOpen(true)}
          style={{ background: "var(--gold)", color: "var(--navy)", border: "none", padding: "10px 18px", borderRadius: 25, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 16px rgba(200,150,62,0.4)" }}>
          + New Trip
        </button>
      </div>

      {trips.map((t, i) => (
        <TripCard key={i} trip={t} onClick={() => t.name === "Santorini Escape" && navigate("itinerary")} />
      ))}

      {/* Overlay + Sheet */}
      <div className={`overlay ${sheetOpen ? "visible" : ""}`} onClick={() => setSheetOpen(false)} />
      <div className={`bottom-sheet ${sheetOpen ? "visible" : ""}`}>
        <div className="sheet-handle" />
        <div className="sheet-title">Plan a New Trip ✈️</div>
        <div style={{ marginBottom: 16 }}>
          <label className="form-label">Destination</label>
          <input className="form-input" placeholder="e.g. Maldives, Iceland..." value={dest} onChange={(e) => setDest(e.target.value)} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label className="form-label">Start Date</label>
            <input className="form-input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="form-label">End Date</label>
            <input className="form-input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="form-label">Travelers</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setTravelers((v) => Math.max(1, v - 1))}
              style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--frosted-mid)", border: "1px solid var(--border)", color: "white", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
            <div style={{ fontSize: 18, fontWeight: 700, minWidth: 30, textAlign: "center" }}>{travelers}</div>
            <button onClick={() => setTravelers((v) => Math.min(20, v + 1))}
              style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--frosted-mid)", border: "1px solid var(--border)", color: "white", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>＋</button>
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label className="form-label">Trip Style</label>
          <div className="chip-row">
            {styles.map((s) => (
              <div key={s} className={`chip ${style === s ? "selected" : ""}`} onClick={() => setStyle(s)}>{s}</div>
            ))}
          </div>
        </div>
        <button className="submit-btn" onClick={handleAdd}>Create Trip 🗺️</button>
      </div>
    </div>
  );
}

// ─── Itinerary Screen ─────────────────────────────────────────────────────────
const INITIAL_DAYS = [
  {
    title: "Day 1 — June 14", subtitle: "Arrival day",
    activities: [
      { icon: "✈️", iconBg: "rgba(46,204,113,0.2)", time: "09:00 AM", name: "Arrive at Santorini Airport", note: "Flight OA360 from Athens · Pick up rental car" },
      { icon: "🏨", iconBg: "rgba(200,150,62,0.2)", time: "02:00 PM", name: "Canaves Oia Suites", note: "Check-in · Cave suite with caldera view" },
      { icon: "🍽️", iconBg: "rgba(231,76,60,0.2)", time: "07:30 PM", name: "Dinner at Metaxy Mas", note: "Authentic Greek mezze · Reservation confirmed" },
    ],
  },
  {
    title: "Day 2 — June 15", subtitle: "Explore Oia",
    activities: [
      { icon: "☕", iconBg: "rgba(231,76,60,0.2)", time: "08:00 AM", name: "Breakfast at PK Cocktail Bar", note: "Rooftop breakfast with caldera view" },
      { icon: "🔭", iconBg: "rgba(52,152,219,0.2)", time: "10:30 AM", name: "Oia Castle Sunrise Point", note: "Walk the blue-domed village · Photography session" },
      { icon: "⛵", iconBg: "rgba(52,152,219,0.2)", time: "03:00 PM", name: "Catamaran Sunset Cruise", note: "4-hour sailing tour · BBQ dinner on board" },
    ],
  },
  {
    title: "Day 3 — June 16", subtitle: "Fira & Beaches",
    activities: [
      { icon: "🏛️", iconBg: "rgba(52,152,219,0.2)", time: "09:00 AM", name: "Akrotiri Archaeological Site", note: "Ancient Minoan Bronze Age settlement" },
      { icon: "🏖️", iconBg: "rgba(52,152,219,0.2)", time: "12:30 PM", name: "Red Beach", note: "Famous volcanic red cliffs · Swim & snorkel" },
      { icon: "🍷", iconBg: "rgba(231,76,60,0.2)", time: "07:00 PM", name: "Wine Tasting at Santo Wines", note: "Assyrtiko variety · Cliffside terrace" },
    ],
  },
];

function ItineraryScreen() {
  const { navigate } = useRouter();
  const { showToast } = useApp();
  const [view, setView] = useState("list");
  const [days, setDays] = useState(INITIAL_DAYS);
  const [openDays, setOpenDays] = useState({ 0: true });
  const [actModal, setActModal] = useState({ open: false, dayIdx: null });
  const [actForm, setActForm] = useState({ time: "", name: "", note: "" });

  const toggleDay = (i) => setOpenDays((prev) => ({ ...prev, [i]: !prev[i] }));

  const addActivity = () => {
    if (!actForm.name.trim()) { showToast("Enter activity name!"); return; }
    setDays((prev) => prev.map((d, i) => i === actModal.dayIdx
      ? { ...d, activities: [...d.activities, { icon: "📍", iconBg: "rgba(52,152,219,0.2)", time: actForm.time || "Anytime", name: actForm.name, note: actForm.note }] }
      : d));
    setActModal({ open: false, dayIdx: null });
    setActForm({ time: "", name: "", note: "" });
    showToast("Activity added! 🗓️");
  };

  return (
    <div className="screen">
      {/* Cover */}
      <div style={{ position: "relative", margin: "16px 16px 16px", borderRadius: 20, overflow: "hidden", height: 220 }}>
        <img src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80" alt="Santorini" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,22,40,1) 0%,rgba(10,22,40,0.5) 50%,rgba(10,22,40,0.2) 100%)" }} />
        <button className="back-btn" onClick={() => navigate("home")} style={{ position: "absolute", top: 12, left: 16 }}>←</button>
        <div style={{ position: "absolute", bottom: 20, left: 16, right: 16 }}>
          <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>Santorini Escape</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>📅 June 14–24, 2026 · 🇬🇷 Greece · 👥 2 travelers</div>
          </div>
        </div>
      </div>

      {/* Toggle */}
      <div className="view-toggle">
        <button className={`toggle-btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>📋 List View</button>
        <button className={`toggle-btn ${view === "map" ? "active" : ""}`} onClick={() => setView("map")}>🗺️ Map View</button>
      </div>

      {/* List */}
      {view === "list" && days.map((day, i) => (
        <div key={i} style={{ margin: "0 16px 12px" }}>
          <div onClick={() => toggleDay(i)}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", cursor: "pointer", borderRadius: openDays[i] ? "16px 16px 0 0" : 16, background: "var(--frosted-mid)", border: "1px solid var(--border)", transition: "all 0.3s" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{day.title}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{day.activities.length} activities · {day.subtitle}</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", transform: openDays[i] ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>▼</div>
          </div>
          <div className={`day-body ${openDays[i] ? "open" : ""}`}>
            <div style={{ background: "var(--frosted)", border: "1px solid var(--border)", borderTop: "none", borderRadius: "0 0 16px 16px", padding: 12 }}>
              {day.activities.map((act, j) => (
                <div key={j} className="activity-card">
                  <div className="activity-icon" style={{ background: act.iconBg }}>{act.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "var(--gold)", fontWeight: 600, marginBottom: 2 }}>{act.time}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{act.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{act.note}</div>
                  </div>
                </div>
              ))}
              <button className="add-activity-btn" onClick={() => setActModal({ open: true, dayIdx: i })}>＋ Add Activity</button>
            </div>
          </div>
        </div>
      ))}

      {/* Map */}
      {view === "map" && (
        <div style={{ margin: "0 16px", borderRadius: 20, overflow: "hidden", position: "relative", height: 420 }}>
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Map" />
          <div style={{ position: "absolute", inset: 0, background: "rgba(10,22,40,0.4)" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
            <div style={{ fontSize: 40, animation: "bounce 1.5s infinite" }}>📍</div>
            <div className="glass" style={{ marginTop: 12, padding: "12px 20px", fontSize: 14, fontWeight: 600 }}>Santorini, Greece</div>
          </div>
          {[{ top: "30%", left: "40%", icon: "🏨" }, { top: "45%", left: "60%", icon: "🍽️" }, { top: "60%", left: "35%", icon: "🏖️" }, { top: "25%", left: "70%", icon: "🍷" }].map((p, i) => (
            <div key={i} style={{ position: "absolute", top: p.top, left: p.left, fontSize: 22, cursor: "pointer" }}>{p.icon}</div>
          ))}
          <div style={{ padding: 16, fontSize: 13, color: "var(--muted)", textAlign: "center", position: "absolute", bottom: 0, width: "100%" }}>📍 7 locations pinned across Santorini</div>
        </div>
      )}

      {/* Add Activity Modal */}
      <div className={`modal-overlay ${actModal.open ? "visible" : ""}`} onClick={(e) => e.target === e.currentTarget && setActModal({ open: false, dayIdx: null })}>
        <div className="modal">
          <div className="sheet-handle" />
          <div className="sheet-title">Add Activity 🗓️</div>
          <div style={{ marginBottom: 12 }}>
            <label className="form-label">Time</label>
            <input className="form-input" type="time" value={actForm.time} onChange={(e) => setActForm((f) => ({ ...f, time: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="form-label">Activity Name</label>
            <input className="form-input" placeholder="e.g. Visit Beach" value={actForm.name} onChange={(e) => setActForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Note</label>
            <input className="form-input" placeholder="Optional note" value={actForm.note} onChange={(e) => setActForm((f) => ({ ...f, note: e.target.value }))} />
          </div>
          <button className="submit-btn" onClick={addActivity}>Add Activity</button>
          <button onClick={() => setActModal({ open: false, dayIdx: null })} style={{ width: "100%", background: "none", border: "none", color: "var(--muted)", padding: 14, cursor: "pointer", fontSize: 14 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Budget Screen ─────────────────────────────────────────────────────────────
const INITIAL_EXPENSES = [
  { icon: "🏨", bg: "rgba(200,150,62,0.15)", name: "Canaves Oia Suites (5 nights)", meta: "Jun 14 · Accommodation", amount: 39375 },
  { icon: "🍽️", bg: "rgba(93,173,226,0.15)", name: "Dinner at Metaxy Mas", meta: "Jun 14 · Food", amount: 4500 },
  { icon: "✈️", bg: "rgba(46,204,113,0.15)", name: "Athens–Santorini Flight", meta: "Jun 14 · Transport", amount: 8400 },
  { icon: "⛵", bg: "rgba(187,143,206,0.15)", name: "Catamaran Sunset Cruise", meta: "Jun 15 · Activities", amount: 12000 },
  { icon: "🛍️", bg: "rgba(231,76,60,0.15)", name: "Local Ceramics & Souvenirs", meta: "Jun 15 · Shopping", amount: 5200 },
  { icon: "🍷", bg: "rgba(200,150,62,0.15)", name: "Wine Tasting at Santo Wines", meta: "Jun 16 · Food", amount: 3800 },
];

const CAT_COLORS = { Food: "#5DADE2", Accommodation: "#C8963E", Transport: "#2ECC71", Activities: "#BB8FCE", Shopping: "#E74C3C" };
const CAT_ICONS = { Food: "🍽️", Accommodation: "🏨", Transport: "✈️", Activities: "🎭", Shopping: "🛍️" };
const CAT_BG = { Food: "rgba(93,173,226,0.15)", Accommodation: "rgba(200,150,62,0.15)", Transport: "rgba(46,204,113,0.15)", Activities: "rgba(187,143,206,0.15)", Shopping: "rgba(231,76,60,0.15)" };

function BudgetScreen() {
  const { navigate } = useRouter();
  const { totalBudget, showToast } = useApp();
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [catTotals, setCatTotals] = useState({ Food: 28125 + 3800, Accommodation: 39375, Transport: 16875, Activities: 20250, Shopping: 7875 });
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ amount: "", category: "Food", note: "" });

  const totalSpent = Object.values(catTotals).reduce((a, b) => a + b, 0);
  const remaining = totalBudget - totalSpent;
  const pct = Math.round((totalSpent / totalBudget) * 100);

  const categories = ["Accommodation", "Food", "Transport", "Activities", "Shopping"];

  const addExpense = () => {
    const amt = parseInt(form.amount);
    if (!amt || amt <= 0) { showToast("Enter a valid amount!"); return; }
    const today = new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    setCatTotals((prev) => ({ ...prev, [form.category]: prev[form.category] + amt }));
    setExpenses((prev) => [{
      icon: CAT_ICONS[form.category], bg: CAT_BG[form.category],
      name: form.note || "New expense", meta: `${today} · ${form.category}`, amount: amt
    }, ...prev]);
    setModalOpen(false);
    setForm({ amount: "", category: "Food", note: "" });
    showToast("Expense added! 💸");
  };

  // Donut segments
  const total = totalSpent || 1;
  let offset = 0;
  const segments = categories.map((cat) => {
    const p = Math.round((catTotals[cat] / total) * 100);
    const seg = { cat, p, offset };
    offset += p;
    return seg;
  });

  return (
    <div className="screen">
      <div style={{ padding: "52px 16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>Budget Tracker</div>
        <button className="back-btn" onClick={() => navigate("home")}>←</button>
      </div>

      {/* Summary */}
      <div className="glass" style={{ margin: "0 16px 20px", padding: 20, display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: 8, alignItems: "center" }}>
        {[
          { label: "Total Budget", value: "₹" + totalBudget.toLocaleString("en-IN"), cls: "gold" },
          null,
          { label: "Spent", value: "₹" + totalSpent.toLocaleString("en-IN"), cls: "white" },
          null,
          { label: "Remaining", value: (remaining >= 0 ? "₹" : "-₹") + Math.abs(remaining).toLocaleString("en-IN"), cls: remaining >= 0 ? "success" : "danger" },
        ].map((item, i) => item ? (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display',serif", color: item.cls === "gold" ? "var(--gold)" : item.cls === "success" ? "var(--success)" : item.cls === "danger" ? "var(--danger)" : "var(--white)" }}>{item.value}</div>
          </div>
        ) : <div key={i} style={{ width: 1, background: "var(--border)", height: "100%", minHeight: 40 }} />)}
      </div>

      {/* Donut */}
      <div className="glass" style={{ margin: "0 16px 20px", padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ position: "relative", width: 180, height: 180 }}>
          <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)", width: 180, height: 180 }}>
            {segments.map((s, i) => (
              <circle key={i} cx="18" cy="18" r="15.9155" fill="transparent"
                stroke={CAT_COLORS[s.cat]} strokeWidth="3.5"
                strokeDasharray={`${s.p} ${100 - s.p}`}
                strokeDashoffset={-s.offset} />
            ))}
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: "var(--gold)", fontFamily: "'Playfair Display',serif" }}>{pct}%</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>spent</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px", marginTop: 20, width: "100%" }}>
          {categories.map((cat) => (
            <div key={cat} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: CAT_COLORS[cat], flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "var(--muted)" }}>{cat}</span>
              <span style={{ fontSize: 12, fontWeight: 600, marginLeft: "auto" }}>₹{catTotals[cat].toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expenses */}
      <div style={{ fontSize: 16, fontWeight: 600, padding: "0 16px 12px" }}>Recent Expenses</div>
      <div style={{ padding: "0 16px" }}>
        {expenses.map((e, i) => (
          <div key={i} className="expense-item glass">
            <div style={{ width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, background: e.bg, flexShrink: 0 }}>{e.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{e.name}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{e.meta}</div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>₹{e.amount.toLocaleString("en-IN")}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 100 }} />

      <button className="fab" onClick={() => setModalOpen(true)}>＋</button>

      {/* Modal */}
      <div className={`modal-overlay ${modalOpen ? "visible" : ""}`} onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
        <div className="modal">
          <div className="sheet-handle" />
          <div className="sheet-title">Add Expense 💸</div>
          <div style={{ marginBottom: 12 }}>
            <label className="form-label">Amount (₹)</label>
            <input className="form-input" type="number" placeholder="0" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="form-label">Category</label>
            <select className="form-input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              {Object.keys(CAT_ICONS).map((c) => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Note</label>
            <input className="form-input" placeholder="What was this for?" value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} />
          </div>
          <button className="submit-btn" onClick={addExpense}>Add Expense</button>
          <button onClick={() => setModalOpen(false)} style={{ width: "100%", background: "transparent", border: "none", color: "var(--muted)", padding: 14, cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Journal Screen ───────────────────────────────────────────────────────────
const INITIAL_MEMORIES = [
  { img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80", mood: "😌 Blissful", note: "Watching the sun melt into the caldera from our terrace. Pure magic.", date: "June 14, 2026", fullImg: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80" },
  { img: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=400&q=80", mood: "😄 Adventurous", note: "Tried every mezze on the menu. Octopus was incredible.", date: "June 14, 2026", fullImg: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80" },
  { img: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&q=80", mood: "🌊 Peaceful", note: "Sailing at dusk. The sky turned three shades of orange.", date: "June 15, 2026", fullImg: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80" },
  { img: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400&q=80", mood: "😴 Tired but Happy", note: "10,000 steps through Oia's winding lanes. Worth every blister.", date: "June 15, 2026", fullImg: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80" },
];
const MOODS = ["😌 Blissful", "😄 Adventurous", "🌊 Peaceful", "😴 Tired but Happy"];
const MEM_HEIGHTS = ["220px", "160px", "160px", "200px", "180px", "190px"];

function JournalScreen() {
  const { navigate } = useRouter();
  const { memories, addMemory, showToast } = useApp();
  const [selected, setSelected] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [note, setNote] = useState("");
  const [mood, setMood] = useState("😌 Blissful");
  const [imgSrc, setImgSrc] = useState("");

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImgSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (!note.trim()) { showToast("Write a memory first!"); return; }
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const fallbacks = ["https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=400&q=80", "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80"];
    const img = imgSrc || fallbacks[memories.length % 2];
    addMemory({ img, fullImg: img, mood, note, date: today });
    setAddOpen(false); setNote(""); setMood("😌 Blissful"); setImgSrc("");
    showToast("Memory saved! 📸");
  };

  // Split into two columns
  const col1 = memories.filter((_, i) => i % 2 === 0);
  const col2 = memories.filter((_, i) => i % 2 === 1);

  return (
    <div className="screen">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ padding: "52px 16px 8px" }}>
          <div style={{ fontSize: 13, color: "var(--gold)", fontWeight: 600, marginBottom: 4 }}>✈️ Santorini Escape · June 2026</div>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display',serif", marginBottom: 6 }}>Travel Journal</div>
          <div style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic" }}>"Every trip is a story waiting to be told."</div>
        </div>
        <button className="back-btn" onClick={() => navigate("home")} style={{ margin: "52px 16px 0 0", flexShrink: 0 }}>←</button>
      </div>

      {/* Masonry */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "16px 16px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {col1.map((m, i) => {
            const realIdx = i * 2;
            return (
              <div key={i} className="memory-card" onClick={() => setSelected(realIdx)}>
                <img src={m.img} alt="Memory" style={{ width: "100%", display: "block", objectFit: "cover", height: MEM_HEIGHTS[realIdx % MEM_HEIGHTS.length] }} />
                <div className="memory-overlay" />
                <div className="memory-content">
                  <div className="mood-tag">{m.mood}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>{m.note.substring(0, 55)}{m.note.length > 55 ? "…" : ""}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>{m.date}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {col2.map((m, i) => {
            const realIdx = i * 2 + 1;
            return (
              <div key={i} className="memory-card" onClick={() => setSelected(realIdx)}>
                <img src={m.img} alt="Memory" style={{ width: "100%", display: "block", objectFit: "cover", height: MEM_HEIGHTS[realIdx % MEM_HEIGHTS.length] }} />
                <div className="memory-overlay" />
                <div className="memory-content">
                  <div className="mood-tag">{m.mood}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>{m.note.substring(0, 55)}{m.note.length > 55 ? "…" : ""}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>{m.date}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ height: 100 }} />

      <button className="fab" onClick={() => setAddOpen(true)}>＋</button>

      {/* Fullscreen */}
      {selected !== null && (
        <div className="fullscreen-overlay visible">
          <div onClick={() => setSelected(null)} style={{ position: "absolute", top: 52, right: 16, width: 38, height: 38, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 20, zIndex: 10 }}>✕</div>
          <img src={memories[selected]?.fullImg || memories[selected]?.img} alt="Memory" style={{ width: "100%", height: "60vh", objectFit: "cover" }} />
          <div style={{ padding: "24px 16px", flex: 1 }}>
            <div style={{ display: "inline-block", background: "rgba(200,150,62,0.25)", border: "1px solid rgba(200,150,62,0.6)", borderRadius: 10, fontSize: 12, color: "var(--gold)", padding: "5px 12px", fontWeight: 600, marginBottom: 12 }}>{memories[selected]?.mood}</div>
            <div style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.9)" }}>{memories[selected]?.note}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 12 }}>📅 {memories[selected]?.date}</div>
          </div>
        </div>
      )}

      {/* Add Memory */}
      <div className={`modal-overlay ${addOpen ? "visible" : ""}`} onClick={(e) => e.target === e.currentTarget && setAddOpen(false)}>
        <div className="modal" style={{ maxHeight: "90vh", overflowY: "auto" }}>
          <div className="sheet-handle" />
          <div className="sheet-title">New Memory 📸</div>
          <div style={{ marginBottom: 16 }}>
            <div className="photo-upload" onClick={() => document.getElementById("mem-img").click()}>
              {imgSrc ? <img src={imgSrc} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 14 }} alt="preview" /> : <>
                <div style={{ fontSize: 28 }}>📷</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>Tap to upload photo</div>
              </>}
            </div>
            <input type="file" id="mem-img" accept="image/*" style={{ display: "none" }} onChange={handleImg} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Your Story</label>
            <textarea className="form-input" rows="3" placeholder="What happened here? How did it feel?" value={note} onChange={(e) => setNote(e.target.value)} style={{ resize: "none", lineHeight: 1.6 }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Mood</label>
            <div className="chip-row">
              {MOODS.map((m) => <div key={m} className={`chip ${mood === m ? "selected" : ""}`} onClick={() => setMood(m)}>{m}</div>)}
            </div>
          </div>
          <button className="submit-btn" onClick={save}>Save Memory ✨</button>
          <button onClick={() => setAddOpen(false)} style={{ width: "100%", background: "transparent", border: "none", color: "var(--muted)", padding: 14, cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── App Provider ─────────────────────────────────────────────────────────────
function AppProvider({ children }) {
  const [trips, setTrips] = useState([
    { name: "Santorini Escape", dates: "June 14 – June 24, 2026", travelers: 2, style: "Luxury", country: "🇬🇷 Greece", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80" },
    { name: "Bali Soul Retreat", dates: "August 2 – August 12, 2026", travelers: 4, style: "Beach", country: "🇮🇩 Indonesia", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80" },
    { name: "Kyoto Cherry Trail", dates: "March 20 – March 30, 2027", travelers: 2, style: "Cultural", country: "🇯🇵 Japan", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80" },
  ]);
  const [memories, setMemories] = useState(INITIAL_MEMORIES);
  const [totalBudget] = useState(180000);
  const [toast, setToast] = useState({ msg: "", visible: false });
  const [profile, setProfile] = useState({ name: "Riya Patel", email: "riya@gmail.com", imgSrc: "" });
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast({ msg, visible: true });
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => setShowProfileDropdown(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <AppContext.Provider value={{
      trips, addTrip: (t) => setTrips((prev) => [t, ...prev]),
      memories, addMemory: (m) => setMemories((prev) => [...prev, m]),
      totalBudget, showToast, profile, setProfile,
      showProfileDropdown, setShowProfileDropdown,
      showProfileModal, setShowProfileModal,
    }}>
      {children}
      <Toast message={toast.msg} visible={toast.visible} />
      <ProfileModal />
    </AppContext.Provider>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [routeKey, setRouteKey] = useState(0);

  return (
    <Router>
      <AppProvider>
        <GlobalStyle />
        <div style={{ maxWidth: 430, margin: "0 auto", position: "relative", minHeight: "100vh", background: "var(--navy)" }}>
          <Route path="home" component={HomeScreen} />
          <Route path="trips" component={TripsScreen} />
          <Route path="itinerary" component={ItineraryScreen} />
          <Route path="budget" component={BudgetScreen} />
          <Route path="journal" component={JournalScreen} />
          <Route path="destinations" component={DestinationsScreen} />
          <BottomNav />
        </div>
      </AppProvider>
    </Router>
  );
}
