import React from 'react';
import { Diff } from '@atlaskit/editor-common';

export interface WithSmartCardStorageProps {
  smartCardStorage: Map<string, string>;
}

export const Context = React.createContext<Map<string, string>>(new Map());

export const Provider: React.FunctionComponent = function ({ children }) {
  return <Context.Provider value={new Map()}>{children}</Context.Provider>;
};

export const withSmartCardStorage = <Props extends WithSmartCardStorageProps>(
  WrappedComponent: React.ComponentType<Props>,
) => {
  return class extends React.Component<Diff<Props, WithSmartCardStorageProps>> {
    render() {
      return (
        <Context.Consumer>
          {(storage) => (
            <WrappedComponent
              {...(this.props as Props)}
              smartCardStorage={storage}
            />
          )}
        </Context.Consumer>
      );
    }
  };
};
