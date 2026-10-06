---
title: Switchback
status: active
startDate: 2026-09-28T04:05:00Z
links:
  website: https://switchback.page/
  github: https://github.com/vandermerwed/switchback
techStack:
  - typescript
  - node
  - astro
category:
  - open-source
  - tool
tags:
  - ai
  - thinking-tools
  - productivity
description: Programmable stationery for AI agents. Step out of the agent loop to think on paper, then come back with a clearer next step.
aiUsage:
  - documentation
---

Switchback is a skill for AI agents that hands the thinking back to you, on paper. Some thinking is better done with a pen than in a chat window: decisions, plans, things you're trying to learn, a weekly reflection.

How it works:

1. Ask your agent in plain language.
2. It plans a workbook and gives you a PDF to print.
3. Work through the pages by hand, away from the screen.
4. Photograph the pages and send them back. The agent reads your handwriting and marks and suggests the next step.

It supports a few shapes of work: a single **Sitting** for a decision, a **Series** of spaced rounds for learning something over weeks, **Incubation** for creative problems, a repeatable **Ritual** for weekly check-ins, and **Proof** for printing a draft to mark up with a red pen.

It works with Claude Code, Codex, Cursor and other agents that support skills:

```bash
npx skills add vandermerwed/switchback
```

More at https://switchback.page/ and the repository: https://github.com/vandermerwed/switchback
