# Deployment Guide - Bartending Academy

## Quick Deploy Options

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Follow the prompts**
- Link to existing project or create new
- Confirm settings
- Deploy!

**Or use Vercel Dashboard:**
1. Visit [vercel.com](https://vercel.com)
2. Import your Git repository
3. Vercel auto-detects Next.js
4. Click "Deploy"

### Option 2: Netlify

1. **Build the project**
```bash
npm run build
```

2. **Install Netlify CLI**
```bash
npm i -g netlify-cli
```

3. **Deploy**
```bash
netlify deploy --prod
```

**Or use Netlify Dashboard:**
1. Visit [netlify.com](https://netlify.com)
2. Drag and drop the `.next` folder
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

### Option 3: Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t bartending-academy .
docker run -p 3000:3000 bartending-academy
```

### Option 4: Traditional Server (Node.js)

1. **Build the application**
```bash
npm run build
```

2. **Transfer files to server**
- `.next/` directory
- `node_modules/` directory
- `package.json`
- `public/` directory (if any assets)
- All configuration files

3. **Start the server**
```bash
npm start
```

4. **Use PM2 for production** (recommended)
```bash
npm i -g pm2
pm2 start npm --name "bartending-academy" -- start
pm2 save
pm2 startup
```

## Environment Setup

### Production Build

Before deploying, always test the production build locally:

```bash
npm run build
npm start
```

Visit `http://localhost:3000` to verify everything works.

### Environment Variables

This application doesn't require environment variables for basic functionality, but you can add them if needed:

Create `.env.local`:
```env
# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Optional: Custom API endpoints (future enhancement)
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Domain Configuration

### Custom Domain with Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

### Custom Domain with Netlify
1. Go to Domain Settings
2. Add custom domain
3. Configure DNS records

### Custom Domain on Server
1. Configure your web server (Nginx/Apache)
2. Point domain to your server IP
3. Set up reverse proxy to port 3000

Example Nginx configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL/HTTPS

### With Vercel/Netlify
SSL is automatic and free!

### With Custom Server
Use Let's Encrypt:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Performance Optimizations

### Before Deployment

1. **Optimize Images**
- Use Next.js Image component (already implemented for future images)
- Compress any large assets

2. **Code Splitting**
- Already handled by Next.js automatically

3. **Remove Console Logs**
```bash
# Add to package.json scripts
"build": "next build && next-remove-imports"
```

4. **Enable Compression**
- Vercel/Netlify handle this automatically
- For custom servers, enable gzip in Nginx/Apache

### After Deployment

1. **Monitor Performance**
- Use Vercel Analytics or Google Analytics
- Monitor Core Web Vitals

2. **Set up CDN**
- Vercel/Netlify use CDN by default
- For custom hosting, consider Cloudflare

## Database Migration (Future)

Currently uses Local Storage. To migrate to a database:

1. **Choose a Database**
- MongoDB (flexible, document-based)
- PostgreSQL (relational, robust)
- Firebase (real-time, easy auth)
- Supabase (PostgreSQL with auth)

2. **Update Storage Layer**
- Modify `lib/storage.ts`
- Replace localStorage calls with API calls
- Add authentication

3. **Create API Routes**
```typescript
// app/api/flashcards/route.ts
export async function GET() {
  // Fetch from database
}

export async function POST(request: Request) {
  // Save to database
}
```

## Monitoring and Logging

### Recommended Services

**Error Tracking:**
- Sentry
- LogRocket
- Rollbar

**Analytics:**
- Google Analytics
- Vercel Analytics
- Plausible (privacy-focused)

**Performance:**
- Lighthouse CI
- WebPageTest
- Google PageSpeed Insights

## Backup Strategy

Since data is stored in Local Storage:

### User Data Export Feature (Future Enhancement)
Add export/import functionality:
```typescript
// Export all data
const exportData = () => {
  const data = {
    flashcards: getFlashcards(),
    quizResults: getQuizResults(),
    gameSessions: getGameSessions(),
    userProgress: getUserProgress(),
  };

  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bartending-academy-backup.json';
  a.click();
};
```

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test # if you add tests
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Security Checklist

Before deploying:

- [ ] Remove all console.log statements
- [ ] Ensure .env files are in .gitignore
- [ ] Enable HTTPS
- [ ] Set proper CORS headers (if using API)
- [ ] Add security headers
- [ ] Rate limiting (if using API)
- [ ] Input validation on all forms
- [ ] XSS protection (React handles this mostly)

## Post-Deployment Testing

Test these features after deployment:

- [ ] All pages load correctly
- [ ] Flashcard flip animations work
- [ ] Quiz timer functions properly
- [ ] Games are playable
- [ ] Form submissions work
- [ ] Local storage persists data
- [ ] Navigation works on all pages
- [ ] Responsive design on mobile
- [ ] Keyboard shortcuts function
- [ ] Progress tracking updates

## Rollback Plan

### Vercel
Vercel keeps deployment history. To rollback:
1. Go to Deployments
2. Find the working version
3. Click "Promote to Production"

### Manual Deployment
Keep previous build:
```bash
mv .next .next.backup
# If issues occur:
rm -rf .next
mv .next.backup .next
```

## Cost Estimates

**Vercel (Hobby Plan)**: FREE
- Perfect for this project
- Unlimited deployments
- Automatic SSL
- Global CDN

**Netlify (Free Plan)**: FREE
- 100GB bandwidth/month
- Automatic SSL
- Forms and functions

**Custom VPS**: $5-20/month
- Digital Ocean, Linode, AWS
- Full control
- Requires more management

## Support and Maintenance

### Regular Tasks
- Monitor error logs weekly
- Check performance metrics monthly
- Update dependencies quarterly
- Review user feedback regularly

### Updates
```bash
# Update all dependencies
npm update

# Check for security issues
npm audit
npm audit fix
```

## Conclusion

This application is deployment-ready! Choose the option that best fits your needs:

- **Quick & Easy**: Use Vercel (recommended)
- **Custom Domain**: Any option works
- **Full Control**: VPS with Node.js
- **Scaling**: All options scale automatically

Happy deploying! 🚀
