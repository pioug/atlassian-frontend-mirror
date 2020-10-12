import React from 'react';
import {
  ConfluenceFeatures,
  JiraFeatures,
  DEFAULT_FEATURES,
} from '../util/features';

interface State {
  features: (ConfluenceFeatures | JiraFeatures) | undefined;
}

const FeaturesContext = React.createContext<State>({
  features: undefined,
});

export interface FeaturesProviderProps {
  features: ConfluenceFeatures | JiraFeatures;
}

export function injectFeatures<T>(
  Component: React.ComponentType<T & FeaturesProviderProps>,
) {
  return (props: Pick<T, Exclude<keyof T, keyof FeaturesProviderProps>>) => (
    <FeaturesContext.Consumer>
      {({ features }) => (
        <Component {...(props as T)} features={features || DEFAULT_FEATURES} />
      )}
    </FeaturesContext.Consumer>
  );
}

export default class FeaturesProvider extends React.Component<
  FeaturesProviderProps,
  State
> {
  state = {
    features: this.props.features,
  };

  render() {
    const { children } = this.props;
    const { features } = this.state;

    return (
      <FeaturesContext.Provider value={{ features }}>
        {children}
      </FeaturesContext.Provider>
    );
  }
}
