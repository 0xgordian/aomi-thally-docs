# Three observations from building with Thally

## What worked well

The Thally CLI scaffold (`create-thally-docs --yes --install`) delivers a complete, immediately buildable project in under 20 seconds. The generated structure is clear: `src/content/*.mdx` for pages, `docs.json` for navigation, and `src/data/site.ts` for identity. The `AGENTS.md` file explains ownership boundaries upfront, which prevented confusion about which files to edit versus which are runtime-managed. The `npx @thallylabs/cli check` command provides fast validation without requiring a full build, catching broken navigation references and missing frontmatter early.

The starter template includes working examples for every component type (Hero, Card, CardGroup), making it straightforward to copy patterns rather than guess at syntax. The build output is detailed enough to debug issues but not so verbose that errors get buried.

## Where friction appeared

The starter template is optimized for larger documentation sites with multiple tabs, API references, and changelog sections. For a three-page assessment, this meant removing about eight example pages and collapsing the navigation from four tabs down to one. A `--minimal` or `--small` scaffold flag that generates just introduction, quickstart, and one guide would reduce this editing step for focused evaluations.

The `AGENTS.md` file references checking `starter-release.json` for runtime-owned paths but does not explain what to do when that file's format is unclear or when you are unsure whether a specific file is runtime-owned. For example, `src/mdx/custom-components.tsx` looks like it might be part of the framework, but `AGENTS.md` does not list it explicitly. Clearer guidance on "if you did not create it and it is not in `src/content/` or `docs.json`, leave it alone" would help.

The middleware deprecation warning appears on every build and dev server start but `AGENTS.md` says framework internals should not be hand-edited. The warning suggests running a codemod, which conflicts with the ownership guidance. Either the warning should not appear on fresh scaffolds or `AGENTS.md` should explicitly address it.

## What could improve

Document the typical dev server port behavior in the Thally quickstart. The scaffold runs `npm run dev` without noting that Next.js auto-selects an available port when 3000 is occupied. The terminal output is clear, but a note in the scaffold success message ("Your dev server will start on port 3000 or the next available port") would prevent confusion when the URL differs from examples.

Clarify what the CLI check validates and what it does not. It caught missing navigation entries and confirmed frontmatter completeness, but it did not catch MDX syntax errors or broken internal links until build time. Knowing the check's scope helps set expectations about when to run it versus when to run a full build.

Add a "validate your content" section to the Thally quickstart that lists the sequence: edit content, run check (fast), fix navigation issues, run build (comprehensive), fix everything else. This would make the workflow explicit rather than something users discover through trial.

**Note:** These observations reflect only the local Thally CLI scaffold, check, and build workflow. Thally Cloud onboarding, managed publishing, and repository connection remain untested and cannot be assessed.
