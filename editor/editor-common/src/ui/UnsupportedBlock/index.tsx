import React, { useCallback, useRef } from 'react';

import { Node as PMNode } from 'prosemirror-model';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import styled from 'styled-components';

import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import QuestionsIcon from '@atlaskit/icon/glyph/question-circle';
import { N30, N50 } from '@atlaskit/theme/colors';
import { borderRadius, fontSize } from '@atlaskit/theme/constants';
import Tooltip from '@atlaskit/tooltip';

import { unsupportedContentMessages } from '../../messages/unsupportedContent';
import { UnsupportedContentTooltipPayload } from '../../utils';
import { ACTION_SUBJECT_ID } from '../../utils/analytics';
import { trackUnsupportedContentTooltipDisplayedFor } from '../../utils/track-unsupported-content';
import { getUnsupportedContent } from '../unsupported-content-helper';

const BlockNode = styled.div`
  align-items: center;
  background: ${N30};
  border: 1px dashed ${N50};
  border-radius: ${borderRadius()}px;
  box-sizing: border-box;
  cursor: default;
  display: flex;
  font-size: ${relativeFontSizeToBase16(fontSize())};
  margin: 10px 0;
  min-height: 24px;
  padding: 10px;
  text-align: center;
  vertical-align: text-bottom;
  min-width: 120px;
  align-items: center;
  justify-content: center;
`;

export interface Props {
  node?: PMNode;
  children?: React.ReactNode;
  dispatchAnalyticsEvent?: (payload: UnsupportedContentTooltipPayload) => void;
}

const UnsupportedBlockNode: React.FC<Props & InjectedIntlProps> = ({
  node,
  intl,
  dispatchAnalyticsEvent,
}) => {
  const message = getUnsupportedContent(
    unsupportedContentMessages.unsupportedBlockContent,
    unsupportedContentMessages.unsupportedBlockContent.defaultMessage + ':',
    node,
    intl,
  );

  const tooltipContent = intl.formatMessage(
    unsupportedContentMessages.unsupportedContentTooltip,
  );

  const { current: style } = useRef({ padding: '4px' });

  const originalNodeType = node?.attrs.originalValue.type;

  const tooltipOnShowHandler = useCallback(
    () =>
      dispatchAnalyticsEvent &&
      trackUnsupportedContentTooltipDisplayedFor(
        dispatchAnalyticsEvent,
        ACTION_SUBJECT_ID.ON_UNSUPPORTED_BLOCK,
        originalNodeType,
      ),
    [dispatchAnalyticsEvent, originalNodeType],
  );
  return (
    <BlockNode>
      {message}
      <Tooltip
        content={tooltipContent}
        hideTooltipOnClick={false}
        position="bottom"
        onShow={tooltipOnShowHandler}
        strategy="absolute"
      >
        <span style={style}>
          <QuestionsIcon label="?" size="small" />
        </span>
      </Tooltip>
    </BlockNode>
  );
};

export default injectIntl(UnsupportedBlockNode);
