import React, { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl-next';

import { Box, Inline } from '@atlaskit/primitives';

import {
  ActionName,
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
import AiIcon from '../../../../../common/ai-icon';

const AISummaryBlockResolvedView: React.FC<AISummaryBlockProps> = (props) => {
  const {
    actions = [],
    metadata,
    testId,
    onActionMenuOpenChange,
    onAIActionChange,
    size = SmartLinkSize.Medium,
  } = props;
  const [aiState, setAIState] = useState<AIState>('ready');

  const metadataElements = renderElementItems(metadata);

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
        icon: <AiIcon label="AiIcon" />,
      } as ActionItem;

      return [aiAction, ...actions];
    }
    return actions;
  }, [actions, aiState, onAIActionClick, testId]);

  const onDropdownOpenChange = useCallback(
    (isOpen) => {
      if (onActionMenuOpenChange) {
        onActionMenuOpenChange({ isOpen });
      }
    },
    [onActionMenuOpenChange],
  );

  return (
    <Block {...props} testId={`${testId}-resolved-view`}>
      <Inline
        alignBlock="center"
        alignInline="end"
        grow="fill"
        spread="space-between"
      >
        <Box>
          {aiState === 'loading' || aiState === 'done' ? (
            <AIStateIndicator state={aiState} testId={testId} />
          ) : (
            <ElementGroup width={SmartLinkWidth.FitToContent}>
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
    </Block>
  );
};

export default AISummaryBlockResolvedView;
