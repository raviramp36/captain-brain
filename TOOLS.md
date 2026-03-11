# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## Craftech360 Integrations

### Google Workspace (gog CLI)
- Account: accounts@craftech360.com
- Services: gmail, calendar, drive, contacts, docs, sheets
- Keyring Password: craftech360
- Usage: `export GOG_KEYRING_PASSWORD=craftech360 GOG_ACCOUNT=accounts@craftech360.com`

### Google Drive Backup (Captain Craftech folder)
- **Main Folder:** https://drive.google.com/drive/folders/1B-A_olBPz4Hd5qjmDlb8Ff8ZCib6-lTz
- **Folder ID:** 1B-A_olBPz4Hd5qjmDlb8Ff8ZCib6-lTz
- **Subfolders:**
  - Memory: 1FIktq8_eU0Ic-GhDfFNOeDgIpoNX28Y4
  - Departments: 19fpEHJG8XBoy8BHVZDWkrCG979usyqCw
  - Workflows: 1Tzp24BTiQPdPI8vlrQVx46fBmJoIv3wR
  - Config: 1rL9L8C31f-COdvH2G16J-sAba-Q0k3vc
  - Inventory Manager: 1RmPnNRh3tCO7TQ-Nv1mauNxltf7O6re5

### Notion (Read-Only)
- Integration Token: [REDACTED - stored in auth-profiles.json]
- API Version: 2022-06-28
- Mode: READ-ONLY reconnaissance — no changes without Ravi's approval

### Netlify (Deployments)
- Account: Ravi's Gmail
- Token: [REDACTED - stored in auth-profiles.json]
- Sites: craftech360-hr.netlify.app (HR Dashboard)

### eTimeOffice (Attendance System)
- Platform: Bio-Park D01 / Team Office
- Dashboard: https://www.etimeoffice.com
- API Base: https://api.etimeoffice.com/api/
- Corporate ID: CRAFTECH360
- Username: CRAFTECH360
- Password: [REDACTED]

### Mac Mini (Singe's)
- Tailscale: singes-mac-mini (100.102.96.57)
- SSH User: singe
- SSH Password: ravi381381
- OpenClaw path: /Users/singe/.npm-global/bin/openclaw
- Workspace: /Users/Shared/clawd/agents/singe
- Agent name: Singe

---

## Audio Transcription (Whisper)
- **Tool:** OpenAI Whisper (base model)
- **Command:** `whisper <audio_file> --model base --language en --output_format txt`
- **Installed:** 2026-02-18
- Works with voice notes (.ogg, .mp3, .wav, etc.)

### Fireflies.ai (Meeting Notes)
- **URL:** https://fireflies.ai
- **Email:** Captain@craftech360.com
- **Password:** Craf!Tech_360#Mail9
- **API Key:** feb648e9-cefe-480f-b881-1997a2788b9c
- **API Endpoint:** https://api.fireflies.ai/graphql
- **Purpose:** Record meetings, generate summaries & action items
- **Created:** 2026-02-18
- **Status:** ✅ Connected & Working

### Notion Meeting Notes
- **Page:** Captain Meeting Notes
- **Page ID:** 30b1f24c-adb6-818d-af1f-d0a7b1c9c586
- **URL:** https://www.notion.so/Captain-Meeting-Notes-30b1f24cadb6818daf1fd0a7b1c9c586
- **Purpose:** Store all meeting MoMs with title + date headings

---

## Captain's VPS (Self - for Singe's reference)
- **Tailscale IP:** 100.115.115.89
- **SSH User:** root
- **SSH Password:** 1J(bz11qEEwqC'5aw0l6
- **OpenClaw path:** /root/.openclaw
- **Workspace:** /root/.openclaw/workspace
- **Gateway port:** 18789

### ⚠️ Config Landmines (NEVER change these!)
Learned the hard way on 2026-02-19:
1. `gateway.mode` → must be `"local"` (not "remote")
2. `plugins.entries.whatsapp.enabled` → must be `true`
3. `gateway.bind` → must be `"loopback"` (not "localhost")
4. **Swap space** → at least 2GB (OOM killer will murder DMs otherwise!)
5. **Device scopes** → must include `operator.write` for message tool (OpenClaw bug #22574)

**Startup check:**
```bash
# Config check
jq '{mode: .gateway.mode, bind: .gateway.bind, wa: .plugins.entries.whatsapp.enabled}' ~/.openclaw/openclaw.json
# Should return: {"mode": "local", "bind": "loopback", "wa": true}

# Swap check
free -h | grep -i swap
# Should show at least 2GB swap

# Device scope check (must have operator.write)
jq '.[].scopes' ~/.openclaw/devices/paired.json
# Should include "operator.write" for message tool to work
```

---

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
