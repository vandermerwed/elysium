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

const getNexusScore = (post: CollectionEntry<"notes" | "projects">) => {
  const incomingLinkCount = post.data.incomingLinks.length;
  const outgoingLinkCount = post.data.outgoingLinks.length;
  const externalResourceCount = post.data.externalLinks.length;
  const wordCount = post.data.wordCount;

  const incomingLinkModifier = 10;
  const outgoingLinkModifier = 5;
  const externalResourceModifier = 2;
  const wordCountModifier = 0.02;

  // Calculate Scores
  const incomingLinkScore = incomingLinkCount * incomingLinkModifier;
  const outgoingLinkScore = outgoingLinkCount * outgoingLinkModifier;
  const externalLinkScore = externalResourceCount * externalResourceModifier;
  const wordCountScore = wordCount * wordCountModifier;

  // Total Link Count
  const totalLinkCount = incomingLinkCount + outgoingLinkCount;

  // Determine Dominance State
  let dominanceState;
  if (totalLinkCount === 0) {
    dominanceState = "H"; // Default to Hybrid if no links
  } else {
    const incomingLinkRatio = incomingLinkCount / totalLinkCount;
    if (incomingLinkRatio > 0.6) {
      dominanceState = "R";
    } else if (incomingLinkRatio < 0.4) {
      dominanceState = "T";
    } else {
      dominanceState = "H";
    }
  }

  // Total Score Calculation
  const totalScore = incomingLinkScore + outgoingLinkScore + externalLinkScore + wordCountScore;

  if (enableDebugging) {
    console.log("--------------------");
    console.log(`Title: ${post.data.title}`);
    console.log(`Dominance State: ${dominanceState}`);
    console.log(`Total Score: ${totalScore}`);
    console.log(`Incoming Link Score: ${incomingLinkScore}`);
    console.log(`Outgoing Link Score: ${outgoingLinkScore}`);
    console.log(`External Link Score: ${externalLinkScore}`);
    console.log(`Word Count Score: ${wordCountScore}`);
    console.log("--------------------");
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
