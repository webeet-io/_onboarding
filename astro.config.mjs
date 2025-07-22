// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightAutoSidebar from "starlight-auto-sidebar";
import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  integrations: [
    expressiveCode({
      themes: ["catppuccin-frappe"],
    }),

    starlight({
      title: "Webeet Docs",
      plugins: [starlightAutoSidebar()],
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
          label: "Webeet",
          collapsed: true,
          autogenerate: { directory: "general" },
        },
        {
          label: "SWE",
          collapsed: true,
          autogenerate: { directory: "onboarding/swe" },
        },
        {
          label: "Data",
          collapsed: true,
          autogenerate: { directory: "onboarding/data" },
        },
        {
          label: "DevSecOps",
          collapsed: true,
          autogenerate: { directory: "onboarding/devsecops" },
        },
      ],
    }),
  ],
});
