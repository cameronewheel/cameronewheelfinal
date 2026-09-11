# CamerOnewheel

Cameron Patecell — Orange County Onewheel racing. Current race board, results, gear, and shop links.

This is the **source** for the site. It is a TanStack Start (React 19) app with Nitro’s **Vercel** preset — not a folder of static HTML. Upload it to a host that can run a Node 22 build (Vercel is the path this project is already wired for).

## What you need

- Node **22**
- npm (ships with Node)

## Run it on your machine

```bash
npm install
npm run dev
```

Then open [http://localhost:8080](http://localhost:8080).

| Command | What it does |
|---|---|
| `npm run dev` | Local site on port 8080 |
| `npm run build` | Production build (Vercel output) |
| `npm run typecheck` | TypeScript check |

Auth is **off**. There is **no database** for the public site. Do not set `DATABASE_URL`.

## Put it on the internet (Vercel)

The production build already uses Nitro’s `vercel` preset.

1. Unzip this folder.
2. Push it to a GitHub repo (or skip git and use the CLI).
3. In [Vercel](https://vercel.com/new): **Add New → Project → Import**.
4. Framework: Vite (auto). Build command is already `npm run build`.
5. Environment variable: `VITE_AUTH_ENABLED` = `false`  
   (also stored in `.grok/app-env.json` so a default build stays signed-out).
6. Deploy.

CLI, from this folder:

```bash
npm install
npx vercel
```

Production:

```bash
npx vercel --prod
```

## Other hosts

This is **server-rendered**, not a static dump. It will not work as a drop of files on plain Apache / cPanel / “upload HTML” hosting.

It will work on any host that:

- runs **Node 22**
- runs `npm install && npm run build`
- serves the Nitro **Vercel** output (`.vercel/output`)

If your host is not Vercel, say so and we can retarget the build (Node server, etc.).

## Pages in the zip

Home, Results (journey map), Watch, Gear, Garage, Builds, Racing, Partners, Sponsors, Contact, Links. Affiliate hops live at `/go/{partner}` (Float Life, USAFLT, etc.).

Photos, the USA atlas, the van sprite, and kit plates are in `public/`. That’s most of the zip size (~27 MB of media).

## Do not change

- `.grok/app-env.json` → keep `"VITE_AUTH_ENABLED": "false"`
- `vite.config.ts` nitro block (`preset: "vercel"`, `serverDir: "./server"`)
- Copy in `src/lib/site-data.ts` (race results / video ids)

## Stack

React 19 · TanStack Start / Router · Tailwind v4 · Vite 8 · Nitro (Vercel)
