# Aomi Docs

Developer documentation for [Aomi](https://aomi.dev): turn plain-language instructions into simulated, wallet-signed transactions on EVM chains and Solana. Built with [Thally](https://thally.io).

## What's in it

| Section | Contents |
| --- | --- |
| Documentation | Overview, quickstart, guides for the portal, MCP, CLI, Agent turns, authentication and building an App, plus concepts, troubleshooting and FAQ |
| Reference | TypeScript SDK, CLI, MCP tools, App manifest, supported chains |
| API reference | Generated from Aomi's published OpenAPI document (`openapi.yaml`) |
| Tutorials | 26 recorded walkthroughs, each with a written guide |

## Run it locally

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:3040.

## Before you open a pull request

```bash
npm run check
npm run build
```

## Editing

- Pages are MDX files in `src/content/`. Every page needs `title` and `description` frontmatter.
- Navigation lives in `docs.json`. Add new pages there or they won't appear in the sidebar.
- `openapi.yaml` is Aomi's published spec from `https://aomi.dev/docs/api-reference/openapi.json`, with `tags` and `summary` added to each operation for navigation. Paths, schemas and descriptions are unchanged. Keep `docs.json` under 5 KB for managed releases.
- Writing and ownership rules are in [AGENTS.md](./AGENTS.md).

## Sources

Content is based on Aomi's public docs at [aomi.dev/docs](https://aomi.dev/docs), the [aomi-labs](https://github.com/aomi-labs) repositories and the npm registry.

Notes on how the site was built: [ARTICLE.md](./ARTICLE.md). Feedback on Thally: [OBSERVATIONS.md](./OBSERVATIONS.md).
