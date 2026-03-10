#!/bin/bash
# Auto-add new WhatsApp group to OpenClaw config
# Usage: ./add-new-group.sh <JID> <GroupName> <Context>

set -e

JID="$1"
GROUP_NAME="$2"
CONTEXT="$3"

if [ -z "$JID" ] || [ -z "$GROUP_NAME" ]; then
    echo "Usage: $0 <JID> <GroupName> [Context]"
    echo "Example: $0 '120363123456789@g.us' 'Marketing Team' 'BD discussions and campaigns'"
    exit 1
fi

CONFIG_FILE="/root/.openclaw/openclaw.json"
MEMORY_FILE="/root/.openclaw/workspace/MEMORY.md"

echo "Adding group: $GROUP_NAME ($JID)"

# Backup config
cp "$CONFIG_FILE" "${CONFIG_FILE}.backup-$(date +%s)"

# Add group to config with requireMention: false
jq --arg jid "$JID" \
   '.channels.whatsapp.groups[$jid] = {"requireMention": false}' \
   "$CONFIG_FILE" > "${CONFIG_FILE}.tmp" && mv "${CONFIG_FILE}.tmp" "$CONFIG_FILE"

# Add to MEMORY.md
echo "Updating MEMORY.md..."
GROUP_ENTRY="| $GROUP_NAME | $JID | Smart (all messages) |"

# Check if Groups section exists in MEMORY.md
if grep -q "### Captain's Groups" "$MEMORY_FILE"; then
    # Add after the header
    sed -i "/### Captain's Groups/,/^$/ {
        /^$/i\\
$GROUP_ENTRY
    }" "$MEMORY_FILE"
else
    # Append new section
    cat >> "$MEMORY_FILE" << EOF

### Captain's Groups (Auto-Added)
| Group | JID | Mode |
|-------|-----|------|
$GROUP_ENTRY
EOF
fi

if [ -n "$CONTEXT" ]; then
    echo "Context: $CONTEXT" >> "$MEMORY_FILE"
fi

echo "✅ Group added to config and MEMORY.md"
echo "🔄 Restart gateway with: openclaw gateway restart"
