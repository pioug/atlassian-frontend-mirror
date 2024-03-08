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

jest.mock('../../../../../../state/hooks/use-ai-summary', () => ({
  useAISummary: jest.fn().mockReturnValue({ state: { status: 'ready' } }),
}));

describe('AISummaryBlock', () => {
  const testIdBase = 'some-test-id';

  const renderAISummaryBlock = (props?: AISummaryBlockProps) => {
    const spy = jest.fn();

    const result = render(
      <AnalyticsListener onEvent={spy} channel={ANALYTICS_CHANNEL}>
        <IntlProvider locale="en">
          <FlexibleUiContext.Provider value={context}>
            <AISummaryBlock status={SmartLinkStatus.Resolved} {...props} />
          </FlexibleUiContext.Provider>
        </IntlProvider>
      </AnalyticsListener>,
    );

    return {
      ...result,
      spy,
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
      const user = userEvent.setup();
      const { findByTestId, queryByTestId } = renderAISummaryBlock({
        testId: testIdBase,
      });

      const buttonBeforeClick = await findByTestId(
        `${testIdBase}-ai-summary-action`,
      );
      await user.click(buttonBeforeClick);

      const indicator = await findByTestId(
        `${testIdBase}-state-indicator-loading`,
      );
      expect(indicator).toBeInTheDocument();

      const buttonAfterClick = queryByTestId(`${testIdBase}-ai-summary-action`);
      expect(buttonAfterClick).not.toBeInTheDocument();
    });

    it('fires button clicked event when click on Summarize button', async () => {
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
    });

    it('fires a summary viewed event when the summary is done', async () => {
      (useAISummary as jest.Mock).mockReturnValueOnce({
        isSummarisedOnMount: false,
        state: { status: 'done', content: 'ai content' },
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
              fromCache: false,
            },
          },
        },
        ANALYTICS_CHANNEL,
      );
    });

    it('fires a summary viewed event when the summary is from cache', async () => {
      (useAISummary as jest.Mock).mockReturnValueOnce({
        isSummarisedOnMount: true,
        state: { status: 'done', content: 'ai content' },
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
    });

    it('does not show metadata during summarizing', async () => {
      const metadataTestId = `${testIdBase}-provider`;
      const user = userEvent.setup();
      const { findByTestId, queryByTestId } = renderAISummaryBlock({
        metadata: [{ name: ElementName.Provider, testId: metadataTestId }],
        testId: testIdBase,
      });

      const providerBeforeClick = await findByTestId(metadataTestId);
      expect(providerBeforeClick).toBeInTheDocument();

      const button = await findByTestId(`${testIdBase}-ai-summary-action`);
      await user.click(button);
      await findByTestId(`${testIdBase}-state-indicator-loading`);

      const providerAfterClick = queryByTestId(metadataTestId);
      expect(providerAfterClick).not.toBeInTheDocument();
    });

    it('shows error state indicator on error', async () => {
      (useAISummary as jest.Mock).mockReturnValueOnce({
        isSummarisedOnMount: false,
        state: { status: 'error', content: '' },
        summariseUrl: jest.fn(),
      });
      const { findByTestId } = renderAISummaryBlock({
        testId: testIdBase,
      });

      const indicator = await findByTestId(`${testIdBase}-error`);
      expect(indicator).toBeInTheDocument();
    });

    it('fires a error viewed event on error', async () => {
      (useAISummary as jest.Mock).mockReturnValueOnce({
        isSummarisedOnMount: false,
        state: { status: 'error', content: '' },
        summariseUrl: jest.fn(),
      });
      const { spy } = renderAISummaryBlock({
        testId: testIdBase,
      });

      expect(spy).toBeFiredWithAnalyticEventOnce(
        {
          payload: {
            action: 'viewed',
            actionSubject: 'error',
            actionSubjectId: 'aiSummary',
          },
        },
        ANALYTICS_CHANNEL,
      );
    });
  });

  describe('metadata', () => {
    it('should render metadata', async () => {
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
  });

  describe('actions', () => {
    it('should render AI summary action button', async () => {
      const user = userEvent.setup();
      const onAIActionChange = jest.fn();
      const { findByTestId } = renderAISummaryBlock({
        onAIActionChange,
        testId: testIdBase,
      });

      const aiSummaryAction = await findByTestId(
        `${testIdBase}-ai-summary-action`,
      );
      expect(aiSummaryAction).toBeDefined();

      await user.click(aiSummaryAction);
      expect(onAIActionChange).toHaveBeenCalledWith('loading');
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
      const overrideCss = css({
        backgroundColor: 'blue',
      });
      const { findByTestId } = renderAISummaryBlock({
        overrideCss,
        testId: testIdBase,
      });

      const block = await findByTestId(`${testIdBase}-resolved-view`);

      expect(block).toHaveStyleDeclaration('background-color', 'blue');
    });
  });
});
