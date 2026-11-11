# Document Aomi with Thally

This is a short developer guide to Aomi's SDK and CLI, in three pages: an introduction to the execution pipeline, a quickstart for Agent turns, and a practical guide for deploying custom Apps. It is meant to help someone integrate Aomi or extend it with plugins.

## Prerequisites

For the local validation path used here, you need Node.js and npm. The project was scaffolded with Node.js v22.23.4 and npm 10.9.9 on Linux.

Have the three page drafts ready based on Aomi's public documentation. This workflow uses the official Thally CLI to create a local project without Cloud sign-in, GitHub App permissions, or managed publishing.

## Research Aomi from public sources

Before writing documentation, gather content from Aomi's public materials. This assessment used only publicly accessible sources with no private or internal content.

### Sources used

**Main website:**
- https://aomi.dev - Product overview, features, architecture
- Content fetched via WebFetch on November 9, 2026

**Official documentation:**
- https://aomi.dev/docs - Introduction and overview
- https://aomi.dev/docs/build/first-app - Rust App quickstart
- https://aomi.dev/docs/integrate/client-sdk - TypeScript SDK integration
- https://aomi.dev/docs/guides/hackathon - Fast start guide
- All documentation fetched via WebFetch on November 9, 2026

**GitHub repositories (public):**
- https://github.com/aomi-labs/aomi - Main repo with React widget and CLI
- https://github.com/aomi-labs/aomi-sdk - Rust SDK for plugin development
- https://github.com/aomi-labs/docs - Documentation source
- https://github.com/aomi-labs/skills - Skills and command references
- Repository information gathered via WebSearch on November 9, 2026

**Verified package versions:**
- npm registry check confirmed @aomi-labs/client: 0.11.2
- npm registry check confirmed @aomi-labs/cli: 0.2.0
- Verified by running `npm view @aomi-labs/client version` and `npm view @aomi-labs/cli version`

## Install and verify Aomi packages

Installed Aomi packages locally to confirm versions and test CLI help output:

```bash
mkdir /tmp/aomi-test && cd /tmp/aomi-test
npm install @aomi-labs/cli @aomi-labs/client
```

Installation completed successfully in approximately 9 seconds. Verified CLI with:

```bash
npx @aomi-labs/cli --help
```

Output confirmed CLI version 0.2.0 with expected command structure: chat, session, transaction, app, model, chain, and wallet commands. Help output showed:
- Interactive REPL mode available
- One-shot prompt mode with `--prompt`
- Guest mode by default (no API key required)
- Backend URL configurable with `--backend-url`

The CLI is publicly available, and the documented commands exist.

**What was tested:** The SDK example from the official documentation was executed in guest mode. The client successfully connected to `https://chat.aomi.dev` and attempted to send messages. The first message was accepted, but the second hit a 429 rate limit (`guest_concurrency_limit`). This confirms the SDK transport works, guest mode exists, and the API is reachable without authentication.

**What was not tested:** No successful Agent turn completions due to rate limits. No transactions were simulated or signed. No wallet connections were made. No `aomi chat` CLI commands executed against the live API. All transaction and signing behavior remains untested.

## Scaffold the project with official Thally CLI

Used the Thally CLI to create an isolated local evaluation:

```bash
npx --yes create-thally-docs@latest aomi-docs --yes --install
cd aomi-docs
```

Scaffold completed in approximately 19 seconds. The `--yes` flag accepts defaults and `--install` runs `npm install` automatically.

Output confirmed:
- Project name: Aomi Docs
- Git repository initialized
- All dependencies installed
- Ready for local preview

Package versions from scaffolded `package.json`:
- next: 16.4.1
- @thallylabs/cli: 2.1.10
- Node runtime: v22.23.4

## Read the project structure

The scaffold created `AGENTS.md` with ownership rules. Key points remained the same as the Python version:
- Pages are MDX files in `src/content/`
- Navigation in `docs.json`
- Site identity in `src/data/site.ts`
- Runtime-owned files are machine-managed

## Add the Aomi content

Created three MDX files with frontmatter based on Aomi's public documentation:

**src/content/introduction.mdx**
```yaml
---
title: Build with Aomi
description: Use Aomi to turn plain-language instructions into simulated, wallet-signed transactions across EVM and Solana.
mode: home
---
```

Content covers:
- What Aomi does (execution pipeline: build, simulate, sign, broadcast)
- Three ways to use it (Portal, CLI, SDK)
- Non-custodial design principles
- Supported chains (10+: Ethereum, Arbitrum, Base, Solana, etc.)
- Requirements and verified package versions

**src/content/quickstart.mdx**
```yaml
---
title: Run your first Agent turn
description: Install the Aomi SDK and send your first plain-language instruction to the agent.
---
```

Covers SDK installation, environment setup, and the example Agent turn from official docs. The SDK example was later run in guest mode against the live API, as described below. Transaction and signing steps are still marked untested.

**src/content/guides/first-app.mdx**
```yaml
---
title: Deploy your first Aomi App
description: Build and deploy a custom Aomi App plugin in Rust to extend the runtime with your own tools.
---
```

Documents the Rust App structure (aomi.toml, Cargo.toml, src/lib.rs) from the official quickstart. Explicitly marked as untested since Rust toolchain was not installed and no actual builds or deploys were performed.

## Configure navigation

