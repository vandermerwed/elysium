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
modDatetime: 2026-07-13T12:22:18Z
---

## Table of contents

Most cloud migrations disappoint, and we usually explain why in technical terms. The wrong landing zone, or the monolith that would not decompose. I have worked on enough of these migrations to believe the technical story is mostly a symptom.

The numbers that should worry you are not about architecture. McKinsey's 2021 survey of around 450 CIOs estimated that migration missteps were wasting well over $100 billion globally across a three-year horizon, and putting more than $500 billion in shareholder value at risk. Two years earlier the Cloud Security Alliance found that 90 per cent of CIOs had already lived through a failed or disrupted enterprise migration, and three-quarters ran late. Those figures are dated now, and they predate the AI that every vendor is selling as the cure. The pattern underneath them has not changed, because it was never really a technical pattern. Migrations fail because the organisation moving to the cloud does not change how it makes decisions, owns risk, or measures value.

That is a failure of leadership, not of technology. A migration in a regulated business is not a technology programme with a change workstream bolted on. It is an operating-model change that happens to involve technology, and it lives or dies on four decisions taken before the first workload moves. AI changes the pace of all four and the nature of none.

## Start with the value contract, not the architecture

The first thing a serious migration needs is not a target architecture. It is a single business case that ties the spend to revenue, cost and risk, and the people paying for it agreeing to own the outcome rather than approve a budget and step back.

I have watched migrations collect a dozen implicit business cases. The CFO wants the data-centre lease gone, security wants a defensible posture, a product line wants to ship faster, and infrastructure wants to stop patching hardware at 2am. Each one is legitimate. Left unreconciled, they guarantee that whatever you deliver, someone important calls it a failure. Someone has to force them into one narrative with numbers attached, turn it into quarterly targets that finance and technology track together, and settle decision rights before anything moves. Who approves an exception when a workload turns out to be dearer in the cloud. Who signs off when a team wants to defer a control to hit a date. If nobody knows, the answer defaults to whoever shouts loudest, and that is how governance erodes, one reasonable-sounding exception at a time.

Framed against what the business actually cares about, growth and resilience, this turns the migration from a cost to be tolerated into an investment someone owns. That ownership is the point. It is what survives the first bad quarter.

## Governance is the spine, and it cannot be delegated

In a regulated organisation there is one principle that does not move. You can outsource the work. You cannot outsource the accountability.

The cloud runs on a shared-responsibility model, because this is where well-run programmes and negligent ones diverge. The provider secures the underlying infrastructure. As you move from raw infrastructure towards managed and SaaS services, the provider takes on more of the stack. The line never reaches zero on your side. You always own your data, your identities and access, and your endpoints. Even in a SaaS product where the vendor patches everything, you still own who is entitled to what. AWS, Microsoft and the Cloud Security Alliance all describe it the same way, because it is not a marketing position.

For a regulated business the consequence is blunt. An organisation can hand the provider the operational work of managing risk, but it keeps the accountability for the regulated outcome. Financial-services outsourcing guidance is firmer still, holding the licensee accountable even when a third party does the work. So good governance here is not a committee that reviews the migration after the fact. It is a set of guardrails, landing zones with controls built in and identity and data-protection standards enforced by the platform rather than by good intentions, set on day one. You put the fence up first, so that later, when AI lets people move quickly, they can only move quickly inside it. Built this way, governance speeds the programme up. It lets you say yes quickly, because the risky answers are already designed out.

## Redesign how IT actually works

The most expensive mistake I see is an organisation that lifts its workloads to the cloud and lifts its org chart along with them. It carries reactive, ticket-driven habits into a place that charges by the hour, and then wonders why the promised agility never arrives.

The migration is the moment to change how the work happens. The shift that holds is from ticket-based operations to product teams that own a capability end to end and answer to clear service levels, rather than passing work across a wall. That only sticks if you resource the new shape on purpose. Platform engineering, so teams are not each reinventing the landing zone. Security embedded in the teams rather than consulted at the end. Data engineering treated as a first-class discipline. And a FinOps practice, so that consumption-based spend has an owner before the first surprise invoice rather than after it. Cloud turns cost into a daily engineering decision, and if no one is accountable for it, it arrives as a quarterly shock.

None of this is free, and pretending otherwise is how support drains away by month six. Part of the value contract has to fund the operating model, not only the infrastructure. Budgeting for servers and forgetting to budget for the way people work is how migrations quietly fail.

## AI is an accelerant you command, with your eyes open

Now the part everyone wants to lead with, and the part I deliberately do not.

AI genuinely compresses this work. In my experience it is good, and getting better, at the archaeology nobody enjoys. Mapping dependencies in a legacy estate that no single person fully understands. Reading years of code to reconstruct what a system actually does. Drafting the refactors and generating the test coverage that tells you a migrated workload still behaves. Run as a migration factory, these tools take the slowest and most error-prone stages of a migration and speed them up. AI-assisted operations can then watch a live estate for drift, cost and risk at a scale a team cannot sustain by hand. Used well, this is how you make an ambitious timeline credible.

I want to be candid about the evidence. The vendor numbers are ahead of the independent proof. You will be told that generative AI cuts refactoring time by a third and migration cost by up to 40 per cent, and you will be shown case studies with eight-figure savings. When I went looking for figures like these that survive real scrutiny, I mostly did not find them. That does not mean the tools do not work. I have seen them work. It means I will not put an unproven percentage into a business case and ask people to bank on it. I will treat those claims as hypotheses, test them against a real baseline, publish the numbers, and let the evidence earn its place.

There is a further reason for the discipline. AI amplifies whatever operating model you point it at. Aim capable, autonomous tooling at weak governance and unclear accountability and you do not fix the problem, you reproduce it faster and at greater scale than a team of people ever could. This is the same principle I set out in [the five levels of organisational AI maturity](https://rokkit200.co/insights/five-levels-of-organisational-ai-maturity), now playing out at the level of infrastructure. It is why the governance line and the operating model come first.

## Sequence for evidence

A word on how I would actually run it, offered as judgement rather than received wisdom. I do not big-bang a regulated estate. I migrate in waves, and I choose each wave so that it produces evidence. Start where the ratio of value to risk is provable. Use the early waves to test the landing zone, the controls and the cost model against reality. Let those wins fund and de-risk the harder waves behind them. The point of the first wave is not the workload. It is proof that the machine works, delivered in the currency agreed at the start. In a multi-year programme you earn confidence one quarter of demonstrated results at a time.

## What well-run looks like

If you want to know whether a migration is being led or merely managed, do not ask about the architecture. Ask what gets measured. Four things, reported the same way every quarter.

Value realised against the business case, produced with finance and stated in the business's currency rather than IT's. Governance posture, with accountability mapped, guardrails enforced by the platform, and exceptions logged and owned. Operating-model health, meaning product teams standing on their own and FinOps holding the cost line. And AI's actual return, measured against a real baseline and reported honestly.

The technology mostly works. The providers are good at their half of the shared-responsibility line. What decides whether a migration creates value or destroys it is whether someone owned the value contract, held the governance line, changed how the organisation works, and used the new tools with judgement.

---

*Sources behind this piece. McKinsey, "Cloud-migration opportunity: business value grows, but missteps abound" (2021). Cloud Security Alliance on the shared-responsibility model (2024) and on enterprise migration outcomes (2019, reported via CIO.com). AWS and Microsoft shared-responsibility documentation. Figures on AI-driven acceleration remain, as of writing, largely vendor-reported rather than independently established, which is the point of the section above.*
