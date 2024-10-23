import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "One Line Initialization",
    Svg: require("@site/static/img/default-feature.svg").default,
    description: (
      <>
        KlyraSDK was designed from the ground up to be easily installed and used
        to get your exchange up and running quickly.
      </>
    ),
  },
  {
    title: "Focus on What Matters",
    Svg: require("@site/static/img/default-feature.svg").default,
    description: (
      <>
        KlyraSDK lets you focus on your users, and we&apos;ll handle the
        backend. This includes state management, customizable components, and
        authentication.
      </>
    ),
  },
  {
    title: "Maximize Customization",
    Svg: require("@site/static/img/default-feature.svg").default,
    description: (
      <>
        Extend or customize KlyraSDK to fulfill the needs for your exchange.
        KlyraSDK is built modularly so you can use what you can plug-and-play
        what you need.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
