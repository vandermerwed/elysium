---
pubDatetime: 2026-07-13T12:20:53Z
title: Leading a Regulated Cloud Migration in the AI Age
featured: false
status: published
tags:
  - cloud-migration
  - digital-transformation
  - ai
  - governance
  - leadership
description: Most cloud migrations fail on leadership, not technology. A pragmatic look at the four decisions that decide a regulated on-prem-to-cloud migration in the AI age.
aiUsage:
  - research
  - ideation
  - editing
  - proofreading
modDatetime: 2026-07-18T06:35:37Z
---

I have worked on enough cloud migrations to stop trusting the post-mortems. When one disappoints, the explanation is always technical. The wrong landing zone. The monolith that would not come apart. A managed service that did not behave the way the slide promised. Those problems are real but almost never the actual reason.

The real reason is rather boring and hard to fix. The organisation moved its systems to the cloud without changing how it makes decisions, who owns the risk, or how it decides whether any of it worked. The surveys that get quoted put the wasted spend in the tens of billions, and most CIOs will tell you they have lived through a migration that ran late or fell over. I don't need a survey for that. I have watched it happen, and it was never really about the technology. It was about leadership, and most of it was decided before the first workload moved.

A migration in a regulated business is not a technology programme with a change workstream bolted on the side. It is a change to how the organisation operates that happens to involve technology. AI changes how fast all of this moves. It changes none of what matters.

## Table of contents

## Start with who owns the outcome

The project kickoff usually goes something like this: The CFO wants the data-centre lease gone. Security wants a defensible posture. A product team wants to ship faster. Infrastructure wants to stop patching hardware at 2am. Every one of those is a fair reason to move, and left side by side they will sink the project, because whatever you actually deliver, at least one of those people will decide it was a failure.

Someone has to force them into a single story with numbers attached, and turn that into targets the finance team and the technology team read together every quarter. The harder part is deciding who gets to make the trade-offs before any of them come up. Who approves the exception when a workload ends up costing more in the cloud than it did on-premise. Who signs it off when a team wants to skip a control to hit a date. If nobody has decided, the answer defaults to whoever is most senior in the room that day. That is how governance goes. Not in one bad decision, but one reasonable-sounding exception at a time.

## Governance is not a meeting

There is one line in a regulated business that does not move. A provider will run the infrastructure for you, and as you move up into managed and SaaS services they will run more of it. What they will never take off your hands is the accountability. You still own your data, your identities, and who is allowed to do what. In financial services the rules are blunter still. The licence holder answers for the outcome even when someone else did the work.

So governance here cannot be a committee that reviews the migration after it has happened. It has to be built into the platform on day one. Landing zones with the controls already in them. Identity and data-protection standards enforced by the system, not by good intentions in a policy document. You put the fence up first, so that later, when AI lets people move quickly, they can only move quickly inside it. Done this way governance is not the brake. It is what lets you say yes without having to think about it, because the dangerous answers were designed out before anyone asked.

## Move the way people work, not just the servers

The most expensive mistake I see is an organisation that lifts its workloads into the cloud and lifts its org chart up with them. It carries the same ticket-driven, throw-it-over-the-wall habits into a place that charges by the hour, and then wonders where the agility went.

The migration is the moment to change how the work actually happens, and it is the only time you will have the mandate to. Teams that own a capability end to end instead of passing tickets between silos. A platform team, so nobody is reinventing the landing zone every sprint. Security sitting inside the teams rather than waiting at the end to say no. Someone accountable for cloud spend before the first surprise invoice, not after it. Cloud turns cost into a decision engineers make every day, and if no one owns that, it arrives as a shock at the end of the quarter. None of this is free, and the budget that pays for servers but forgets to pay for the new way of working is how support quietly drains away by month six.

## AI last, and on purpose

This is the part everyone wants to open with. I am putting it last.

AI genuinely compresses this work, and it is good at the parts nobody enjoys. Mapping the dependencies in an estate no single person fully understands anymore. Reading years of code to work out what a system actually does. Drafting the refactors and generating the tests that tell you a migrated workload still behaves. Pointed at that archaeology, it turns the slowest and most error-prone stages into something you can move through. That is how you make an ambitious timeline honest instead of hopeful.

I want to be straight about the numbers though. You will be told generative AI cuts refactoring time by a third and migration cost by up to forty per cent, with case studies to match. When I went looking for figures like that which survive real scrutiny, I mostly could not find them. That does not mean the tools don't work. I have seen them work. It means I will not put an unproven percentage into a business case and ask people to bet on it. I will treat the claim as a hypothesis, measure it against a real baseline, and let the evidence earn its place.

There is a harder reason to be careful. AI amplifies whatever you point it at. Aim capable, autonomous tooling at weak governance and unclear ownership and you don't fix the mess, you reproduce it faster and at a scale no team of people could manage. It is the same thing I wrote about in [the five levels of organisational AI maturity](https://rokkit200.co/insights/five-levels-of-organisational-ai-maturity), showing up now at the level of infrastructure. It is why the governance and the operating model come first, and the tooling comes last.

## How I would actually run it

I don't big-bang a regulated estate. I move in waves, and I choose each wave to produce evidence. Start where the value is provable and the risk is contained. Use the early waves to test the landing zone, the controls and the cost model against reality instead of against a diagram. Let those wins pay for and de-risk the harder waves behind them. The point of the first wave is not the workload. It is proof that the machine works, delivered in the currency you agreed at the start.

If you want to know whether a migration is being led or just managed, don't look at the architecture. Look at what gets measured, and whether anyone owns those metrics. Value against the business case, in the business's terms and not IT's. Governance, with the accountability mapped and every exception logged and owned. Whether the teams can actually stand on their own yet. And what the AI really returned, against a real baseline, reported honestly even when it is less than the slide said.

None of this is really about the cloud. It is about whether someone owned the outcome from the start. That is the part no tool is going to do for you.
