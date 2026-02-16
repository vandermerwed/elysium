import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://danielvandermerwe.com/",
  author: "Daniel van der Merwe",
  profile: "https://danielvandermerwe.com/",
  desc: "Daniel van der Merwe's home base for practical notes on mindful productivity, tools for thought, and software patterns that survive contact with reality.",
  title: "Daniel van der Merwe",
  logo: "logo.png",
  ogImage: "og.png",
  lightAndDarkMode: true,
  postPerIndex: 5,
  fragmentsPerIndex: 6,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  editPost: {
    url: "https://github.com/vandermerwed/elysium/edit/main/src/content",
    text: "Suggest Changes",
    appendFilePath: true,
    disabled: true
  },
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 36,
  height: 36,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Mail",
    href: "mailto:daniel@danielvandermerwe.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "Github",
    href: "https://github.com/vandermerwed",
    linkTitle: ` ${SITE.author} on Github`,
    active: true,
  },
  {
    name: "Facebook",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Facebook`,
    active: false,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/vandermerwed",
    linkTitle: `${SITE.author} on Instagram`,
    active: false,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/vandermerwed",
    linkTitle: `${SITE.author} on LinkedIn`,
    active: true,
  },
  {
    name: "X",
    href: "https://x.com/vandermerwed",
    linkTitle: `${SITE.author} on X`,
    active: false,
  },
  {
    name: "Twitch",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Twitch`,
    active: false,
  },
  {
    name: "YouTube",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on YouTube`,
    active: false,
  },
  {
    name: "WhatsApp",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on WhatsApp`,
    active: false,
  },
  {
    name: "Snapchat",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Snapchat`,
    active: false,
  },
  {
    name: "Pinterest",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Pinterest`,
    active: false,
  },
  {
    name: "TikTok",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on TikTok`,
    active: false,
  },
  {
    name: "CodePen",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on CodePen`,
    active: false,
  },
  {
    name: "Discord",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Discord`,
    active: false,
  },
  {
    name: "GitLab",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on GitLab`,
    active: false,
  },
  {
    name: "Reddit",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Reddit`,
    active: false,
  },
  {
    name: "Skype",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Skype`,
    active: false,
  },
  {
    name: "Steam",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Steam`,
    active: false,
  },
  {
    name: "Telegram",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Telegram`,
    active: false,
  },
  {
    name: "Mastodon",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Mastodon`,
    active: false,
  },
  {
    name: "Bluesky",
    href: "https://bsky.app/profile/danielvandermerwe.com",
    linkTitle: `${SITE.title} on Bluesky`,
    active: true,
  },
];
