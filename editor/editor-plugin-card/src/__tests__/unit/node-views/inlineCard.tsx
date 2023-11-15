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

import { fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { inlineCard } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { Card } from '@atlaskit/smart-card';

import * as useLinkUpgradeDiscoverabilityHook from '../../../common/hooks/useLinkUpgradeDiscoverability';
import { InlineCardComponent } from '../../../nodeviews/inlineCard';
import { InlineCardWithAwareness } from '../../../nodeviews/inlineCardWithAwareness';
import { createCardContext } from '../_helpers';

import { TestErrorBoundary } from './_ErrorBoundary';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en">{children}</IntlProvider>
);

describe('inlineCard', () => {
  let mockEditorView: EditorView;

  beforeEach(() => {
    (Card as any).mockImplementation((props: any) => {
      mockSmartCardRender(props);
      return <div onClick={props.onClick} data-testid="mockSmartCard" />;
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
      const onClick = () => {
        props.onClick();
      };
      return (
        <div onClick={onClick} className="smart-card-mock">
          {props.url}
        </div>
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe.each([InlineCardComponent, InlineCardWithAwareness])(
    'inline card',
    Component => {
      it('should render (findOverflowScrollParent returning false)', () => {
        mockFindOverflowScrollParent.mockImplementationOnce(() => false);
        const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
          defaultSchema,
        );
        const { getByTestId } = render(
          <Component
            node={mockInlinePmNode}
            view={mockEditorView}
            getPos={() => 0}
            cardContext={createCardContext()}
          />,
          { wrapper: TestWrapper },
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
            <Component
              node={mockInlinePmNode}
              view={mockEditorView}
              getPos={() => 0}
              cardContext={createCardContext()}
              useAlternativePreloader={true}
            />,
            { wrapper: TestWrapper },
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
            <Component
              node={mockInlinePmNode}
              view={mockEditorView}
              getPos={() => 0}
              cardContext={createCardContext()}
              useAlternativePreloader={false}
            />,
            { wrapper: TestWrapper },
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
        mockFindOverflowScrollParent.mockImplementationOnce(
          () => scrollContainer,
        );
        const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
          defaultSchema,
        );
        const { getByTestId } = render(
          <Component
            node={mockInlinePmNode}
            view={mockEditorView}
            getPos={() => 0}
            cardContext={createCardContext()}
          />,
          { wrapper: TestWrapper },
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
          <Component
            node={mockInlinePmNode}
            view={mockEditorView}
            getPos={() => 0}
            cardContext={createCardContext()}
          />,
          { wrapper: TestWrapper },
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
          <Component
            node={mockInlinePmNode}
            view={mockEditorView}
            getPos={() => 0}
            cardContext={createCardContext()}
          />,
          { wrapper: TestWrapper },
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
          <Component
            node={mockInlinePmNode}
            view={mockEditorView}
            getPos={() => 0}
          />,
          { wrapper: TestWrapper },
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
          <Component
            node={mockInlinePmNode}
            view={mockEditorView}
            getPos={() => 0}
          />,
          { wrapper: TestWrapper },
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
              <Component
                node={mockInlinePmNode}
                view={mockEditorView}
                getPos={() => 0}
                cardContext={createCardContext()}
              />
            </TestErrorBoundary>,
            { wrapper: TestWrapper },
          );

          if (err) {
            expect(getByText('Bad things have happened')).toBeInTheDocument();
          } else {
            expect(queryByText('Bad things have happened')).toBeNull();
          }
        },
      );
    },
  );

  describe('awareness upgrade features', () => {
    const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
      defaultSchema,
    );

    const setup = () =>
      render(
        <InlineCardWithAwareness
          node={mockInlinePmNode}
          view={mockEditorView}
          getPos={() => 0}
          cardContext={createCardContext()}
          useAlternativePreloader={false}
          isPulseEnabled={true}
        />,
        { wrapper: TestWrapper },
      );

    describe('isPulseEnabled', () => {
      beforeEach(() => {
        localStorage.clear();
      });

      it('should show pulse if shouldShowLinkPulse returned from the useLinkUpgradeDiscoverability hook is true', () => {
        jest
          .spyOn(useLinkUpgradeDiscoverabilityHook, 'default')
          .mockReturnValue({
            shouldShowLinkPulse: true,
            shouldShowLinkOverlay: true,
            shouldShowToolbarPulse: true,
          });

        const { getByTestId } = setup();

        const cardElement = getByTestId('mockSmartCard');
        expect(cardElement).toBeInTheDocument();
        expect(getByTestId('discovery-pulse')).toBeDefined();
      });

      it('should not show pulse if shouldShowLinkPulse returned from the useLinkUpgradeDiscoverability hook is false', () => {
        jest
          .spyOn(useLinkUpgradeDiscoverabilityHook, 'default')
          .mockReturnValue({
            shouldShowLinkPulse: false,
            shouldShowLinkOverlay: true,
            shouldShowToolbarPulse: true,
          });

        const { getByTestId, queryByTestId } = setup();

        const cardElement = getByTestId('mockSmartCard');
        expect(cardElement).toBeInTheDocument();
        expect(queryByTestId('discovery-pulse')).toBeFalsy();
      });

      it('should invalidate the local storage key with an expiration of 1 day when the pulse starts', () => {
        jest
          .spyOn(useLinkUpgradeDiscoverabilityHook, 'default')
          .mockReturnValue({
            shouldShowLinkPulse: true,
            shouldShowLinkOverlay: true,
            shouldShowToolbarPulse: true,
          });

        const { getByTestId } = setup();

        const cardElement = getByTestId('mockSmartCard');
        expect(cardElement).toBeInTheDocument();

        const pulse = getByTestId('discovery-pulse');
        expect(pulse).toBeDefined();

        fireEvent.animationStart(pulse);

        const localStorageValue = localStorage.getItem(
          '@atlaskit/editor-plugin-card_smart-link-upgrade-pulse',
        );
        expect(localStorage).toBeDefined();

        expect(JSON.parse(localStorageValue || '')).toMatchObject({
          value: 'discovered',
          expires: expect.any(Number),
        });
      });
    });

    describe('isOverlayEnabled', () => {
      it('should not show overlay if value returned from useLinkUpgradeDiscoverability is false', () => {
        jest
          .spyOn(useLinkUpgradeDiscoverabilityHook, 'default')
          .mockReturnValue({
            shouldShowLinkPulse: true,
            shouldShowLinkOverlay: false,
            shouldShowToolbarPulse: true,
          });

        const { getByTestId, queryByTestId } = setup();

        const cardElement = getByTestId('mockSmartCard');
        expect(cardElement).toBeInTheDocument();

        fireEvent.mouseEnter(cardElement);
        expect(queryByTestId('inline-card-overlay')).toBeFalsy();
      });

      it('should not show overlay by default when useLinkUpgradeDiscoverability is true', () => {
        jest
          .spyOn(useLinkUpgradeDiscoverabilityHook, 'default')
          .mockReturnValue({
            shouldShowLinkPulse: true,
            shouldShowLinkOverlay: true,
            shouldShowToolbarPulse: true,
          });

        const { getByTestId, queryByTestId } = setup();

        const cardElement = getByTestId('mockSmartCard');
        expect(cardElement).toBeInTheDocument();
        expect(queryByTestId('inline-card-overlay')).toBeFalsy();
      });

      it('should show overlay on mouse enter if value returned from useLinkUpgradeDiscoverability is true', () => {
        jest
          .spyOn(useLinkUpgradeDiscoverabilityHook, 'default')
          .mockReturnValue({
            shouldShowLinkPulse: true,
            shouldShowLinkOverlay: true,
            shouldShowToolbarPulse: true,
          });

        const { getByTestId } = setup();

        const cardElement = getByTestId('mockSmartCard');
        expect(cardElement).toBeInTheDocument();

        fireEvent.mouseEnter(cardElement);
        expect(getByTestId('inline-card-overlay-close')).toBeDefined();
      });

      it('should hide overlay on mouse leave if value returned from useLinkUpgradeDiscoverability is true', () => {
        jest
          .spyOn(useLinkUpgradeDiscoverabilityHook, 'default')
          .mockReturnValue({
            shouldShowLinkPulse: true,
            shouldShowLinkOverlay: true,
            shouldShowToolbarPulse: true,
          });

        const { getByTestId, queryByTestId } = setup();

        const cardElement = getByTestId('mockSmartCard');
        expect(cardElement).toBeInTheDocument();

        fireEvent.mouseEnter(cardElement);
        expect(getByTestId('inline-card-overlay-close')).toBeDefined();

        fireEvent.mouseLeave(cardElement);
        expect(queryByTestId('inline-card-overlay')).toBeFalsy();
      });
    });
  });
});
