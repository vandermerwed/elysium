function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["selector", "[data-theme='dark']"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    // Remove the following screen breakpoint or add other breakpoints
    // if one breakpoint is not enough for you
    screens: {
      sm: "640px",
      lg: "1024px",
    },

    extend: {
      textColor: {
        skin: {
          base: withOpacity("--color-text-base"),
          accent: withOpacity("--color-accent"),
          "accent-secondary": withOpacity("--color-accent-secondary"),
          inverted: withOpacity("--color-fill"),
        },
      },
      backgroundColor: {
        skin: {
          fill: withOpacity("--color-fill"),
          accent: withOpacity("--color-accent"),
          inverted: withOpacity("--color-text-base"),
          card: withOpacity("--color-card"),
          "card-muted": withOpacity("--color-card-muted"),
        },
      },
      outlineColor: {
        skin: {
          fill: withOpacity("--color-accent"),
        },
      },
      borderColor: {
        skin: {
          line: withOpacity("--color-border", { opacityValue: 0.1 }),
          "line-muted": withOpacity("--color-border-muted"),
          fill: withOpacity("--color-text-base"),
          accent: withOpacity("--color-accent"),
        },
      },
      fill: {
        skin: {
          base: withOpacity("--color-text-base"),
          accent: withOpacity("--color-accent"),
        },
        transparent: "transparent",
      },
      stroke: {
        skin: {
          accent: withOpacity("--color-accent")
        }
      },
      fontFamily: {
        // mono: ["IBM Plex Mono", "monospace"],
        // mono: ["Roboto Mono", "monospace"],
        // mono: ["Rajdhani", "monospace"],
        // sans: ["Inter", "sans-serif"],
        // sans: ["Roboto", "sans-serif"],
        // mono: ["Rajdhani", "monospace"],
        mono: ["Fira Code", "Consolas", "monospace"],
        sans: ["system-ui", "sans-serif"]
      },

      typography: {
        DEFAULT: {
          css: {
            pre: {
              fontFamily: "monospace",
              color: false,
            },
            code: {
              fontFamily: "monospace",
              color: false,
            },
          },
        },
      },
      gridTemplateColumns: {
        '3': 'repeat(3, minmax(0, 1fr))',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
