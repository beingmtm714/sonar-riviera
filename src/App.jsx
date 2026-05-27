import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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
  text: "#E8E9EC", textMuted: "#C0C8DA", textDim: "#8096B8",
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
const SIGNAL_ACTIONS = {
  1:  { nextSteps: ["Follow up on VP Eng timing — Series A closes next month", "Send 3 VP Eng candidate profiles this week"], strategicRecs: ["Pitch retained VP Eng search now — 30-day window before close", "Use as Series A first-eng-leader case study for VC distribution"], due: "2026-05-21" },
  2:  { nextSteps: ["Send platform/product split case studies", "Sync with Shannon at a16z on portfolio pattern"], strategicRecs: ["Cross-sell: 3 other Series B companies need the same restructure", "Build org design content for VC talent partner distribution"], due: "2026-05-20" },
  3:  { nextSteps: ["Share ML eng comp benchmarking data", "Propose creative equity structure frameworks"], strategicRecs: ["Publish quarterly ML comp report as Riviera IP — high VC distribution value", "Alert Greylock portfolio proactively to comp pressure trend"], due: "2026-05-19" },
  4:  { nextSteps: ["Send eng manager candidate profiles", "Share player-coach vs. pure manager decision framework"], strategicRecs: ["60-day window — start search immediately for best close odds", "High-visibility mandate: Devin/Cognition is a marquee AI brand"], due: "2026-05-18" },
  5:  { nextSteps: ["Send Head of Design candidate longlist", "Introduce design research methodology frameworks"], strategicRecs: ["Bundle design + UX research search — rare profile commands full retained fee", "Flag design leadership gap to a16z as a fintech portfolio pattern"], due: "2026-05-24" },
  6:  { nextSteps: ["Share pod org design templates from Stripe/Notion", "Propose Eng Manager search alongside pod rollout"], strategicRecs: ["Propose 2–3 Eng Manager cluster search — efficiency play for Riviera", "4th infra company at this inflection point — codify as a playbook"], due: "2026-05-23" },
  7:  { nextSteps: ["Build distributed systems/GPU technical screen", "Send 3 senior inference engineer profiles"], strategicRecs: ["Get on retainer before Series A — first mover advantage", "Co-building hiring bar documentation creates long-term lock-in"], due: "2026-05-22" },
  8:  { nextSteps: ["Share Series C ML infra PM comp benchmarking", "Offer market data presentation to W&B leadership team"], strategicRecs: ["Series C ML tooling PM comp report — distributable to all VC talent partners", "Identify top 5 PMs at attrition risk across the portfolio"], due: "2026-05-21" },
  9:  { nextSteps: ["Send staff+ eng profiles for vertical ownership model", "Follow up with Accel portfolio ops on search mandate"], strategicRecs: ["Propose 3–5 staff eng cluster search — premium retained project", "v0 AI traction signals an upcoming PM search next quarter"], due: "2026-05-25" },
  10: { nextSteps: ["Build IR + LLM engineer shortlist from research pipeline", "Schedule comp discussion with General Catalyst talent"], strategicRecs: ["Rare skillset = high-fee retained opportunity — move fast", "Source IR researchers from Google Search and academic NLP programs"], due: "2026-05-26" },
  11: { nextSteps: ["Present eng director candidate profiles", "Share player-coach framework tailored to 12-person team dynamics"], strategicRecs: ["12-month exclusive retained search — close before A-round velocity peaks", "Connect Redpoint talent to Riviera's Series A eng leadership track record"], due: "2026-05-22" },
  12: { nextSteps: ["Send commercial-focused PM profiles", "Share OS/commercial split case studies from Elastic and Confluent"], strategicRecs: ["High-fee commercial PM search at Series C — prioritize outreach this week", "Pattern: all OS companies need this split at $50M ARR — proactive VC brief"], due: "2026-05-24" },
  13: { nextSteps: ["Share equity refresh benchmarking for fintech Series C", "Offer to facilitate stay interviews with at-risk eng team"], strategicRecs: ["Attrition risk = replacement search pipeline — get ahead of it now", "Flag to Founders Fund as a portfolio-wide Series C retention risk"], due: "2026-05-21" },
  14: { nextSteps: ["Build on-prem deployment engineer shortlist from enterprise companies", "Send ML systems + enterprise software hybrid profiles"], strategicRecs: ["3 months without a hire = urgent retained search mandate ready to close", "Index Ventures intro: propose portfolio-wide ML infra hiring support"], due: "2026-05-22" },
  15: { nextSteps: ["Build AI design systems specialist shortlist", "Send Sequoia talent team Riviera's AI product design expertise overview"], strategicRecs: ["AI interaction design gap exists across 5+ Sequoia portfolio companies — pattern brief", "Build AI design candidate pool now before demand peaks"], due: "2026-05-25" },
};
const PATTERN_ACTIONS = [
  { id: 1, recommendation: "Build a dedicated player-coach candidate pool — 5 companies need this archetype simultaneously. Proactive pool means faster closes and a premium positioning story.", due: "2026-05-31" },
  { id: 2, recommendation: "Create a 'Series A Eng Leadership Playbook' for VC talent partners. Positions Riviera as the specialist firm for the most critical early-stage hire.", due: "2026-05-28" },
  { id: 3, recommendation: "Proactively brief OS-stage companies in VC portfolios on the commercial product split pattern before they ask — generates inbound mandates.", due: "2026-05-28" },
  { id: 4, recommendation: "Publish a quarterly ML Compensation Report as Riviera IP. Distributable to all VC talent partners, creates a recurring touchpoint, positions Riviera as the data source.", due: "2026-05-31" },
  { id: 5, recommendation: "Launch a 'Design Leadership in Infrastructure' proactive recruiting campaign. Three companies need this simultaneously — cluster approach cuts cost per placement.", due: "2026-05-28" },
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
const UPCOMING_MEETINGS = [
  { id: "u1", time: "Today 2:00 PM", date: "2026-05-16", title: "Cohere Series B eng hiring check-in", attendees: "Aidan Gomez (CEO)", company: "Cohere", vcRef: "Index Ventures" },
  { id: "u2", time: "Today 4:30 PM", date: "2026-05-16", title: "Andreessen Horowitz talent partner monthly", attendees: "Shannon Schiltz", company: null, vcRef: "Andreessen Horowitz" },
  { id: "u3", time: "Tomorrow 10:00 AM", date: "2026-05-17", title: "Glean engineering leadership discussion", attendees: "Arvind Jain (CEO)", company: "Glean", vcRef: "General Catalyst" },
  { id: "u4", time: "Tomorrow 3:00 PM", date: "2026-05-17", title: "Vercel staff eng search kickoff", attendees: "Guillermo Rauch (CEO)", company: "Vercel", vcRef: "Accel" },
  { id: "u5", time: "May 19 11:00 AM", date: "2026-05-19", title: "Ramp equity refresh strategy session", attendees: "Eric Glyman (CEO)", company: "Ramp", vcRef: "Founders Fund" },
  { id: "u6", time: "May 20 2:00 PM", date: "2026-05-20", title: "Cognition AI — eng manager candidate review", attendees: "Scott Wu (CEO)", company: "Cognition AI", vcRef: "General Catalyst" },
  { id: "u7", time: "May 21 11:00 AM", date: "2026-05-21", title: "Greylock portfolio talent sync", attendees: "talent partner", company: null, vcRef: "Greylock" },
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

// ─── TOOLTIP ───
const TOOLTIPS = {
  intake: "Every meeting you take generates signal. Connect your notetaker and Sonar auto-extracts structured intel — company, stage, signal type, VC ref — without manual entry. The longer you run it, the richer the dataset.",
  signals: "The raw intelligence layer. Each card is a signal captured from a real conversation — filtered by function, stage, and type. Expand any card to see enrichment data pulled from Crunchbase, LinkedIn, and news.",
  patterns: "Sonar aggregates signals into themes across your whole conversation history. When four Series A founders ask the same question in a month, that's not noise — it's a pattern worth acting on.",
  vcs: "Tracks which VC relationships are generating signal and converting to commercial engagements. The progress bar measures against a 12-month target. Attribution flows from first conversation to signed search.",
  askSonar: "Natural language search across all signals, patterns, and live web data. Ask it anything about the market — it synthesizes your proprietary conversation data with current news and returns a grounded answer.",
};
const Tooltip = ({ id, children }) => {
  const [coords, setCoords] = useState(null);
  const ref = useRef(null);
  const text = TOOLTIPS[id];

  const show = () => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const above = r.top > window.innerHeight * 0.45;
    setCoords({
      left: r.left + r.width / 2 + window.scrollX,
      y: above ? r.top + window.scrollY - 10 : r.bottom + window.scrollY + 10,
      above,
    });
  };

  if (!text) return <>{children}</>;
  return (
    <div ref={ref} style={{ display: "inline-flex", alignItems: "center" }}
      onMouseEnter={show} onMouseLeave={() => setCoords(null)}>
      {children}
      <span style={{ marginLeft: "6px", fontSize: "12px", color: T.accent, cursor: "default", lineHeight: 1, userSelect: "none", opacity: 0.8 }}>ⓘ</span>
      {coords && createPortal(
        <div style={{
          position: "absolute",
          top: coords.y,
          left: coords.left,
          transform: coords.above ? "translate(-50%, -100%)" : "translate(-50%, 0)",
          background: T.surfaceActive, border: `1px solid ${T.border}`, borderRadius: T.r,
          padding: "10px 13px", width: "270px", zIndex: 9999,
          fontFamily: T.sans, fontSize: "12px", color: T.textMuted, lineHeight: "1.6",
          boxShadow: T.shadow, pointerEvents: "none",
        }}>
          {text}
        </div>,
        document.body
      )}
    </div>
  );
};

// ─── CHART COMPONENTS ───
const BarChart = ({ items, maxVal }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
    {items.map(({ label, value, color }) => (
      <div key={label}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
          <span style={{ fontFamily: T.sans, fontSize: "12px", color: T.textMuted }}>{label}</span>
          <span style={{ fontFamily: T.mono, fontSize: "11px", color: color || T.accent, fontWeight: 700 }}>{value}</span>
        </div>
        <div style={{ height: "4px", background: T.borderSubtle, borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ width: `${Math.min((value / maxVal) * 100, 100)}%`, height: "100%", background: color || T.accent, borderRadius: "2px", transition: "width 0.5s ease" }} />
        </div>
      </div>
    ))}
  </div>
);

const WeeklyBars = ({ signals }) => {
  const base = new Date("2026-05-18");
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const end = new Date(base); end.setDate(base.getDate() - (7 - i - 1) * 7);
    const start = new Date(end); start.setDate(end.getDate() - 7);
    const count = signals.filter(s => { const d = new Date(s.date); return d >= start && d < end; }).length;
    return { label: `${start.getMonth() + 1}/${start.getDate()}`, count };
  });
  const maxCount = Math.max(...weeks.map(w => w.count), 1);
  const barW = 28; const gap = 8; const chartH = 60;
  const svgW = weeks.length * (barW + gap) - gap;
  return (
    <svg width="100%" viewBox={`0 0 ${svgW} ${chartH + 18}`} style={{ overflow: "visible" }}>
      {weeks.map((w, i) => {
        const barH = w.count > 0 ? Math.max((w.count / maxCount) * chartH, 4) : 0;
        const x = i * (barW + gap);
        return (
          <g key={i}>
            <rect x={x} y={chartH - barH} width={barW} height={barH || 2} fill={w.count > 0 ? T.accent : T.borderSubtle} rx="2" />
            <text x={x + barW / 2} y={chartH + 13} textAnchor="middle" fill={T.textDim} fontSize="8" fontFamily="monospace">{w.label}</text>
            {w.count > 0 && <text x={x + barW / 2} y={chartH - barH - 4} textAnchor="middle" fill={T.accent} fontSize="9" fontFamily="monospace">{w.count}</text>}
          </g>
        );
      })}
    </svg>
  );
};

