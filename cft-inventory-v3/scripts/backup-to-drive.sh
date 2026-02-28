#!/bin/bash
# Captain Craftech - Drive Backup Script
# Syncs workspace files to Google Drive

export GOG_KEYRING_PASSWORD=craftech360
export GOG_ACCOUNT=accounts@craftech360.com

# Folder IDs
MEMORY_FOLDER="1FIktq8_eU0Ic-GhDfFNOeDgIpoNX28Y4"
CONFIG_FOLDER="1rL9L8C31f-COdvH2G16J-sAba-Q0k3vc"
DEPARTMENTS_FOLDER="19fpEHJG8XBoy8BHVZDWkrCG979usyqCw"
WORKFLOWS_FOLDER="1Tzp24BTiQPdPI8vlrQVx46fBmJoIv3wR"

WORKSPACE="/root/.openclaw/workspace"

echo "=== Captain Craftech Drive Backup ==="
echo "Started: $(date)"

# Backup memory files
echo "Backing up memory files..."
for f in $WORKSPACE/memory/*.md; do
  [ -f "$f" ] && gog drive upload "$f" --parent $MEMORY_FOLDER --update-existing 2>/dev/null
done

# Backup config files
echo "Backing up config files..."
for f in MEMORY.md TOOLS.md SOUL.md USER.md IDENTITY.md AGENTS.md HEARTBEAT.md; do
  [ -f "$WORKSPACE/$f" ] && gog drive upload "$WORKSPACE/$f" --parent $CONFIG_FOLDER --update-existing 2>/dev/null
done

echo "Backup completed: $(date)"
