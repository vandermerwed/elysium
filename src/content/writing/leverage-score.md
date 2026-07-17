---
pubDatetime: 2026-07-17T09:00:00Z
title: The Leverage Score
featured: false
status: release
tags:
  - ai
  - agents
  - productivity
  - measurement
description: Why I started counting agent hours against my own, the ratio I call my leverage score, and why a big number means nothing without judgement.
aiUsage:
  - research
  - ideation
  - editing
  - proofreading
---

I have tracked my time for many years. I do it without thinking. I switch a timer when I switch tasks, and I have done it so long that it just runs as a subconscious background process.

A few months ago it stopped computing.

I went to change the timer, the way I always do, because I had moved on to something else and I stalled. I didn't know what to set it to. "I" was working on several things at once, with several agents running on different tasks, and the timer wanted me to name the one thing I was doing. There wasn't one thing. The version of me the timer was built for, one person on one task for one stretch of attention, didn't exist anymore.

This has been nagging at me for a while now and I think I can put a name to it now.

## Steering, not doing

I am not firing a handful of instructions at a handful of agents and walking away. My harness is set up to stop and ask me the moment it hits a roadblock or an uncertainty, so the sessions pull me back in whenever they need a decision. The way I work now is closer to steering a set of collaborative sessions than running a set of unattended jobs.

It does not work for everything. Anything that needs deep, sustained attention is hard to run in parallel. Writing, for me, is a one-at-a-time thing. Research parallelises easily. So does a lot of code, several features on the same project, or different features across separate projects. The number of things I can run at once is really just a measure of how much context I can hold in my head at the same time, manifested as a spread of terminals.

## Breaking it down

So I broke it down to the fundamentals. There are two things I actually care about, how much the agents produced and how much of my own time it cost. For every hour I spend at the computer, how many agent hours ran off the back of it.

I call this ratio my "leverage score".

The way I work it out is not clever, and it only works because the agents I use are CLI tools that keep a session history on disk. On the agent side I read those logs, measure the active time in each one, and add it all up across every session and every tool. Sessions that ran in parallel stack, so an hour with three agents going is three agent hours. On my side I use RescueTime for my actual time at the computer and phone. The score is the one divided by the other. It is deterministic, no model involved, just arithmetic over two numbers.

This number only measures amplification, not efficiency though. A high score does not mean I worked faster. It just means more ran beyond my own screen time.

Getting better at this is mostly a matter of engineering the loops the agents run in, so they can go longer before they need me. There is a name starting to stick for that, [loop engineering](https://addyosmani.com/blog/loop-engineering/), the shift from writing a good prompt to designing the reason, act and check cycle an agent repeats on its own. The better those loops get, the higher the score climbs, because each hour of mine is holding up more agent hours.

## What the number is for

I would advise against the default reaction here, which would be to start chasing the score, to feel good about a bigger number every week. But agent hours are not automatically useful hours. If you chase the score and you are not actually reviewing what comes out, what is the point. You would just be producing nonsense faster.

So the number only means anything because I spend my time directing and reviewing output, and something only ships once it passes a quality bar, whether that bar is enforced by my harness, written into a specification, or just me looking at the result and deciding I am happy with it. Human judgment is still the thing that decides what counts.

The leverage score tells me how much I am handing off. Whether the work is any good is still my problem.
