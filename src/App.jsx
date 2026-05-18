import React, { useState, useEffect } from "react";

// ─── RESPONSIVE HOOK ───
const useIsMobile = (breakpoint = 640) => {
  const [mobile, setMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [breakpoint]);
  return mobile;
};

// ─── DESIGN TOKENS ───
const T = {
  bg: "#0C0D0F", surface: "#141518", surfaceHover: "#1A1B20", surfaceActive: "#1E1F25",
  border: "#2A2B32", borderSubtle: "#1E1F25",
  text: "#E8E9EC", textMuted: "#8B8D98", textDim: "#5C5E69",
  accent: "#4F8CFF", accentDim: "rgba(79,140,255,0.12)",
  green: "#34D399", greenDim: "rgba(52,211,153,0.12)",
  amber: "#FBBF24", amberDim: "rgba(251,191,36,0.12)",
  red: "#F87171", redDim: "rgba(248,113,113,0.12)",
  purple: "#A78BFA", purpleDim: "rgba(167,139,250,0.12)",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
  sans: "'Helvetica Neue', sans-serif",
  r: "6px",
};

// ─── DATA ───
const SIGNALS = [
  { id: 1, date: "2026-05-14", company: "Meridian AI", stage: "Series A", func: "Engineering", type: "hiring_trigger", signal: "Closing Series A next month. CEO asked about timing first VP Eng hire vs promoting internal lead. Leaning external but worried about culture disruption.", source: "Founder meeting", vcRef: "Lightspeed", enrichment: { raised: "$14M Series A (projected)", headcount: "23 \u2192 target 40 by Q1", news: "Launched enterprise API product in April" } },
  { id: 2, date: "2026-05-13", company: "Vanta Security", stage: "Series B", func: "Product", type: "org_pattern", signal: "Restructuring product org from feature teams to platform/product split. Third Series B company this quarter asking about this pattern.", source: "VC talent partner", vcRef: "a16z", enrichment: { raised: "$110M Series B", headcount: "180", news: "Expanded SOC2 automation to EU markets" } },
  { id: 3, date: "2026-05-12", company: "Baseten", stage: "Series B", func: "Engineering", type: "comp_shift", signal: "ML infra eng comp up 15-20% in last 6 months. Baseten losing candidates to OpenAI and Anthropic on TC. Asked about creative comp structures.", source: "Founder meeting", vcRef: "Greylock", enrichment: { raised: "$40M Series B", headcount: "65", news: "Model inference platform hit 10B API calls/month" } },
  { id: 4, date: "2026-05-11", company: "Cognition AI", stage: "Series A", func: "Engineering", type: "hiring_trigger", signal: "Post-seed expansion underway. CEO wants first eng manager before tripling headcount. 12-person eng team, debating player-coach vs pure people manager. Timeline pressure — wants hire closed in 60 days.", source: "Founder meeting", vcRef: "General Catalyst", enrichment: { raised: "$21M Series A", headcount: "12 → target 35 by Q3", news: "Devin autonomous coding agent crossed 50k enterprise users" } },
  { id: 5, date: "2026-05-10", company: "Sardine", stage: "Series B", func: "Design", type: "capability_gap", signal: "No design leadership. Product and eng making all UX decisions. Revenue is there but churn tied to poor onboarding experience. Need Head of Design who can also do research.", source: "VC talent partner", vcRef: "Andreessen Horowitz", enrichment: { raised: "$51.5M Series B", headcount: "90", news: "Fraud detection platform expanded to LATAM" } },
  { id: 6, date: "2026-05-09", company: "Render", stage: "Series B", func: "Engineering", type: "org_pattern", signal: "Moving from flat eng org to pods. CTO wants to keep IC track strong but needs eng managers. Classic scaling inflection. Fourth infra company hitting this at 60-80 headcount.", source: "Founder meeting", vcRef: "Bessemer", enrichment: { raised: "$50M Series B", headcount: "72", news: "Launched GPU cloud offering to compete with Railway" } },
  { id: 7, date: "2026-05-08", company: "Together AI", stage: "Seed", func: "Engineering", type: "hiring_trigger", signal: "First three inference optimization engineers needed. Non-technical co-founder running hiring. Asked for help structuring a technical screen for distributed systems and GPU scheduling roles.", source: "Founder meeting", vcRef: "Andreessen Horowitz", enrichment: { raised: "$20M Seed", headcount: "8", news: "Open-source inference platform crossed 1B daily API calls" } },
  { id: 8, date: "2026-05-07", company: "Weights & Biases", stage: "Series C", func: "Product", type: "comp_shift", signal: "Product management comp at Series C AI infra companies now rivaling eng comp. W&B lost two PMs to Databricks. Market is repricing PM roles in ML tooling.", source: "VC talent partner", vcRef: "Felicis", enrichment: { raised: "$250M Series C", headcount: "350", news: "Enterprise ARR crossed $100M, deepened Microsoft partnership" } },
  { id: 9, date: "2026-05-06", company: "Vercel", stage: "Series C", func: "Engineering", type: "org_pattern", signal: "Post-layoff eng reorg complete. Moved to smaller, more senior teams. Hiring bar significantly raised. Looking for staff+ engineers who can own full vertical slices.", source: "Board advisor", vcRef: "Accel", enrichment: { raised: "$150M Series C", headcount: "300 (post-layoff)", news: "v0 AI product driving new developer segment" } },
  { id: 10, date: "2026-05-05", company: "Glean", stage: "Series C", func: "Engineering", type: "capability_gap", signal: "Enterprise search product needs information retrieval and ranking talent. Candidates need both LLM fine-tuning and traditional IR depth — rare combo. Losing finalists to Google and OpenAI on comp.", source: "Founder meeting", vcRef: "General Catalyst", enrichment: { raised: "$200M Series C", headcount: "220", news: "Glean AI assistant for enterprise launched, ARR crossed $100M" } },
  { id: 11, date: "2026-05-04", company: "Modal", stage: "Series A", func: "Engineering", type: "hiring_trigger", signal: "Doubling eng team in next 6 months. CEO wants to hire an eng director before scaling. First management hire. Asked about player-coach vs pure manager debate.", source: "Founder meeting", vcRef: "Redpoint", enrichment: { raised: "$16M Series A", headcount: "20", news: "Cloud compute for AI/ML workloads gaining traction with mid-market" } },
  { id: 12, date: "2026-05-03", company: "Anyscale", stage: "Series C", func: "Product", type: "org_pattern", signal: "Open-source (Ray) and commercial product teams increasingly misaligned. Hiring dedicated product leader for commercial side. Pattern repeating across OS-commercial companies.", source: "VC talent partner", vcRef: "NEA", enrichment: { raised: "$100M Series C", headcount: "200", news: "Ray 3.0 launch drove 40% increase in enterprise adoption" } },
  { id: 13, date: "2026-05-14", company: "Ramp", stage: "Series C", func: "Engineering", type: "comp_shift", signal: "Senior eng attrition ticking up. Equity refresh program not keeping pace. Three senior engs left for pre-IPO companies in last quarter.", source: "Board advisor", vcRef: "Founders Fund", enrichment: { raised: "$300M Series C", headcount: "800", news: "Crossed $500M ARR, expanded procurement product line" } },
  { id: 14, date: "2026-05-02", company: "Cohere", stage: "Series B", func: "Engineering", type: "hiring_trigger", signal: "Scaling eng team for on-premise enterprise deployment. Need 4-5 senior engineers with both ML systems and enterprise software experience. Searching 3 months with no strong candidates clearing both bars.", source: "Founder meeting", vcRef: "Index Ventures", enrichment: { raised: "$270M Series B", headcount: "300", news: "Command R+ outperforming competitors on enterprise RAG benchmarks" } },
  { id: 15, date: "2026-05-01", company: "Notion", stage: "Series C", func: "Design", type: "capability_gap", signal: "AI features creating design debt. Need design systems lead who understands AI interaction patterns. Very specific profile.", source: "VC talent partner", vcRef: "Sequoia", enrichment: { raised: "$275M Series C", headcount: "500+", news: "Notion AI reaching feature parity with standalone AI tools" } },
];
const PATTERNS = [
  { id: 1, theme: "Player-coach hiring archetype", count: 5, stages: ["Series A", "Series B"], signal: "5 companies in last 30 days specifically asked about player-coach eng leaders. Post-layoff market is pushing companies toward senior ICs who can manage small teams.", funcs: ["Engineering"], trend: "up" },
  { id: 2, theme: "VP Eng timing at Series A", count: 4, stages: ["Series A"], signal: "4 Series A companies debating first VP Eng hire. Pattern: 20-30 person companies, non-technical founder, hitting scaling wall.", funcs: ["Engineering"], trend: "up" },
  { id: 3, theme: "Open-source / commercial tension", count: 3, stages: ["Series B", "Series C"], signal: "3 OS-commercial companies restructuring product orgs. Dedicated commercial product leadership needed as enterprise revenue grows.", funcs: ["Product"], trend: "stable" },
  { id: 4, theme: "ML/AI eng comp repricing", count: 4, stages: ["Series B", "Series C"], signal: "ML infra and AI product eng comp up 15-20% in 6 months. Driven by OpenAI/Anthropic/Google pulling talent.", funcs: ["Engineering"], trend: "up" },
  { id: 5, theme: "Design leadership vacuum in infra", count: 3, stages: ["Series A", "Series B"], signal: "Infrastructure companies reaching $5-10M ARR without dedicated design leadership. Churn and onboarding problems surfacing.", funcs: ["Design"], trend: "stable" },
];
const VC_RELATIONSHIPS = [
  { firm: "Lightspeed", tier: "active", signals: 3, engagements: 1, contacts: ["Sam Wholley (talent)"], lastTouch: "2026-05-14" },
  { firm: "Andreessen Horowitz", tier: "active", signals: 4, engagements: 2, contacts: ["Shannon Schiltz (talent)"], lastTouch: "2026-05-10" },
  { firm: "Khosla Ventures", tier: "active", signals: 3, engagements: 1, contacts: ["talent partner"], lastTouch: "2026-05-11" },
  { firm: "Greylock", tier: "building", signals: 2, engagements: 0, contacts: ["talent partner"], lastTouch: "2026-05-12" },
  { firm: "Bessemer", tier: "building", signals: 2, engagements: 0, contacts: ["talent network"], lastTouch: "2026-05-09" },
  { firm: "Accel", tier: "building", signals: 1, engagements: 0, contacts: ["portfolio ops"], lastTouch: "2026-05-06" },
  { firm: "Founders Fund", tier: "active", signals: 2, engagements: 1, contacts: ["Keith Rabois"], lastTouch: "2026-05-14" },
  { firm: "Felicis", tier: "building", signals: 1, engagements: 0, contacts: ["Aydin Senkut (GP)"], lastTouch: "2026-05-07" },
  { firm: "Sequoia", tier: "prospect", signals: 1, engagements: 0, contacts: ["portfolio team"], lastTouch: "2026-05-01" },
  { firm: "Redpoint", tier: "building", signals: 1, engagements: 0, contacts: ["talent partner"], lastTouch: "2026-05-04" },
  { firm: "General Catalyst", tier: "active", signals: 2, engagements: 1, contacts: ["talent partner"], lastTouch: "2026-05-08" },
  { firm: "Index Ventures", tier: "building", signals: 1, engagements: 0, contacts: ["talent partner"], lastTouch: "2026-05-02" },
  { firm: "NEA", tier: "prospect", signals: 1, engagements: 0, contacts: ["portfolio ops"], lastTouch: "2026-05-03" },
];
const CALENDAR_EVENTS = [
  { id: "c1", time: "3 hours ago", title: "Sardine founder follow-up", attendees: "Soups Ranjan (CEO)", notetaker: "granola" },
  { id: "c2", time: "Yesterday, 4:00 PM", title: "Lightspeed talent partner sync", attendees: "Sam Wholley", notetaker: "otter" },
  { id: "c3", time: "Yesterday, 10:00 AM", title: "Baseten eng hiring debrief", attendees: "Amir Moussa (CTO)", notetaker: "granola" },
];
const SYNCED_MEETINGS = [
  { id: "s1", time: "May 14", title: "a16z portfolio talent roundtable", attendees: "Shannon Schiltz + 6", notetaker: "otter", signalsExtracted: 2 },
  { id: "s2", time: "May 13", title: "Modal player-coach discussion", attendees: "Erik Bernhardsson (CEO)", notetaker: "granola", signalsExtracted: 1 },
  { id: "s3", time: "May 12", title: "Khosla portfolio eng talent sync", attendees: "talent partner", notetaker: "granola", signalsExtracted: 2 },
  { id: "s4", time: "May 11", title: "Cognition AI eng hiring strategy", attendees: "Scott Wu (CEO)", notetaker: "granola", signalsExtracted: 1 },
  { id: "s5", time: "May 10", title: "Sardine churn deep-dive", attendees: "Soups Ranjan (CEO)", notetaker: "otter", signalsExtracted: 1 },
  { id: "s6", time: "May 9", title: "Render org design conversation", attendees: "Anurag Goel (CEO)", notetaker: "granola", signalsExtracted: 1 },
];
const NOTETAKERS = [
  { key: "granola", name: "Granola", connected: true, autosync: true },
  { key: "otter", name: "Otter.ai", connected: true, autosync: false },
  { key: "fathom", name: "Fathom", connected: false, autosync: false },
  { key: "fireflies", name: "Fireflies", connected: false, autosync: false },
  { key: "avoma", name: "Avoma", connected: false, autosync: false },
  { key: "read", name: "Read.ai", connected: false, autosync: false },
];
const DATA_SOURCES = [
  { name: "Sutro CRM", status: "shared", desc: "Company profiles, funding, contacts" },
  { name: "Crunchbase", status: "shared", desc: "Funding rounds, investors, headcount" },
  { name: "LinkedIn", status: "shared", desc: "Leadership changes, hiring velocity" },
  { name: "PitchBook", status: "available", desc: "Valuations, deal history, cap tables" },
  { name: "News / RSS", status: "active", desc: "Announcements, press, launches" },
];

