# Ship developer docs for an onchain API with Thally

This walks through how the Aomi developer docs in this repository were built with Thally, from an empty folder to a site with a quickstart, task guides, concept pages, a CLI and SDK reference, an interactive API reference generated from Aomi's OpenAPI document, and 26 video tutorials.

Aomi is onchain execution infrastructure for agents and apps, and it's a good stress test for a docs platform. It has four ways in (a hosted chat, an MCP server, a CLI and a TypeScript SDK), a Rust plugin system, an HTTP API with 75 operations, and a security model that readers have to understand before they sign anything. If the docs get the structure wrong, people sign transactions they don't understand or give up at the API key step.

## What you need

- Node.js 20 or later and npm (this build used Node.js 22.23.4 and npm 10.9.9 on Linux)
- The product's public docs, repos and, if it has one, its OpenAPI document

No Thally Cloud account is needed to build and check the site locally.

## 1. Gather sources before you write anything

Every command, flag, endpoint and number on the site comes from one of these:

- Aomi's docs at [aomi.dev/docs](https://aomi.dev/docs), read as Markdown through `/docs/llms.txt` and the `.md` version of each page
- The published OpenAPI document at `https://aomi.dev/docs/api-reference/openapi.json`
- The public repos: [aomi-labs/aomi](https://github.com/aomi-labs/aomi), [aomi-labs/aomi-sdk](https://github.com/aomi-labs/aomi-sdk) and [aomi-labs/skills](https://github.com/aomi-labs/skills)
- The npm registry, for `@aomi-labs/client` (0.11.2) and `@aomi-labs/cli` (0.2.0)

If a fact couldn't be traced to one of these, it isn't on the site. That rule cost a few nice-sounding sentences. One example: the Aomi intro says every chain is simulated on a fork, but the portal guide says Solana requests in the portal are signed without one. The site says the second thing, on every page where it matters.

Then run the product. The quickstart's guest-mode example was run against `https://chat.aomi.dev`: the first turn went through, and a fast second call came back `429` with `guest_concurrency_limit`. That error is now a note in the quickstart and an entry in Troubleshooting, because the next developer will hit it too.

## 2. Scaffold the project

```bash
npx --yes create-thally-docs@latest aomi-docs --yes --install
cd aomi-docs
```

This took about 19 seconds and produced a buildable Next.js project. Three files matter at the start:

- `src/content/` holds one MDX file per page
- `docs.json` holds tabs, groups and navigation order
- `src/data/site.ts` holds the site name, description and header links

Read `AGENTS.md` before touching anything else. It lists which files are runtime-owned and must only change through Thally's update workflow.

## 3. Design the information architecture first

The first version of this site had three pages in one group. It read like a summary of Aomi's docs, not a docs site. The rebuild started from what a reader is trying to do, sorted with the Diataxis split that Thally's own [content types guide](https://docs.thally.io/guides/content-types) uses: tutorials, how-to guides, concepts and reference.

```text
Documentation
  Get started      Overview, Quickstart
  Use Aomi         Portal, MCP, CLI
  Integrate        Agent turns, Authentication
  Build Apps       Your first App
  Concepts         How Aomi works, Signing and permissions, Apps and routing, Glossary
  Help             Troubleshooting, FAQ
Reference          TypeScript SDK, CLI, MCP tools, App manifest, Supported chains
API reference      Overview + 75 generated endpoint pages
Tutorials          26 recorded walkthroughs with written guides
```

A few decisions behind it:

- The landing page routes people instead of describing the product. Four cards up top, one per entry path (SDK, MCP, CLI, App), and a table that tells you which auth each path needs on day one. Stripe and Supabase open the same way, and it stops a CLI user from reading SDK docs.
- Use is separate from Integrate. Someone pasting an MCP URL into Claude Code and someone writing a Node service have nothing in common after the first minute.
- Security is a concept page, not a warning box. "Signing and permissions" explains who controls what. Task pages link to it at the moment it matters, such as choosing a signing policy.
- Reference pages are tables. Commands, flags, environment variables, MCP tools, OAuth scopes, `UserState` fields. No narrative. Guides link into them.
- Troubleshooting is keyed by the literal error. Headings are the strings people paste into search: `invalid_target`, `insufficient_scope`, `SDK version mismatch: plugin=X, host=Y`.

Write `docs.json` once the tree is settled:

```json
{
  "tabs": [
    {
      "tab": "Documentation",
      "groups": [
        { "group": "Get started", "pages": ["introduction", "quickstart"] },
        { "group": "Use Aomi", "pages": ["guides/portal", "guides/mcp", "guides/cli"] }
      ]
    }
  ]
}
```

## 4. Use one template per page type

Every task page follows the same order: the result in one or two sentences, prerequisites, numbered steps with real commands, what success looks like, likely failures, then next steps. The quickstart ends with the literal output (`cobalt`), not "you should see a response".

Thally's frontmatter carries metadata that would otherwise clutter the page:

```yaml
---
title: Quickstart
description: Install the Aomi TypeScript SDK and run a two-turn Agent conversation from Node.js. No API key needed.
timeEstimate: 5 min
keywords: [install, sdk, typescript, node, guest mode, first request]
---
```

`navTitle` keeps sidebar labels short ("MCP") while page titles stay descriptive ("Connect an MCP client").

The built-in components did most of the formatting work: `CodeGroup` for npm, pnpm and yarn; `Tabs` for Claude Code, Codex and Cursor; `Steps` for the deploy flow; `AccordionGroup` for App build errors; Mermaid for the pipeline diagram. Every code block has a language tag and, where it helps, a filename (`example.ts`, `Cargo.toml`).

## 5. Generate the API reference from OpenAPI

Aomi publishes an OpenAPI 3.1 document. Save it as `openapi.yaml` in the project root and bind it to a tab:

```json
{
  "tab": "API reference",
  "groups": [{ "group": "Overview", "pages": ["reference/api"] }],
  "api": {
    "source": "openapi.yaml",
    "tagsOrder": ["Agent", "Agent sessions", "Pipeline catalog", "Pipeline EVM lifecycle", "Account", "Service"],
    "defaultGroup": "Service"
  }
}
```

Aomi's spec has no tags and no summaries, so out of the box all 75 operations land in one group, titled by raw `operationId` (`describeevmbuild`). The first fix was an `overrides` entry per operation in `docs.json`. That works locally, but it pushed `docs.json` to 16 KB, and Thally caps the `docs.json` binding for managed releases at 5 KB. So the grouping moved into the spec instead: each operation got a `tags` entry based on its path and a `summary` such as "Start a turn". Paths, methods, operation IDs, schemas and descriptions are untouched, and `docs.json` is back under 5 KB.

The hand-written overview page covers what a generated page can't: base URLs, bearer tokens, the `Idempotency-Key` rule and a typical Agent loop over HTTP.

## 6. Turn videos into tutorials people can follow

Aomi has a lot of recorded demos. A wall of embeds isn't documentation, so each video got its own page with the same template: what happens on screen, a "Try it yourself" section using today's product, a caveat that amounts and routes are examples, and links into the guides. Where the current product differs from the recording (the old `/api/mcp` path, an earlier MCP screen), the page says so and points to the current guide.

## 7. Cut the filler

The last pass was a line edit of every page. Rules that did the most work:

- Second person, active voice, present tense
- Lead with the task, not with context the reader already has
- Concrete over general: `429` with `guest_concurrency_limit`, not "you may hit rate limits"
- No first-person notes about what the author did or didn't test. Those belong in this article, not on the site.
- No em dashes, and none of the usual filler words

Before: "This URL routes your requests to the public Aomi runtime without requiring authentication for guest mode."

After: "It runs in guest mode, so you don't need an API key or an OAuth client."

## 8. Check and build

```bash
npm run check
npm run build
```

`check` finished with "No issues found." in a few seconds. It catches navigation references and missing frontmatter. `build` prerenders the content pages and all 75 API operation pages.

Then start the site and open `/api/agent-readiness`. It scores how usable the docs are for AI agents and checks things `check` doesn't, including internal links and anchors, code language tags, page size and descriptions. This site scores 89 out of 100. The one failing check is OpenAPI examples: Aomi's spec ships request and response examples for only a few operations, and that has to be fixed in the source spec, not in the docs. The `readiness.goldenQuestions` block in `docs.json` lists real questions ("How do I connect Claude Code to Aomi?") and checks that search returns the right page for each.

## What was and wasn't run

Run: the npm installs, `aomi --help`, the SDK guest-mode example (first turn succeeded, second returned `429`), Thally scaffold, check and build.

Not run: a signed transaction, a wallet connection, a Rust build of the example App, or a deploy through `aomi-build`. Those pages are taken from Aomi's published docs, and the example output on the App page is the output Aomi documents.

## Versions

| Package | Version |
| --- | --- |
| Node.js | 22.23.4 |
| npm | 10.9.9 |
| next | 16.4.1 |
| react | 19.2.0 |
| typescript | 5.9.3 |
| @aomi-labs/client | 0.11.2 |
| @aomi-labs/cli | 0.2.0 |
