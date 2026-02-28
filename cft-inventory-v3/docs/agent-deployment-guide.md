# 🎖️ Craftech360 AI Agent Deployment Guide

**For:** Suman (HR Lead)  
**From:** Captain  
**Date:** 19 Feb 2026

---

## 📋 Overview

We're setting up an AI-powered project coordination system. Here's what it does:

1. **BD posts project confirmation** in WhatsApp → **Captain automatically captures it**
2. **Captain creates project in Notion** with all details
3. **Captain notifies relevant departments** based on products needed
4. **Daily pre-standup:** Captain sends reminder of upcoming tasks
5. **Post-standup:** Captain pulls Fireflies transcript → updates Notion

---

## 🚀 Step-by-Step Implementation

### Phase 1: Create WhatsApp Groups (Day 1)

#### Step 1.1: Create these 5 new groups

| # | Group Name | Description |
|---|------------|-------------|
| 1 | **CFT Project Confirmations** | BD posts confirmed projects here |
| 2 | **CFT Engineering** | Software + Embedded team coordination |
| 3 | **CFT Creative Hub** | Creative + SMM + Video coordination |
| 4 | **CFT Operations** | Ops + Inventory + Logistics |
| 5 | **CFT BD Team** | Sales pipeline & follow-ups |

#### Step 1.2: Add members to each group

**1. CFT Project Confirmations**
```
Admin: Suman
Members:
- Snehal (BD Lead)
- Avijit
- Nishkal
- Akshay
- Amruta
- Shivkumara (PM)
- Captain (will be added by Ravi - +917338042505)
```

**2. CFT Engineering**
```
Admin: Suman
Members:
- Software: Chetan, Harsh, Kotresh, Karthikeya, Rahul, Yamuna
- Embedded: Naveen, Shashank, Pratik
- R&D: David, Darshan
- Captain (will be added by Ravi)
```

**3. CFT Creative Hub**
```
Admin: Suman
Members:
- Akash (Video)
- Divyashree (Graphics)
- Manjunath (3D)
- Nikita (SMM Lead)
- Sinchana (SMM)
- Siva (UI/UX)
- Abhijith (UI/UX)
- Captain (will be added by Ravi)
```

**4. CFT Operations**
```
Admin: Suman
Members:
- Shivraj (Ops Lead)
- Shivkumara (PM)
- Thippeswamy
- Varuna
- Suma NC (Accounts)
- Captain (will be added by Ravi)
```

**5. CFT BD Team**
```
Admin: Suman
Members:
- Snehal (Lead)
- Avijit
- Nishkal
- Akshay
- Amruta
- Captain (will be added by Ravi)
```

#### Step 1.3: Group Settings
- Set group description to explain purpose
- Enable "Only admins can change group info"
- Add group icon (optional but nice)

---

### Phase 2: Share BD Message Format (Day 1-2)

#### Step 2.1: Send this to Snehal and BD team

Message to send:
```
Hi Team,

We're implementing a new project coordination system. When a project is confirmed, please post in "CFT Project Confirmations" group using this format:

━━━━━━━━━━━━━━━━━━━━━━━━

🎯 PROJECT CONFIRMED

📋 Event: [Event Name]
🏢 Client: [Agency/Direct Client]
📍 Location: [Venue, City]

📦 Products:
- [Product 1] - [Quantity]
- [Product 2] - [Quantity]

📅 Dates:
- Setup: [Date]
- Event: [Date(s)]

💰 Costing: [Confirmed/Pending]
📝 Special Notes: [Any specific requirements]

@PM please add to Notion

━━━━━━━━━━━━━━━━━━━━━━━━

Example:

🎯 PROJECT CONFIRMED

📋 Event: Air Cargo Summit
🏢 Client: ARC Worldwide
📍 Location: Jio Centre, Mumbai

📦 Products:
- DNA Display - 1 unit
- AI Photobooth - 2 units

📅 Dates:
- Setup: 24th Feb '26
- Event: 25th - 27th Feb '26

💰 Costing: Confirmed
📝 Special Notes: Client wants custom branding on DNA

@PM please add to Notion

━━━━━━━━━━━━━━━━━━━━━━━━

This helps Captain (our AI assistant) automatically:
✅ Create project in Notion
✅ Notify relevant teams (Engineering, Ops, Creative)
✅ Track deadlines and follow-ups

Please follow this format strictly for best results!
```

#### Step 2.2: Pin the format message in CFT Project Confirmations group

---

### Phase 3: Add Captain to Groups (Day 2)

**Ravi will add Captain to all groups using WhatsApp number: +917338042505**

After adding, Captain will send a confirmation message in each group.

---

### Phase 4: Test the System (Day 2-3)

#### Test 1: Project Capture Test

