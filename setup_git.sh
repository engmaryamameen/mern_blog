# #!/bin/bash

# # Set Git global configuration
# git config --global user.name "engmaryamameen"
# git config --global user.email "maryamshehzadi768@gmail.com"

# # Export timezone to Asia/Karachi for commits (requires GNU date and TZ awareness)
# export TZ=Asia/Karachi

# # Set local repository remote and branch
# git remote remove origin 2>/dev/null  # Optional: remove existing origin if present
# git remote add origin https://github.com/engmaryamameen/mern_blog.git
# git branch -M main
# git push -u origin main

# echo "Git configuration and push completed."


#!/bin/bash

# Set the timezone for the commit date/time display
export TZ=Asia/Karachi

# Update git username and email in past commits
git filter-branch --env-filter '
    export GIT_AUTHOR_NAME="engmaryamameen"
    export GIT_AUTHOR_EMAIL="maryamshehzadi768@gmail.com"
    export GIT_COMMITTER_NAME="engmaryamameen"
    export GIT_COMMITTER_EMAIL="maryamshehzadi768@gmail.com"
' --tag-name-filter cat -- --branches --tags

# Rebase onto the main branch (to ensure everything is synced up)
git branch -M main

# Push changes to the remote repository, overwriting history
git push origin main --force --tags

echo "Past commits updated with new username and email, and timezone set to Asia/Karachi."
