# Three observations from building with Thally

These cover the local workflow: scaffold, writing, `thally check`, `npm run build` and the OpenAPI reference. Thally Cloud publishing isn't covered here.

## 1. The scaffold is fast and the ownership rules are clear

`npx create-thally-docs@latest aomi-docs --yes --install` produced a project that built on the first try in about 19 seconds. The layout is obvious within a minute: pages in `src/content/`, navigation in `docs.json`, identity in `src/data/site.ts`. `AGENTS.md` says up front which files are runtime-owned, which saved me from editing framework code by accident. The component set covers what a developer docs site actually needs (`Steps`, `Tabs`, `CodeGroup`, `AccordionGroup`, Mermaid, video), and frontmatter fields like `navTitle` and `timeEstimate` mean page metadata doesn't leak into the body.

## 2. The starter assumes a big site, and `check` stops short of links

The starter ships with several example tabs, a sample API and changelog pages. For a new product site, the first half hour is deleting things. A `--minimal` flag that scaffolds an introduction, a quickstart and one empty group would cut that out.

`thally check` is quick and catches missing navigation entries and frontmatter. Broken internal links and anchors only surface in the agent-readiness report (`/api/agent-readiness` on a running site), and MDX errors only at build time. I wrote a small script to diff every `/path` link against the page list before I found that report. Running the readiness link check inside `thally check` would catch the most common docs regression without starting a server.

The middleware deprecation warning prints on every build. `AGENTS.md` says not to hand-edit framework internals, and `BUILD-WARNINGS.md` explains why the warning stays, but nothing points a new user to that file. One line in the build output linking to it would save a confused search.

## 3. Untagged OpenAPI specs need a better default, and `overrides` hit a size cap

Binding Aomi's OpenAPI document to a tab worked first time and generated 75 endpoint pages with a request builder. But Aomi's spec has no tags or summaries, which is common for generated specs. Every operation lands in one group, titled by its raw `operationId` (`browsePipelineAppOperations`, `describeevmbuild`).

The documented fix is an `overrides` entry per operation in `docs.json`. For 75 operations that took a script, and it made `docs.json` 16 KB. A comment in the starter's readiness code says managed releases cap the `docs.json` binding at 5 KB, which the [API reference setup guide](https://docs.thally.io/guides/api-reference-setup) doesn't mention. I only found it by reading source. In the end I added tags and summaries to the spec copy, which the same guide tells you not to do.

Two changes would remove the problem:

- A `groupBy: "path"` setting that groups untagged operations by path prefix (`/v1/agent`, `/v1/pipeline/evm`)
- Falling back to a humanized `operationId` for the title when there's no `summary`

And `thally check` should warn when `docs.json` is over the managed size limit, before a publish fails.
