import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StudyAI",
    short_name: "StudyAI",
    description: "An AI study companion for focused learning.",
    start_url: "/dashboard",
    display: "standalone",
    orientation: "portrait",
    theme_color: "#FFFFFF",
    background_color: "#F8FAFC",
    icons: [
      { src: "/icon.svg", sizes: "192x192", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
