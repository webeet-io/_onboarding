// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Webeet Docs",
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
          label: "Learn our stack",
          autogenerate: { directory: "onboarding/swe/resources" },
        },
        {
          label: "Portfolio Project",
          autogenerate: { directory: "onboarding/swe/portfolio-project" },
        },
        {
          label: "Day by day",
          autogenerate: { directory: "onboarding/swe/day-by-day" },
        },
      ],
    }),
  ],
});
