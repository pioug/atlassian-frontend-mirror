import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { DiProvider, injectable } from 'react-magnetic-di';
import { mocked } from 'ts-jest/utils';
import { type JsonLd } from 'json-ld-types';
import { fireEvent, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { AISummariesStore } from '../../../../../../state/hooks/use-ai-summary/ai-summary-service/store';
import type { ProductType } from '@atlaskit/linking-common';

import {
  mockBaseResponseWithErrorPreview,
  mockBaseResponseWithPreview,
  mockConfluenceResponse,
  mockIframelyResponse,
  mockJiraResponse,
  mockJiraResponseWithDatasources,
} from '../../../../__tests__/__mocks__/mocks';
import { getCardState } from '../../../../../../../examples/utils/flexible-ui';
import HoverCardResolvedView from '../index';
import {
  type AnalyticsFacade,
  useSmartLinkAnalytics,
} from '../../../../../../state/analytics';
import { mockGetContext } from '../../../../../../state/actions/__tests__/index.test.mock';
import { mocks } from '../../../../../../utils/mocks';
import {
  CardDisplay,
  SmartLinkPosition,
  SmartLinkSize,
} from '../../../../../../constants';
import { useSmartLinkActions } from '../../../../../../state/hooks-external/useSmartLinkActions';
import { type LinkAction } from '../../../../../../state/hooks-external/useSmartLinkActions';
import { type CardState } from '@atlaskit/linking-common';
import { useSmartCardState } from '../../../../../../state/store';
import { extractBlockProps } from '../../../../../../extractors/block';
import MockAtlasProject from '../../../../../../__fixtures__/atlas-project';
import mockAtlasProjectWithAiSummary from '../../../../../../__fixtures__/atlas-project-with-ai-summary';
import { type JsonLdDatasourceResponse } from '@atlaskit/link-client-extension';
import useRelatedUrls, {
  type RelatedUrlsResponse,
} from '../../../../../../state/hooks/use-related-urls';
import { useAISummary } from '../../../../../../state/hooks/use-ai-summary';

jest.mock('../../../../../../state/actions', () => ({
  useSmartCardActions: jest.fn(),
}));

jest.mock('../../../../../../state/store', () => ({
  useSmartCardState: jest.fn(),
}));

jest.mock('../../../../../../extractors/block', () => ({
  extractBlockProps: jest.fn(),
}));

const mockGetBooleanFF = getBooleanFF as jest.Mock;

jest.mock('@atlaskit/platform-feature-flags', () => ({
  ...jest.requireActual('@atlaskit/platform-feature-flags'),
  getBooleanFF: jest.fn(),
}));

let isAiSummaryFFEnabled = false;
mockGetBooleanFF.mockImplementation(
  (key) =>
    key === 'platform.linking-platform.smart-card.hover-card-ai-summaries' &&
    isAiSummaryFFEnabled,
);

jest.mock('../../../../../../state/hooks/use-ai-summary', () => {
  const original = jest.requireActual(
    '../../../../../../state/hooks/use-ai-summary',
  );
  return {
    useAISummary: jest.fn().mockImplementation(({ url, ari, product }) => {
      return {
        summariseUrl: original.useAISummary({ url, ari, product }).summariseUrl,
        state: { status: 'ready', content: '' },
      };
    }),
  };
});

//must be similar to the product name we use inside of the mocked module below.
const productName: ProductType = 'ATLAS';
jest.mock('@atlaskit/link-provider', () => ({
  useSmartLinkContext: () => ({
    ...mockGetContext(),
    store: {
      getState: () => ({ 'test-url': mocks.analytics }),
      dispatch: jest.fn(),
    },
    //it is not allowed to reference any out-of-scope variables e.g. productName above
    product: 'ATLAS' as ProductType,
  }),
  useFeatureFlag: jest.fn(),
}));

const mockGetRelatedUrls = jest.fn<Promise<RelatedUrlsResponse>, any[]>();
const mockuseRelatedUrls = () => mockGetRelatedUrls;
const injectableUseRelatedUrls = injectable(useRelatedUrls, mockuseRelatedUrls);

const titleBlockProps = {
  maxLines: 2,
  size: SmartLinkSize.Large,
  position: SmartLinkPosition.Center,
};

describe('HoverCardResolvedView', () => {
  let analyticsEvents: AnalyticsFacade;
  const id = 'resolved-test-id';
  const location = 'resolved-test-location';
  const dispatchAnalytics = jest.fn();
  const url = 'test-url';

  const TestComponent = ({
    mockResponse = mockConfluenceResponse as JsonLdDatasourceResponse,
    cardActions = [],
    isAISummaryEnabled,
    cardState,
  }: {
    mockResponse?: JsonLd.Response;
    cardActions?: LinkAction[];
    isAISummaryEnabled?: boolean;
    cardState: any;
  }) => {
    return (
      <DiProvider use={[injectableUseRelatedUrls]}>
        <IntlProvider locale="en">
          <HoverCardResolvedView
            analytics={analyticsEvents}
            extensionKey={mockResponse.meta.key}
            id={'123'}
            flexibleCardProps={{
              cardState: cardState,
              children: {},
              actionOptions: { hide: false },
              url: url,
            }}
            onActionClick={jest.fn()}
            cardState={cardState}
            url={url}
            titleBlockProps={titleBlockProps}
            cardActions={cardActions}
            isAISummaryEnabled={isAISummaryEnabled}
          />
        </IntlProvider>
      </DiProvider>
    );
  };

  beforeEach(() => {
    const { result } = renderHook(() =>
      useSmartLinkAnalytics(url, dispatchAnalytics, id, location),
    );
    analyticsEvents = result.current;
  });

  afterEach(() => {
    jest.clearAllMocks();
    isAiSummaryFFEnabled = false;
  });

  const setup = ({
    mockResponse = mockConfluenceResponse as JsonLdDatasourceResponse,
    cardActions = [],
    isAISummaryEnabled,
  }: {
    mockResponse?: JsonLd.Response;
    cardActions?: LinkAction[];
    isAISummaryEnabled?: boolean;
  } = {}) => {
    const cardState = getCardState({
      data: mockResponse.data,
      meta: mockResponse.meta,
      status: 'resolved',
      datasources: (mockResponse as JsonLdDatasourceResponse).datasources,
    });

    const {
      queryByTestId,
      findByTestId,
      findByText,
      findAllByTestId,
      debug,
      rerender,
    } = render(
      <TestComponent
        cardState={cardState}
        mockResponse={mockResponse}
        cardActions={cardActions}
        isAISummaryEnabled={isAISummaryEnabled}
      />,
    );

    const rerenderTestComponent = () =>
      rerender(
        <TestComponent
          cardState={cardState}
          mockResponse={mockResponse}
          cardActions={cardActions}
          isAISummaryEnabled={isAISummaryEnabled}
        />,
      );

    return {
      queryByTestId,
      findByTestId,
      findByText,
      findAllByTestId,
      debug,
      rerenderTestComponent,
    };
  };

  describe('hover card blocks', () => {
    const mockWithActions = (response?: JsonLd.Response) => {
      const handler = jest.fn().mockResolvedValue(true);

      const state: CardState = {
        details: response ?? mocks.success,
        status: 'resolved',
      };
      const props = {
        icon: {},
        actions: [
          { id: 'comment', text: 'Comment', promise: handler },
          { id: 'preview-content', text: 'Preview', promise: handler },
        ],
      };

      mocked(useSmartCardState).mockImplementation(() => state);
      mocked(extractBlockProps).mockImplementation(() => props);

      return handler;
    };

    it('renders hover card blocks', async () => {
      const { findAllByTestId, findByTestId } = setup();
      jest.runAllTimers();
      const titleBlock = await findByTestId('smart-block-title-resolved-view');
      await findAllByTestId('smart-block-metadata-resolved-view');
      const snippetBlock = await findByTestId(
        'smart-block-snippet-resolved-view',
      );
      const footerBlock = await findByTestId(
        'smart-footer-block-resolved-view',
      );
      //trim because the icons are causing new lines in the textContent
      expect(titleBlock.textContent?.trim()).toBe('I love cheese');
      expect(snippetBlock.textContent).toBe('Here is your serving of cheese');
      expect(footerBlock.textContent?.trim()).toBe('Confluence');
    });

    it('should render preview instead of snippet when preview data is available', async () => {
      const { findByTestId, queryByTestId } = setup({
        mockResponse: mockBaseResponseWithPreview as JsonLd.Response,
      });
      jest.runAllTimers();
      await findByTestId('smart-block-title-resolved-view');
      await findByTestId('smart-block-preview-resolved-view');

      expect(queryByTestId('smart-block-snippet-resolved-view')).toBeNull();
    });

    it('should fallback to rendering snippet if preview data is available but fails to load', async () => {
      const { findByTestId, queryByTestId } = setup({
        mockResponse: mockBaseResponseWithErrorPreview as JsonLd.Response,
      });
      jest.runAllTimers();
      await findByTestId('smart-block-title-resolved-view');
      fireEvent.transitionEnd(
        await findByTestId('smart-block-preview-resolved-view'),
      );
      await findByTestId('smart-block-snippet-resolved-view');

      expect(queryByTestId('smart-block-preview-resolved-view')).toBeNull();
    });

    describe('footer actions', () => {
      it('renders CustomAction other than "preview-content" correctly', async () => {
        mockWithActions();

        const { result } = renderHook(() =>
          useSmartLinkActions({
            url,
            appearance: CardDisplay.HoverCardPreview,
          }),
        );
        const cardActions = result.current;

        const { findByTestId } = setup({ cardActions });

        await findByTestId('smart-element-group-actions');

        // correctly renders action other than preview
        const commentAction = await findByTestId('comment');
        expect(commentAction).toBeDefined();
        expect(commentAction.textContent).toBe('Comment');
      });

      it('renders PreviewAction correctly', async () => {
        mockWithActions();

        const { result } = renderHook(() =>
          useSmartLinkActions({
            url,
            appearance: CardDisplay.HoverCardPreview,
          }),
        );
        const cardActions = result.current;

        const { findByTestId } = setup({ cardActions });

        await findByTestId('smart-element-group-actions');

        // correctly renders preview action
        const previewAction = await findByTestId('preview-content');
        expect(previewAction).toBeDefined();
        expect(previewAction.textContent).toBe('Open preview');
      });

      it('renders FollowAction', async () => {
        mockWithActions(MockAtlasProject);
        const { result } = renderHook(() =>
          useSmartLinkActions({
            url,
            appearance: CardDisplay.HoverCardPreview,
          }),
        );
        const { findByTestId } = setup({
          cardActions: result.current,
          mockResponse: MockAtlasProject,
        });
        await findByTestId('smart-element-group-actions');

        const action = await findByTestId('smart-action-follow-action');
        expect(action?.textContent).toEqual('Follow');
      });

      describe('with AI Summary FF enabled', () => {
        beforeEach(() => {
          isAiSummaryFFEnabled = true;
          AISummariesStore.clear();
        });

        it('renders AISummary block with actions when AI is enabled and AISummary is enabled', async () => {
          mockWithActions(mockAtlasProjectWithAiSummary);
          const { findByTestId } = setup({
            mockResponse: mockAtlasProjectWithAiSummary,
            isAISummaryEnabled: true,
          });

          await findByTestId('smart-ai-summary-block-resolved-view');
          const aiSummaryAction = await findByTestId(
            'smart-ai-summary-block-ai-summary-action',
          );
          expect(aiSummaryAction?.textContent).toEqual('Summarize');
        });

        it('Hide the link description and metadata only when there is summary content available', async () => {
          (useAISummary as jest.Mock).mockReturnValueOnce({
            state: { status: 'loading', content: '' },
            summariseUrl: jest.fn(),
          });

          const { queryByTestId, rerenderTestComponent } = setup({
            mockResponse: mockAtlasProjectWithAiSummary,
            isAISummaryEnabled: true,
          });

          const linkDescriptionAndBottomMetaData = queryByTestId(
            'connected-AI-resolved-view',
          );
          expect(linkDescriptionAndBottomMetaData).toBeInTheDocument();

          (useAISummary as jest.Mock).mockReturnValueOnce({
            state: {
              status: 'loading',
              content: 'first piece of summary is here',
            },
            summariseUrl: jest.fn(),
          });

          rerenderTestComponent();

          const linkDescriptionAndBottomMetaDataAfterRerender = queryByTestId(
            'connected-AI-resolved-view',
          );
          expect(
            linkDescriptionAndBottomMetaDataAfterRerender,
          ).not.toBeInTheDocument();
        });

        it('should use a resolved data URL instead of provided URL', async () => {
          // Provided URL can be different from the data URL obtained from the resolver (see short links as example).
          // We want to ensure that all components within the Hover Card subscribe to the same URL AI Summary update
          // and do not create two different instances of AI Summary Service.
          await setup({
            mockResponse: {
              ...mockAtlasProjectWithAiSummary,
              data: {
                ...mockAtlasProjectWithAiSummary.data,
                url: 'http://data-link-url.com',
              },
            },
            isAISummaryEnabled: true,
          });

          expect(AISummariesStore.size).toBe(1);
          //provided URL
          expect(AISummariesStore.get(url)).not.toBeDefined();
          //Data url from the cardState
          expect(
            AISummariesStore.get('http://data-link-url.com'),
          ).toBeDefined();
        });

        it('should call the useAISummary hook with a product name when it`s available in SmartLinkContext', async () => {
          await setup({
            mockResponse: {
              ...mockAtlasProjectWithAiSummary,
            },
            isAISummaryEnabled: true,
          });

          expect(useAISummary).toHaveBeenCalledWith(
            expect.objectContaining({
              product: productName,
            }),
          );
        });
      });

      describe('with AI Summary FF disabled', () => {
        beforeEach(() => {
          isAiSummaryFFEnabled = false;
        });

        it('does not render AISummary block', async () => {
          const { queryByTestId } = setup({
            mockResponse: mockAtlasProjectWithAiSummary,
          });

          expect(
            queryByTestId('smart-ai-summary-block-resolved-view'),
          ).toBeNull();
          expect(
            queryByTestId('smart-ai-summary-block-ai-summary-action'),
          ).toBeNull();
        });
      });
    });

    describe('renders RelatedUrlsBlock', () => {
      ffTest(
        'platform.linking-platform.smart-card.enable-hover-card-related-urls',
        async () => {
          const { findByTestId } = setup();
          await findByTestId('smart-block-related-urls-resolving-view');
        },
        async () => {
          const { queryByTestId } = setup();
          const relatedUrlsBlock = queryByTestId(
            'smart-block-related-urls-resolving-view',
          );
          expect(relatedUrlsBlock).not.toBeInTheDocument();
        },
      );
    });

    describe('renders footer blocks', () => {
      const setupWithAISummary = () =>
        setup({
          mockResponse: mockAtlasProjectWithAiSummary,
          isAISummaryEnabled: true,
        });

      it('renders FooterBlock', async () => {
        const { findByTestId } = setup();
        const block = await findByTestId('smart-footer-block-resolved-view');
        expect(block).toBeInTheDocument();
      });

      describe('When AISummary enabled', () => {
        beforeEach(() => {
          isAiSummaryFFEnabled = true;
          AISummariesStore.clear();
        });

        it('renders AISummaryBlock', async () => {
          const { findByTestId } = setupWithAISummary();
          const block = await findByTestId(
            'smart-ai-summary-block-resolved-view',
          );
          expect(block).toBeInTheDocument();
        });

        it('does not render FooterBlock', () => {
          const { queryByTestId } = setupWithAISummary();
          const block = queryByTestId('smart-footer-block-resolved-view');
          expect(block).not.toBeInTheDocument();
        });

        it('does not render ActionBlock', () => {
          const { queryByTestId } = setupWithAISummary();
          const block = queryByTestId('smart-block-action');
          expect(block).not.toBeInTheDocument();
        });

        it('does not render MetadataBlock (footer)', () => {
          const { queryByTestId } = setupWithAISummary();
          const block = queryByTestId('smart-block-action-footer');
          expect(block).not.toBeInTheDocument();
        });
      });
    });
  });

  it('image preview display position - first or 3rd position', async () => {
    const { findByTestId } = setup({
      mockResponse: mockBaseResponseWithPreview as JsonLd.Response,
    });
    const container = await findByTestId('smart-links-container');
    const imagePreview = await findByTestId(
      'smart-block-preview-resolved-view',
    );
    expect(container.firstElementChild).toBe(imagePreview);
  });

  describe('metadata', () => {
    it('renders correctly for confluence links', async () => {
      const { findByTestId } = setup();
      await findByTestId('authorgroup-metadata-element');
      const commentCount = await findByTestId('commentcount-metadata-element');
      const reactCount = await findByTestId('reactcount-metadata-element');

      expect(commentCount.textContent).toBe('4');
      expect(reactCount.textContent).toBe('8');
    });

    it('renders correctly for jira links', async () => {
      const { findByTestId } = setup({
        mockResponse: mockJiraResponse as JsonLd.Response,
      });
      await findByTestId('assignedtogroup-metadata-element');
      const priority = await findByTestId('priority-metadata-element');
      const state = await findByTestId('state-metadata-element');

      expect(priority.textContent).toBe('Major');
      expect(state.textContent).toBe('Done');
    });

    it('renders correctly for other providers', async () => {
      const { findByTestId } = setup({
        mockResponse: mockIframelyResponse as JsonLd.Response,
      });
      const titleBlock = await findByTestId('smart-block-title-resolved-view');
      const modifiedOn = await findByTestId('modifiedon-metadata-element');
      await findByTestId('authorgroup-metadata-element');

      expect(titleBlock.textContent?.trim()).toBe('I love cheese');
      expect(modifiedOn.textContent).toBe('Updated on Jan 1, 2022');
    });

    it('elements rendered in top block or bottom metadata block', async () => {
      const { findAllByTestId, findByTestId } = setup({
        mockResponse: mockConfluenceResponse as JsonLd.Response,
      });
      const metadataElements = await findAllByTestId(
        'smart-block-metadata-resolved-view',
      );
      const commentCount = await findByTestId('commentcount-metadata-element');
      const reactCount = await findByTestId('reactcount-metadata-element');
      expect(metadataElements.length).toEqual(2);
      expect(metadataElements[1].children).toContain(
        commentCount.parentElement,
      );
      expect(metadataElements[1].children).toContain(reactCount.parentElement);
    });
  });

  describe('analytics', () => {
    const getExpectedRenderSuccessEventPayload = (
      canBeDatasource: boolean,
    ) => ({
      action: 'renderSuccess',
      actionSubject: 'smartLink',
      attributes: {
        id: expect.any(String),
        componentName: 'smart-cards',
        definitionId: 'spaghetti-id',
        display: 'hoverCardPreview',
        destinationObjectType: 'spaghetti-resource',
        destinationProduct: 'spaghetti-product',
        destinationSubproduct: 'spaghetti-subproduct',
        extensionKey: 'spaghetti-key',
        location: 'resolved-test-location',
        packageName: expect.any(String),
        packageVersion: expect.any(String),
        resourceType: 'spaghetti-resource',
        status: 'resolved',
        canBeDatasource: canBeDatasource,
      },
      eventType: 'ui',
    });

    it('should fire render success event when hover card is rendered', async () => {
      const { findByTestId } = setup();
      await findByTestId('smart-block-title-resolved-view');

      expect(dispatchAnalytics).toHaveBeenCalledWith(
        getExpectedRenderSuccessEventPayload(false),
      );
    });

    it('should fire render success event with canBeDatasource = true when hover card is rendered and state has datasources data', async () => {
      const { findByTestId } = setup({
        mockResponse: mockJiraResponseWithDatasources as JsonLd.Response,
      });
      await findByTestId('smart-block-title-resolved-view');

      expect(dispatchAnalytics).toHaveBeenCalledWith(
        getExpectedRenderSuccessEventPayload(true),
      );
    });
  });
});
