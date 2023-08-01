import React from 'react';

import PropTypes from 'prop-types';

import type { CardContext } from '@atlaskit/link-provider';

type CardContextProviderProps = {
  children: ({ cardContext }: { cardContext?: CardContext }) => React.ReactNode;
};

/**
 * Provides the link provider context via the legacy context adapter
 * and children render function
 */
// eslint-disable-next-line @repo/internal/react/no-class-components
export class CardContextProvider extends React.Component<
  CardContextProviderProps,
  {}
> {
  static contextTypes = {
    contextAdapter: PropTypes.object,
  };

  render() {
    const cardContext = this.context.contextAdapter
      ? this.context.contextAdapter.card?.value
      : undefined;

    return this.props.children({ cardContext });
  }
}
