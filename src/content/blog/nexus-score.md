---
pubDatetime: 2023-10-12T09:52:00
title: Visual Representations of Interconnectedness and Depth
slug: nexus-score
featured: true
draft: false
tags:
  - fragment
  - astro
  - digital-garden
description: "Nexus Score: A system for evaluating and visually representing notes in a digital garden based on connectedness and content depth."
type: fragment
aiUsage:
  - research
  - proofreading
  - code-assistance
  - system-design
  - data-analysis
---

I was introduced to the concept of using patterns to convey information density in this [digital garden note](https://notes.azlen.me/cri6tvov/) by [Azlen](https://twitter.com/azlenelza). Similarly, [Maggie Appleton also uses iconography](https://maggieappleton.com/notes) to visually differentiate between seedling, budding and evergreen notes in her digital garden. They inspired me to create my own pattern system to convey the interconnectedness and depth of notes on this website.

In order to create a pattern system for categorizing notes I had to define some factors that differentiate notes from each other. I selected the following criteria to try and capture connectedness and depth of each note:

- **Incoming links (Backlinks):** These represent how many other notes refer or link back to a particular note. A higher number of backlinks indicates that the note is a crucial reference or cornerstone in the digital garden.
- **Outgoing links:** This measures how many other notes a particular note refers to. It can indicate the breadth of a note and its interconnectedness within the digital garden.
- **Word count:** A note's length can often signify its depth or thoroughness on a subject. Longer notes might delve deeper into a topic, while shorter ones could be more concise or introductory.
- **External links:** These demonstrate how a note connects to external resources or references outside the digital garden. It's a nod to the fact that no note exists in isolation and that our knowledge often builds on external sources.

## Criteria and Weights

I then needed to figure out a way to score notes based on these criteria. After a lot of coffee and tinkering I settled on the following approach.

I decided on some arbitrary weightings for each criterion based on absolutely no research at all, I just went with my gut and some rudimentary reasoning. I'll tweak these weightings as the site grows.

I'll use code snippets to explain the approach I took.

```typescript
const incomingLinkModifier = 3;
const outgoingLinkModifier = 1.5;
const externalResourceModifier = 2;
const wordCountModifier = 0.005;
```

I then work out a score for each criterion:

```typescript
const incomingLinkScore = incomingLinkCount * incomingLinkModifier;
const outgoingLinkScore = outgoingLinkCount * outgoingLinkModifier;
const externalLinkScore =
  externalResourceModifier * Math.log(1 + externalResourceCount);
const wordCountScore = wordCount * wordCountModifier;
```

Pretty self explanatory, but it's worth noting the reason I used logarithmic scoring on the external link is because of posts like [[loadout-update-2023-q3|Loadout Update (2023/Q3)]] . This post has many external links which in normal cases wouldn't be a problem, but in this case it created an abnormal inflation of the score the post was given. So I used logarithmic scoring to apply some diminishing returns on the use of external links.

In the future I might consider adding different weighting options for different post types but for now this will do.

## Introducing the Nexus Score

To calculate a score for each note based on the the weighting calculations presented some challenges. Just because a note has many outgoing links does not mean it is equal to a note that has many words.

My first approach was to tally up the scores but it didn't convey any meaningful information based on connectedness to other notes for example. Just by looking at a score you can't know if it has that score because of many incoming links or because it has a lot of words.

So the approach I settled on was to apply a multi-dimensional scoring approach.

```typescript
const linkDominanceThreshold = 10;
const linkDominanceScore = incomingLinkScore - outgoingLinkScore;

let dominanceState;

if (Math.abs(linkDominanceScore) < linkDominanceThreshold) {
  dominanceState = "H"; // Hub Note
} else if (linkDominanceScore > 0) {
  dominanceState = "R"; // Receiver Note
} else {
  dominanceState = "T"; // Transmitter Note
}
const totalScore =
  Math.abs(linkDominanceScore) + wordCountScore + externalLinkScore;
```

Ok, so what's going on here?

Firstly I calculate a dominance score by subtracting incoming link count from outgoing link count. This will either give me a negative or positive number. If the absolute (regardless of sign) dominance score is less than 10 it's a "Hub" note. It means there is a balance of incoming and outgoing links to and from the note. If it has a positive score it is a "Receiver" note that has many incoming notes. If it has negative score it is a Transmitter note with many outgoing links to other notes.

The final part of the equation is to then add the absolute link dominance score, word count score and external link score together for a final total score.

I'm then left with two outputs that form what I'm calling Nexus Score.

- A letter representing link dominance: `H / R / T`
- A number representing a total score of all the other scores

## Visually Representing Nexus Scores

To visually represent these scores on notes I had to figure out ranges for the numbers. Once again I went with gut feel based on the current scores.

```typescript
const iconScoreRanges: IconScoreRanges = {
  R_Fragment: [0, 10],
  R_Basic: [10, 26],
  R_Developed: [26, 42],
  R_Advanced: [42, 68],
  R_Integrated: [68, Infinity],

  H_Fragment: [0, 10],
  H_Basic: [10, 26],
  H_Developed: [26, 42],
  H_Advanced: [42, 68],
  H_Integrated: [68, Infinity],

  T_Fragment: [0, 10],
  T_Basic: [10, 26],
  T_Developed: [26, 42],
  T_Advanced: [42, 68],
  T_Integrated: [68, Infinity],
};
```

These ranges will definitely be adjusted over time as the site grows.

The link dominance score and total score can now be used to match a score range. As an example a note with more outgoing links than incoming links and a total score of 25 will resolve to `T_Basic`.

Here is a full map of the Nexus Score icons.

| Nexus Score | [R] Receiver                                                                                                                                                                                                                                                                                                                                                                                                                                                          | [H] Hub                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | [T] Transmitter                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fragment    | <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path></svg>                                                                                                          | <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-dashed" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M8.56 3.69a9 9 0 0 0 -2.92 1.95"></path><path d="M3.69 8.56a9 9 0 0 0 -.69 3.44"></path><path d="M3.69 15.44a9 9 0 0 0 1.95 2.92"></path><path d="M8.56 20.31a9 9 0 0 0 3.44 .69"></path><path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95"></path><path d="M20.31 15.44a9 9 0 0 0 .69 -3.44"></path><path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92"></path><path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69"></path></svg>      | <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-line" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M6 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M18 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M7.5 16.5l9 -9"></path></svg>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Basic       | <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-playstation-circle" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 21a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9a9 9 0 0 0 -9 9a9 9 0 0 0 9 9z"></path><path d="M12 12m-4.5 0a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0 -9 0"></path></svg> | <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-topology-ring-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M14 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M7 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M21 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M7 18h10"></path><path d="M18 16l-5 -8"></path><path d="M11 8l-5 8"></path></svg>                                                                                                                                                            | <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-topology-star" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M8 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M20 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M8 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M20 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M14 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M7.5 7.5l3 3"></path><path d="M7.5 16.5l3 -3"></path><path d="M13.5 13.5l3 3"></path><path d="M16.5 7.5l-3 3"></path></svg>                                                                                                                                                                                                                                                                                                                             |
| Developed   | <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-half-vertical" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path><path d="M3 12h18"></path></svg>                                                                  | <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-topology-ring-3" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M8 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M20 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M20 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M8 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M6 8v8"></path><path d="M18 16v-8"></path><path d="M8 6h8"></path><path d="M16 18h-8"></path></svg>                                                                                      | <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-topology-star-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M14 20a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M14 4a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M6 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M22 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M14 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M6 12h4"></path><path d="M14 12h4"></path><path d="M12 6v4"></path><path d="M12 14v4"></path></svg>                                                                                                                                                                                                                                                                                                                                                 |
| Advanced    | <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-half" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path><path d="M12 3v18"></path></svg>                                                                           | <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-topology-full" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M20 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M8 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M8 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M20 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M6 8v8"></path><path d="M18 16v-8"></path><path d="M8 6h8"></path><path d="M16 18h-8"></path><path d="M7.5 7.5l9 9"></path><path d="M7.5 16.5l9 -9"></path></svg>                          | <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-topology-star-3" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M18 5a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M10 5a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M6 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M18 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M14 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M22 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M6 12h4"></path><path d="M14 12h4"></path><path d="M15 7l-2 3"></path><path d="M9 7l2 3"></path><path d="M11 14l-2 3"></path><path d="M13 14l2 3"></path></svg>                                                                                                                                                                          |
| Integrated  | <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-triangle" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path><path d="M12 20l7 -12h-14z"></path></svg>                                                              | <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-topology-complex" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M20 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M8 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M8 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M20 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M14 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M7.5 7.5l3 3"></path><path d="M6 8v8"></path><path d="M18 16v-8"></path><path d="M8 6h8"></path><path d="M16 18h-8"></path></svg> | <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-topology-star-ring-3" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M18 5a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M10 5a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M6 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M18 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M14 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M22 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path><path d="M6 12h4"></path><path d="M14 12h4"></path><path d="M15 7l-2 3"></path><path d="M9 7l2 3"></path><path d="M11 14l-2 3"></path><path d="M13 14l2 3"></path><path d="M10 5h4"></path><path d="M10 19h4"></path><path d="M17 17l2 -3"></path><path d="M19 10l-2 -3"></path><path d="M7 7l-2 3"></path><path d="M5 14l2 3"></path></svg> |

> Icons source: https://tabler-icons.io/

## Future Considerations

- Normalization of scores (not straight forward to do efficiently)
- Different weightings and score ranges based on note types (theme post, loadout update, note, fragment, etc.)
- Add a citation library and adjust the nexus score to accommodate for these

## Conclusion

I know there are still many flaws in this system and many ways that it can be improved. This will do for now though and has scratched the creative itch I had. If you have any thoughts or critiques on the approach I took please feel free to [reach out to me on X (Twitter)](https://twitter.com/vandermerwed).
