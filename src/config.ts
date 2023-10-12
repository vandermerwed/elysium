import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://danielvandermerwe.com/",
  author: "Daniel van der Merwe",
  desc: "Embark on a cosmic journey with Captain Daniel aboard the Elysium. Navigate through sectors dedicated to productivity, technology, and the quantified self, as he traverses life's many challenges and discoveries.",
  title: "Elysium Chronicles",
  ogImage: "og.png",
  lightAndDarkMode: true,
  postPerPage: 15,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/vandermerwed",
    linkTitle: ` ${SITE.author} on Github`,
    active: true,
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
    name: "Mail",
    href: "mailto:yourmail@gmail.com",
    linkTitle: `Send an email to ${SITE.author}`,
    active: false,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/vandermerwed",
    linkTitle: `${SITE.author} on Twitter`,
    active: true,
  },
  {
    name: "Twitch",
    href: "https://twitch.com/",
    linkTitle: `${SITE.author} on Twitch`,
    active: false,
  },
  {
    name: "YouTube",
    href: "https://github.com/",
    linkTitle: `${SITE.author} on YouTube`,
    active: false,
  },
  {
    name: "WhatsApp",
    href: "https://github.com/",
    linkTitle: `${SITE.author} on WhatsApp`,
    active: false,
  },
  {
    name: "Snapchat",
    href: "https://github.com/",
    linkTitle: `${SITE.author} on Snapchat`,
    active: false,
  },
  {
    name: "Pinterest",
    href: "https://github.com/",
    linkTitle: `${SITE.author} on Pinterest`,
    active: false,
  },
  {
    name: "TikTok",
    href: "https://github.com/",
    linkTitle: `${SITE.author} on TikTok`,
    active: false,
  },
  {
    name: "CodePen",
    href: "https://github.com/",
    linkTitle: `${SITE.author} on CodePen`,
    active: false,
  },
  {
    name: "Discord",
    href: "https://github.com/",
    linkTitle: `${SITE.author} on Discord`,
    active: false,
  },
  {
    name: "GitLab",
    href: "https://github.com/",
    linkTitle: `${SITE.author} on GitLab`,
    active: false,
  },
  {
    name: "Reddit",
    href: "https://github.com/",
    linkTitle: `${SITE.author} on Reddit`,
    active: false,
  },
  {
    name: "Skype",
    href: "https://github.com/",
    linkTitle: `${SITE.author} on Skype`,
    active: false,
  },
  {
    name: "Steam",
    href: "https://github.com/",
    linkTitle: `${SITE.author} on Steam`,
    active: false,
  },
  {
    name: "Telegram",
    href: "https://github.com/",
    linkTitle: `${SITE.author} on Telegram`,
    active: false,
  },
  {
    name: "Mastodon",
    href: "https://github.com/",
    linkTitle: `${SITE.author} on Mastodon`,
    active: false,
  },
];
