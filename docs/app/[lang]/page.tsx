import HomePage from "@/components/home/home-page";
import { i18n } from "@/lib/i18n";
import { source } from "@/lib/source";
import "./page.css";

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default async function Home(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  return <HomePage pageTree={source.getPageTree(lang)} />;
}
