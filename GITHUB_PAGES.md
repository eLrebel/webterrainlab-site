# Publish like LocalType: separate public GitHub Pages repository

LocalType is a separate public repo: \`eLrebel/localtype-site\`, hosted at
\`https://elrebel.github.io/localtype-site/\`.

Web Terrain Lab's extension source repo \`eLrebel/Chrome-extension-02\` is
**private**. Keep it private. Create a **public** companion GitHub repository
named \`webterrainlab-site\` (main branch), just like LocalType's site.

## Export the public website

\`\`\`bash
npm run build:github-pages
npm run test:github-pages
\`\`\`

This builds only static website assets, legal/support pages, and the
public Paddle checkout page into \`dist/github-pages/\`. Copy the CONTENTS
of that folder to the root of the public \`webterrainlab-site\` repository.
Do NOT mirror the private repository or publish the commerce Worker.

GitHub > webterrainlab-site > Settings > Pages:
- Source: Deploy from a branch
- Branch: main
- Folder: /(root)

Planned preview:
\`https://elrebel.github.io/webterrainlab-site/\`

Planned Paddle checkout:
\`https://elrebel.github.io/webterrainlab-site/buy/\`

The export adds the required \`/webterrainlab-site/\` path prefix and
\`.nojekyll\`, because project Pages is not hosted at the domain root.

## Go live

- Create a separate Paddle Billing product: $5 USD, ONE-TIME.
- Obtain live approval for the checkout's domain and configure Paddle's
  default checkout link to the published \`/buy/\` page.
- Use the existing new Web Terrain Lab license Worker, not LocalType's.
- Supply public Paddle client token and price ID. Keep secret API keys
  and webhook signing secrets in the Worker only.
- Configure an HTTPS API host for extension license verification.
- Test payment -> signed webhook -> activation -> restore -> refund.
- Keep \`enabled:false\` until these tests, site policies, and browser QA pass.

A custom domain may be added later; it is NOT required to preview the site.
See \`commerce/SETUP.md\` for full merchant activation instructions.

## One-command Windows option (GitHub CLI)

After installing and signing in to [GitHub CLI](https://cli.github.com/),
the source repository contains a publisher that creates the companion
public repository automatically, builds the site, uploads only the public
export, and attempts to enable GitHub Pages:

\`\`\`bat
call "D:\PERSONAL\Chrome-extension-02\scripts\publish-github-pages.cmd"
\`\`\`

The publisher requires Git, Node.js, npm, and GitHub CLI and may open
an interactive GitHub sign-in. It checks that the exported Paddle
checkout is disabled and avoids copying private extension code or
backend webhook secrets. GitHub Pages deployment may still need
manual activation under \`Settings > Pages\` depending on permissions.
