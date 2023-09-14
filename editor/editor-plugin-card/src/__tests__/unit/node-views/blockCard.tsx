import React from 'react';

import { render, screen } from '@testing-library/react';
let mockFindOverflowScrollParent = jest.fn();
let mockRafSchedule = jest.fn().mockImplementation((cb: any) => cb());
jest.mock('raf-schd', () => (cb: any) => () => mockRafSchedule(cb));

jest.mock('@atlaskit/smart-card', () => ({
  ...jest.requireActual<Object>('@atlaskit/smart-card'),
  Card: jest.fn(),
}));

jest.mock('@atlaskit/editor-common/ui', () => ({
  findOverflowScrollParent: () => mockFindOverflowScrollParent(),
  overflowShadow: jest.fn(),
  sharedExpandStyles: jest.fn(),
  WidthProvider: jest.fn(),
}));

jest.mock('@atlaskit/editor-common/utils', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/utils'),
  browser: {
    ie: false,
    ie_version: 0,
  },
  withImageLoader: jest.fn(),
}));
import { browser } from '@atlaskit/editor-common/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { blockCard } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { Card } from '@atlaskit/smart-card';

import { BlockCardComponent } from '../../../nodeviews/blockCard';
import { createCardContext } from '../_helpers';

import { TestErrorBoundary } from './_ErrorBoundary';

describe('blockCard', () => {
  let mockEditorView: any;

  beforeEach(() => {
    (Card as any).mockImplementation((props: any) => {
      props.onResolve({
        title: 'my-title',
        url: 'https://my.url.com',
      });
      return <div data-testid="smart-card-mock">{props.url}</div>;
    });
    mockFindOverflowScrollParent = jest.fn();
    mockEditorView = {
      state: {
        selection: {
          from: 0,
          to: 0,
        },
        tr: {
          setMeta: jest
            .fn()
            .mockImplementation((_pluginKey: any, action: any) => action),
        },
      },
      dispatch: jest.fn(),
    } as unknown as EditorView;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render (findOverflowScrollParent returning false)', () => {
    mockFindOverflowScrollParent.mockImplementationOnce(() => false);
    const mockBlockCardPmNode = blockCard({ url: 'https://some/url' })()(
      defaultSchema,
    );
    render(
      <BlockCardComponent
        node={mockBlockCardPmNode}
        view={mockEditorView}
        getPos={() => 0}
        cardContext={createCardContext()}
      />,
    );

    expect(screen.getByTestId('smart-card-mock')).toBeInTheDocument();
  });

  it('should call registerCard when URL renders', () => {
    const mockBlockPmNode = blockCard({ url: 'https://some/url' })()(
      defaultSchema,
    );
    render(
      <BlockCardComponent
        node={mockBlockPmNode}
        view={mockEditorView}
        getPos={() => 0}
        cardContext={createCardContext()}
      />,
    );

    expect(mockRafSchedule).toHaveBeenCalledTimes(1);
    expect(mockEditorView.state.tr.setMeta).toHaveBeenCalledTimes(1);
    expect(mockEditorView.dispatch).toHaveBeenCalledTimes(1);
    expect(mockEditorView.dispatch).toHaveBeenCalledWith({
      info: {
        pos: 0,
        title: 'my-title',
        url: 'https://my.url.com',
      },
      type: 'REGISTER',
    });
  });

  it.each([new Error(), undefined, null])(
    'should only throw err when onError prop is called with an err value',
    err => {
      (Card as any).mockImplementation((props: any) => {
        props.onResolve({
          title: 'my-title',
          url: 'https://my.url.com',
        });
        props.onError({ url: 'https://my.url.com', err });
        return null;
      });
      const mockBlockPmNode = blockCard({ url: 'https://some/url' })()(
        defaultSchema,
      );

      const { queryByText, getByText } = render(
        <TestErrorBoundary>
          <BlockCardComponent
            node={mockBlockPmNode}
            view={mockEditorView}
            getPos={() => 0}
            cardContext={createCardContext()}
          />
        </TestErrorBoundary>,
      );

      if (err) {
        expect(getByText('Bad things have happened')).toBeInTheDocument();
      } else {
        expect(queryByText('Bad things have happened')).toBeNull();
      }
    },
  );

  describe('give the browser is Edge 44 or below', () => {
    it('should NOT render span after SmartCard to stop edit popup rendering to low', () => {
      browser.ie = true;
      browser.ie_version = 18;
      const mockBlockCardPmNode = blockCard({ url: 'https://some/url' })()(
        defaultSchema,
      );
      render(
        <BlockCardComponent
          node={mockBlockCardPmNode}
          view={mockEditorView}
          getPos={() => 0}
          cardContext={createCardContext()}
        />,
      );

      const spanElement = screen.queryByRole('span');
      expect(spanElement).toBeNull();
    });
  });

  describe('give the browser is Chromium', () => {
    it('should render a span after SmartCard to fix GAP cursor bug', () => {
      browser.ie = false;
      browser.ie_version = 0;
      const mockBlockCardPmNode = blockCard({ url: 'https://some/url' })()(
        defaultSchema,
      );
      const { container } = render(
        <BlockCardComponent
          node={mockBlockCardPmNode}
          view={mockEditorView}
          getPos={() => 0}
          cardContext={createCardContext()}
        />,
      );

      const spanElement = container.querySelector('span');
      expect(spanElement).toHaveAttribute('contenteditable', 'true');
    });
  });
});
