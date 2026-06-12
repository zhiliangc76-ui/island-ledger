# Island Ledger

An unofficial, lightweight Starsand Island companion site. It runs entirely in the browser and can be deployed free on Cloudflare Pages or GitHub Pages.

## Important data note

The current content is an early product preview. Recipe quantities and most game records are placeholders that must be verified in-game before public promotion. This is intentional: publishing wrong data would hurt players and search visibility.

## Preview locally

Open `index.html` directly in a browser, or run:

```powershell
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy with Cloudflare Pages

1. Create a new GitHub repository and upload the files in this folder.
2. In Cloudflare, go to **Workers & Pages**, then **Create application**.
3. Choose **Pages** and connect the GitHub repository.
4. Select no framework preset. Leave the build command blank and use `/` as the output directory.
5. Deploy. Cloudflare will provide a free `pages.dev` address.

## Before public launch

- Replace `hello@example.com` in `index.html` with a real submission email.
- Verify and expand game data in `app.js`.
- Add privacy, contact, and editorial-policy pages.
- Connect a privacy-friendly analytics service.
- Do not use copied game artwork, guide text, or proprietary data dumps.
