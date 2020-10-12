import { Feature, FeatureMap } from '../../types';

const propToFeature = (props: any, key: string) => {
  switch (key) {
    case Feature.xflow:
      return typeof props.triggerXFlow === 'function';
    case Feature.isProductStoreInTrelloJSWFirstEnabled:
      return Boolean(
        props.recommendationsFeatureFlags &&
          props.recommendationsFeatureFlags
            .isProductStoreInTrelloJSWFirstEnabled,
      );
    case Feature.isProductStoreInTrelloConfluenceFirstEnabled:
      return Boolean(
        props.recommendationsFeatureFlags &&
          props.recommendationsFeatureFlags
            .isProductStoreInTrelloConfluenceFirstEnabled,
      );
    default:
      return Boolean(props[key]);
  }
};

export default function mapPropsToFeatures(props: any): FeatureMap {
  return Object.keys(Feature).reduce(
    (acc, key) => ({
      ...acc,
      [key]: propToFeature(props, key),
    }),
    {},
  ) as FeatureMap;
}
