# Auto-Onboard WhatsApp Group

## When User Says: "Add this group: [Name] - [Purpose]"

**Captain should:**

1. **Extract JID** from the inbound metadata (provided by OpenClaw in the system context)
2. **Parse** the group name and purpose from the user's message
3. **Run the script**:
   ```bash
   /root/.openclaw/workspace/scripts/add-new-group.sh "<JID>" "<Name>" "<Purpose>"
   ```
4. **Confirm** to the user: "✅ Added [Name] to config. Restarting gateway..."
5. **Restart** gateway via `gateway` tool with note

## Example Flow

**User message in new group:**
> "Captain, add this group: CFT Marketing - For BD campaigns and client pitches"

**Captain extracts from inbound metadata:**
```json
{
  "chat_id": "120363987654321@g.us",
  "channel": "whatsapp",
  "chat_type": "group"
}
```

**Captain runs:**
```bash
/root/.openclaw/workspace/scripts/add-new-group.sh \
  "120363987654321@g.us" \
  "CFT Marketing" \
  "For BD campaigns and client pitches"
```

**Captain responds:**
> [Captain] ✅ Added "CFT Marketing" to my active groups. Restarting gateway to activate...

Then calls: `gateway(action: "restart", note: "Added CFT Marketing group")`

---

## Implementation Note

The `chat_id` in the inbound metadata JSON block (always present for WhatsApp groups) **IS** the JID.
Extract it automatically—don't ask the user for it.
