# Craftech360 AI Implementation Plan

*Document created: 2026-02-18*
*Source: Voice notes from Ravi*

---

## Company Overview

**Craftech360** — Experiential technology company creating immersive worlds at the intersection of Design, Gaming, and AI.

- **Team Size:** ~30 people
- **Working Days:** Mon-Sat (Sundays off)
- **Strategic Direction:** Kinetic Installations as core focus

---

## Current Departments & People

### Leadership (4)
- RaviKumar — Founder & CEO
- Shrishail Pattar — Co-Founder & MD
- Abilash S — Co-Founder & CTO
- Pradeep Zille — Co-Founder & CBO

### Software (5)
- Chetan, Harsh, Kotresh, Karthikeya, Rahul, Yamuna

### Embedded (3)
- Naveen, Shashank, Pratik

### Creative (6)
- Akash (Video), Divyashree (Graphics), Manjunath (3D), Nikhitha (SMM), Siva (UI/UX), Abhijith (UI/UX)

### Business Development (5)
- Snehal (Lead), Avijit, Nishkal, Akshay, Amruta

### Operations (4)
- Shivraj (Lead), Shivkumara (PM), Thippeswamy, Varuna

### HR & Admin (2)
- Suman (HR), Suma NC (Accounts)

### Contractors (2)
- Praveen, Roopa

### Interns (4)
- David (Touch Designer), Darshan (Mechanical), Abhishek, Sinchana

---

## Project Workflow

### Lead Entry (2 Paths)
1. **Inbound (most common):** Client calls with specific needs (photobooth, Aurora, Nebula, etc.)
2. **Discovery:** Client has event idea but needs recommendations → BD creates pitch

### Flow
```
Lead → BD (client comms throughout)
         ↓
    Confirmation + Costing
         ↓
   ┌─────┼─────┬─────────┐
   ↓     ↓     ↓         ↓
Accounts Creative Software Embedded
 (PI)      ↓       ↓         ↓
          └───────┴─────────┘
                  ↓ (PARALLEL)
          PM (Shivkumara) + Software
             Integration Test + KT
                  ↓
          Execution (Ops on-site)
                  ↓
          DC out → Event → DC check
                  ↓
          Video → SMM (post-event)
```

### Key Roles in Flow
| Function | Person | Responsibilities |
|----------|--------|------------------|
| PM | Shivkumara (Shivan) | Inventory blocking, logistics, travel/hotels, integration test |
| Ops Lead | Shivraj | On-site execution, DC management |
| Inventory | Currently Ops | *Hiring dedicated role* |
| Accounts | Suma NC | PI, payment follow-up, vendor payments |
| Client Comms | BD team (Snehal) | Throughout project lifecycle |

---

## R&D / Kinetic Installations Track

**Runs parallel to events — same resources, dual focus**

### Focus Areas
- Kinetic installations (motors, mechanical design, displays)
- Touch Designer / Unity for control
- Leadshine motors, DMX motors

### Core R&D Team
| Person | Role |
|--------|------|
| Ravi | Ideator (decides what to build) |
| Pattar | Execution & Design lead |
| Shivraja + Navin | Leading kinetic installations |
| Darshan | Mechanical design |
| Manjunath | 3D renders |
| David | Touch Designer (visuals, patches) |
| Harsh | Unity motor control software |

---

## Pain Points (To Solve)

### 1. BD — No Tracking & Follow-up Issues
- Don't update what they do regularly
- Payment follow-up commitments not tracked
- Things promised but not delivered

### 2. Operations/PM — Travel & Logistics
- No tracking of hotels → miss early booking discounts
- No tracking of flights → end up paying higher costs
- Unorganized planning

### 3. Accounts ↔ Ops ↔ Vendors — Communication Gap
- No proper communication channel
- Vendor payments always delayed
- No visibility into what's pending

### 4. R&D — Underutilized Resources
- Experiments planned but forgotten due to event rush
- David could do 100 experiments but has no clear backlog
- No guidance on what to work on next
- No self-serve task list

### 5. General — Accountability
- No system for tracking commitments
- Things fall through the cracks
- No continuous improvement loop

---

## Implementation Approach

### Option: Department-wise vs People-wise
- Can implement AI agents by department OR by individual
- Need to decide which is more effective

### Proposed Agent Architecture

| Agent | Role | Solves |
|-------|------|--------|
| 🎖️ **Captain** | CEO Advisor / Orchestrator | Cross-dept coordination, strategic oversight |
| ⚡ **Spark** | BD Lead | Follow-ups, payment tracking, client pipeline |
| 🎨 **Kreti** | CMO (Creative/SMM) | Content calendar, post-event marketing |
| 💻 **Dev** (proposed) | Engineering Lead | Software + Embedded coordination |
| ⚙️ **Ops** (proposed) | Operations Lead | PM, logistics, travel, inventory |

### Systems to Build

1. **Event Pipeline Tracker**
   - Project status board
   - Automated handoff triggers
   - Follow-up reminders

2. **R&D / Experiment Backlog**
   - Self-serve task list
   - People can pick up and track progress
   - Weekly nudges on stale items

3. **Travel & Logistics Tracker**
   - Flight/hotel booking tracker
   - Early booking alerts
   - Cost optimization

4. **Vendor Payment Tracker**
   - Accounts ↔ Ops visibility
   - Payment due dates
   - Automated reminders

5. **EOD/Update System**
   - Daily updates from key roles
   - Accountability tracking

---

## Next Steps

1. ✅ Document completed (this file)
2. 🔄 Update HTML visualization with full picture
3. 📋 Create detailed plan of action
4. 🚀 Phased rollout

---

*This document will be updated as we learn more and implement.*
