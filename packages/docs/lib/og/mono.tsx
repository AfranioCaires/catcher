import type { ReactNode } from "react";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ImageResponseOptions } from "next/server";

export interface GenerateProps {
  title: ReactNode;
  description?: ReactNode;
  site?: ReactNode;
  logo?: ReactNode;
}

const getFont = async (name: string) => {
  const path = join(process.cwd(), "lib/og", name);
  return readFile(path);
};

export async function getImageResponseOptions(): Promise<ImageResponseOptions> {
  const [regular, bold] = await Promise.all([
    getFont("JetBrainsMono-Regular.ttf"),
    getFont("JetBrainsMono-Bold.ttf"),
  ]);

  return {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Mono",
        data: regular,
        weight: 400,
        style: "normal",
      },
      {
        name: "Mono",
        data: bold,
        weight: 600,
        style: "normal",
      },
    ],
  };
}

export function generate({ title, description, logo, site = "My App" }: GenerateProps) {
  const primaryTextColor = "rgb(240,240,240)";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        color: "white",
        backgroundColor: "rgb(10,10,10)",
        fontFamily: "Mono",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "4rem",
        }}
      >
        <p
          style={{
            fontWeight: 600,
            fontSize: "76px",
            margin: 0,
            marginBottom: "1rem",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: "42px",
            color: "rgba(240,240,240,0.7)",
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {description}
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "24px",
            marginTop: "auto",
            color: primaryTextColor,
          }}
        >
          {logo}
          <p
            style={{
              fontSize: "46px",
              fontWeight: 600,
              margin: 0,
            }}
          >
            {site}
          </p>
        </div>
      </div>
    </div>
  );
}
