import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { mocked } from 'ts-jest/utils';
import { JsonLd } from 'json-ld-types';
import { fireEvent, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { ffTest } from '@atlassian/feature-flags-test-utils';

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
  AnalyticsFacade,
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
import { LinkAction } from '../../../../../../state/hooks-external/useSmartLinkActions';
import { CardState } from '@atlaskit/linking-common';
import { useSmartCardState } from '../../../../../../state/store';
import { extractBlockProps } from '../../../../../../extractors/block';
import MockAtlasProject from '../../../../../../__fixtures__/atlas-project';
import { JsonLdDatasourceResponse } from '@atlaskit/link-client-extension';

jest.mock('../../../../../../state/actions', () => ({
  useSmartCardActions: jest.fn(),
}));

jest.mock('../../../../../../state/store', () => ({
  useSmartCardState: jest.fn(),
}));

jest.mock('../../../../../../extractors/block', () => ({
  extractBlockProps: jest.fn(),
}));

jest.mock('@atlaskit/link-provider', () => ({
  useSmartLinkContext: () => ({
    ...mockGetContext(),
    store: {
      getState: () => ({ 'test-url': mocks.analytics }),
      dispatch: jest.fn(),
    },
  }),
  useFeatureFlag: jest.fn(),
}));

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

  beforeEach(() => {
    const { result } = renderHook(() =>
      useSmartLinkAnalytics(url, dispatchAnalytics, id, location),
    );
    analyticsEvents = result.current;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setup = async ({
    mockResponse = mockConfluenceResponse as JsonLdDatasourceResponse,
    cardActions = [],
  }: { mockResponse?: JsonLd.Response; cardActions?: LinkAction[] } = {}) => {
    const cardState = getCardState({
      data: mockResponse.data,
      meta: mockResponse.meta,
      status: 'resolved',
      datasources: (mockResponse as JsonLdDatasourceResponse).datasources,
    });

    const { queryByTestId, findByTestId, findByText, findAllByTestId } = render(
      <IntlProvider locale="en">
        <HoverCardResolvedView
          analytics={analyticsEvents}
          extensionKey={mockResponse.meta.key}
          id={'123'}
          flexibleCardProps={{
            cardState: cardState,
            children: {},
            showServerActions: true,
            url: url,
          }}
          onActionClick={jest.fn()}
          cardState={cardState}
          url={url}
          titleBlockProps={titleBlockProps}
          cardActions={cardActions}
        />
      </IntlProvider>,
    );

    return { queryByTestId, findByTestId, findByText, findAllByTestId };
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
      const { findByTestId } = await setup();
      jest.runAllTimers();
      const titleBlock = await findByTestId('smart-block-title-resolved-view');
      await findByTestId('smart-block-metadata-resolved-view');
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
      const { findByTestId, queryByTestId } = await setup({
        mockResponse: mockBaseResponseWithPreview as JsonLd.Response,
      });
      jest.runAllTimers();
      await findByTestId('smart-block-title-resolved-view');
      await findByTestId('smart-block-preview-resolved-view');

      expect(queryByTestId('smart-block-snippet-resolved-view')).toBeNull();
    });

    it('should fallback to rendering snippet if preview data is available but fails to load', async () => {
      const { findByTestId, queryByTestId } = await setup({
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

    it('renders CustomAction other than "preview-content" correctly', async () => {
      mockWithActions();

      const { result } = renderHook(() =>
        useSmartLinkActions({ url, appearance: CardDisplay.HoverCardPreview }),
      );
      const cardActions = result.current;

      const { findByTestId } = await setup({ cardActions });

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

      const { findByTestId } = await setup({ cardActions });

      await findByTestId('smart-element-group-actions');

      // correctly renders preview action
      const previewAction = await findByTestId('preview-content');
      expect(previewAction).toBeDefined();
      expect(previewAction.textContent).toBe('Open preview');
    });

    describe('renders FollowAction', () => {
      ffTest(
        'platform.linking-platform.smart-card.follow-button',
        async () => {
          mockWithActions(MockAtlasProject);
          const { result } = renderHook(() =>
            useSmartLinkActions({
              url,
              appearance: CardDisplay.HoverCardPreview,
            }),
          );
          const { findByTestId } = await setup({
            cardActions: result.current,
            mockResponse: MockAtlasProject,
          });
          await findByTestId('smart-element-group-actions');

          const action = await findByTestId('smart-action-follow-action');
          expect(action?.textContent).toEqual('Follow');
        },
        async () => {
          mockWithActions(MockAtlasProject);
          const { result } = renderHook(() =>
            useSmartLinkActions({
              url,
              appearance: CardDisplay.HoverCardPreview,
            }),
          );
          const { findByTestId, queryByTestId } = await setup({
            cardActions: result.current,
            mockResponse: MockAtlasProject,
          });
          await findByTestId('smart-element-group-actions');

          const action = queryByTestId('smart-action-follow-action');
          expect(action).not.toBeInTheDocument();
        },
      );
    });
  });

  describe('image preview display position - first or 3rd position, depending on the FF  ', () => {
    ffTest(
      'platform.linking-platform.smart-card.enable-better-metadata_iojwg',
      async () => {
        const { findByTestId } = await setup({
          mockResponse: mockBaseResponseWithPreview as JsonLd.Response,
        });
        const container = await findByTestId('smart-links-container');
        const imagePreview = await findByTestId(
          'smart-block-preview-resolved-view',
        );
        expect(container.firstElementChild).toBe(imagePreview);
      },
      async () => {
        const { findByTestId } = await setup({
          mockResponse: mockBaseResponseWithPreview as JsonLd.Response,
        });
        const container = await findByTestId('smart-links-container');
        const imagePreview = await findByTestId(
          'smart-block-preview-resolved-view',
        );
        //is displayed after title & metadata blocks
        expect(container.children[2]).toBe(imagePreview);
      },
    );
  });

  describe('metadata', () => {
    it('renders correctly for confluence links', async () => {
      const { findByTestId } = await setup();
      await findByTestId('authorgroup-metadata-element');
      const createdBy = await findByTestId('createdby-metadata-element');
      const commentCount = await findByTestId('commentcount-metadata-element');
      const reactCount = await findByTestId('reactcount-metadata-element');

      expect(createdBy.textContent).toBe('Created by Michael Schrute');
      expect(commentCount.textContent).toBe('4');
      expect(reactCount.textContent).toBe('8');
    });

    it('renders correctly for jira links', async () => {
      const { findByTestId } = await setup({
        mockResponse: mockJiraResponse as JsonLd.Response,
      });
      await findByTestId('authorgroup-metadata-element');
      const priority = await findByTestId('priority-metadata-element');
      const state = await findByTestId('state-metadata-element');

      expect(priority.textContent).toBe('Major');
      expect(state.textContent).toBe('Done');
    });

    it('renders correctly for other providers', async () => {
      const { findByTestId } = await setup({
        mockResponse: mockIframelyResponse as JsonLd.Response,
      });
      const titleBlock = await findByTestId('smart-block-title-resolved-view');
      const modifiedOn = await findByTestId('modifiedon-metadata-element');
      const createdBy = await findByTestId('createdby-metadata-element');

      expect(titleBlock.textContent?.trim()).toBe('I love cheese');
      expect(modifiedOn.textContent).toBe('Updated on Jan 1, 2022');
      expect(createdBy.textContent).toBe('Created by Michael Schrute');
    });

    describe('elements rendered in top block or bottom metadata block, depending on the FF  ', () => {
      ffTest(
        'platform.linking-platform.smart-card.enable-better-metadata_iojwg',
        async () => {
          const { findAllByTestId, findByTestId } = await setup({
            mockResponse: mockConfluenceResponse as JsonLd.Response,
          });
          const metadataElements = await findAllByTestId(
            'smart-block-metadata-resolved-view',
          );
          const commentCount = await findByTestId(
            'commentcount-metadata-element',
          );
          const reactCount = await findByTestId('reactcount-metadata-element');
          expect(metadataElements.length).toEqual(2);
          expect(metadataElements[1].children).toContain(
            commentCount.parentElement,
          );
          expect(metadataElements[1].children).toContain(
            reactCount.parentElement,
          );
        },
        async () => {
          const { findAllByTestId, findByTestId } = await setup({
            mockResponse: mockConfluenceResponse as JsonLd.Response,
          });
          const metadataElements = await findAllByTestId(
            'smart-block-metadata-resolved-view',
          );
          const commentCount = await findByTestId(
            'commentcount-metadata-element',
          );
          const reactCount = await findByTestId('reactcount-metadata-element');
          expect(metadataElements.length).toEqual(1);
          expect(metadataElements[0]).toContainElement(
            commentCount.parentElement,
          );
          expect(metadataElements[0]).toContainElement(
            reactCount.parentElement,
          );
        },
      );
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
      const { findByTestId } = await setup();
      await findByTestId('smart-block-title-resolved-view');

      expect(dispatchAnalytics).toHaveBeenCalledWith(
        getExpectedRenderSuccessEventPayload(false),
      );
    });

    it('should fire render success event with canBeDatasource = true when hover card is rendered and state has datasources data', async () => {
      const { findByTestId } = await setup({
        mockResponse: mockJiraResponseWithDatasources as JsonLd.Response,
      });
      await findByTestId('smart-block-title-resolved-view');

      expect(dispatchAnalytics).toHaveBeenCalledWith(
        getExpectedRenderSuccessEventPayload(true),
      );
    });
  });
});
