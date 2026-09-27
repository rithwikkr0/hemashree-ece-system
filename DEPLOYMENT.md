# Cloudflare Pages Deployment Specification — HEMASHREE // ECE SYSTEM

## 1. Deployment Identity & Parameters

| Parameter | Configuration Value |
| :--- | :--- |
| **Cloudflare Pages Project Name** | `hemashree-portfolio` |
| **GitHub Repository** | `rithwikkr0/hemashree-ece-system` |
| **GitHub Repository URL** | `https://github.com/rithwikkr0/hemashree-ece-system` |
| **Production Branch** | `main` |
| **Framework Preset** | `Vite` |
| **Root Directory** | `/` |
| **Build Command** | `npm run build` |
| **Build Output Directory** | `dist` |
| **Node.js Version** | `20.18.0` (specified in `.node-version`) |
| **Environment Variables** | *None required* (100% self-contained static client-side build) |
| **Expected Deployment URL** | `https://hemashree-portfolio.pages.dev` |

---

## 2. SPA Client-Side Routing

Cloudflare Pages automatically processes `dist/_redirects` copied from `public/_redirects`:

```
/*    /index.html   200
```

This guarantees:
- Direct visits, page reloads, and browser history transitions for all subpaths resolve to `index.html`.
- No 404 errors on deep linking or anchor references (`#profile`, `#lab`, `#projects`, `#signals`, `#missions`, `#archive`, `#transmission`).

---

## 3. Step-by-Step Cloudflare Pages Connection Guide

Because Cloudflare requires browser-level OAuth authorization to link your Cloudflare account to your GitHub repository, perform the following steps in your Cloudflare dashboard:

1. **Log In to Cloudflare**:
   - Navigate to [dash.cloudflare.com](https://dash.cloudflare.com/) and sign in.

2. **Navigate to Pages**:
   - In the left sidebar, click **Workers & Pages**.
   - Click the **Create application** button.
   - Select the **Pages** tab.
   - Click **Connect to Git**.

3. **Select Repository**:
   - If prompted, authorize Cloudflare to access your GitHub repositories.
   - Select: **`rithwikkr0/hemashree-ece-system`**.
   - Click **Begin setup**.

4. **Configure Project Settings**:
   - **Project name**: Enter `hemashree-portfolio` *(this determines the `.pages.dev` subdomain)*.
   - **Production branch**: Ensure `main` is selected.
   - **Framework preset**: Select `Vite`.
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` *(leave default / empty)*.
   - **Environment variables**: *None needed*.

5. **Deploy**:
   - Click **Save and Deploy**.
   - Cloudflare Pages will fetch the code, run `npm run build` using Node `20.18.0`, and deploy the bundle globally.
   - Your site will be live at: **`https://hemashree-portfolio.pages.dev`**.

---

## 4. Pre-Deployment Verification Summary

- **Build**: Tested and verified with `0 TypeScript errors` and `0 Vite errors`.
- **Assets**: 22 files total (6.56 MB), fully optimized.
- **Security**: 0 API keys or private credentials tracked.
