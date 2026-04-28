# Deployment Guide

This project is a static Vite + React frontend. The deployment process is:

1. Verify the required environment.
2. Configure production environment variables.
3. Build the app.
4. Publish the `dist/` directory to a static host.
5. Verify the deployed site.

## 1. Prerequisites

Install:

- Node.js 20 or newer
- npm 10 or newer

Confirm the project runs locally before deploying:

```bash
npm install
npm run check
```

## 2. Configure Environment Variables

Copy the example file and set the production values:

```bash
cp .env.example .env
```

Set the required client-side variable:

- `VITE_GEMINI_API_KEY`

For production hosting, set the same value in your host’s environment settings or secret manager if supported.

## 3. Create a Production Build

Run the production build locally:

```bash
npm run build
```

This generates the static site in `dist/`.

If you want to preview the production output before deploying, run:

```bash
npm run preview
```

## 4. Deployment Options

Use the same production build for every host:

- Build command: `npm run build`
- Output directory: `dist`

### Vercel

1. Create a new project in Vercel and connect this repository.
2. Set the framework preset to Vite if Vercel does not detect it automatically.
3. Keep the default build command as `npm run build`.
4. Set the output directory to `dist` if prompted.
5. Add `VITE_GEMINI_API_KEY` in the project environment variables.
6. Deploy and verify the preview URL.

### Netlify

1. Create a new site in Netlify and connect this repository.
2. Set the build command to `npm run build`.
3. Set the publish directory to `dist`.
4. Add `VITE_GEMINI_API_KEY` in the site environment variables.
5. Deploy and verify the live URL.

### GitHub Pages

1. Make sure the production build is ready with `npm run build`.
2. If you are deploying to a project page such as `username.github.io/repo-name/`, set the Vite `base` path in [vite.config.js](vite.config.js) to match the repository name.
3. Upload the contents of `dist/` to GitHub Pages, or use a GitHub Actions deploy workflow that publishes `dist/`.
4. Add `VITE_GEMINI_API_KEY` to your workflow or repository secrets if the build needs it at deploy time.
5. Open the published Pages URL and verify the app loads correctly.

### Cloudflare Pages

1. Create a new Pages project and connect this repository.
2. Set the build command to `npm run build`.
3. Set the build output directory to `dist`.
4. Add `VITE_GEMINI_API_KEY` in the Pages environment variables.
5. Deploy and verify the live URL.

## 5. Deploy via GitHub Actions

The repository already runs these checks in CI before release:

- `npm run lint`
- `npm run test:ci`
- `npm run build`

If your hosting provider supports artifact-based deploys, publish the `dist/` directory after a successful build.

## 6. Verify the Deployment

After deployment, open the live site and check:

- The dashboard loads without console errors.
- Settings changes persist after refresh.
- Theme switching works in Light, Dark, and System modes.
- Modals open and close correctly.
- API-driven features have the expected production environment variable values.

## 7. Rollback Plan

If a release breaks the app:

1. Revert to the last known good deployment in your hosting provider.
2. Re-run `npm run check` locally.
3. Fix the regression and redeploy.
