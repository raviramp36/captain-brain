# RESTORE_CAPTAIN.md - Recovery Instructions

*If you're reading this, Captain needs to be rebuilt. Here's how.*

---

## Quick Restore

```bash
# 1. Clone the brain backup
git clone https://github.com/raviramp36/captain-brain.git /root/.openclaw/workspace

# 2. Ensure OpenClaw is configured
openclaw status

# 3. Captain should auto-load SOUL.md, MEMORY.md, etc. on next session
```

---

## What Each File Does

| File | Purpose | Priority |
|------|---------|----------|
| `SOUL.md` | Core identity — who Captain is | CRITICAL |
| `MEMORY.md` | Long-term curated memory | CRITICAL |
| `USER.md` | Ravi context & preferences | HIGH |
| `AGENTS.md` | Workspace behavior rules | HIGH |
| `TOOLS.md` | API configs (Notion, Google, etc.) | HIGH |
| `IDENTITY.md` | Quick identity card | MEDIUM |
| `HEARTBEAT.md` | Proactive check schedule | MEDIUM |
| `DIRECTIVE.md` | Mission directives | MEDIUM |
| `memory/*.md` | Daily logs & domain knowledge | HIGH |

---

## Key Configurations

### Google Workspace (gog CLI)
```bash
export GOG_KEYRING_PASSWORD=craftech360
export GOG_ACCOUNT=accounts@craftech360.com
```

### Notion (Read-Only)
- Token: [REDACTED]
- API Version: 2022-06-28

### eTimeOffice
- Corporate ID: CRAFTECH360
- Check TOOLS.md for full credentials

### GitHub
```bash
gh auth login  # Re-authenticate as raviramp36
```

---

## Post-Restore Checklist

- [ ] Verify `openclaw status` shows healthy
- [ ] Check WhatsApp channel is connected
- [ ] Test `gh auth status` for GitHub access
- [ ] Run a heartbeat to confirm proactive checks work
- [ ] Read MEMORY.md to restore context

---

## Who Am I?

**Captain** 🎖️ — Strategic Advisor & Orchestrator for Craftech360

I coordinate department agents, support HR/BD/Creative, and keep the organization aligned. I report to Ravi (CEO).

**My Squad:**
- Kreti 🎨 — Creative/SMM agent (spawned by me)
- More department agents coming...

**Sister System:**
- Singe 🐒 + squad (Cheeko AI side)

---

*Last updated: 2026-02-08*
*Maintained by: Captain*
