# Deploying this site to Vercel

This is a static site (plain HTML/CSS/JS, no build step). A local git repo has already been initialized here with one commit. Do the following on your own Mac.

## 0. One-time cleanup (do this first)
The sandboxed tool that set up this repo left 3 harmless leftover lock files behind that it wasn't able to clean up itself. Remove them before your first `git add`/`commit`, or git will refuse to run:

```bash
cd ~/Documents/"Portfolio 2026 12 Aug 7 PM"
rm -f .git/index.lock .git/HEAD.lock .git/objects/maintenance.lock
git add -A
git commit -m "Add deployment instructions"
```

## 1. Create the GitHub repo
1. Go to https://github.com/new
2. Name it (e.g. `pavithran-portfolio-2026`)
3. Leave it **empty** — do NOT check "Add a README", "Add .gitignore", or "Choose a license" (this folder already has commits; an empty repo avoids a merge conflict)
4. Click **Create repository** and copy the repo URL it gives you (looks like `https://github.com/<you>/pavithran-portfolio-2026.git`)

## 2. Push this folder to GitHub
Open Terminal, then:

```bash
cd ~/Documents/"Portfolio 2026 12 Aug 7 PM"
git remote add origin https://github.com/<you>/pavithran-portfolio-2026.git
git push -u origin main
```

(If GitHub asks you to sign in, use your GitHub username and a Personal Access Token as the password — GitHub no longer accepts your account password directly. Create one at https://github.com/settings/tokens if you don't have one.)

## 3. Import into Vercel
1. Go to https://vercel.com/new
2. Choose **Import Git Repository**, select the repo you just pushed
3. Framework Preset: **Other** (this is plain static HTML — no build command, no output directory override needed)
4. Click **Deploy**

Vercel will give you a `*.vercel.app` URL immediately, and will auto-redeploy every time you push to `main`.

## 4. Point your existing domain (optional)
If you want `pavithranportfolio2026.vercel.app` or a custom domain to point here instead of your old site, go to the new Vercel project → **Settings → Domains** and add/move it there.

## Updating the site later
Any time Claude (or you) edits files in this folder:

```bash
cd ~/Documents/"Portfolio 2026 12 Aug 7 PM"
git add -A
git commit -m "describe the change"
git push
```

Vercel redeploys automatically within ~30 seconds of the push.
