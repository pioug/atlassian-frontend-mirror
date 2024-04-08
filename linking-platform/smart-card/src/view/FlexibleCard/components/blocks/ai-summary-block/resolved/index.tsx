import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { FormattedMessage } from 'react-intl-next';

import { Box, Inline } from '@atlaskit/primitives';

import {
  ActionName,
  SmartLinkDirection,
  SmartLinkSize,
  SmartLinkWidth,
} from '../../../../../../constants';
import ActionGroup from '../../action-group';
import Block from '../../block';
import ElementGroup from '../../element-group';
import AIStateIndicator from '../ai-state-indicator';
import { renderElementItems } from '../../utils';
import type { ActionItem } from '../../types';
import type { AISummaryBlockProps } from '../types';
import { messages } from '../../../../../../messages';
import { useAISummary } from '../../../../../../state/hooks/use-ai-summary';
import { useFlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import AIIcon from '../../../../../common/ai-icon';
import AISummary from '../../../../../common/ai-summary';
import { useAnalyticsEvents } from '../../../../../../common/analytics/generated/use-analytics-events';
import AIEventSummaryViewed from '../ai-event-summary-viewed';
import AIEventErrorViewed from '../ai-event-error-viewed';
import { di } from 'react-magnetic-di';
import type {
  AISummaryStatus,
  ErrorMessage,
} from '../../../../../../state/hooks/use-ai-summary/ai-summary-service/types';

export const AISummaryBlockErrorIndicator = ({
  showErrorIndicator,
  error,
  testId,
}: {
  showErrorIndicator: boolean;
  error?: ErrorMessage;
} & Pick<AISummaryBlockProps, 'testId'>) => {
  return showErrorIndicator ? (
    <Inline grow="fill">
      <AIEventErrorViewed reason={error} />
      <AIStateIndicator error={error} state={'error'} testId={testId} />
    </Inline>
  ) : null;
};

export const AISummaryBlockStatusIndicator = ({
  showStatusIndicator,
  metadata,
  status,
  testId,
}: {
  showStatusIndicator: boolean;
  status: AISummaryStatus;
} & Pick<AISummaryBlockProps, 'metadata' | 'testId'>) => {
  const metadataElements = renderElementItems(metadata);

  return showStatusIndicator ? (
    <AIStateIndicator state={status} testId={`${testId}-state-indicator`} />
  ) : (
    <ElementGroup
      width={SmartLinkWidth.FitToContent}
      testId={`${testId}-metadata-group`}
    >
      {metadataElements}
    </ElementGroup>
  );
};

const AISummaryBlockResolvedView = (props: AISummaryBlockProps) => {
  di(
    useAISummary,
    AISummaryBlockErrorIndicator,
    AISummaryBlockStatusIndicator,
    AISummary,
  );

  const {
    actions = [],
    onActionMenuOpenChange,
    size = SmartLinkSize.Medium,
    testId,
    aiSummaryMinHeight,
    metadata,
  } = props;

  const { fireEvent } = useAnalyticsEvents();
  const context = useFlexibleUiContext();
  const url = context?.url || '';
  const ari = context?.ari || '';

  const {
    summariseUrl,
    state: { content, status, error },
  } = useAISummary({ url, ari });

  const showAISummary =
    status === 'done' ||
    // We want to display the AI Summary component only when there is content available during the loading process.
    (status === 'loading' && !!content);

  const isSummarisedOnMountRef = useRef(status === 'done');
  const isErroredOnMountRef = useRef(status === 'error');

  useEffect(() => {
    // if the error was apparent on mount and the status is changed to loading we can
    // clear the initial error on mount state
    if (isErroredOnMountRef.current && status === 'loading') {
      isErroredOnMountRef.current = false;
    }
  }, [status]);

  const combinedActions = useMemo(() => {
    if (status === 'ready' || status === 'error') {
      const aiAction = {
        content: <FormattedMessage {...messages.ai_summarize} />,
        name: ActionName.CustomAction,
        onClick: () => {
          fireEvent('ui.button.clicked.aiSummary', {});
          summariseUrl();
        },
        testId: `${testId}-ai-summary-action`,
        icon: <AIIcon label="AIIcon" />,
      } as ActionItem;

      return [aiAction, ...actions];
    }
    return actions;
  }, [actions, status, testId, summariseUrl, fireEvent]);

  const onDropdownOpenChange = useCallback(
    (isOpen: boolean) => {
      if (onActionMenuOpenChange) {
        onActionMenuOpenChange({ isOpen });
      }
    },
    [onActionMenuOpenChange],
  );

  return (
    <Block
      {...props}
      direction={SmartLinkDirection.Vertical}
      testId={`${testId}-resolved-view`}
    >
      {status === 'done' && (
        <AIEventSummaryViewed fromCache={isSummarisedOnMountRef.current} />
      )}
      {showAISummary && (
        <AISummary
          testId={`${testId}-ai-summary`}
          minHeight={aiSummaryMinHeight}
          content={content}
          showIcon={isSummarisedOnMountRef.current}
        />
      )}
      <Inline
        alignBlock="center"
        alignInline="end"
        grow="fill"
        spread="space-between"
      >
        <Box>
          <AISummaryBlockStatusIndicator
            metadata={metadata}
            showStatusIndicator={
              !isSummarisedOnMountRef.current &&
              (status === 'loading' || status === 'done')
            }
            status={status}
            testId={testId}
          />
        </Box>
        <Box>
          <ActionGroup
            onDropdownOpenChange={onDropdownOpenChange}
            items={combinedActions}
            appearance="default"
            size={size}
          />
        </Box>
      </Inline>
      <AISummaryBlockErrorIndicator
        showErrorIndicator={!isErroredOnMountRef.current && status === 'error'}
        error={error}
        testId={testId}
      />
    </Block>
  );
};

export default AISummaryBlockResolvedView;
