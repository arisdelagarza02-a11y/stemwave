# 🚀 GitHub Upload Commands

## After creating your GitHub repository, run these commands:

### 1. Set the main branch
```bash
git branch -M main
```

### 2. Connect to your GitHub repository
```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
```
**Replace YOUR-USERNAME and YOUR-REPO-NAME with your actual details!**

### 3. Push your files to GitHub
```bash
git push -u origin main
```

## Enable GitHub Pages (Free Hosting):

1. Go to your repository on GitHub
2. Click **Settings** (top right of repository)
3. Scroll down to **Pages** (left sidebar)
4. Under "Source", select **Deploy from a branch**
5. Select branch: **main**
6. Click **Save**
7. Your site will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME`

## Quick Commands Reference:

```bash
# Check status
git status

# Add files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull from GitHub
git pull
```