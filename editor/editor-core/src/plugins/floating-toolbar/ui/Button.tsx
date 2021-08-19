import React from 'react';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button/custom-theme-button';
import { getButtonStyles, iconOnlySpacing } from './styles';

export type ButtonAppearance = 'subtle' | 'danger';
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
  href?: string;
  target?: string;
  children?: React.ReactNode;
  className?: string;
  tooltipContent?: React.ReactNode;
  testId?: string;
  hideTooltipOnClick?: boolean;
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
          spacing={'compact'}
          href={href}
          target={target}
          appearance={appearance}
          aria-haspopup={true}
          iconBefore={icon || undefined}
          iconAfter={iconAfter}
          onClick={onClick}
          isSelected={selected}
          isDisabled={disabled}
          testId={testId}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          {children}
        </Button>
      </div>
    </Tooltip>
  );
};
