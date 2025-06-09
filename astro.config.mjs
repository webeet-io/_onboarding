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
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Overview", slug: "onboarding/swe/first-steps/overview" },
            {
              label: "Courses & Resources",
              slug: "onboarding/swe/first-steps/courses-overview",
            },
            {
              label: "Portfolio Project",
              slug: "onboarding/swe/first-steps/project-overview",
            },
          ],
        },
        {
          label: "Learn our stack",
          items: [
            {
              label: "React router v7",
              slug: "onboarding/swe/resources/resources-react-router-v7",
            },
            {
              label: "Fastify",
              slug: "onboarding/swe/resources/resources-fastify",
            },
            {
              label: "Zustand",
              slug: "onboarding/swe/resources/resources-zustand",
            },
            {
              label: "Amparo",
              slug: "onboarding/swe/resources/resources-amparo",
            },
            { label: "Zod", slug: "onboarding/swe/resources/resources-zod" },
            { label: "Jest", slug: "onboarding/swe/resources/resources-jest" },
          ],
        },
        {
          label: "Day by day",
          items: [
            { label: "Day one", slug: "onboarding/swe/day-by-day/day-one" },
            { label: "Day two", slug: "onboarding/swe/day-by-day/day-two" },
            { label: "Day three", slug: "onboarding/swe/day-by-day/day-three" },
            { label: "Day four", slug: "onboarding/swe/day-by-day/day-four" },
            { label: "Day five", slug: "onboarding/swe/day-by-day/day-five" },
            { label: "Day six", slug: "onboarding/swe/day-by-day/day-six" },
            { label: "Day seven", slug: "onboarding/swe/day-by-day/day-seven" },
            { label: "Day eight", slug: "onboarding/swe/day-by-day/day-eight" },
            { label: "Day nine", slug: "onboarding/swe/day-by-day/day-nine" },
          ],
        },
      ],
    }),
  ],
});
