#!/bin/bash
export JAVA_HOME=/home/codespace/java/21.0.10-ms
export PATH="$JAVA_HOME/bin:$PATH"
cd /workspaces/SavvyMoney/android
./gradlew assembleDebug --warning-mode all 2>&1
