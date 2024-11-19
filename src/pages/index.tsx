import { Redirect } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function Home(): JSX.Element {
  const { i18n } = useDocusaurusContext();
  const { currentLocale } = i18n;

  const targetPath =
    currentLocale === "es" ? "/es/docs/overview" : "/docs/overview";

  return <Redirect to={targetPath} />;
}