1. Ask Snehal (or anyone from BD) to post a **test project** in CFT Project Confirmations:

```
🎯 PROJECT CONFIRMED

📋 Event: TEST EVENT - Please Ignore
🏢 Client: Test Agency
📍 Location: Test Location, Bangalore

📦 Products:
- AI Photobooth - 1 unit

📅 Dates:
- Setup: 28th Feb '26
- Event: 1st Mar '26

💰 Costing: Confirmed
📝 Special Notes: This is a test

@PM please add to Notion
```

2. **Expected Result:**
   - Captain acknowledges the message
   - Captain creates project in Notion
   - Captain sends notification to CFT Engineering (AI Photobooth = Software)
   - Captain sends notification to CFT Operations
   - Captain sends notification to CFT Creative Hub

3. **Verify in Notion:**
   - Check https://www.notion.so/craftech360/3f1a5849c8f345d6b6beb6240cb8d580
   - Look for "TEST EVENT" project
   - Verify all fields are populated

#### Test 2: Department Notification Test

Check that these groups received notifications:
- [ ] CFT Engineering - received message about AI Photobooth
- [ ] CFT Operations - received message about inventory/travel
- [ ] CFT Creative Hub - received message about content planning

#### Test 3: Response Test

In CFT Project Confirmations, type:
```
@Captain what projects are coming up this week?
```

Captain should respond with upcoming projects from Notion.

---

### Phase 5: Standup Integration (Day 3-4)

#### Step 5.1: Confirm standup time

Tell Captain the daily standup time. Example:
```
Captain, our daily standup is at 10:30 AM IST
```

#### Step 5.2: Test pre-standup report

Captain will send a report 30 minutes before standup to CFT Project Confirmations showing:
- Upcoming events in next 7 days
- Tasks due today
- Blockers/gaps (missing travel booking, DC not created, etc.)

#### Step 5.3: Fireflies Integration

After standup:
1. Fireflies records the meeting (as usual)
2. Captain pulls the transcript (~15 min after meeting ends)
3. Captain extracts action items
4. Captain updates Notion
5. Captain sends MoM summary to CFT Project Confirmations

---

### Phase 6: Go Live (Day 5)

Once testing is successful:

1. **Announce to all teams:**
```
Hi Team,

We've implemented a new AI-powered project coordination system!

📥 BD: Post confirmed projects in "CFT Project Confirmations" using the pinned format
📋 All: Captain will notify your department group when there's work for you
📅 Daily: Captain sends pre-standup prep report at [TIME - 30 min]
📝 After standup: Captain updates Notion with action items

Questions? Ask in your department group or ping Suman.
```

2. **Monitor for first week:**
   - Watch for any parsing errors
   - Collect feedback from teams
   - Report issues to Ravi

---

## 🔧 Troubleshooting

### Captain doesn't respond
- Check if Captain is in the group (look for +917338042505)
- Try mentioning: @Captain or Captain:
- Wait 30 seconds and try again

### Project not created in Notion
- Check if BD message followed the format exactly
- Ask Captain: "Captain, did you capture the last project?"
- Manually check Notion for the project

### Wrong department notified
- This can happen initially as Captain learns
- Correct Captain: "Captain, this project needs Embedded team not Software"
- Captain will learn and improve

### Standup report not sent
- Check if standup time was set correctly
- Ask Captain: "Captain, what time is standup set for?"
- Reset if needed: "Captain, set standup time to 10:30 AM IST"

---

## 📞 Support Contacts

| Issue | Contact |
|-------|---------|
| Captain not working | Ravi |
| Group admin issues | Suman |
| Notion access | Ravi |
| BD format questions | Snehal |

---

## 📊 Visual Reference

See the complete flow visualization at:
**https://craftech360-hr.netlify.app/project-flow.html**

Password: ravi381381

---

## ✅ Implementation Checklist

### Day 1
- [ ] Create CFT Project Confirmations group
- [ ] Create CFT Engineering group
- [ ] Create CFT Creative Hub group
- [ ] Create CFT Operations group
- [ ] Create CFT BD Team group
- [ ] Add all members to respective groups
- [ ] Send BD format to Snehal

### Day 2
- [ ] Ravi adds Captain to all 5 groups
- [ ] Pin BD format in CFT Project Confirmations
- [ ] Captain sends intro message in each group

### Day 3
- [ ] Run Test 1: Project Capture
- [ ] Run Test 2: Department Notification
- [ ] Run Test 3: Response Test
- [ ] Fix any issues found

### Day 4
- [ ] Set standup time with Captain
- [ ] Test pre-standup report
- [ ] Test Fireflies integration (after one standup)

### Day 5
- [ ] Send Go Live announcement
- [ ] Monitor and collect feedback

---

*Guide created by Captain 🎖️ | Questions? Ask in My Squad group*