const TYPE_LABELS = { hiring_trigger: "Hiring", org_pattern: "Org", comp_shift: "Comp", capability_gap: "Gap" };
const TYPE_LABELS_FULL = { hiring_trigger: "Hiring Trigger", org_pattern: "Org Pattern", comp_shift: "Comp Shift", capability_gap: "Capability Gap" };
const TYPE_COLORS = { hiring_trigger: T.accent, org_pattern: T.purple, comp_shift: T.amber, capability_gap: T.red };
const TYPE_BGS = { hiring_trigger: T.accentDim, org_pattern: T.purpleDim, comp_shift: T.amberDim, capability_gap: T.redDim };
const TIER_COLORS = { active: T.green, building: T.amber, prospect: T.textDim };
const TREND_ICONS = { up: "\u2191", down: "\u2193", stable: "\u2192" };
const TREND_COLORS = { up: T.green, down: T.red, stable: T.textMuted };
const TIME_PERIODS = [
  { key: "1w", label: "Week", days: 7 }, { key: "1m", label: "Month", days: 30 },
  { key: "3m", label: "Quarter", days: 90 }, { key: "6m", label: "6 Mo", days: 180 },
  { key: "1y", label: "Year", days: 365 }, { key: "all", label: "All", days: Infinity },
];
const TODAY = new Date("2026-05-16");
const filterByTime = (dateStr, periodKey) => {
  if (periodKey === "all") return true;
  const p = TIME_PERIODS.find(x => x.key === periodKey);
  const cutoff = new Date(TODAY); cutoff.setDate(cutoff.getDate() - (p?.days || 30));
  return new Date(dateStr) >= cutoff;
};

