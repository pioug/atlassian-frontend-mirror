/** @jsx jsx */
import React, { useCallback } from 'react';
import { css, jsx } from '@emotion/core';
import Button from '@atlaskit/button/custom-theme-button';
import Tooltip from '@atlaskit/tooltip';
import { SmartLinkSize } from '../../../../../../constants';
import { ActionButtonProps } from './types';
import { sizeToButtonSpacing } from '../../../utils';

const getButtonStyle = (size?: SmartLinkSize, iconOnly?: boolean) => {
  switch (size) {
    case SmartLinkSize.Large:
      return iconOnly
        ? css`
            button,
            button:hover,
            button:focus,
            button:active {
              padding: 0;
              > span {
                margin: 0;
              }
            }
          `
        : '';
    case SmartLinkSize.Small:
      return css`
        font-size: 0.75rem;
        font-weight: 500;
        line-height: 1rem;
        button,
        button:hover,
        button:focus,
        button:active {
          line-height: 1rem;
          ${iconOnly
            ? `
            padding: 0.125rem;
          `
            : `
            padding-left: 0.25rem;
            padding-right: 0.25rem;
          `}
        }
      `;
    case SmartLinkSize.XLarge:
    case SmartLinkSize.Medium:
    default:
      return '';
  }
};

const ActionButton: React.FC<ActionButtonProps> = ({
  appearance,
  content,
  iconAfter,
  iconBefore,
  onClick,
  overrideCss,
  size,
  testId,
  tooltipMessage,
}) => {
  const iconOnly = !content;

  const onButtonClick = useCallback(
    (handler: Function) => (e: React.BaseSyntheticEvent) => {
      e.preventDefault();
      handler();
    },
    [],
  );

  const onContainerClick = useCallback((e: React.BaseSyntheticEvent) => {
    // Stop button on click event from propagate into parent container.
    e.stopPropagation();
  }, []);

  return (
    <div
      css={[getButtonStyle(size, iconOnly), overrideCss]}
      data-testid={`${testId}-button-wrapper`}
      onClick={onContainerClick}
    >
      <Tooltip
        content={tooltipMessage}
        hideTooltipOnClick={true}
        testId={`${testId}-tooltip`}
      >
        <Button
          appearance={appearance}
          iconAfter={iconAfter}
          iconBefore={iconBefore}
          onClick={onButtonClick(onClick)}
          spacing={sizeToButtonSpacing[size]}
          testId={testId}
        >
          {content}
        </Button>
      </Tooltip>
    </div>
  );
};

export default ActionButton;
