# Deployment Guide to GitHub

This guide explains how to share your statistical software on GitHub and deploy it for free using GitHub Pages.

## Prerequisite: Git
If you haven't installed Git, download it here: [git-scm.com](https://git-scm.com/downloads)

## Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g., `statistic-software`).
3. Make it **Public**.
4. Click **Create repository**.

## Step 2: Push your code
Open your terminal in this project folder (`c:\Users\gierl\...\Antigravity - Statistic Software`) and run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```
*(Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual details)*

## Step 3: Enable GitHub Pages
1. Go to your repository **Settings** tab on GitHub.
2. Click **Pages** in the left sidebar.
3. Under **Build and deployment**:
   - Source: **GitHub Actions**
   - (The workflow I added will automatically appear here once you push)
4. The deployment will start automatically.
5. Once finished, GitHub will give you a link (e.g., `https://yourname.github.io/statistic-software/`).

## Alternative: ZIP Upload
If you don't want to use Git commands:
1. Go to your GitHub repo.
2. Click **Add file** -> **Upload files**.
3. Drag and drop all files from this project folder (excluding `node_modules`).
4. Commit changes.
5. Follow Step 3 above.

## Note on Updates
To update your live site, run these commands in your terminal after making code changes:
```bash
git add .
git commit -m "Description of changes"
git push
```
The GitHub Action will automatically rebuild and update your live site in 1-3 minutes.

## Troubleshooting

### "Author identity unknown"
If you see this error, run these commands in your terminal:
```bash
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```

### "Updates were rejected" (Remote contains work)
This happens if you initialized your GitHub repo with a README or License. To force your local code to be the main version, run:
```bash
git push -f origin main
```
*Warning: This overwrites the remote repository with your local version.*