Updated `docs.json` to reflect the three-page structure:

```json
{
  "tabs": [
    {
      "tab": "Guide",
      "groups": [
        {
          "group": "Get started with Aomi",
          "pages": [
            "introduction",
            "quickstart",
            "guides/first-app"
          ]
        }
      ]
    }
  ]
}
```

Simplified from the starter's multiple tabs to match a focused three-page guide.

## Set the site identity

Updated `src/data/site.ts`:

```typescript
export const siteConfig: SiteConfig = {
  name: 'Aomi Developer Guide',
  description: 'Build with Aomi: execution harness for onchain AI across EVM and Solana',
  repoUrl: '',
  links: [
    { label: 'Get started', href: '/quickstart' },
    { label: 'Aomi docs', href: 'https://aomi.dev/docs' },
    { label: 'Portal', href: 'https://chat.aomi.dev' },
  ],
  brand: brandPresets[brandPreset],
  brandPreset,
  brandPresets,
}
```

## Validate and build

Ran Thally validation checks:

```bash
npx --yes @thallylabs/cli@latest check
```

Output:
```
Linting /workspace/aomi-docs...
✅ No issues found.
```

Check took approximately 8 seconds. Validated content structure, navigation references, and frontmatter completeness.

```bash
npm run build
```

Build completed successfully in approximately 25 seconds. Output showed:
- 3 content pages compiled
- 47 total static pages generated
- All routes prerendered
- TypeScript compilation passed

No warnings or errors related to the custom content.

## Preview locally

Started the dev server:

```bash
npm run dev
```

Server started on port 3040:
```
▲ Next.js 16.4.1 (Turbopack)
- Local:         http://localhost:3040
✓ Ready in 257ms
```

Manual verification via curl confirmed the site was serving:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3040/
```

Returned: 200

Desktop and mobile viewport checks delegated to automated browser testing. The site structure and build validated successfully.

## Obstacles and resolutions

### SDK guest mode rate limiting

**Challenge:** Testing the SDK example in guest mode to verify the transport layer worked.

**Resolution:** Successfully executed the documented example. The SDK connected to the API and sent the first message, but the second message hit a 429 rate limit with `guest_concurrency_limit`. This is expected behavior for rapid successive calls in guest mode, not a failure. The test confirms the SDK transport works, guest mode exists, and no authentication is needed for basic API access.

### Version verification without full execution

**Challenge:** Document accurate version numbers and commands without executing potentially complex workflows (signing, transactions, deployments).

**Resolution:** Installed packages locally to verify versions exist on npm. Ran CLI `--help` to confirm command structure matches documentation. Explicitly marked all runtime examples as untested with clear notes in the content.

### Rust toolchain scope

**Challenge:** The Rust App guide requires Rust 1.85+, cargo, and potentially GitHub App setup for deployment.

**Resolution:** Documented the Rust workflow from official sources without installing Rust or attempting builds. Marked all Rust examples as untested and clearly noted the deployment requirements.

## What was tested

**Verified:**
- npm package existence and versions (@aomi-labs/client 0.11.2, @aomi-labs/cli 0.2.0)
- CLI help command output structure
- SDK example execution in guest mode (connected successfully, hit expected rate limit)
- Public documentation accessibility
- GitHub repository public access
- Thally project scaffold
- Thally CLI check validation
- Production build success
- Dev server startup and HTTP response

**Not executed (marked as untested in docs):**
- Completed Agent turn (rate-limited in guest mode)
- `aomi chat` CLI commands against live API
- Transaction simulation or signing
- Wallet connections or authentication
- Rust App builds or deployments
- GitHub App installation or deployment workflows

## What was not tested

This workflow validates the content structure and local build. It does not test:

- Live Aomi API responses or Agent behavior
- SDK example execution with real sessions
- Transaction simulation or blockchain interaction
- CLI commands beyond `--help`
- Rust toolchain installation or plugin compilation
- GitHub App deployment pipeline
- Thally Cloud onboarding or managed publishing
- Repository connection or hosted deployment

Those steps would require API access, wallet connections, Rust installation, and external service integration. The local CLI validation is complete and accurate without them.

## Sources summary

**Public sources used (all accessed November 9, 2026):**
- aomi.dev (main website)
- aomi.dev/docs/* (official documentation, multiple pages)
- github.com/aomi-labs/* (public repositories: aomi, aomi-sdk, docs, skills)
- npm registry (package version checks)

**What was installed and tested:**
- @aomi-labs/client (0.11.2) - installed, and the documented guest-mode example was run
- @aomi-labs/cli (0.2.0) - installed, help command tested

**Private materials:** None. No employer materials, no internal documentation, no private repositories, no proprietary information.

**Invented content:** None. All commands, code samples, and features come from public Aomi documentation. Anything not verified is explicitly marked as untested.

## Package versions

All exact versions:
- @thallylabs/cli: 2.1.10 (recorded at scaffold time)
- next: 16.4.1
- react: 19.2.0
- typescript: 5.9.3
- Node.js: v22.23.4
- npm: 10.9.9
- @aomi-labs/client: 0.11.2 (verified from npm, guest-mode example run)
- @aomi-labs/cli: 0.2.0 (verified from npm, help tested only)

Rust SDK documentation references aomi-sdk =5.1.1 but this was not installed or verified locally.
