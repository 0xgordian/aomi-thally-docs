# Aomi Developer Guide

A three-page documentation site for Aomi, built with Thally. It covers what Aomi is, how to run your first Agent turn with the SDK, and how to deploy a custom App in Rust.

## Run it locally

You need Node.js 20 or later.

```bash
npm install
npx @thallylabs/cli@latest check
npm run build
npm run dev
```

The dev server starts at http://localhost:3040

## Pages

- Introduction: what Aomi does and who it is for
- Quickstart: install the SDK and send a first instruction
- Guide: build and deploy a custom Aomi App
- Tutorials: each public Aomi demo video on its own page, with a short written guide under the embed

## How this was built

The writeup is in [ARTICLE.md](./ARTICLE.md). It walks through scaffolding the site, adding the content, and running the Thally check and build, including what was tested and what was not.

Notes from using the Thally CLI are in [OBSERVATIONS.md](./OBSERVATIONS.md).
