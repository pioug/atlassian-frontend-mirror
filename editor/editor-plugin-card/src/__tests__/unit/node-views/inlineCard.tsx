import React from 'react';
let mockFindOverflowScrollParent = jest.fn();
let mockRafSchedule = jest.fn().mockImplementation((cb: any) => cb());
jest.mock('raf-schd', () => (cb: any) => () => mockRafSchedule(cb));
let mockSmartCardRender = jest.fn();
jest.mock('@atlaskit/smart-card', () => {
  return {
    ...jest.requireActual<Object>('@atlaskit/smart-card'),
    Card: jest.fn(),
  };
});

jest.mock('@atlaskit/editor-common/utils', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/utils'),
  browser: () => ({}),
  withImageLoader: jest.fn(),
}));

jest.mock('@atlaskit/editor-common/ui', () => ({
  findOverflowScrollParent: () => mockFindOverflowScrollParent(),
  overflowShadow: jest.fn(),
  sharedExpandStyles: jest.fn(),
  WidthProvider: jest.fn(),
}));

import { render } from '@testing-library/react';
import { EditorView } from 'prosemirror-view';

import { inlineCard } from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { Card } from '@atlaskit/smart-card';

import { InlineCardComponent } from '../../../nodeviews/inlineCard';
import { createCardContext } from '../_helpers';

import { TestErrorBoundary } from './_ErrorBoundary';

describe('inlineCard', () => {
  let mockEditorView: EditorView;

  beforeEach(() => {
    (Card as any).mockImplementation((props: any) => {
      mockSmartCardRender(props);
      return <div data-testid="mockSmartCard" />;
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
    mockSmartCardRender.mockImplementation(props => {
      props.onResolve({
        title: 'my-title',
        url: 'https://my.url.com',
      });
      return <div className="smart-card-mock">{props.url}</div>;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render (findOverflowScrollParent returning false)', () => {
    mockFindOverflowScrollParent.mockImplementationOnce(() => false);
    const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
      defaultSchema,
    );
    const { getByTestId } = render(
      <InlineCardComponent
        node={mockInlinePmNode}
        view={mockEditorView}
        getPos={() => 0}
        cardContext={createCardContext()}
      />,
    );
    const cardElement = getByTestId('mockSmartCard');
    expect(cardElement).toBeInTheDocument();
    expect(mockSmartCardRender).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://some/url',
        container: undefined,
      }),
    );
  });

  describe('with useAlternativePreloader flag', () => {
    it('should set inlinePreloaderStyle to "on-right-without-skeleton" when enabled', () => {
      const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
        defaultSchema,
      );
      const { getByTestId } = render(
        <InlineCardComponent
          node={mockInlinePmNode}
          view={mockEditorView}
          getPos={() => 0}
          cardContext={createCardContext()}
          useAlternativePreloader={true}
        />,
      );

      const cardElement = getByTestId('mockSmartCard');
      expect(cardElement).toBeInTheDocument();
      expect(mockSmartCardRender).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://some/url',
          container: undefined,
          inlinePreloaderStyle: 'on-right-without-skeleton',
        }),
      );
    });

    it('should not set inlinePreloaderStyle when not enabled', () => {
      const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
        defaultSchema,
      );
      const { getByTestId } = render(
        <InlineCardComponent
          node={mockInlinePmNode}
          view={mockEditorView}
          getPos={() => 0}
          cardContext={createCardContext()}
          useAlternativePreloader={false}
        />,
      );
      const cardElement = getByTestId('mockSmartCard');
      expect(cardElement).toBeInTheDocument();
      expect(mockSmartCardRender).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://some/url',
          container: undefined,
          inlinePreloaderStyle: undefined,
        }),
      );
    });
  });

  it('should render (findOverflowScrollParent returning node)', () => {
    const scrollContainer = document.createElement('div');
    mockFindOverflowScrollParent.mockImplementationOnce(() => scrollContainer);
    const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
      defaultSchema,
    );
    const { getByTestId } = render(
      <InlineCardComponent
        node={mockInlinePmNode}
        view={mockEditorView}
        getPos={() => 0}
        cardContext={createCardContext()}
      />,
    );
    const cardElement = getByTestId('mockSmartCard');
    expect(cardElement).toBeInTheDocument();
    expect(mockSmartCardRender).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://some/url',
        container: scrollContainer,
      }),
    );
  });

  it('should dispatch REGISTER card action when URL renders', () => {
    const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
      defaultSchema,
    );

    render(
      <InlineCardComponent
        node={mockInlinePmNode}
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

  it('should dispatch REGISTER card action when URL renders with error status', () => {
    mockSmartCardRender.mockImplementation(props => {
      props.onError({
        status: 'not_found',
        url: 'https://my.url.com',
      });
      return <div className="smart-card-mock">{props.url}</div>;
    });
    const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
      defaultSchema,
    );

    render(
      <InlineCardComponent
        node={mockInlinePmNode}
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
        url: 'https://my.url.com',
      },
      type: 'REGISTER',
    });
  });

  it('should not render Card when no cardContext nor data are provided', () => {
    const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
      defaultSchema,
    );

    const { queryByTestId } = render(
      <InlineCardComponent
        node={mockInlinePmNode}
        view={mockEditorView}
        getPos={() => 0}
      />,
    );

    const cardElement = queryByTestId('mockSmartCard');
    expect(cardElement).toBeNull();
  });

  it('should render Card when cardContext is not provided but data is provided', () => {
    const mockInlinePmNode = inlineCard({
      url: 'https://some/url',
      data: {},
    })()(defaultSchema);

    const { getByTestId } = render(
      <InlineCardComponent
        node={mockInlinePmNode}
        view={mockEditorView}
        getPos={() => 0}
      />,
    );

    const cardElement = getByTestId('mockSmartCard');
    expect(cardElement).toBeInTheDocument();
  });

  it.each([new Error(), null, undefined])(
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
      const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
        defaultSchema,
      );

      const { getByText, queryByText } = render(
        <TestErrorBoundary>
          <InlineCardComponent
            node={mockInlinePmNode}
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
});
