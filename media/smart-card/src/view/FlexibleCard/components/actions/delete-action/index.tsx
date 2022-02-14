/** @jsx jsx */
import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { css, jsx } from '@emotion/core';
import Button from '@atlaskit/button/custom-theme-button';
import { ActionProps } from '../types';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { SmartLinkSize } from '../../../../../constants';
import Tooltip from '@atlaskit/tooltip';
import { getIconSizeStyles } from '../../utils';
import { messages } from '../../../../../messages';
import { tokens } from '../../../../../utils/token';
import { handleOnClick } from '../../../../../utils';

const getWidth = (size?: SmartLinkSize): string => {
  switch (size) {
    case SmartLinkSize.XLarge:
    case SmartLinkSize.Large:
      return '1.5rem';
    case SmartLinkSize.Medium:
    case SmartLinkSize.Small:
    default:
      return '1rem';
  }
};

const getStyles = (size?: SmartLinkSize) => css`
  color: ${tokens.actionIcon};
  ${getIconSizeStyles(getWidth(size))};
`;

const DeleteAction: React.FC<ActionProps> = ({
  appearance = 'subtle',
  content,
  onClick,
  size = SmartLinkSize.Medium,
  testId = 'smart-action-delete-action',
}: ActionProps) => {
  if (!onClick) {
    return null;
  }
  return (
    <Tooltip content={<FormattedMessage {...messages.delete} />}>
      <Button
        spacing="none"
        appearance={appearance}
        testId={testId}
        onClick={handleOnClick(onClick)}
      >
        {content || (
          <span css={getStyles(size)} data-testid={`${testId}-icon`}>
            <CrossIcon label="Delete"></CrossIcon>
          </span>
        )}
      </Button>
    </Tooltip>
  );
};

export default DeleteAction;