// ─── SMALL COMPONENTS ───
const Tag = ({ label, color, bg }) => (
  <span style={{ display: "inline-block", padding: "2px 7px", borderRadius: "3px", fontSize: "10px", fontFamily: T.mono, letterSpacing: "0.03em", color, background: bg, fontWeight: 500, lineHeight: "17px", whiteSpace: "nowrap" }}>{label}</span>
);
const StageTag = ({ stage }) => {
  const c = { Seed: T.textMuted, "Series A": T.accent, "Series B": T.purple, "Series C": T.amber };
  const b = { Seed: "rgba(139,141,152,0.1)", "Series A": T.accentDim, "Series B": T.purpleDim, "Series C": T.amberDim };
  return <Tag label={stage} color={c[stage] || T.textMuted} bg={b[stage] || "rgba(139,141,152,0.1)"} />;
};
const ToggleSwitch = ({ on, onToggle }) => (
  <div onClick={(e) => { e.stopPropagation(); onToggle(); }} style={{ width: "26px", height: "14px", borderRadius: "7px", background: on ? T.green : T.border, position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: on ? "#fff" : T.textDim, position: "absolute", top: "2px", left: on ? "14px" : "2px", transition: "left 0.2s" }} />
  </div>
);
const ScrollRow = ({ children, style: s }) => (
  <div style={{ display: "flex", gap: "5px", overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", paddingBottom: "2px", ...s }}>
    {children}
  </div>
);

// ─── INTAKE MODULE ───
const IntakeModule = ({ mobile }) => {
  const [intakeMode, setIntakeMode] = useState("calendar");
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [showSyncedHistory, setShowSyncedHistory] = useState(false);
  const [notetakerState, setNotetakerState] = useState(
    NOTETAKERS.reduce((acc, n) => ({ ...acc, [n.key]: { connected: n.connected, autosync: n.autosync } }), {})
  );
  const [syncedEvents, setSyncedEvents] = useState({});

  const handleSync = (id) => { setAnalyzing(id); setTimeout(() => { setSyncedEvents(p => ({ ...p, [id]: true })); setAnalyzing(null); }, 1600); };
  const handlePaste = () => { setAnalyzing("paste"); setTimeout(() => { setAnalyzing(null); setText(""); }, 1600); };
  const toggleAutosync = (k) => setNotetakerState(p => ({ ...p, [k]: { ...p[k], autosync: !p[k].autosync } }));
  const toggleConnect = (k) => setNotetakerState(p => ({ ...p, [k]: { connected: !p[k].connected, autosync: false } }));

  const connectedCount = Object.values(notetakerState).filter(n => n.connected).length;
  const autosyncCount = Object.values(notetakerState).filter(n => n.autosync).length;
  const unsyncedCount = CALENDAR_EVENTS.filter(e => !syncedEvents[e.id]).length;

  return (
    <div style={{ background: T.surface, borderRadius: T.r, border: `1px solid ${T.border}`, overflow: "hidden" }}>
      <div onClick={() => setCollapsed(!collapsed)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: mobile ? "10px 12px" : "12px 16px", cursor: "pointer", borderBottom: collapsed ? "none" : `1px solid ${T.borderSubtle}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontFamily: T.mono, fontSize: "11px", fontWeight: 600, color: T.text, textTransform: "uppercase", letterSpacing: "0.04em" }}>Signal Intake</span>
          {unsyncedCount > 0 && <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.bg, background: T.accent, borderRadius: "8px", padding: "1px 7px", fontWeight: 600 }}>{unsyncedCount}</span>}
          {!mobile && <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.green }}>{connectedCount} sources</span>}
          {!mobile && autosyncCount > 0 && <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.amber }}>{autosyncCount} autosync</span>}
        </div>
        <span style={{ fontFamily: T.mono, fontSize: "12px", color: T.textDim, transition: "transform 0.2s", transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }}>{"\u25BC"}</span>
      </div>

      {!collapsed && (
        <>
          <ScrollRow style={{ borderBottom: `1px solid ${T.borderSubtle}`, padding: "0" }}>
            {[["calendar", "Recent Meetings"], ["paste", "Paste / Type"], ["photo", "Photo"], ["sources", "Data Sources"]].map(([k, label]) => (
              <button key={k} onClick={() => setIntakeMode(k)} style={{ padding: "9px 14px", border: "none", borderBottom: intakeMode === k ? `2px solid ${T.accent}` : "2px solid transparent", fontFamily: T.mono, fontSize: "11px", cursor: "pointer", background: "transparent", color: intakeMode === k ? T.text : T.textDim, whiteSpace: "nowrap", flexShrink: 0 }}>{label}</button>
            ))}
          </ScrollRow>

          <div style={{ padding: mobile ? "12px" : "14px 16px" }}>
            {intakeMode === "calendar" && (
              <div>
                <ScrollRow style={{ marginBottom: "10px" }}>
                  <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim, alignSelf: "center", flexShrink: 0 }}>NOTETAKERS</span>
                  {NOTETAKERS.map(n => {
                    const st = notetakerState[n.key];
                    return (
                      <div key={n.key} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "3px 7px", borderRadius: "3px", background: st.connected ? (st.autosync ? T.greenDim : T.accentDim) : "rgba(92,94,105,0.06)", border: `1px solid ${st.connected ? (st.autosync ? "rgba(52,211,153,0.2)" : "rgba(79,140,255,0.12)") : T.borderSubtle}`, flexShrink: 0 }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: st.connected ? (st.autosync ? T.green : T.accent) : T.textDim }} />
                        <span style={{ fontFamily: T.mono, fontSize: "10px", color: st.connected ? T.text : T.textDim }}>{n.name}</span>
                        {st.connected ? <ToggleSwitch on={st.autosync} onToggle={() => toggleAutosync(n.key)} /> : (
                          <span onClick={() => toggleConnect(n.key)} style={{ fontFamily: T.mono, fontSize: "9px", color: T.accent, cursor: "pointer" }}>+</span>
                        )}
                      </div>
                    );
                  })}
                </ScrollRow>

                <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Pending Sync</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "10px" }}>
                  {CALENDAR_EVENTS.map(evt => {
                    const done = syncedEvents[evt.id]; const busy = analyzing === evt.id;
                    const nt = NOTETAKERS.find(n => n.key === evt.notetaker);
                    if (done) return (
                      <div key={evt.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", background: "rgba(52,211,153,0.03)", borderRadius: "4px", border: "1px solid rgba(52,211,153,0.1)", opacity: 0.7 }}>
                        <div style={{ flex: 1 }}><span style={{ fontFamily: T.sans, fontSize: "12px", color: T.textMuted }}>{evt.title}</span></div>
                        <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.green }}>synced {"\u2713"}</span>
                      </div>
                    );
                    return (
                      <div key={evt.id} style={{ display: "flex", alignItems: mobile ? "flex-start" : "center", gap: mobile ? "6px" : "10px", padding: "8px 10px", background: T.surfaceHover, borderRadius: "4px", border: `1px solid ${T.borderSubtle}`, flexDirection: mobile ? "column" : "row" }}>
                        {mobile ? (
                          <>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                              <span style={{ fontFamily: T.sans, fontSize: "12px", color: T.text }}>{evt.title}</span>
                              <button onClick={() => handleSync(evt.id)} disabled={busy} style={{ padding: "4px 10px", border: `1px solid ${T.accent}`, borderRadius: "3px", fontFamily: T.mono, fontSize: "10px", cursor: "pointer", background: T.accentDim, color: T.accent, flexShrink: 0 }}>{busy ? "..." : "sync"}</button>
                            </div>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim }}>{evt.time}</span>
                              <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim }}>{evt.attendees}</span>
                              <span style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, padding: "1px 5px", background: T.bg, borderRadius: "2px" }}>{nt?.name}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim, width: "110px", flexShrink: 0 }}>{evt.time}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontFamily: T.sans, fontSize: "12px", color: T.text }}>{evt.title}</div>
                              <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim }}>{evt.attendees}</div>
                            </div>
                            <span style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, padding: "2px 6px", background: T.bg, borderRadius: "2px", flexShrink: 0 }}>{nt?.name}</span>
                            <button onClick={() => handleSync(evt.id)} disabled={busy} style={{ padding: "5px 12px", border: `1px solid ${T.accent}`, borderRadius: "3px", fontFamily: T.mono, fontSize: "10px", cursor: "pointer", background: T.accentDim, color: T.accent, width: "70px", flexShrink: 0 }}>{busy ? "syncing..." : "sync"}</button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div onClick={() => setShowSyncedHistory(!showSyncedHistory)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: T.bg, borderRadius: "4px", cursor: "pointer", border: `1px solid ${T.borderSubtle}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim, textTransform: "uppercase" }}>Previously Synced</span>
                    <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.green }}>{SYNCED_MEETINGS.length} this week</span>
                    <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.accent }}>{SYNCED_MEETINGS.reduce((a, m) => a + m.signalsExtracted, 0)} signals</span>
                  </div>
                  <span style={{ fontFamily: T.mono, fontSize: "11px", color: T.textDim, transition: "transform 0.2s", transform: showSyncedHistory ? "rotate(0deg)" : "rotate(-90deg)" }}>{"\u25BC"}</span>
                </div>
                {showSyncedHistory && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginTop: "5px" }}>
                    {SYNCED_MEETINGS.map(m => (
                      <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 10px", background: "rgba(52,211,153,0.02)", borderRadius: "4px", border: "1px solid rgba(52,211,153,0.06)", flexWrap: mobile ? "wrap" : "nowrap" }}>
                        <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim, width: mobile ? "auto" : "55px", flexShrink: 0 }}>{m.time}</span>
                        <span style={{ fontFamily: T.sans, fontSize: "12px", color: T.textMuted, flex: 1, minWidth: 0 }}>{m.title}</span>
                        <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.green, flexShrink: 0 }}>{m.signalsExtracted}s</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {intakeMode === "paste" && (
              <div>
                <textarea value={text} onChange={e => setText(e.target.value)} placeholder={"Paste meeting notes, raw transcript, email thread...\n\nSonar will extract: company, stage, signal type, key insight, and VC reference."} style={{ width: "100%", height: mobile ? "100px" : "130px", background: T.bg, border: `1px solid ${T.borderSubtle}`, borderRadius: T.r, padding: "10px", fontFamily: T.sans, fontSize: "13px", color: T.text, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
                <button onClick={handlePaste} disabled={!text.trim()} style={{ marginTop: "8px", padding: "8px 16px", border: "none", borderRadius: T.r, fontFamily: T.mono, fontSize: "11px", cursor: "pointer", background: T.accent, color: "#fff", opacity: !text.trim() ? 0.4 : 1 }}>
                  {analyzing === "paste" ? "Extracting with Sonar..." : "Extract Signals"}
                </button>
              </div>
            )}

            {intakeMode === "photo" && (
              <div style={{ height: mobile ? "110px" : "140px", background: T.bg, border: `2px dashed ${T.border}`, borderRadius: T.r, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", cursor: "pointer" }}>
                <span style={{ fontSize: "24px", opacity: 0.4 }}>{"\uD83D\uDCF7"}</span>
                <span style={{ fontFamily: T.sans, fontSize: "12px", color: T.textDim, textAlign: "center", padding: "0 16px" }}>Drop photo of handwritten notes or tap to upload</span>
                <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.accent }}>OCR + Sonar extraction</span>
              </div>
            )}

            {intakeMode === "sources" && (
              <div>
                <div style={{ fontFamily: T.sans, fontSize: "12px", color: T.textMuted, marginBottom: "10px", lineHeight: 1.5 }}>
                  Sonar enriches every signal with external data from the same sources that power Sutro.
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {DATA_SOURCES.map(ds => (
                    <div key={ds.name} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", background: T.surfaceHover, borderRadius: "4px", border: `1px solid ${T.borderSubtle}` }}>
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: ds.status === "shared" ? T.accent : ds.status === "active" ? T.green : T.amber, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontFamily: T.sans, fontSize: "12px", fontWeight: 600, color: T.text }}>{ds.name}</span>
                        {!mobile && <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim, marginLeft: "8px" }}>{ds.desc}</span>}
                      </div>
                      <Tag label={ds.status === "shared" ? "Sutro" : ds.status === "active" ? "Active" : "Avail."} color={ds.status === "shared" ? T.accent : ds.status === "active" ? T.green : T.amber} bg={ds.status === "shared" ? T.accentDim : ds.status === "active" ? T.greenDim : T.amberDim} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// ─── SIGNAL CARD ───
const SignalCard = ({ s, expanded, onToggle, mobile }) => (
  <div onClick={onToggle} style={{ padding: mobile ? "10px" : "12px 14px", background: expanded ? T.surfaceActive : T.surface, borderRadius: T.r, border: `1px solid ${expanded ? T.border : T.borderSubtle}`, cursor: "pointer" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px", flexWrap: "wrap" }}>
          <span style={{ fontFamily: T.sans, fontSize: "13px", fontWeight: 600, color: T.text }}>{s.company}</span>
          <StageTag stage={s.stage} />
          <Tag label={TYPE_LABELS[s.type]} color={TYPE_COLORS[s.type]} bg={TYPE_BGS[s.type]} />
          {!mobile && <Tag label={s.func} color={T.textMuted} bg="rgba(139,141,152,0.08)" />}
        </div>
        <p style={{ fontFamily: T.sans, fontSize: "13px", color: T.textMuted, lineHeight: "1.5", margin: 0 }}>{s.signal}</p>
        {expanded && (
          <div style={{ marginTop: "10px" }}>
            <div style={{ display: "flex", gap: "12px", marginBottom: "4px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim }}>{s.source}</span>
              {s.vcRef && <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.accent }}>VC: {s.vcRef}</span>}
              {mobile && <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim }}>{s.func}</span>}
            </div>
            {s.enrichment && (
              <div style={{ marginTop: "8px", padding: "8px 10px", background: T.bg, borderRadius: T.r, border: `1px solid ${T.borderSubtle}` }}>
                <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", marginBottom: "6px" }}>Enrichment <span style={{ color: T.accent }}>via Sutro</span></div>
                {s.enrichment.raised && <div style={{ fontFamily: T.sans, fontSize: "11px", color: T.textMuted, marginBottom: "2px" }}><span style={{ color: T.green }}>$</span> {s.enrichment.raised}</div>}
                {s.enrichment.headcount && <div style={{ fontFamily: T.sans, fontSize: "11px", color: T.textMuted, marginBottom: "2px" }}>{"\u25C6"} {s.enrichment.headcount}</div>}
                {s.enrichment.news && <div style={{ fontFamily: T.sans, fontSize: "11px", color: T.textMuted }}>{"\u2192"} {s.enrichment.news}</div>}
              </div>
            )}
          </div>
        )}
      </div>
      <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim, whiteSpace: "nowrap", flexShrink: 0 }}>{s.date.slice(5)}</span>
    </div>
  </div>
);

// ─── VC CARD (mobile) / ROW (desktop) ───
const VCCard = ({ v }) => (
  <div style={{ padding: "10px", background: T.surface, borderRadius: T.r, border: `1px solid ${T.borderSubtle}` }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
      <span style={{ fontFamily: T.sans, fontSize: "13px", fontWeight: 600, color: T.text }}>{v.firm}</span>
      <Tag label={v.tier} color={TIER_COLORS[v.tier]} bg={v.tier === "active" ? T.greenDim : v.tier === "building" ? T.amberDim : "rgba(92,94,105,0.1)"} />
    </div>
    <div style={{ display: "flex", gap: "12px", fontFamily: T.mono, fontSize: "10px", color: T.textMuted, marginBottom: "4px" }}>
      <span>{v.signals} signals</span>
      <span style={{ color: v.engagements > 0 ? T.green : T.textDim }}>{v.engagements} deals</span>
      <span style={{ marginLeft: "auto", color: T.textDim }}>{v.lastTouch.slice(5)}</span>
    </div>
    <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim }}>{v.contacts.join(", ")}</div>
  </div>
);
const VCRow = ({ v }) => (
  <div style={{ display: "grid", gridTemplateColumns: "130px 72px 50px 50px 1fr 80px", alignItems: "center", gap: "6px", padding: "9px 12px", background: T.surface, borderRadius: T.r, border: `1px solid ${T.borderSubtle}`, fontSize: "12px" }}>
    <span style={{ fontFamily: T.sans, fontWeight: 600, color: T.text }}>{v.firm}</span>
    <Tag label={v.tier} color={TIER_COLORS[v.tier]} bg={v.tier === "active" ? T.greenDim : v.tier === "building" ? T.amberDim : "rgba(92,94,105,0.1)"} />
    <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textMuted, textAlign: "center" }}>{v.signals}</span>
    <span style={{ fontFamily: T.mono, fontSize: "10px", color: v.engagements > 0 ? T.green : T.textDim, textAlign: "center" }}>{v.engagements}</span>
    <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.contacts.join(", ")}</span>
    <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim, textAlign: "right" }}>{v.lastTouch.slice(5)}</span>
  </div>
);

