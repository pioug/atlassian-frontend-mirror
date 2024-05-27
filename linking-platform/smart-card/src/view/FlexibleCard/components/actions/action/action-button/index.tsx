/** @jsx jsx */
import React, { useCallback } from 'react';
import { css, jsx } from '@emotion/react';
import { LoadingButton } from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import { SmartLinkSize } from '../../../../../../constants';
import { type ActionButtonProps } from './types';
import { sizeToButtonSpacing } from '../../../utils';

const getButtonStyle = (size?: SmartLinkSize, iconOnly?: boolean) => {
  switch (size) {
    case SmartLinkSize.Large:
      return iconOnly
        ? css({
            'button, button:hover, button:focus, button:active': {
              padding: 0,
              '> span': {
                margin: 0,
              },
            },
          })
        : '';
    case SmartLinkSize.Small:
      return css({
        fontSize: '0.75rem',
        fontWeight: 500,
        lineHeight: '1rem',
        'button, button:hover, button:focus, button:active': [
          {
            lineHeight: '1rem',
          },
          iconOnly
            ? `
            padding: 0.125rem;
          `
            : `
            padding-left: 0.25rem;
            padding-right: 0.25rem;
          `,
        ],
      });
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
  isLoading,
  onClick,
  overrideCss,
  size,
  testId,
  tooltipMessage,
  isDisabled,
  href,
  ariaLabel,
}) => {
  const iconOnly = !content;

  const onButtonClick = useCallback(
    (handler: Function) => (e: React.BaseSyntheticEvent) => {
      e.preventDefault();
      handler();
    },
    [],
  );

  return (
    <div
      css={[getButtonStyle(size, iconOnly), overrideCss]}
      data-testid={`${testId}-button-wrapper`}
    >
      <Tooltip
        content={tooltipMessage}
        hideTooltipOnClick={true}
        testId={`${testId}-tooltip`}
      >
        <LoadingButton
          appearance={appearance}
          iconAfter={iconAfter}
          iconBefore={iconBefore}
          isDisabled={isDisabled}
          isLoading={isLoading}
          onClick={onButtonClick(onClick)}
          spacing={sizeToButtonSpacing[size]}
          testId={testId}
          href={href}
          aria-label={ariaLabel}
        >
          {content}
        </LoadingButton>
      </Tooltip>
    </div>
  );
};

export default ActionButton;
