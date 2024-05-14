import React from 'react';

import '@atlaskit/link-test-helpers/jest';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { css } from '@emotion/react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ActionName,
  ElementName,
  SmartLinkStatus,
} from '../../../../../../constants';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import { useAISummary } from '../../../../../../state/hooks/use-ai-summary';
import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { AISummaryBlockProps } from '../types';
import { IntlProvider } from 'react-intl-next';
import AISummaryBlock from '../index';
import { ActionItem } from '../../types';
import { ANALYTICS_CHANNEL } from '../../../../../../utils/analytics';
import { Provider as SmartCardProvider } from '@atlaskit/smart-card';
import { ffTest } from '@atlassian/feature-flags-test-utils';

jest.mock('../../../../../../state/hooks/use-ai-summary', () => ({
  useAISummary: jest.fn().mockReturnValue({ state: { status: 'ready' } }),
}));

const TestComponent = (props: AISummaryBlockProps & { spy: jest.Mock }) => (
  <AnalyticsListener onEvent={props.spy} channel={ANALYTICS_CHANNEL}>
    <SmartCardProvider>
      <IntlProvider locale="en">
        <FlexibleUiContext.Provider value={context}>
          <AISummaryBlock status={SmartLinkStatus.Resolved} {...props} />
        </FlexibleUiContext.Provider>
      </IntlProvider>
    </SmartCardProvider>
  </AnalyticsListener>
);