// ─── SEARCH RESPONSES ───
// ─── SONAR CONTEXT FOR CLAUDE ───
const SONAR_CONTEXT = `You are Sonar, a market intelligence tool for Riviera Partners. You have access to the following ecosystem signals, patterns, and VC relationships collected from BD conversations, founder meetings, and VC talent partner check-ins. Answer questions with a single narrative summary of no more than 300 characters. Name specific companies, numbers, or patterns. Do not use bullet points or line breaks. The user will read the full signal cards below your summary, so do not restate every detail — just orient them to what the data shows.

SIGNALS (${SIGNALS.length} total):
${SIGNALS.map(s => `- [ID:${s.id}] [${s.date}] ${s.company} (${s.stage}, ${s.func}) [${s.type}] via ${s.source}${s.vcRef ? `, VC: ${s.vcRef}` : ''}. Signal: ${s.signal} | Enrichment: raised ${s.enrichment.raised}, headcount ${s.enrichment.headcount}, news: ${s.enrichment.news}`).join('\n')}

DETECTED PATTERNS (${PATTERNS.length} total):
${PATTERNS.map(p => `- [ID:${p.id}] "${p.theme}" (${p.count}x, trend: ${p.trend}, stages: ${p.stages.join('/')}, funcs: ${p.funcs.join('/')}): ${p.signal}`).join('\n')}

VC RELATIONSHIPS (${VC_RELATIONSHIPS.length}):
${VC_RELATIONSHIPS.map(v => `- ${v.firm} [${v.tier}]: ${v.signals} signals, ${v.engagements} engagements, contacts: ${v.contacts.join(', ')}, last touch: ${v.lastTouch}`).join('\n')}

You MUST end every response with a JSON block in this exact format — no exceptions, even if no signals matched:
|||JSON|||
{"matchedSignalIds": [1, 4], "matchedPatternIds": [2]}
|||END|||

matchedSignalIds: Use the [ID:N] values from the signals above. Include every signal relevant to the question — err toward more, not fewer.
matchedPatternIds: Use the [ID:N] values from the patterns above.
If nothing matched, output: |||JSON|||
{"matchedSignalIds": [], "matchedPatternIds": []}
|||END|||`;

