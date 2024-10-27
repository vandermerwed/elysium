import type { CollectionEntry } from "astro:content";

const enableDebugging = false;

type IconScoreRanges = {
  [key: string]: [number, number];
};

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

const getNexusScore = (post: CollectionEntry<"blog" | "projects">) => {

  const incomingLinkCount = post.data.incomingLinks.length;
  const outgoingLinkCount = post.data.outgoingLinks.length;
  const externalResourceCount = post.data.externalLinks.length;
  const wordCount = post.data.wordCount;

  const incomingLinkModifier = 3;
  const outgoingLinkModifier = 1.5;
  const externalResourceModifier = 2;
  const wordCountModifier = 0.005;

  // Define a threshold for balanced state
  const linkDominanceThreshold = 10;

  // Determine link dominance
  const incomingLinkScore = incomingLinkCount * incomingLinkModifier;
  const outgoingLinkScore = outgoingLinkCount * outgoingLinkModifier;
  const externalLinkScore =
    externalResourceModifier * Math.log(1 + externalResourceCount);
  const wordCountScore = wordCount * wordCountModifier;

  const linkDominanceScore = incomingLinkScore - outgoingLinkScore;

  let dominanceState;

  if (Math.abs(linkDominanceScore) < linkDominanceThreshold) {
    dominanceState = "H";
  } else if (linkDominanceScore > 0) {
    dominanceState = "R";
  } else {
    dominanceState = "T";
  }

  const totalScore =
    Math.abs(linkDominanceScore) + wordCountScore + externalLinkScore;

  if (enableDebugging) {
    console.log("--------------------");
    console.log(`Title: ${post.data.title}`);
    console.log(`Score: ${totalScore}`);
    console.log(
      `Incoming Links: ${incomingLinkCount} * ${incomingLinkModifier} = ${incomingLinkScore}`
    );
    console.log(
      `Outgoing Links: ${outgoingLinkCount} * ${outgoingLinkModifier} = ${outgoingLinkScore}`
    );
    console.log(
      `External Resources: ${externalResourceCount} * ${externalResourceModifier} = ${externalLinkScore}`
    );
    console.log(
      `Word Count: ${wordCount} * ${wordCountModifier} = ${wordCountScore}`
    );
    console.log(
      `Link Dominance Score: ${linkDominanceScore} [Absolute: ${Math.abs(
        linkDominanceScore
      )}]`
    );
  }

  // Assign icons based on score and link dominance
  const iconScore = calculateIconScore(totalScore, dominanceState);

  return iconScore;
};

const calculateIconScore = (score: number, dominanceState: string): string => {
  const iconPrefix = dominanceState;
  let iconSuffix = "Fragment"; // Default value

  for (const [icon, [lowerBound, upperBound]] of Object.entries(
    iconScoreRanges
  )) {
    if (enableDebugging) {
      console.log(
        `(In loop) Icon: ${icon}`,
        score,
        `[${lowerBound}, ${upperBound}]`
      );
    }
    if (
      icon.startsWith(iconPrefix) &&
      score > lowerBound &&
      score <= upperBound
    ) {
      if (enableDebugging) {
        console.log(
          `(In loop) Icon Range: ${icon}`,
          score,
          `[${lowerBound}, ${upperBound}]`
        );
      }
      iconSuffix = icon.split("_")[1];
      break;
    }
  }

  if (enableDebugging) {
    console.log(`Icon Score: ${iconPrefix}-${iconSuffix}`);
    console.log("--------------------");
  }

  return `${iconPrefix}_${iconSuffix}`; // [${score}]`;
};

export default getNexusScore;
