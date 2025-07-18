// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightUtils from "@lorenzo_lewis/starlight-utils";
import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  integrations: [
    expressiveCode({
      themes: ["catppuccin-frappe"],
    }),

    starlight({
      title: "Webeet Docs",
      plugins: [
        starlightUtils({
          multiSidebar: {
            switcherStyle: "hidden",
          },
        }),
      ],
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
          label: "SWE",
          autogenerate: { directory: "onboarding/swe" },
        },
        {
          label: "Data",
          autogenerate: { directory: "onboarding/data" },
        },
        {
          label: "DevSecOps",
          autogenerate: { directory: "onboarding/devsecops" },
        },
      ],
    }),
  ],
});