// ─── MAIN APP ───
export default function SignalBoard() {
  const mobile = useIsMobile();
  const [tab, setTab] = useState("signals");
  const [expandedSignal, setExpandedSignal] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterStage, setFilterStage] = useState("all");
  const [timePeriod, setTimePeriod] = useState("1m");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchActive(true);
    setSearchResult(null);

    try {
      const response = await fetch("/.netlify/functions/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5-20251101",
          max_tokens: 1000,
          system: SONAR_CONTEXT,
          messages: [{ role: "user", content: searchQuery }],
        }),
      });

      const data = await response.json();

      if (data.type === "error" || !data.content) {
        setSearchResult({
          answer: `API error: ${data.error?.message || JSON.stringify(data)}`,
          matchedSignals: [],
          matchedPatterns: [],
        });
        setSearchLoading(false);
        return;
      }

      const rawText = data.content
        .filter(item => item.type === "text")
        .map(item => item.text)
        .join("\n");

      let answer = rawText;
      let matchedSignals = [];
      let matchedPatterns = [];

      const jsonMatch = rawText.match(/\|\|\|JSON\|\|\|([\s\S]*?)\|\|\|END\|\|\|/);
      if (jsonMatch) {
        answer = rawText.replace(/\|\|\|JSON\|\|\|[\s\S]*?\|\|\|END\|\|\|/, "").trim();
        try {
          const parsed = JSON.parse(jsonMatch[1].trim());
          matchedSignals = parsed.matchedSignalIds || [];
          matchedPatterns = parsed.matchedPatternIds || [];
        } catch (e) {
          // JSON block malformed, answer still shows
        }
      }

      setSearchResult({ answer, matchedSignals, matchedPatterns });
    } catch (err) {
      setSearchResult({
        answer: "Search failed. Check connection and try again.",
        matchedSignals: [],
        matchedPatterns: [],
      });
    }

    setSearchLoading(false);
  };
  const clearSearch = () => { setSearchQuery(""); setSearchActive(false); setSearchResult(null); };

  const filtered = SIGNALS.filter(s => {
    if (!filterByTime(s.date, timePeriod)) return false;
    if (filterType !== "all" && s.type !== filterType) return false;
    if (filterStage !== "all" && s.stage !== filterStage) return false;
    return true;
  });
  const activeVCs = VC_RELATIONSHIPS.filter(v => v.tier === "active").length;
  const totalEngagements = VC_RELATIONSHIPS.reduce((a, v) => a + v.engagements, 0);
  const periodLabel = TIME_PERIODS.find(p => p.key === timePeriod)?.label || "";
  const px = mobile ? "12px" : "24px";

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.sans }}>
      {/* HEADER */}
      <div style={{ borderBottom: `1px solid ${T.borderSubtle}`, padding: `0 ${px}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "48px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontFamily: T.mono, fontSize: mobile ? "13px" : "14px", fontWeight: 700, color: T.text }}>SONAR</span>
            <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim }}>by Riviera</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: mobile ? "8px" : "14px" }}>
            {!mobile && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: T.accent }} />
                  <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim }}>Sutro data</span>
                </div>
                <div style={{ width: "1px", height: "12px", background: T.borderSubtle }} />
              </>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: T.green }} />
              <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim }}>{mobile ? "synced" : "Calendar + notetakers synced"}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: `16px ${px}` }}>
        {/* INTAKE */}
        <div style={{ marginBottom: "14px" }}><IntakeModule mobile={mobile} /></div>

        {/* SEARCH */}
        <div style={{ marginBottom: "14px" }}>
          <div style={{ display: "flex", gap: "6px", flexDirection: mobile ? "column" : "row" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder={mobile ? '"Who needs eng leadership right now?"' : 'Ask anything across your signals... "Which companies need eng leadership?" "What\u2019s Paradigm surfacing?"'}
                style={{ width: "100%", padding: "11px 14px", paddingRight: searchActive ? "32px" : "14px", background: T.surface, border: `1px solid ${searchActive ? T.accent : T.border}`, borderRadius: T.r, fontFamily: T.sans, fontSize: "13px", color: T.text, outline: "none", boxSizing: "border-box" }} />
              {searchActive && <span onClick={clearSearch} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", fontFamily: T.mono, fontSize: "13px", color: T.textDim, cursor: "pointer" }}>{"\u2715"}</span>}
            </div>
            <button onClick={handleSearch} disabled={!searchQuery.trim()} style={{ padding: mobile ? "10px" : "0 18px", border: "none", borderRadius: T.r, fontFamily: T.mono, fontSize: "11px", cursor: "pointer", background: T.accent, color: "#fff", whiteSpace: "nowrap" }}>
              {searchLoading ? "Analyzing..." : "Ask Sonar"}
            </button>
          </div>

          {searchActive && searchResult && (
            <div style={{ marginTop: "8px", background: T.surface, border: `1px solid ${T.accent}`, borderRadius: T.r, overflow: "hidden" }}>
              <div style={{ padding: mobile ? "10px" : "14px 16px" }}>
                <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.accent, textTransform: "uppercase", marginBottom: "8px" }}>Sonar Analysis</div>
                <p style={{ fontFamily: T.sans, fontSize: "13px", color: T.textMuted, lineHeight: "1.6", margin: 0 }}>{searchResult.answer}</p>
              </div>
              {searchResult.matchedSignals.length > 0 && (
                <div style={{ padding: mobile ? "8px 10px" : "10px 16px", borderTop: `1px solid ${T.borderSubtle}` }}>
                  <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", marginBottom: "6px" }}>Referenced Signals</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {searchResult.matchedSignals.map(sid => {
                      const s = SIGNALS.find(x => x.id === sid);
                      if (!s) return null;
                      return (
                        <div key={sid} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 8px", background: T.bg, borderRadius: "4px", flexWrap: "wrap" }}>
                          <span style={{ fontFamily: T.sans, fontSize: "12px", fontWeight: 600, color: T.text }}>{s.company}</span>
                          <StageTag stage={s.stage} />
                          <Tag label={TYPE_LABELS[s.type]} color={TYPE_COLORS[s.type]} bg={TYPE_BGS[s.type]} />
                          {!mobile && <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim, marginLeft: "auto" }}>{s.date.slice(5)}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {searchResult.matchedPatterns.length > 0 && (
                <div style={{ padding: mobile ? "8px 10px" : "10px 16px", borderTop: `1px solid ${T.borderSubtle}` }}>
                  <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", marginBottom: "6px" }}>Related Patterns</div>
                  {searchResult.matchedPatterns.map(pid => {
                    const p = PATTERNS.find(x => x.id === pid);
                    if (!p) return null;
                    return (
                      <div key={pid} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 8px", background: T.bg, borderRadius: "4px", flexWrap: "wrap" }}>
                        <span style={{ fontFamily: T.sans, fontSize: "12px", fontWeight: 600, color: T.text }}>{p.theme}</span>
                        <span style={{ fontFamily: T.mono, fontSize: "14px", fontWeight: 700, color: TREND_COLORS[p.trend] }}>{TREND_ICONS[p.trend]}</span>
                        <span style={{ fontFamily: T.mono, fontSize: "11px", color: T.accent, fontWeight: 700 }}>{p.count}x</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: mobile ? "8px" : "10px", marginBottom: "14px" }}>
          {[
            [`Signals (${periodLabel})`, filtered.length, `${new Set(filtered.map(s => s.vcRef)).size} VCs`],
            ["Active VCs", activeVCs, `of ${VC_RELATIONSHIPS.length}`],
            ["Engagements", totalEngagements, "from ecosystem"],
            ["Patterns", PATTERNS.length, `${PATTERNS.filter(p => p.trend === "up").length} trending up`],
          ].map(([label, value, sub], i) => (
            <div key={i} style={{ padding: mobile ? "10px" : "14px 16px", background: T.surface, borderRadius: T.r, border: `1px solid ${T.borderSubtle}` }}>
              <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>{label}</div>
              <div style={{ fontFamily: T.mono, fontSize: mobile ? "20px" : "26px", fontWeight: 700, color: T.text, lineHeight: 1 }}>{value}</div>
              <div style={{ fontFamily: T.sans, fontSize: "10px", color: T.textMuted, marginTop: "3px" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* TABS + TIME */}
        <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: mobile ? "stretch" : "center", gap: mobile ? "8px" : "0", marginBottom: "14px" }}>
          <ScrollRow>
            {[["signals", "Signals"], ["patterns", "Patterns"], ["vcs", "VCs"]].map(([k, label]) => (
              <button key={k} onClick={() => setTab(k)} style={{ padding: "7px 14px", borderRadius: "4px", border: `1px solid ${tab === k ? T.border : T.borderSubtle}`, fontFamily: T.mono, fontSize: "11px", cursor: "pointer", background: tab === k ? T.surfaceActive : "transparent", color: tab === k ? T.text : T.textDim, whiteSpace: "nowrap", flexShrink: 0 }}>{label}</button>
            ))}
          </ScrollRow>
          <ScrollRow>
            {TIME_PERIODS.map(p => (
              <button key={p.key} onClick={() => setTimePeriod(p.key)} style={{ padding: "5px 9px", borderRadius: "4px", border: `1px solid ${timePeriod === p.key ? T.border : T.borderSubtle}`, fontFamily: T.mono, fontSize: "10px", cursor: "pointer", background: timePeriod === p.key ? T.surfaceActive : "transparent", color: timePeriod === p.key ? T.text : T.textDim, whiteSpace: "nowrap", flexShrink: 0 }}>{p.label}</button>
            ))}
          </ScrollRow>
        </div>

        {/* SIGNALS TAB */}
        {tab === "signals" && (
          <div>
            <ScrollRow style={{ marginBottom: "12px" }}>
              <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim, alignSelf: "center", flexShrink: 0 }}>FILTER</span>
              {[["all", "All"], ["hiring_trigger", "Hiring"], ["org_pattern", "Org"], ["comp_shift", "Comp"], ["capability_gap", "Gap"]].map(([k, label]) => (
                <button key={k} onClick={() => setFilterType(k)} style={{ padding: "4px 9px", borderRadius: "3px", border: `1px solid ${filterType === k ? T.border : T.borderSubtle}`, fontFamily: T.mono, fontSize: "10px", cursor: "pointer", background: filterType === k ? T.surfaceActive : "transparent", color: filterType === k ? T.text : T.textDim, whiteSpace: "nowrap", flexShrink: 0 }}>{label}</button>
              ))}
              <span style={{ width: "1px", background: T.borderSubtle, flexShrink: 0 }} />
              {["all", "Seed", "A", "B", "C"].map((s, i) => {
                const val = s === "all" ? "all" : ["all", "Seed", "Series A", "Series B", "Series C"][i];
                return <button key={s} onClick={() => setFilterStage(val)} style={{ padding: "4px 9px", borderRadius: "3px", border: `1px solid ${filterStage === val ? T.border : T.borderSubtle}`, fontFamily: T.mono, fontSize: "10px", cursor: "pointer", background: filterStage === val ? T.surfaceActive : "transparent", color: filterStage === val ? T.text : T.textDim, whiteSpace: "nowrap", flexShrink: 0 }}>{s === "all" ? "All" : s}</button>;
              })}
            </ScrollRow>
            <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim, marginBottom: "8px" }}>{filtered.length} signals</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {filtered.map(s => (
                <SignalCard key={s.id} s={s} expanded={expandedSignal === s.id} onToggle={() => setExpandedSignal(expandedSignal === s.id ? null : s.id)} mobile={mobile} />
              ))}
            </div>
          </div>
        )}

        {/* PATTERNS TAB */}
        {tab === "patterns" && (
          <div>
            <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim, marginBottom: "8px" }}>{PATTERNS.length} patterns detected</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {PATTERNS.map(p => (
                <div key={p.id} style={{ padding: mobile ? "10px" : "14px 16px", background: T.surface, borderRadius: T.r, border: `1px solid ${T.borderSubtle}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: T.sans, fontSize: "13px", fontWeight: 600, color: T.text }}>{p.theme}</span>
                      <span style={{ fontFamily: T.mono, fontSize: "16px", fontWeight: 700, color: TREND_COLORS[p.trend] }}>{TREND_ICONS[p.trend]}</span>
                    </div>
                    <span style={{ fontFamily: T.mono, fontSize: "20px", fontWeight: 700, color: T.accent }}>{p.count}</span>
                  </div>
                  <p style={{ fontFamily: T.sans, fontSize: "12px", color: T.textMuted, lineHeight: "1.5", margin: "0 0 8px 0" }}>{p.signal}</p>
                  <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    {p.stages.map(s => <StageTag key={s} stage={s} />)}
                    {p.funcs.map(f => <Tag key={f} label={f} color={T.textMuted} bg="rgba(139,141,152,0.08)" />)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "16px", padding: mobile ? "12px" : "16px", background: T.surface, borderRadius: T.r, border: `1px solid ${T.borderSubtle}` }}>
              <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.accent, textTransform: "uppercase", marginBottom: "8px" }}>Intelligence Brief — May 2026</div>
              <p style={{ fontFamily: T.sans, fontSize: "13px", color: T.textMuted, lineHeight: "1.6", margin: 0 }}>
                <strong style={{ color: T.text }}>Top signal:</strong> Player-coach eng leadership demand accelerating. 5 companies across Series A/B. Direct Paragon opportunity: build a candidate pool and market proactively to portfolio companies hitting 40-70 headcount.
              </p>
              <p style={{ fontFamily: T.sans, fontSize: "13px", color: T.textMuted, lineHeight: "1.6", margin: "8px 0 0 0" }}>
                <strong style={{ color: T.text }}>Emerging:</strong> ML/AI eng comp repricing creating retention risk at Series B+. Riviera advisory can lead with comp benchmarking as entry point.
              </p>
            </div>
          </div>
        )}

        {/* VCs TAB */}
        {tab === "vcs" && (
          <div>
            <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim, marginBottom: "8px" }}>
              {activeVCs} active · {VC_RELATIONSHIPS.filter(v => v.tier === "building").length} building · {VC_RELATIONSHIPS.filter(v => v.tier === "prospect").length} prospect
            </div>
            {!mobile && (
              <div style={{ display: "grid", gridTemplateColumns: "130px 72px 50px 50px 1fr 80px", gap: "6px", padding: "0 12px 6px" }}>
                {["Firm", "Status", "Sig.", "Deals", "Contacts", "Touch"].map(h => (
                  <span key={h} style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", textAlign: h === "Sig." || h === "Deals" ? "center" : h === "Touch" ? "right" : "left" }}>{h}</span>
                ))}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {[...VC_RELATIONSHIPS].sort((a, b) => {
                const o = { active: 0, building: 1, prospect: 2 };
                return o[a.tier] - o[b.tier];
              }).map(v => mobile ? <VCCard key={v.firm} v={v} /> : <VCRow key={v.firm} v={v} />)}
            </div>
            <div style={{ marginTop: "16px", padding: mobile ? "12px" : "16px", background: T.surface, borderRadius: T.r, border: `1px solid ${T.borderSubtle}` }}>
              <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.accent, textTransform: "uppercase", marginBottom: "8px" }}>Target: 15+ Active VCs</div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ flex: 1, height: "6px", background: T.bg, borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: `${(activeVCs / 15) * 100}%`, height: "100%", background: T.accent, borderRadius: "3px" }} />
                </div>
                <span style={{ fontFamily: T.mono, fontSize: "12px", color: T.accent }}>{activeVCs}/15</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <footer style={{ marginTop: "auto", padding: mobile ? "28px 16px" : "32px 24px", borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <span style={{ fontFamily: T.mono, fontSize: "11px", color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Sonar · Signal Intelligence</span>
        <a href="https://github.com/beingmtm714/sonar-riviera" target="_blank" rel="noopener noreferrer" style={{ fontFamily: T.mono, fontSize: "11px", color: T.accent, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", border: `1px solid ${T.border}`, borderRadius: T.r, background: T.surface }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          Read the Docs
        </a>
      </footer>
    </div>
  );
}
