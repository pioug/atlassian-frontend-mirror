import React from 'react';
import PropTypes from 'prop-types';

export type ContextAdapter = Record<string, React.Context<any>>;

// injects contexts via old context API to children
// and gives access to the original Provider so that
// the child can re-emit it
export const createContextAdapter = (createContextAdapter: ContextAdapter) => {
  return class extends React.Component<{}, { hasRendered: {} }> {
    static childContextTypes = {
      contextAdapter: PropTypes.object,
    };

    contextState: Record<string, any> = {};

    getChildContext() {
      return { contextAdapter: this.zipProvidersWithValues() };
    }

    zipProvidersWithValues() {
      return Object.keys(createContextAdapter).reduce<
        Record<string, React.Context<any> & { value: any }>
      >((zipped, name) => {
        zipped[name] = {
          Provider: createContextAdapter[name].Provider,
          Consumer: createContextAdapter[name].Consumer,
          value: this.contextState[name],
        };

        return zipped;
      }, {});
    }

    render() {
      const { children } = this.props;

      // render all the consumers, and react to their value changes independently
      const consumers = Object.keys(createContextAdapter).map((name, idx) => {
        const Consumer = createContextAdapter[name].Consumer;
        return (
          <Consumer key={idx}>
            {value => {
              // update local copy of value provided from Consumer
              if (this.contextState[name] !== value) {
                this.contextState[name] = value;
                this.forceUpdate();
              }
              return null;
            }}
          </Consumer>
        );
      });

      return (
        <>
          {consumers}
          {children}
        </>
      );
    }
  };
};
