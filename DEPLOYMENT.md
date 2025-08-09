# Deployment Guide - Tian Lianghai GitHub Pages Profile

## 🚀 Quick Deployment Steps

### Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name the repository: `tianlianghai.github.io`
5. Make it public
6. Don't initialize with README (we already have one)
7. Click "Create repository"

### Step 2: Upload Files

#### Option A: Using Git (Recommended)

```bash
# Clone the repository (replace with your actual repository URL)
git clone https://github.com/tianlianghai/tianlianghai.github.io.git
cd tianlianghai.github.io

# Copy all files from this project to the repository folder
# Then commit and push
git add .
git commit -m "Initial commit: GitHub Pages profile"
git push origin main
```

#### Option B: Using GitHub Web Interface

1. Go to your repository on GitHub
2. Click "Add file" → "Upload files"
3. Drag and drop all files from this project:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
   - `_config.yml`
4. Click "Commit changes"

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section (or click "Pages" in the left sidebar)
4. Under "Source", select "Deploy from a branch"
5. Under "Branch", select "main" and click "Save"
6. Wait a few minutes for the site to deploy

### Step 4: Access Your Site

Your GitHub Pages profile will be available at:
**https://tianlianghai.github.io**

## 🎨 Customization Before Deployment

### Update Personal Information

1. **Edit `index.html`**:
   - Line 16: Update the GitHub avatar URL
   - Line 19: Update your name
   - Line 20: Update your title
   - Line 21: Update your location
   - Lines 24-30: Update social media links

2. **Update About Section** (lines 32-35):
   - Customize the description to match your background

3. **Update Skills** (lines 37-95):
   - Add/remove programming languages
   - Update frameworks and tools

4. **Update Publications** (lines 97-115):
   - Add your research papers
   - Include correct links

5. **Update Projects** (lines 117-175):
   - Add your actual GitHub projects
   - Update descriptions and technologies

### Update Contact Information

- Replace `tianlianghai@example.com` with your actual email
- Update LinkedIn profile URL
- Add any additional social media links

## 🔧 Advanced Configuration

### Custom Domain (Optional)

If you want to use a custom domain:

1. Purchase a domain (e.g., from Namecheap, GoDaddy, etc.)
2. In your repository settings, go to "Pages"
3. Under "Custom domain", enter your domain
4. Click "Save"
5. Configure DNS settings with your domain provider:
   - Add a CNAME record pointing to `tianlianghai.github.io`
   - Or add A records pointing to GitHub's IP addresses

### Google Analytics (Optional)

1. Create a Google Analytics account
2. Get your tracking ID
3. Edit `_config.yml`:
   ```yaml
   google_analytics: YOUR-GA-TRACKING-ID
   ```

### SEO Optimization

1. Update meta tags in `index.html`:
   ```html
   <meta name="description" content="Tian Lianghai - Computer Vision Researcher based in Beijing, China">
   <meta name="keywords" content="computer vision, deep learning, pytorch, research, china">
   <meta name="author" content="Tian Lianghai">
   ```

2. Add Open Graph tags:
   ```html
   <meta property="og:title" content="Tian Lianghai - Computer Vision Researcher">
   <meta property="og:description" content="Computer Vision Researcher based in Beijing, China">
   <meta property="og:image" content="https://avatars.githubusercontent.com/u/75210582?v=4">
   <meta property="og:url" content="https://tianlianghai.github.io">
   ```

## 🐛 Troubleshooting

### Common Issues

1. **Site not loading**:
   - Check if GitHub Pages is enabled in repository settings
   - Wait 5-10 minutes for initial deployment
   - Check the "Actions" tab for deployment status

2. **Styling issues**:
   - Clear browser cache
   - Check if all CSS files are uploaded correctly
   - Verify file paths in HTML

3. **JavaScript not working**:
   - Check browser console for errors
   - Ensure `script.js` is uploaded
   - Verify all external resources are loading

4. **Images not displaying**:
   - Check image URLs
   - Ensure images are uploaded to repository
   - Use relative paths for local images

### Performance Optimization

1. **Optimize images**:
   - Compress images before uploading
   - Use appropriate formats (WebP for photos, PNG for graphics)
   - Consider lazy loading for large images

2. **Minify code** (for production):
   - Use online tools to minify CSS and JavaScript
   - Remove unnecessary whitespace and comments

3. **Enable caching**:
   - GitHub Pages automatically serves static files with caching headers
   - Consider using a CDN for external resources

## 📊 Analytics and Monitoring

### GitHub Pages Analytics

GitHub Pages provides basic analytics:
1. Go to repository settings
2. Click "Pages" in the left sidebar
3. Scroll down to see traffic analytics

### External Analytics

Consider adding:
- Google Analytics
- Plausible Analytics
- Simple Analytics
- GitHub's built-in traffic insights

## 🔄 Maintenance

### Regular Updates

- Keep project links current
- Update publications and research
- Refresh skills and technologies
- Maintain contact information

### Backup Strategy

- Repository serves as backup
- Consider local backup of files
- Use version control for all changes

## 📞 Support

If you encounter issues:

1. Check [GitHub Pages documentation](https://docs.github.com/en/pages)
2. Review [GitHub Pages troubleshooting](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/troubleshooting-jekyll-build-errors-for-github-pages-sites)
3. Search existing issues on GitHub
4. Create a new issue in the repository

## 🎉 Success!

Once deployed, your GitHub Pages profile will be:
- Professional and modern
- Fully responsive
- SEO optimized
- Easy to maintain
- Showcasing your skills and projects

**URL**: https://tianlianghai.github.io

---

*Happy coding! 🚀*
