@echo off
set FILTER_BRANCH_SQUELCH_WARNING=1
git filter-branch --env-filter "if [ \"$GIT_COMMITTER_EMAIL\" = \"yourpersonal@email.com\" ]; then export GIT_COMMITTER_NAME=\"Saad amir\"; export GIT_COMMITTER_EMAIL=\"saadamir070@gmail.com\"; fi; if [ \"$GIT_AUTHOR_EMAIL\" = \"yourpersonal@email.com\" ]; then export GIT_AUTHOR_NAME=\"Saad amir\"; export GIT_AUTHOR_EMAIL=\"saadamir070@gmail.com\"; fi" --tag-name-filter cat -- --branches --tags