describe('AISummaryBlock', () => {
  const testIdBase = 'some-test-id';

  const renderAISummaryBlock = (props?: AISummaryBlockProps) => {
    const spy = jest.fn();

    const { rerender, ...result } = render(
      <TestComponent spy={spy} {...props} />,
    );
    const rerenderTestComponent = () =>
      rerender(<TestComponent spy={spy} {...props} />);

    return {
      ...result,
      spy,
      rerenderTestComponent,
    };
  };

  describe('status', () => {
    it('should render non-empty block when status is resolved', () => {
      const { container } = renderAISummaryBlock();
      expect(container.children.length).toBeGreaterThan(0);
    });

    it.each([
      [SmartLinkStatus.Resolving],
      [SmartLinkStatus.Forbidden],
      [SmartLinkStatus.Errored],
      [SmartLinkStatus.NotFound],
      [SmartLinkStatus.Unauthorized],
      [SmartLinkStatus.Fallback],
    ])('should render null when status is %s', (status: SmartLinkStatus) => {
      const { container } = renderAISummaryBlock({ status });
      expect(container.children.length).toEqual(0);
    });
  });

  describe('ai summary', () => {
    it('shows summarizing indicator when click on Summarize button', async () => {
      (useAISummary as jest.Mock).mockReturnValue({
        state: { status: 'loading', content: '' },
        summariseUrl: jest.fn(),
      });

      const { findByTestId, queryByTestId } = renderAISummaryBlock({
        testId: testIdBase,
      });

      const indicator = await findByTestId(
        `${testIdBase}-state-indicator-loading`,
      );
      expect(indicator).toBeInTheDocument();

      const buttonAfterClick = queryByTestId(`${testIdBase}-ai-summary-action`);
      expect(buttonAfterClick).not.toBeInTheDocument();
    });

    it('fires expected events when click on Summarize button', async () => {
      (useAISummary as jest.Mock).mockReturnValue({
        state: { status: 'ready', content: '' },
        summariseUrl: jest.fn(),
      });
      const user = userEvent.setup();
      const { spy, findByTestId } = renderAISummaryBlock({
        testId: testIdBase,
      });

      const button = await findByTestId(`${testIdBase}-ai-summary-action`);
      await user.click(button);
      expect(spy).toBeFiredWithAnalyticEventOnce(
        {
          payload: {
            action: 'clicked',
            actionSubject: 'button',
            actionSubjectId: 'aiSummary',
          },
        },
        ANALYTICS_CHANNEL,
      );
      expect(spy).toBeFiredWithAnalyticEventOnce(
        {
          payload: {
            action: 'initiated',
            actionSubject: 'aiInteraction',
            attributes: {
              aiFeatureName: 'Smart Links Summary',
              proactiveAIGenerated: 0,
              userGeneratedAI: 1,
            },
          },
        },
        ANALYTICS_CHANNEL,
      );
    });

    it('fires expected events when the summary is done', async () => {
      (useAISummary as jest.Mock).mockReturnValue({
        state: { status: 'loading', content: '' },
        summariseUrl: jest.fn(),
      });

      const { spy, rerenderTestComponent } = renderAISummaryBlock({
        testId: testIdBase,
      });

      (useAISummary as jest.Mock).mockReturnValue({
        state: { status: 'done', content: '' },
        summariseUrl: jest.fn(),
      });

      rerenderTestComponent();

      expect(spy).toBeFiredWithAnalyticEventOnce(
        {
          payload: {
            action: 'viewed',
            actionSubject: 'summary',
            attributes: {
              fromCache: false,
            },
          },
        },
        ANALYTICS_CHANNEL,
      );
      expect(spy).not.toBeFiredWithAnalyticEventOnce(
        {
          payload: {
            action: 'initiated',
            actionSubject: 'aiInteraction',
            attributes: {
              aiFeatureName: 'Smart Links Summary',
              proactiveAIGenerated: 1,
              userGeneratedAI: 0,
            },
          },
        },
        ANALYTICS_CHANNEL,
      );
    });

    it('fires expected events when the summary is cached', async () => {
      (useAISummary as jest.Mock).mockReturnValue({
        state: { status: 'done', content: '' },
        summariseUrl: jest.fn(),
      });

      const { spy } = renderAISummaryBlock({
        testId: testIdBase,
      });
      expect(spy).toBeFiredWithAnalyticEventOnce(
        {
          payload: {
            action: 'viewed',
            actionSubject: 'summary',
            attributes: {
              fromCache: true,
            },
          },
        },
        ANALYTICS_CHANNEL,
      );
      expect(spy).toBeFiredWithAnalyticEventOnce(
        {
          payload: {
            action: 'initiated',
            actionSubject: 'aiInteraction',
            attributes: {
              aiFeatureName: 'Smart Links Summary',
              proactiveAIGenerated: 1,
              userGeneratedAI: 0,
            },
          },
        },
        ANALYTICS_CHANNEL,
      );
    });

    it('does not show metadata during summarizing', async () => {
      (useAISummary as jest.Mock).mockReturnValue({
        state: { status: 'loading', content: '' },
        summariseUrl: jest.fn(),
      });

      const metadataTestId = `${testIdBase}-provider`;
      const { queryByTestId } = renderAISummaryBlock({
        metadata: [{ name: ElementName.Provider, testId: metadataTestId }],
        testId: testIdBase,
      });

      const provider = queryByTestId(metadataTestId);
      expect(provider).not.toBeInTheDocument();
    });

    it('shows default error state indicator on error', async () => {
      (useAISummary as jest.Mock).mockReturnValue({
        state: { status: 'loading', content: '' },
        summariseUrl: jest.fn(),
      });

      const { queryByTestId, rerenderTestComponent } = renderAISummaryBlock({
        testId: testIdBase,
      });

      const indicator = queryByTestId(`${testIdBase}-error-indicator-error`);
      expect(indicator).not.toBeInTheDocument();

      (useAISummary as jest.Mock).mockReturnValue({
        state: { status: 'error', content: '' },
        summariseUrl: jest.fn(),
      });

      rerenderTestComponent();
      const indicatorA = queryByTestId(`${testIdBase}-error-indicator-error`);

      expect(indicatorA).toBeInTheDocument();
    });

    ffTest.on(
      'platform.linking-platform.smart-card.hover-card-action-redesign',
      'with redesign FF enabled',
      async () => {
        it('should not render error state indicator', async () => {
          (useAISummary as jest.Mock).mockReturnValue({
            state: { status: 'error', content: '' },
            summariseUrl: jest.fn(),
          });

          const { queryByTestId } = renderAISummaryBlock({
            testId: testIdBase,
          });

          const indicatorA = queryByTestId(
            `${testIdBase}-error-indicator-error`,
          );

          expect(indicatorA).not.toBeInTheDocument();
        });
      },
    );

    it('shows acceptable use violation error state indicator on acceptable use violation error', async () => {
      (useAISummary as jest.Mock).mockReturnValue({
        state: { status: 'loading', content: '' },
        summariseUrl: jest.fn(),
      });

      const { queryByTestId, findByTestId, rerenderTestComponent } =
        renderAISummaryBlock({
          testId: testIdBase,
        });

      const indicator = queryByTestId(`${testIdBase}-error`);
      expect(indicator).not.toBeInTheDocument();

      (useAISummary as jest.Mock).mockReturnValue({
        state: {
          status: 'error',
          content: '',
          error: 'ACCEPTABLE_USE_VIOLATIONS',
        },
        summariseUrl: jest.fn(),
      });

      rerenderTestComponent();
      const indicatorA = queryByTestId(`${testIdBase}-error-indicator-error`);
      expect(
        (await findByTestId(`${testIdBase}-error-indicator-error-message`))
          .textContent,
      ).toBe(
        "We cannot show the results of this summary as it goes against Atlassian's Acceptable Use Policy.",
      );

      expect(indicatorA).toBeInTheDocument();
    });

    it('shows HIPAA content detected error state indicator on HIPAA content detected error', async () => {
      (useAISummary as jest.Mock).mockReturnValue({
        state: { status: 'loading', content: '' },
        summariseUrl: jest.fn(),
      });

      const { queryByTestId, findByTestId, rerenderTestComponent } =
        renderAISummaryBlock({
          testId: testIdBase,
        });

      const indicator = queryByTestId(`${testIdBase}-error-indicator-error`);
      expect(indicator).not.toBeInTheDocument();

      (useAISummary as jest.Mock).mockReturnValue({
        state: {
          status: 'error',
          content: '',
          error: 'HIPAA_CONTENT_DETECTED',
        },
        summariseUrl: jest.fn(),
      });

      rerenderTestComponent();
      const indicatorA = queryByTestId(`${testIdBase}-error-indicator-error`);
      expect(
        (await findByTestId(`${testIdBase}-error-indicator-error-message`))
          .textContent,
      ).toBe(
        'Atlassian Intelligence was unable to process your request as your content contains links to HIPAA restricted content.',
      );

      expect(indicatorA).toBeInTheDocument();
    });

    it('fires a error viewed event on error', async () => {
      (useAISummary as jest.Mock).mockReturnValue({
        state: { status: 'loading', content: '' },
        summariseUrl: jest.fn(),
      });

      const { spy, rerenderTestComponent } = renderAISummaryBlock({
        testId: testIdBase,
      });

      (useAISummary as jest.Mock).mockReturnValue({
        state: { status: 'error', content: '', error: 'NETWORK_ERROR' },
        summariseUrl: jest.fn(),
      });

      rerenderTestComponent();

      expect(spy).toBeFiredWithAnalyticEventOnce(
        {
          payload: {
            action: 'viewed',
            actionSubject: 'error',
            actionSubjectId: 'aiSummary',
            attributes: {
              reason: 'NETWORK_ERROR',
            },
          },
        },
        ANALYTICS_CHANNEL,
      );
    });

    it('Display the AI Summary component only when there is summary content available', async () => {
      (useAISummary as jest.Mock).mockReturnValue({
        state: { status: 'loading', content: '' },
        summariseUrl: jest.fn(),
      });

      const aiSummaryTestId = `${testIdBase}-ai-summary`;
      const { queryByTestId, rerenderTestComponent } = renderAISummaryBlock({
        metadata: [{ name: ElementName.Provider, testId: aiSummaryTestId }],
        testId: testIdBase,
      });

      const AISummary = queryByTestId(aiSummaryTestId);
      expect(AISummary).not.toBeInTheDocument();

      (useAISummary as jest.Mock).mockReturnValue({
        state: { status: 'loading', content: 'first piece of summary is here' },
        summariseUrl: jest.fn(),
      });

      rerenderTestComponent();
      const AISummaryWithContent = queryByTestId(aiSummaryTestId);
      expect(AISummaryWithContent).toBeInTheDocument();
    });
  });

  describe('metadata', () => {
    it('should render metadata', async () => {
      (useAISummary as jest.Mock).mockReturnValue({
        state: { status: 'ready', content: '' },
        summariseUrl: jest.fn(),
      });

      const { findByTestId } = renderAISummaryBlock({
        metadata: [
          { name: ElementName.Provider, testId: `${testIdBase}-provider` },
        ],
      });
      const provider = await findByTestId(`${testIdBase}-provider`);
      expect(provider).toBeDefined();

      const providerLabel = await findByTestId(`${testIdBase}-provider-label`);
      expect(providerLabel.textContent).toBe('Confluence');
    });

    ffTest.on(
      'platform.linking-platform.smart-card.hover-card-action-redesign',
      'with redesign FF enabled',
      async () => {
        it('should not render footer metadata', async () => {
          (useAISummary as jest.Mock).mockReturnValue({
            state: { status: 'ready', content: '' },
            summariseUrl: jest.fn(),
          });

          const { queryByTestId } = renderAISummaryBlock({
            metadata: [
              { name: ElementName.Provider, testId: `${testIdBase}-provider` },
            ],
          });

          const provider = queryByTestId(`${testIdBase}-provider`);
          expect(provider).not.toBeInTheDocument();
        });
      },
    );
  });

  describe('actions', () => {
    it('should define AI Summary Action', async () => {
      (useAISummary as jest.Mock).mockReturnValue({
        state: { status: 'ready', content: '' },
        summariseUrl: jest.fn(),
      });
      const { findByTestId } = renderAISummaryBlock({
        testId: testIdBase,
      });

      const aiSummaryAction = await findByTestId(
        `${testIdBase}-ai-summary-action`,
      );
      expect(aiSummaryAction).toBeDefined();
    });

    it('should render provided actions', async () => {
      const user = userEvent.setup();
      const actionItem: ActionItem = {
        testId: 'some-delete-actionItem-test-id',
        name: ActionName.DeleteAction,
        onClick: jest.fn(),
      };
      const { findByTestId } = renderAISummaryBlock({
        testId: testIdBase,
        actions: [actionItem],
      });

      const deleteAction = await findByTestId('some-delete-actionItem-test-id');
      expect(deleteAction).toBeDefined();
      expect(deleteAction.textContent).toBe('Delete');

      await user.click(deleteAction);
      expect(actionItem.onClick).toHaveBeenCalled();
    });

    it('should trigger onActionMenuOpenChange when action menu is clicked', async () => {
      const user = userEvent.setup();
      const onActionMenuOpenChange = jest.fn();
      const { findByTestId } = renderAISummaryBlock({
        actions: [
          { name: ActionName.DeleteAction, onClick: jest.fn() },
          { name: ActionName.EditAction, onClick: jest.fn() },
        ],
        onActionMenuOpenChange,
      });

      const moreButton = await findByTestId('action-group-more-button');
      await user.click(moreButton);
      expect(onActionMenuOpenChange).toHaveBeenCalled();
    });

    it('renders with override css', async () => {
      const overrideCssStyles = css({
        backgroundColor: 'blue',
      });
      const { findByTestId } = renderAISummaryBlock({
        overrideCss: overrideCssStyles,
        testId: testIdBase,
      });

      const block = await findByTestId(`${testIdBase}-resolved-view`);

      expect(block).toHaveStyleDeclaration('background-color', 'blue');
    });
  });
});
