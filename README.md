# Sonar by Riviera

Sonar captures market intelligence from BD conversations and makes it searchable. Every founder meeting, every VC talent partner sync, every board advisor call generates signal — who's hiring, how orgs are changing, where comp is moving, what capability gaps are showing up. Right now that signal lives in someone's head or in scattered meeting notes. Sonar structures it, enriches it with external data, and lets you query it in plain English.

---

## What it does

**Signal Intake.** Connect Granola, Otter.ai, Fathom, Fireflies, Avoma, or Read.ai and set meetings to autosync — signals get captured without manual action. Or paste raw meeting notes and Claude extracts the structured signal. Or drop a photo of handwritten notes and it OCRs them. Recent calendar meetings surface automatically as one-click sync targets.

**Signal Feed.** A filterable feed of signals tagged by company, stage, function, and type (Hiring Trigger, Org Pattern, Comp Shift, Capability Gap). Each signal expands to show source, VC reference, and enrichment data from the same sources that power Sutro — Crunchbase, LinkedIn, news.

**Pattern Detection.** Aggregated view of recurring themes. "5 Series A/B companies asked about player-coach eng leaders this month." That's not just a BD note — it's a Paragon product signal and a firm-wide intelligence input. A monthly brief summarizes the top patterns for distribution to the search practice and advisory team.

**Ask Sonar.** Natural language search running against the full signal database via Claude. "Which companies need eng leadership right now?" "What's Paradigm surfacing?" "Where is comp moving at Series B?" Returns a synthesized answer with the specific signals and patterns it drew from.

**VC Relationship Tracker.** Active, building, and prospect VC relationships with signal counts, commercial engagement attribution, and a progress bar toward the 12-month target of 15+ active relationships.

---

## Why it matters for the role

The Riviera JD has five core functions. Sonar maps to all of them.

**Ecosystem development and consultative engagement.** Conversations are the raw material. Sonar is what turns them into institutional knowledge instead of letting them disappear.

**Commercial conversion from relationships.** The VC Relationships tab tracks attribution from relationship to engagement. The JD asks for this explicitly. Sonar is where it lives.

**Market intelligence and pattern flagging.** The JD asks someone to "flag emerging hiring patterns, compensation shifts, and organizational model changes." The Patterns view and Ask Sonar do this automatically from the signals you're already capturing.

**Early-stage practice design.** The aggregate signal data answers the question Riviera doesn't have a clean answer to yet: what does the seed-to-Series C market actually need? Sonar builds that answer over time.

**12-month success metrics.** The VC tracker, signal counts by time period, and engagement attribution all map to the JD's specific metrics. The numbers are in the tool, not in a spreadsheet.

---

## Why it matters for Riviera beyond the role

Riviera has Sutro for candidate intelligence and Paragon for technical talent at scale. Neither captures what happens before a search engagement begins — the conversations with founders who aren't ready to hire yet, the VC talent partners sharing portfolio patterns, the board advisors flagging org design shifts.

That's where Sonar sits.

The signal dataset is proprietary. Nobody else is capturing early-stage ecosystem conversations at this level of structure. Six months in, Riviera has data on what the market needs before it formalizes into a search mandate. Competitors don't.

Paragon gets a product intelligence feed. The player-coach demand pattern, the comp repricing at Series B, the design leadership vacuum in infra companies — these aren't just BD insights. They tell Paragon what archetypes to build candidate pools around and what to market proactively to portfolio companies.

One person's BD activity becomes firm-wide market awareness. The search practice, advisory team, and Paragon all work from the same intelligence, structured and distributed through a monthly brief.

---

## Stack

React 18 + Vite, Claude Sonnet via Netlify Functions proxy, Netlify hosting. No database — signal data is hardcoded for demo purposes. Production would connect to a backend (Supabase or Airtable) and to notetaker APIs via OAuth.
