import React from 'react';
import PropTypes from 'prop-types';
import type { CardContext as CardContextType } from '@atlaskit/link-provider';
import { asMock } from '@atlaskit/media-test-helpers';

type ContextWrapper<T> = {
  Provider: React.Provider<T>;
  Consumer: React.Consumer<T>;
  value: T;
};

type MockCardContextAdapterProps = {
  card?: ContextWrapper<CardContextType | undefined>;
};

/**
 * Provides SmartCard context
 * @see packages/editor/editor-core/src/nodeviews/context-adapter.tsx
 */
export class MockCardContextAdapter extends React.PureComponent<
  MockCardContextAdapterProps,
  {}
> {
  static childContextTypes = {
    contextAdapter: PropTypes.object,
  };

  contextState: MockCardContextAdapterProps = {};

  getChildContext() {
    return {
      contextAdapter: {
        card: this.props.card,
      },
    };
  }

  render() {
    return this.props.children;
  }
}

export const cardContext = ({
  Provider: {},
  Consumer: {},
  value: {
    extractors: {
      getPreview: jest.fn(),
    },
    store: {
      getState: jest.fn(() => ({})),
      dispatch: jest.fn(),
      subscribe: jest.fn(),
      replaceReducer: jest.fn(),
    },
  },
} as unknown) as ContextWrapper<CardContextType | undefined>;

/**
 * Sets the SmartCardContext to return a value when calling the `getPreview` extractor
 * @param preview Preview url string
 */
export const mockPreview = (preview?: string) => {
  asMock(cardContext!.value!.extractors.getPreview).mockReturnValue(preview);
};

/**
 * Sets the SmartCardContext to return a specific state when calling `getState` on the store
 * @param state Store state to mock
 */
export const mockCardContextState = (state: {} = {}) => {
  asMock(cardContext!.value!.store.getState).mockReturnValue(state);
};
