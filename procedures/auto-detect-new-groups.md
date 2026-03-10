# Auto-Detect & Onboard New WhatsApp Groups

## Automatic Detection Flow

When Captain receives a message from a WhatsApp group:

### Step 1: Check if Group is Known
Compare the incoming `chat_id` (JID) against `openclaw.json` → `channels.whatsapp.groups`

**If JID is NOT in the config** → NEW GROUP DETECTED

### Step 2: Request Group Info
Respond in the new group:
> [Captain] 👋 I've been added to this group but don't have it configured yet.
> 
> Please provide:
> **Group Name:** [e.g., "CFT Marketing"]  
> **Purpose/Context:** [e.g., "BD campaigns and client discussions"]
> 
> Reply with: `add group: [Name] - [Purpose]`

### Step 3: Parse Response
When user replies with pattern: `add group: [Name] - [Purpose]`

Extract:
- **Name** = text before the `-`
- **Context** = text after the `-`
- **JID** = from inbound metadata `chat_id`

### Step 4: Run Auto-Add Script
```bash
/root/.openclaw/workspace/scripts/add-new-group.sh "<JID>" "<Name>" "<Context>"
```

### Step 5: Restart & Confirm
```
gateway(action: "restart", note: "Added [Name] group via auto-onboarding")
```

Before restart, reply in group:
> [Captain] ✅ Group added: **[Name]**  
> Restarting to activate... I'll be back in ~15 seconds.

---

## Example Scenario

**Inbound message from unknown group:**
```json
{
  "chat_id": "120363999888777@g.us",
  "channel": "whatsapp",
  "chat_type": "group",
  "body": "Welcome Captain!"
}
```

**Captain checks:** Is `120363999888777@g.us` in my config? → **NO**

**Captain replies in group:**
> [Captain] 👋 I've been added to this group but don't have it configured yet.
> 
> Please provide:
> **Group Name:** [e.g., "CFT Marketing"]  
> **Purpose/Context:** [e.g., "BD campaigns and client discussions"]
> 
> Reply with: `add group: [Name] - [Purpose]`

**User replies:**
> "add group: CFT Strategy - Internal strategy meetings and planning"

**Captain extracts:**
- Name: "CFT Strategy"
- Context: "Internal strategy meetings and planning"
- JID: "120363999888777@g.us"

**Captain runs:**
```bash
/root/.openclaw/workspace/scripts/add-new-group.sh \
  "120363999888777@g.us" \
  "CFT Strategy" \
  "Internal strategy meetings and planning"
```

**Captain confirms & restarts:**
> [Captain] ✅ Group added: **CFT Strategy**  
> Restarting to activate... I'll be back in ~15 seconds.

---

## Implementation

This procedure should be:
1. **Always active** when Captain receives group messages
2. **First thing to check** before attempting to respond
3. **Logged to** `memory/YYYY-MM-DD.md` for tracking

**Trigger:** Any group message where `chat_id` (JID) is NOT in `openclaw.json` config
