// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  integrations: [
    expressiveCode({
      themes: ["catppuccin-frappe"],
    }),

    starlight({
      title: "Webeet Docs",
      customCss: ["./src/styles/app.css"],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/webeet-io/_onboarding",
        },
      ],
      logo: {
        light: "./src/assets/webeet_logo.png",
        dark: "./src/assets/webeet_logo_dark.png",
      },
      sidebar: [
        {
          label: "First steps",
          autogenerate: { directory: "onboarding/swe/first-steps" },
        },
        {
          label: "TypeScript",
          autogenerate: { directory: "onboarding/swe/typescript" },
        },
        {
          label: "Python",
          autogenerate: { directory: "onboarding/swe/python" },
        },
        {
          label: "Learn our stack",
          autogenerate: { directory: "onboarding/swe/resources" },
        },
        {
          label: "Day by day",
          autogenerate: { directory: "onboarding/swe/day-by-day" },
        },
      ],
    }),
  ],
});