// ─── DAILY PREP MODULE ───
const DailyPrepModule = ({ mobile, onIntegrationOpen }) => {
  const [period, setPeriod] = useState("day");
  const [expandedMeeting, setExpandedMeeting] = useState(null);
  const [meetingPreps, setMeetingPreps] = useState({});
  const [prepLoading, setPrepLoading] = useState(null);

  const generateMeetingPrep = async (meeting) => {
    setPrepLoading(meeting.id);
    const relatedSignals = SIGNALS.filter(s => s.company === meeting.company || s.vcRef === meeting.vcRef);
    const vcData = VC_RELATIONSHIPS.find(v => v.firm === meeting.vcRef);
    const signalEntry = meeting.company
      ? Object.entries(SIGNAL_ACTIONS).find(([sid]) => SIGNALS.find(x => x.id === parseInt(sid))?.company === meeting.company)
      : null;
    const actions = signalEntry ? signalEntry[1] : null;
    const context = [
      `Meeting: ${meeting.title} with ${meeting.attendees}`,
      relatedSignals.length > 0 ? `Previous signals from this relationship: ${relatedSignals.map(s => s.signal).join('; ')}` : '',
      vcData ? `VC relationship: ${vcData.firm} (${vcData.tier}), ${vcData.signals} signals captured, ${vcData.engagements} commercial engagements, contacts: ${vcData.contacts.join(', ')}` : '',
      actions?.nextSteps?.length > 0 ? `Open to-dos from last call: ${actions.nextSteps.join('; ')}` : '',
      actions?.strategicRecs?.length > 0 ? `Strategic context: ${actions.strategicRecs.join('; ')}` : '',
    ].filter(Boolean).join('\n');
    try {
      const res = await fetch("/.netlify/functions/claude", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 250, skipWebSearch: true,
          system: "You write sharp 2-sentence meeting prep notes for a talent advisory firm. Name specific companies, people, open to-dos, and the commercial angle. No filler.",
          messages: [{ role: "user", content: `Write a meeting prep note based on: ${context}` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.filter(i => i.type === "text").map(i => i.text).join("") || "Unable to generate prep note.";
      setMeetingPreps(p => ({ ...p, [meeting.id]: text }));
    } catch (e) {
      setMeetingPreps(p => ({ ...p, [meeting.id]: "Generation failed. Try again." }));
    }
    setPrepLoading(null);
  };

  const periodCutoff = new Date(TODAY);
  periodCutoff.setDate(periodCutoff.getDate() + (period === "day" ? 1 : 7));
  const upcomingFiltered = UPCOMING_MEETINGS.filter(m => new Date(m.date) <= periodCutoff);

  const actionCutoff = new Date(TODAY);
  actionCutoff.setDate(actionCutoff.getDate() + (period === "day" ? 3 : 7));
  const actionItems = [
    ...Object.entries(SIGNAL_ACTIONS).flatMap(([sid, actions]) => {
      const signal = SIGNALS.find(s => s.id === parseInt(sid));
      if (!signal || !actions.due || new Date(actions.due) > actionCutoff) return [];
      return (actions.nextSteps || []).slice(0, 1).map((step, i) => ({
        id: `ns-${sid}-${i}`, category: "nextStep", title: step,
        company: signal.company, stage: signal.stage, type: signal.type,
        mentioned: signal.date, due: actions.due, signalId: parseInt(sid),
      }));
    }),
    ...PATTERN_ACTIONS.filter(pa => new Date(pa.due) <= actionCutoff).map(pa => ({
      id: `pat-${pa.id}`, category: "pattern", title: pa.recommendation,
      company: null, mentioned: "2026-05-16", due: pa.due, patternId: pa.id,
    })),
  ].sort((a, b) => new Date(a.due) - new Date(b.due));

  const catLabel = { nextStep: "Next Step", strategicRec: "Rec", pattern: "Pattern" };
  const catColor = { nextStep: T.amber, strategicRec: T.accent, pattern: T.purple };
  const catBg   = { nextStep: T.amberDim, strategicRec: T.accentDim, pattern: T.purpleDim };

  const CARD_W = 180;
  const CARD_H = 160;

  return (
    <div style={{ background: T.surface, borderRadius: T.r, border: `1px solid ${T.border}`, overflow: "hidden", marginBottom: "14px" }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: mobile ? "10px 12px" : "12px 16px", borderBottom: `1px solid ${T.borderSubtle}` }}>
        <span style={{ fontFamily: T.mono, fontSize: "11px", fontWeight: 600, color: T.text, textTransform: "uppercase", letterSpacing: "0.04em" }}>Daily Prep</span>
        <div style={{ display: "flex", gap: "4px" }}>
          {[["day", "Today"], ["week", "This Week"]].map(([p, label]) => (
            <button key={p} onClick={() => setPeriod(p)} style={{ padding: "3px 10px", borderRadius: "3px", border: `1px solid ${period === p ? T.border : T.borderSubtle}`, fontFamily: T.mono, fontSize: "10px", cursor: "pointer", background: period === p ? T.surfaceActive : "transparent", color: period === p ? T.text : T.textDim }}>{label}</button>
          ))}
        </div>
      </div>

      {/* MEETINGS ROW */}
      {upcomingFiltered.length > 0 && (
        <div style={{ borderBottom: expandedMeeting ? `1px solid ${T.borderSubtle}` : "none" }}>
          <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.text, textTransform: "uppercase", letterSpacing: "0.06em", padding: mobile ? "10px 12px 6px" : "12px 16px 6px" }}>Meetings · {upcomingFiltered.length}</div>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", padding: mobile ? "0 12px 12px" : "0 16px 14px" }}>
            {upcomingFiltered.map(meeting => {
              const isActive = expandedMeeting === meeting.id;
              return (
                <div key={meeting.id} onClick={() => setExpandedMeeting(isActive ? null : meeting.id)}
                  style={{ width: CARD_W, minWidth: CARD_W, height: CARD_H, flexShrink: 0, borderRadius: T.r, border: `1px solid ${isActive ? T.accent : T.borderSubtle}`, background: isActive ? T.surfaceActive : T.bg, cursor: "pointer", padding: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box" }}>
                  <div>
                    <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.amber, marginBottom: "6px", letterSpacing: "0.02em" }}>{meeting.time}</div>
                    <div style={{ fontFamily: T.sans, fontSize: "12px", fontWeight: 600, color: T.text, lineHeight: "1.35", marginBottom: "5px" }}
                      title={meeting.title}>
                      {meeting.title.length > 48 ? meeting.title.slice(0, 45) + "..." : meeting.title}
                    </div>
                    <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim, lineHeight: "1.3" }}>{meeting.attendees}</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    {meeting.vcRef
                      ? <span style={{ fontFamily: T.mono, fontSize: "9px", color: isActive ? T.accent : T.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "130px" }}>{meeting.vcRef}</span>
                      : <span />}
                    <span style={{ fontFamily: T.mono, fontSize: "10px", color: isActive ? T.accent : T.textDim }}>{isActive ? "\u25B2" : "\u25BC"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EXPANDED MEETING DETAIL */}
      {expandedMeeting && (() => {
        const meeting = UPCOMING_MEETINGS.find(m => m.id === expandedMeeting);
        if (!meeting) return null;
        const prep = meetingPreps[meeting.id];
        const relatedSignals = SIGNALS.filter(s => s.company === meeting.company || s.vcRef === meeting.vcRef);
        const vcData = VC_RELATIONSHIPS.find(v => v.firm === meeting.vcRef);
        const signalEntry = meeting.company ? Object.entries(SIGNAL_ACTIONS).find(([sid]) => SIGNALS.find(x => x.id === parseInt(sid))?.company === meeting.company) : null;
        const actions = signalEntry ? signalEntry[1] : null;
        return (
          <div style={{ padding: mobile ? "12px" : "14px 16px", borderBottom: actionItems.length > 0 ? `1px solid ${T.borderSubtle}` : "none" }}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
              {relatedSignals.length > 0 && (
                <div style={{ flex: "1 1 280px", padding: "10px 12px", background: T.bg, borderRadius: T.r, border: `1px solid ${T.borderSubtle}` }}>
                  <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "7px" }}>Relationship Context</div>
                  {relatedSignals.slice(0, 3).map(s => (
                    <div key={s.id} style={{ display: "flex", gap: "6px", marginBottom: "4px" }}>
                      <span style={{ color: T.accent, fontFamily: T.mono, fontSize: "10px", flexShrink: 0 }}>&#9656;</span>
                      <span style={{ fontFamily: T.sans, fontSize: "11px", color: T.textMuted, lineHeight: "1.4" }}>{s.signal}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ flex: "0 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {vcData && (
                  <div style={{ padding: "10px 12px", background: T.bg, borderRadius: T.r, border: `1px solid ${T.borderSubtle}` }}>
                    <FieldRow label="VC Tier" value={vcData.tier} color={TIER_COLORS[vcData.tier]} />
                    <FieldRow label="Contacts" value={vcData.contacts.join(", ")} />
                    <FieldRow label="Signals" value={`${vcData.signals} captured`} />
                    <FieldRow label="Deals" value={vcData.engagements > 0 ? `${vcData.engagements} attributed` : "None yet"} color={vcData.engagements > 0 ? T.green : T.textDim} />
                  </div>
                )}
                {actions?.nextSteps?.length > 0 && (
                  <div style={{ padding: "10px 12px", background: T.bg, borderRadius: T.r, border: `1px solid ${T.borderSubtle}` }}>
                    <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.amber, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Open To-Dos</div>
                    {actions.nextSteps.map((step, i) => (
                      <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "3px" }}>
                        <span style={{ color: T.amber, fontFamily: T.mono, fontSize: "10px", flexShrink: 0 }}>{">>"}</span>
                        <span style={{ fontFamily: T.sans, fontSize: "11px", color: T.textMuted }}>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {prep && (
              <div style={{ marginBottom: "10px", padding: "10px 12px", background: "rgba(79,140,255,0.04)", borderRadius: T.r, border: `1px solid ${T.accentDim}` }}>
                <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.accent, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>AI Prep Note</div>
                <p style={{ fontFamily: T.sans, fontSize: "12px", color: T.text, lineHeight: "1.6", margin: 0 }}>{prep}</p>
              </div>
            )}
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={() => generateMeetingPrep(meeting)} disabled={prepLoading === meeting.id} style={{ flex: 1, padding: "7px 12px", border: `1px solid ${T.accent}`, borderRadius: T.r, fontFamily: T.mono, fontSize: "10px", cursor: "pointer", background: T.accentDim, color: prepLoading === meeting.id ? T.textDim : T.accent, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {prepLoading === meeting.id ? "Generating..." : prep ? "Regenerate Prep" : "Generate Prep Note"}
              </button>
              <button onClick={() => onIntegrationOpen({ title: `Prep: ${meeting.title}`, type: "meeting", source: { name: meeting.attendees }, mentioned: meeting.date, due: meeting.date })} style={{ padding: "7px 14px", border: `1px solid ${T.border}`, borderRadius: T.r, fontFamily: T.mono, fontSize: "10px", cursor: "pointer", background: T.surfaceActive, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.04em" }}>CRM</button>
            </div>
          </div>
        );
      })()}

      {/* ACTION ITEMS ROW */}
      {actionItems.length > 0 && (
        <div>
          <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.text, textTransform: "uppercase", letterSpacing: "0.06em", padding: mobile ? "10px 12px 6px" : "12px 16px 6px" }}>Action Items · {actionItems.length} due</div>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", padding: mobile ? "0 12px 12px" : "0 16px 14px" }}>
            {actionItems.map(item => (
              <div key={item.id} style={{ width: CARD_W, minWidth: CARD_W, height: CARD_H - 20, flexShrink: 0, borderRadius: T.r, border: `1px solid ${T.borderSubtle}`, background: T.bg, padding: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box" }}>
                <div>
                  <div style={{ marginBottom: "6px" }}><Tag label={catLabel[item.category]} color={catColor[item.category]} bg={catBg[item.category]} /></div>
                  {item.company && <div style={{ fontFamily: T.sans, fontSize: "12px", fontWeight: 600, color: T.text, marginBottom: "4px" }}>{item.company}</div>}
                  <div style={{ fontFamily: T.sans, fontSize: "11px", color: T.textMuted, lineHeight: "1.35" }}>
                    {item.title.length > 70 ? item.title.slice(0, 67) + "..." : item.title}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  {item.due && <span style={{ fontFamily: T.mono, fontSize: "9px", color: T.amber }}>Due {item.due.slice(5)}</span>}
                  <button onClick={() => onIntegrationOpen({ title: item.title, type: item.category, source: { name: item.company || "Sonar" }, mentioned: item.mentioned, due: item.due })} style={{ padding: "2px 7px", border: `1px solid ${T.border}`, borderRadius: "3px", fontFamily: T.mono, fontSize: "9px", cursor: "pointer", background: T.surfaceActive, color: T.textDim, textTransform: "uppercase" }}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {upcomingFiltered.length === 0 && actionItems.length === 0 && (
        <div style={{ textAlign: "center", padding: "20px", fontFamily: T.mono, fontSize: "10px", color: T.textDim }}>No meetings or actions for this period</div>
      )}
    </div>
  );
};

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
          <Tooltip id="intake"><span style={{ fontFamily: T.mono, fontSize: "11px", fontWeight: 600, color: T.text, textTransform: "uppercase", letterSpacing: "0.04em" }}>Signal Intake</span></Tooltip>
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
const FieldRow = ({ label, value, color }) => (
  <div style={{ display: "flex", gap: "6px", marginBottom: "3px" }}>
    <span style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.06em", width: "80px", flexShrink: 0, paddingTop: "1px" }}>{label}</span>
    <span style={{ fontFamily: T.sans, fontSize: "11px", color: color || T.textMuted }}>{value}</span>
  </div>
);
const SignalCard = ({ s, expanded, onToggle, onSendToStrategy, mobile }) => {
  const actions = SIGNAL_ACTIONS[s.id] || {};
  return (
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
            <div style={{ marginTop: "12px" }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: "10px 12px", background: T.bg, borderRadius: T.r, border: `1px solid ${T.borderSubtle}`, marginBottom: "8px" }}>
                <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Signal Details</div>
                <FieldRow label="Source" value={s.source} />
                <FieldRow label="VC Ref" value={s.vcRef || "—"} color={s.vcRef ? T.accent : T.textDim} />
                <FieldRow label="Function" value={s.func} />
                <FieldRow label="Stage" value={s.stage} />
                <FieldRow label="Date" value={s.date} />
              </div>
              {s.enrichment && (
                <div style={{ padding: "10px 12px", background: T.bg, borderRadius: T.r, border: `1px solid ${T.borderSubtle}`, marginBottom: "8px" }}>
                  <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Enrichment <span style={{ color: T.accent }}>via Sutro</span></div>
                  <FieldRow label="Raised" value={s.enrichment.raised} color={T.green} />
                  <FieldRow label="Headcount" value={s.enrichment.headcount} />
                  <FieldRow label="Latest News" value={s.enrichment.news} />
                </div>
              )}
              {actions.nextSteps && (
                <div style={{ padding: "10px 12px", background: T.bg, borderRadius: T.r, border: `1px solid ${T.borderSubtle}`, marginBottom: "8px" }}>
                  <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.amber, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Next Steps from Call</div>
                  {actions.nextSteps.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: "6px", marginBottom: i < actions.nextSteps.length - 1 ? "5px" : 0 }}>
                      <span style={{ color: T.amber, fontFamily: T.mono, fontSize: "10px", flexShrink: 0 }}>{">>"}</span>
                      <span style={{ fontFamily: T.sans, fontSize: "12px", color: T.textMuted }}>{step}</span>
                    </div>
                  ))}
                </div>
              )}
              {actions.strategicRecs && (
                <div style={{ padding: "10px 12px", background: "rgba(79,140,255,0.04)", borderRadius: T.r, border: `1px solid ${T.accentDim}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.accent, textTransform: "uppercase", letterSpacing: "0.06em" }}>Strategic Next Steps</div>
                    {onSendToStrategy && <button onClick={e => { e.stopPropagation(); onSendToStrategy(s.id); }} style={{ padding: "3px 8px", border: `1px solid ${T.accent}`, borderRadius: "3px", fontFamily: T.mono, fontSize: "9px", cursor: "pointer", background: T.accentDim, color: T.accent, textTransform: "uppercase", letterSpacing: "0.04em" }}>+ Strategy</button>}
                  </div>
                  {actions.strategicRecs.map((rec, i) => (
                    <div key={i} style={{ display: "flex", gap: "6px", marginBottom: i < actions.strategicRecs.length - 1 ? "5px" : 0 }}>
                      <span style={{ color: T.accent, fontFamily: T.mono, fontSize: "10px", flexShrink: 0 }}>*</span>
                      <span style={{ fontFamily: T.sans, fontSize: "12px", color: T.textMuted }}>{rec}</span>
                    </div>
                  ))}
                  {actions.due && <div style={{ marginTop: "8px", fontFamily: T.mono, fontSize: "9px", color: T.textDim }}>Due: {actions.due}</div>}
                </div>
              )}
            </div>
          )}
        </div>
        <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim, whiteSpace: "nowrap", flexShrink: 0 }}>{s.date.slice(5)}</span>
      </div>
    </div>
  );
};

// ─── INTEGRATION MODAL ───
const INTEGRATION_APPS = [
  { name: "Notion", color: "#fff", bg: "#000", icon: "N" },
  { name: "Linear", color: "#fff", bg: "#5E6AD2", icon: "L" },
  { name: "Salesforce", color: "#fff", bg: "#00A1E0", icon: "SF" },
  { name: "HubSpot", color: "#fff", bg: "#FF7A59", icon: "HS" },
];
const IntegrationModal = ({ item, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [appMsg, setAppMsg] = useState(null);
  const text = `[${(item.type || "").replace(/_/g, " ").toUpperCase()}] ${item.title}\nSource: ${item.source?.name || ""}\nMentioned: ${item.mentioned || ""}\nDue: ${item.due || ""}`;
  const copy = () => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  return createPortal(
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }} onClick={onClose}>
      <div style={{ background: T.surface, borderRadius: T.r, border: `1px solid ${T.border}`, padding: "20px", width: "100%", maxWidth: "400px", boxShadow: T.shadow }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>Send to App</span>
          <span style={{ cursor: "pointer", color: T.textDim, fontSize: "18px", lineHeight: 1 }} onClick={onClose}>×</span>
        </div>
        <div style={{ padding: "10px 12px", background: T.bg, borderRadius: T.r, marginBottom: "14px", border: `1px solid ${T.borderSubtle}` }}>
          <div style={{ fontFamily: T.sans, fontSize: "12px", fontWeight: 600, color: T.text, marginBottom: "4px" }}>{item.title}</div>
          <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim }}>Source: {item.source?.name}</div>
          {item.due && <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.amber, marginTop: "2px" }}>Due: {item.due}</div>}
        </div>
        <button onClick={copy} style={{ width: "100%", padding: "9px", border: `1px solid ${T.border}`, borderRadius: T.r, fontFamily: T.mono, fontSize: "11px", cursor: "pointer", background: copied ? T.greenDim : T.surfaceActive, color: copied ? T.green : T.text, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {copied ? "Copied to clipboard ✓" : "Copy to clipboard"}
        </button>
        <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Direct integration</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {INTEGRATION_APPS.map(app => (
            <button key={app.name} onClick={() => setAppMsg(app.name)} style={{ padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: T.r, fontFamily: T.sans, fontSize: "12px", cursor: "pointer", background: appMsg === app.name ? T.surfaceActive : T.bg, color: appMsg === app.name ? T.textDim : T.text, display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "20px", height: "20px", borderRadius: "4px", background: appMsg === app.name ? T.border : app.bg, color: app.color, fontFamily: T.mono, fontSize: "9px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{app.icon}</span>
              {appMsg === app.name ? "OAuth required" : app.name}
            </button>
          ))}
        </div>
        {appMsg && <div style={{ marginTop: "10px", fontFamily: T.mono, fontSize: "9px", color: T.textDim, textAlign: "center" }}>OAuth setup required in production to connect {appMsg}</div>}
      </div>
    </div>,
    document.body
  );
};

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
  const [briefNarrative, setBriefNarrative] = useState(null);
  const [briefLoading, setBriefLoading] = useState(false);
  const [pinnedSignalIds, setPinnedSignalIds] = useState([]);
  const [integrationItem, setIntegrationItem] = useState(null);
  const [strategyPeriod, setStrategyPeriod] = useState("week");
  const handlePinSignal = (signalId) => setPinnedSignalIds(prev => prev.includes(signalId) ? prev : [...prev, signalId]);

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
          model: "claude-sonnet-4-6",
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

  const generateBrief = async () => {
    setBriefLoading(true);
    try {
      const briefSignals = SIGNALS.filter(s => filterByTime(s.date, "1m"));
      const typeBreakdown = Object.entries(
        briefSignals.reduce((acc, s) => ({ ...acc, [s.type]: (acc[s.type] || 0) + 1 }), {})
      ).map(([k, v]) => `${v} ${TYPE_LABELS_FULL[k]}`).join(", ");
      const topVCs = Object.entries(
        briefSignals.reduce((acc, s) => ({ ...acc, [s.vcRef]: (acc[s.vcRef] || 0) + 1 }), {})
      ).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k} (${v})`).join(", ");
      const trendingPatterns = PATTERNS.filter(p => p.trend === "up").map(p => p.theme).join("; ");

      const prompt = `BD performance this month:
Signals: ${briefSignals.length} captured across ${new Set(briefSignals.map(s => s.company)).size} companies. Breakdown: ${typeBreakdown}. Top VC sources: ${topVCs}.
VC pipeline: ${activeVCs} active relationships of ${VC_RELATIONSHIPS.length} tracked. ${VC_RELATIONSHIPS.filter(v => v.tier === "building").length} building. ${totalEngagements} commercial engagements attributed.
Trending patterns: ${trendingPatterns}.

Write a 3-sentence executive summary of this BD activity. Name specific companies, VCs, and numbers. Direct and analytical — no filler.`;

      const response = await fetch("/.netlify/functions/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 300,
          skipWebSearch: true,
          system: "You write concise executive BD briefs for a talent advisory firm. Be specific and direct.",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      if (data.content) {
        setBriefNarrative(data.content.filter(i => i.type === "text").map(i => i.text).join(""));
      } else {
        setBriefNarrative(`Error: ${data.error?.message || "No response."}`);
      }
    } catch (e) {
      setBriefNarrative("Failed to generate. Try again.");
    }
    setBriefLoading(false);
  };

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

      {/* NAV */}
      <div style={{ borderBottom: `1px solid ${T.borderSubtle}`, padding: `0 ${px}`, overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", height: "36px", alignItems: "center" }}>
          {[
            { label: "Daily Prep",  scrollId: "section-prep",    switchTab: null },
            { label: "Ask Sonar",   scrollId: "section-search",  switchTab: null },
            { label: "Signals",     scrollId: "section-signals", switchTab: "signals" },
            { label: "Patterns",    scrollId: "section-signals", switchTab: "patterns" },
            { label: "VCs",         scrollId: "section-signals", switchTab: "vcs" },
            { label: "Brief",       scrollId: "section-signals", switchTab: "brief" },
            { label: "Data Sync",   scrollId: "section-sync",    switchTab: null },
          ].map(({ label, scrollId, switchTab }) => (
            <button key={label}
              onClick={() => {
                if (switchTab) setTab(switchTab);
                setTimeout(() => document.getElementById(scrollId)?.scrollIntoView({ behavior: "smooth", block: "start" }), switchTab ? 50 : 0);
              }}
              style={{ padding: "0 14px", height: "36px", border: "none", background: "transparent", fontFamily: T.mono, fontSize: "10px", color: T.textDim, cursor: "pointer", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: `16px ${px}` }}>
        {/* DAILY PREP */}
        <div id="section-prep"><DailyPrepModule mobile={mobile} onIntegrationOpen={setIntegrationItem} /></div>

        {/* SEARCH */}
        <div id="section-search" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r, padding: mobile ? "16px" : "22px 24px", marginBottom: "20px" }}>
          <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Ask Sonar</div>
          <div style={{ display: "flex", gap: "8px", flexDirection: mobile ? "column" : "row" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder={mobile ? '"Who needs eng leadership right now?"' : 'Ask anything \u2014 "Which companies need eng leadership?" \u00b7 "What comp pressure is Andreessen surfacing?" \u00b7 "Where are the capability gaps?"'}
                style={{ width: "100%", padding: mobile ? "12px 14px" : "14px 16px", paddingRight: searchActive ? "36px" : "16px", background: T.bg, border: `1px solid ${searchActive ? T.accent : T.border}`, borderRadius: T.r, fontFamily: T.sans, fontSize: "14px", color: T.text, outline: "none", boxSizing: "border-box" }} />
              {searchActive && <span onClick={clearSearch} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontFamily: T.mono, fontSize: "14px", color: T.textDim, cursor: "pointer" }}>{"\u2715"}</span>}
            </div>
            <Tooltip id="askSonar">
              <button onClick={handleSearch} disabled={!searchQuery.trim()} style={{ padding: mobile ? "13px 20px" : "14px 28px", border: "none", borderRadius: T.r, fontFamily: T.mono, fontSize: "12px", fontWeight: 600, cursor: "pointer", background: T.accent, color: "#fff", whiteSpace: "nowrap", letterSpacing: "0.04em" }}>
                {searchLoading ? "Analyzing..." : "Ask Sonar"}
              </button>
            </Tooltip>
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
        <div id="section-signals" style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: mobile ? "8px" : "10px", marginBottom: "14px" }}>
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
            {[["signals", "Signals", "signals"], ["patterns", "Patterns", "patterns"], ["vcs", "VCs", "vcs"], ["brief", "Exec Brief", null]].map(([k, label, tip]) => {
              const btn = <button key={k} onClick={() => setTab(k)} style={{ padding: "7px 14px", borderRadius: "4px", border: `1px solid ${tab === k ? T.border : T.borderSubtle}`, fontFamily: T.mono, fontSize: "11px", cursor: "pointer", background: tab === k ? T.surfaceActive : "transparent", color: tab === k ? T.text : T.textDim, whiteSpace: "nowrap", flexShrink: 0 }}>{label}</button>;
              return tip ? <Tooltip key={k} id={tip}>{btn}</Tooltip> : <React.Fragment key={k}>{btn}</React.Fragment>;
            })}
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
                <SignalCard key={s.id} s={s} expanded={expandedSignal === s.id} onToggle={() => setExpandedSignal(expandedSignal === s.id ? null : s.id)} onSendToStrategy={handlePinSignal} mobile={mobile} />
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

        {/* BRIEF TAB */}
        {tab === "brief" && (() => {
          const briefSignals = SIGNALS.filter(s => filterByTime(s.date, "1m"));
          const typeItems = Object.entries(
            briefSignals.reduce((acc, s) => ({ ...acc, [s.type]: (acc[s.type] || 0) + 1 }), {})
          ).map(([k, v]) => ({ label: TYPE_LABELS_FULL[k], value: v, color: TYPE_COLORS[k] })).sort((a, b) => b.value - a.value);
          const funcItems = Object.entries(
            briefSignals.reduce((acc, s) => ({ ...acc, [s.func]: (acc[s.func] || 0) + 1 }), {})
          ).map(([k, v]) => ({ label: k, value: v, color: T.accent })).sort((a, b) => b.value - a.value);
          const vcItems = [
            { label: "Active", value: VC_RELATIONSHIPS.filter(v => v.tier === "active").length, color: T.green },
            { label: "Building", value: VC_RELATIONSHIPS.filter(v => v.tier === "building").length, color: T.amber },
            { label: "Prospect", value: VC_RELATIONSHIPS.filter(v => v.tier === "prospect").length, color: T.textDim },
          ];
          const OKRs = [
            { label: "Active VC Relationships", current: activeVCs, target: 15, color: T.accent },
            { label: "Signals This Month", current: briefSignals.length, target: 20, color: T.green },
            { label: "Commercial Engagements", current: totalEngagements, target: 8, color: T.purple },
            { label: "Patterns Identified", current: PATTERNS.length, target: 6, color: T.amber },
          ];
          return (
            <div id="brief-content">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Executive Brief</div>
                  <div style={{ fontFamily: T.sans, fontSize: "22px", fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>May 2026</div>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button onClick={generateBrief} disabled={briefLoading} style={{ padding: "8px 14px", border: `1px solid ${T.border}`, borderRadius: T.r, fontFamily: T.mono, fontSize: "10px", cursor: "pointer", background: T.surface, color: briefLoading ? T.textDim : T.text, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {briefLoading ? "Generating..." : briefNarrative ? "Regenerate" : "Generate Narrative"}
                  </button>
                  <button onClick={() => window.print()} style={{ padding: "8px 14px", border: "none", borderRadius: T.r, fontFamily: T.mono, fontSize: "10px", cursor: "pointer", background: T.accent, color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Export PDF
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: "10px", marginBottom: "14px" }}>
                {[
                  { label: "Signals This Month", value: briefSignals.length, sub: `${new Set(briefSignals.map(s => s.company)).size} companies` },
                  { label: "Active VCs", value: activeVCs, sub: `of ${VC_RELATIONSHIPS.length} tracked` },
                  { label: "Engagements", value: totalEngagements, sub: "attributed to BD" },
                  { label: "Patterns", value: PATTERNS.length, sub: `${PATTERNS.filter(p => p.trend === "up").length} trending up` },
                ].map(({ label, value, sub }) => (
                  <div key={label} style={{ padding: "12px 14px", background: T.surface, borderRadius: T.r, border: `1px solid ${T.borderSubtle}` }}>
                    <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{label}</div>
                    <div style={{ fontFamily: T.mono, fontSize: "24px", fontWeight: 700, color: T.text, marginBottom: "2px" }}>{value}</div>
                    <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textMuted }}>{sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: "14px", padding: "14px 16px", background: T.surface, borderRadius: T.r, border: `1px solid ${briefNarrative ? T.accent : T.borderSubtle}` }}>
                <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>Executive Summary</div>
                {briefNarrative
                  ? <p style={{ fontFamily: T.sans, fontSize: "13px", color: T.text, lineHeight: "1.7", margin: 0 }}>{briefNarrative}</p>
                  : <p style={{ fontFamily: T.sans, fontSize: "13px", color: T.textDim, lineHeight: "1.7", margin: 0, fontStyle: "italic" }}>Hit "Generate Narrative" to produce a Claude-written executive summary from this month's signal data.</p>
                }
              </div>

              <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                <div style={{ padding: "14px 16px", background: T.surface, borderRadius: T.r, border: `1px solid ${T.borderSubtle}` }}>
                  <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>Signal Cadence · Last 8 Weeks</div>
                  <WeeklyBars signals={SIGNALS} />
                </div>
                <div style={{ padding: "14px 16px", background: T.surface, borderRadius: T.r, border: `1px solid ${T.borderSubtle}` }}>
                  <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>By Signal Type</div>
                  <BarChart items={typeItems} maxVal={Math.max(...typeItems.map(i => i.value), 1)} />
                </div>
                <div style={{ padding: "14px 16px", background: T.surface, borderRadius: T.r, border: `1px solid ${T.borderSubtle}` }}>
                  <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>By Function</div>
                  <BarChart items={funcItems} maxVal={Math.max(...funcItems.map(i => i.value), 1)} />
                </div>
                <div style={{ padding: "14px 16px", background: T.surface, borderRadius: T.r, border: `1px solid ${T.borderSubtle}` }}>
                  <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>VC Pipeline</div>
                  <BarChart items={vcItems} maxVal={Math.max(...vcItems.map(i => i.value), 1)} />
                </div>
              </div>

              <div style={{ padding: "14px 16px", background: T.surface, borderRadius: T.r, border: `1px solid ${T.borderSubtle}` }}>
                <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>OKR Progress</div>
                <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: "16px" }}>
                  {OKRs.map(({ label, current, target, color }) => (
                    <div key={label}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
                        <span style={{ fontFamily: T.sans, fontSize: "12px", color: T.textMuted }}>{label}</span>
                        <span style={{ fontFamily: T.mono, fontSize: "12px", fontWeight: 700, color }}>{current}<span style={{ color: T.textDim, fontWeight: 400 }}>/{target}</span></span>
                      </div>
                      <div style={{ height: "6px", background: T.bg, borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ width: `${Math.min((current / target) * 100, 100)}%`, height: "100%", background: color, borderRadius: "3px", transition: "width 0.6s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}


        {/* VCs TAB */}
        {tab === "vcs" && (
          <div id="section-vcs">
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

        {/* DATA SYNC */}
        <div id="section-sync" style={{ marginTop: "24px", borderTop: `1px solid ${T.borderSubtle}`, paddingTop: "20px" }}>
          <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>Data Sync</div>
          <IntakeModule mobile={mobile} />
        </div>
      </div>
      {integrationItem && <IntegrationModal item={integrationItem} onClose={() => setIntegrationItem(null)} />}
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
