import React, { useRef } from 'react';

import { Node as PMNode } from 'prosemirror-model';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import styled from 'styled-components';

import QuestionsIcon from '@atlaskit/icon/glyph/question-circle';
import { N30, N50 } from '@atlaskit/theme/colors';
import { borderRadius, fontSize } from '@atlaskit/theme/constants';
import Tooltip from '@atlaskit/tooltip';

import { unsupportedContentMessages } from '../../messages/unsupportedContent';
import { getUnsupportedContent } from '../unsupported-content-helper';

const InlineNode = styled.span`
  align-items: center;
  background: ${N30};
  border: 1px dashed ${N50};
  border-radius: ${borderRadius()}px;
  box-sizing: border-box;
  cursor: default;
  display: inline-flex;
  font-size: ${fontSize()}px;
  margin: 0 2px;
  min-height: 24px;
  padding: 0 10px;
  user-select: all;
  vertical-align: middle;
  white-space: nowrap;

  &.ProseMirror-selectednode {
    background: ${N50};
    outline: none;
  }
`;

export interface Props {
  node?: PMNode;
  children?: React.ReactNode;
}

const UnsupportedInlineNode: React.FC<Props & InjectedIntlProps> = ({
  node,
  intl,
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

  return (
    <InlineNode>
      {message}
      <Tooltip
        content={tooltipContent}
        hideTooltipOnClick={false}
        position="bottom"
      >
        <span style={style}>
          <QuestionsIcon label="?" size="small" />
        </span>
      </Tooltip>
    </InlineNode>
  );
};

export default injectIntl(UnsupportedInlineNode);
