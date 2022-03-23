/** @jsx jsx */
import React from 'react';
import { FormattedMessage } from 'react-intl-next';

import { css, jsx, SerializedStyles } from '@emotion/core';

import { TitleBlockProps } from '../types';
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
import { BaseTitleBlockComponent } from '../utils';

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

const TitleBlockErroredView: React.FC<TitleBlockProps> = (props) => {
  const { size = SmartLinkSize.Medium, retry, testId } = props;
  const { descriptor: retryDescriptor, onClick, values: retryValues } =
    retry || {};

  const hasAction = onClick !== undefined;

  return (
    <BaseTitleBlockComponent {...props} blockTestIdPostfix="errored-view">
      {retryDescriptor && (
        <ElementGroup
          direction={SmartLinkDirection.Horizontal}
          align={SmartLinkAlignment.Right}
        >
          <span
            css={getMessageStyles(size, hasAction)}
            onClick={onClick}
            data-testid={`${testId}-errored-view-message`}
          >
            <FormattedMessage {...retryDescriptor} values={retryValues} />
          </span>
        </ElementGroup>
      )}
    </BaseTitleBlockComponent>
  );
};

export default TitleBlockErroredView;
