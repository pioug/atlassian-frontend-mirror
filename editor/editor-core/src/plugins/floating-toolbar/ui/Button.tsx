import React from 'react';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button/custom-theme-button';
import { getButtonStyles, iconOnlySpacing } from './styles';

import type { ButtonAppearance } from '@atlaskit/editor-common/types';
export type { ButtonAppearance };
export interface Props {
  title?: string;
  icon?: React.ReactElement<any>;
  iconAfter?: React.ReactElement<any>;
  onClick?: React.MouseEventHandler;
  onMouseEnter?: <T>(event: React.MouseEvent<T>) => void;
  onMouseLeave?: <T>(event: React.MouseEvent<T>) => void;
  onFocus?: <T>(event: React.FocusEvent<T>) => void;
  onBlur?: <T>(event: React.FocusEvent<T>) => void;
  selected?: boolean;
  disabled?: boolean;
  appearance?: ButtonAppearance;
  ariaHasPopup?:
    | boolean
    | 'dialog'
    | 'menu'
    | 'listbox'
    | 'tree'
    | 'grid'
    | undefined;
  href?: string;
  target?: string;
  children?: React.ReactNode;
  className?: string;
  tooltipContent?: React.ReactNode;
  testId?: string;
  hideTooltipOnClick?: boolean;
  tabIndex?: number | null | undefined;
}

export default ({
  title,
  icon,
  iconAfter,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  selected,
  disabled,
  href,
  target,
  appearance = 'subtle',
  children,
  className,
  tooltipContent,
  testId,
  hideTooltipOnClick = true,
  ariaHasPopup,
  tabIndex,
}: Props) => {
  // Check if there's only an icon and add additional styles
  const iconOnly = (icon || iconAfter) && !children;
  const customSpacing = iconOnly ? iconOnlySpacing : {};

  return (
    <Tooltip
      content={tooltipContent || title}
      hideTooltipOnClick={hideTooltipOnClick}
      position="top"
    >
      <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Button
          className={className}
          theme={(adgTheme, themeProps) => {
            const { buttonStyles, ...rest } = adgTheme(themeProps);
            return {
              buttonStyles: {
                ...buttonStyles,
                ...customSpacing,
                ...(appearance === 'danger' &&
                  getButtonStyles({
                    appearance,
                    state: themeProps.state,
                    mode: themeProps.mode,
                  })),
              },
              ...rest,
            };
          }}
          aria-label={title}
          aria-pressed={selected}
          spacing={'compact'}
          href={href}
          target={target}
          appearance={appearance}
          aria-haspopup={ariaHasPopup}
          iconBefore={icon || undefined}
          iconAfter={iconAfter}
          onClick={onClick}
          isSelected={selected}
          isDisabled={disabled}
          testId={testId}
          onFocus={onFocus}
          onBlur={onBlur}
          // @ts-ignore
          // tabIndex set as 0 by default in the design system  ButtonBase component
          // this is not expected for all buttons, we have to use tabIndex={null} for some cases
          // should be fixed here https://a11y-internal.atlassian.net/browse/DST-287
          tabIndex={tabIndex}
        >
          {children}
        </Button>
      </div>
    </Tooltip>
  );
};
