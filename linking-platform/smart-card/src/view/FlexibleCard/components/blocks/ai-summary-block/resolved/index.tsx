import React, { useCallback, useMemo, useState } from 'react';
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
import type { AIState } from '../types';
import { messages } from '../../../../../../messages';
import { useAISummary } from '../../../../../../state/hooks/use-ai-summary';
import { useFlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import AIIcon from '../../../../../common/ai-icon';
import AISummary from '../../../../../common/ai-summary';

const AISummaryBlockResolvedView: React.FC<AISummaryBlockProps> = (props) => {
  const {
    actions = [],
    metadata,
    onActionMenuOpenChange,
    onAIActionChange,
    size = SmartLinkSize.Medium,
    testId,
  } = props;
  const [aiState, setAIState] = useState<AIState>('ready');

  const metadataElements = renderElementItems(metadata);

  const context = useFlexibleUiContext();
  const url = context?.url || '';

  const aiSummary = useAISummary({ url });
  const {
    state: { content, status },
    isSummarisedOnMount,
  } = aiSummary;

  const onAIActionClick = useCallback(() => {
    setAIState('loading');
    if (onAIActionChange) {
      onAIActionChange('loading');
    }
  }, [onAIActionChange]);

  const combinedActions = useMemo(() => {
    if (aiState === 'ready') {
      const aiAction = {
        content: <FormattedMessage {...messages.ai_summarize} />,
        name: ActionName.CustomAction,
        onClick: onAIActionClick,
        testId: `${testId}-ai-summary-action`,
        icon: <AIIcon label="AIIcon" />,
      } as ActionItem;

      return [aiAction, ...actions];
    }
    return actions;
  }, [actions, aiState, onAIActionClick, testId]);

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
      <AISummary content={content} showIcon={isSummarisedOnMount} />

      <Inline
        alignBlock="center"
        alignInline="end"
        grow="fill"
        spread="space-between"
      >
        <Box>
          {!isSummarisedOnMount &&
          (aiState === 'loading' || aiState === 'done') ? (
            <AIStateIndicator
              state={aiState}
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
      {status === 'error' && (
        <Inline grow="fill">
          <AIStateIndicator state={status} testId={testId} />
        </Inline>
      )}
    </Block>
  );
};

export default AISummaryBlockResolvedView;
