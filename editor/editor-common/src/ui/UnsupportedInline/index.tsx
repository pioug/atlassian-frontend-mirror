/** @jsx jsx */
import React, { useCallback, useRef } from 'react';

import { css, jsx } from '@emotion/react';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';

import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import QuestionsIcon from '@atlaskit/icon/glyph/question-circle';
import { N30, N50 } from '@atlaskit/theme/colors';
import { borderRadius, fontSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { ACTION_SUBJECT_ID } from '../../analytics';
import { unsupportedContentMessages } from '../../messages/unsupportedContent';
import { UnsupportedContentTooltipPayload } from '../../utils';
import { trackUnsupportedContentTooltipDisplayedFor } from '../../utils/track-unsupported-content';
import { getUnsupportedContent } from '../unsupported-content-helper';

const inlineNodeStyle = css`
  align-items: center;
  background: ${token('color.background.disabled', N30)};
  border: 1px dashed ${token('color.border.disabled', N50)};
  border-radius: ${borderRadius()}px;
  box-sizing: border-box;
  cursor: default;
  display: inline-flex;
  font-size: ${relativeFontSizeToBase16(fontSize())};
  margin: 0 ${token('space.025', '2px')};
  min-height: 24px;
  padding: 0 10px;
  vertical-align: middle;
  white-space: nowrap;
`;

export interface Props {
  node?: PMNode;
  children?: React.ReactNode;
  dispatchAnalyticsEvent?: (payload: UnsupportedContentTooltipPayload) => void;
}

const UnsupportedInlineNode: React.FC<Props & WrappedComponentProps> = ({
  node,
  intl,
  dispatchAnalyticsEvent,
}) => {
  const message = getUnsupportedContent(
    unsupportedContentMessages.unsupportedInlineContent,
    'Unsupported',
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
        ACTION_SUBJECT_ID.ON_UNSUPPORTED_INLINE,
        originalNodeType,
      ),
    [dispatchAnalyticsEvent, originalNodeType],
  );
  return (
    <span css={inlineNodeStyle}>
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
    </span>
  );
};

export default injectIntl(UnsupportedInlineNode);
