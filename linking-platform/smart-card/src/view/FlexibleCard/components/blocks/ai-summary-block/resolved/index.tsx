import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
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

const AISummaryBlockResolvedView: React.FC<AISummaryBlockProps> = (props) => {
  const {
    actions = [],
    metadata,
    onActionMenuOpenChange,
    size = SmartLinkSize.Medium,
    testId,
    aiSummaryMinHeight,
  } = props;

  const metadataElements = renderElementItems(metadata);
  const { fireEvent } = useAnalyticsEvents();
  const context = useFlexibleUiContext();
  const url = context?.url || '';

  const {
    summariseUrl,
    state: { content, status },
  } = useAISummary({ url });

  const showAISummary = status !== 'ready' && status !== 'error';

  const isSummarisedOnMountRef = useRef(status === 'done');
  let isErroredOnMountRef = useRef(status === 'error');

  const [showAISummaryErrorMessage, setShowAISummaryErrorMessage] =
    useState<boolean>(false);

  useEffect(() => {
    if (isErroredOnMountRef.current && status === 'loading') {
      isErroredOnMountRef.current = false;
      setShowAISummaryErrorMessage(true);
    } else {
      setShowAISummaryErrorMessage(
        !isErroredOnMountRef.current && status === 'error',
      );
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
          {!isSummarisedOnMountRef.current &&
          (status === 'loading' || status === 'done') ? (
            <AIStateIndicator
              state={status}
              testId={`${testId}-state-indicator`}
            />
          ) : (
            <ElementGroup
              width={SmartLinkWidth.FitToContent}
              testId={`${testId}-metadata-group`}
            >
              {metadataElements}
            </ElementGroup>
          )}
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
      {/* <AIStateIndicator state={'error'} testId={testId} /> */}
      {showAISummaryErrorMessage && (
        <Inline grow="fill">
          <AIEventErrorViewed />
          <AIStateIndicator state={status} testId={testId} />
        </Inline>
      )}
    </Block>
  );
};

export default AISummaryBlockResolvedView;
