/** @jsx jsx */
import React from 'react';
import { FormattedMessage } from 'react-intl-next';

import { css, jsx, SerializedStyles } from '@emotion/core';

import { LinkIcon, Title } from '../../../elements';
import { TitleBlockProps } from '../types';
import Block from '../../block';
import {
  SmartLinkAlignment,
  SmartLinkDirection,
  SmartLinkSize,
} from '../../../../../../constants';
import {
  getLinkLineHeight,
  getLinkSizeStyles,
  getTruncateStyles,
} from '../../../utils';
import ElementGroup from '../../element-group';
import { tokens } from '../../../../../../utils/token';

const actionStyles: SerializedStyles = css`
  cursor: pointer;
  :hover {
    color: ${tokens.errorMessageHover};
    text-decoration: underline;
  }
`;

const getMessageStyles = (
  size: SmartLinkSize,
  hasAction: boolean,
): SerializedStyles => {
  const sizeStyles = getLinkSizeStyles(size);
  return css`
    flex: 1 1 auto;
    justify-content: flex-end;
    ${hasAction ? actionStyles : ''}
    ${sizeStyles}
    ${getTruncateStyles(
      1,
      getLinkLineHeight(size),
    )}
    color: ${tokens.errorMessage};
  `;
};

const TitleBlockErroredView: React.FC<TitleBlockProps> = ({
  maxLines,
  retry,
  position,
  testId,
  theme,
  ...blockProps
}) => {
  const { descriptor, onClick, values } = retry || {};
  const { size = SmartLinkSize.Medium } = blockProps;
  const hasAction = onClick !== undefined;
  return (
    <Block {...blockProps} testId={`${testId}-errored-view`}>
      <LinkIcon position={position} />
      <Title maxLines={maxLines} theme={theme} />
      {descriptor && (
        <ElementGroup
          direction={SmartLinkDirection.Horizontal}
          align={SmartLinkAlignment.Right}
        >
          <span
            css={getMessageStyles(size, hasAction)}
            onClick={onClick}
            data-testid={`${testId}-errored-view-message`}
          >
            <FormattedMessage {...descriptor} values={values} />
          </span>
        </ElementGroup>
      )}
    </Block>
  );
};

export default TitleBlockErroredView;
