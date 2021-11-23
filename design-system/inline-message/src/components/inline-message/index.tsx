/** @jsx jsx */
import { CSSProperties, FC, ReactNode, useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/custom-theme-button';
import InlineDialog from '@atlaskit/inline-dialog';
import * as colors from '@atlaskit/theme/colors';
import { themed, useGlobalTheme } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';

import { itemSpacing } from '../../constants';
import type { IconAppearance, InlineDialogPlacement } from '../../types';
import MessageIcon from '../message-icon';

interface InlineMessageProps {
  /**
   * The elements to be displayed by the inline dialog.
   */
  children?: ReactNode;
  /**
   * The placement to be passed to the inline dialog. Determines where around
   * the text the dialog is displayed.
   */
  placement?: InlineDialogPlacement;
  /**
   * Text to display second.
   */
  secondaryText?: ReactNode;
  /**
   * Text to display first, bolded for emphasis.
   */
  title?: ReactNode;
  /**
   * Set the icon to be used before the title. Options are: connectivity,
   * confirmation, info, warning, and error.
   */
  type?: IconAppearance;
  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   *
   * As inline message is composed of different components, we passed down the testId to the sub component you want to test:
   * - testId to identify the inline message component.
   * - testId--inline-dialog to get the content of the actual component.
   * - testId--button to click on the actual component.
   * - testId--title to get the title of the actual component.
   * - testId--text to get the text of the actual component.
   */
  testId?: string;
  /**
   * Text to be used as label for the button icon. Can be used to provide useful information for users with screen readers when there is no title and/or secondaryText
   */
  iconLabel?: string;
}

const buttonContentsStyles = css({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
});

const titleStyles = css({
  padding: `0 ${itemSpacing}px`,
  fontWeight: 500,
});

const textStyles = css({
  padding: `0 ${itemSpacing}px`,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const rootStyles = css({
  display: 'inline-block',
  maxWidth: '100%',
  '&:focus': {
    outline: '1px solid',
  },
  '&:hover': {
    // eslint-disable-next-line @repo/internal/styles/no-nested-styles
    '[data-ds--inline-message--icon]': {
      color: 'var(--icon-accent-color)',
    },
    // eslint-disable-next-line @repo/internal/styles/no-nested-styles
    '[data-ds--inline-message--button]': {
      textDecoration: 'underline',
    },
  },
});

const titleColor = themed({
  light: token('color.text.highEmphasis', colors.N600),
  dark: token('color.text.highEmphasis', colors.DN600),
});
const textColor = themed({
  light: token('color.text.lowEmphasis', colors.N300),
  dark: token('color.text.lowEmphasis', colors.DN100),
});

const iconColor = themed('appearance', {
  connectivity: {
    light: token('color.iconBorder.brand', colors.B300),
    dark: token('color.iconBorder.brand', colors.B75),
  },
  confirmation: {
    light: token('color.iconBorder.success', colors.G200),
    dark: token('color.iconBorder.success', colors.G200),
  },
  info: {
    light: token('color.iconBorder.discovery', colors.P200),
    dark: token('color.iconBorder.discovery', colors.P200),
  },
  warning: {
    light: token('color.iconBorder.warning', colors.Y200),
    dark: token('color.iconBorder.warning', colors.Y200),
  },
  error: {
    light: token('color.iconBorder.danger', colors.R300),
    dark: token('color.iconBorder.danger', colors.R300),
  },
});

/**
 * __Inline message__
 *
 * An inline message lets users know when important information is available or when an action is required.
 *
 * - [Examples](https://atlassian.design/components/inline-message/examples)
 * - [Code](https://atlassian.design/components/inline-message/code)
 * - [Usage](https://atlassian.design/components/inline-message/usage)
 *
 * @example
 *
 * ```jsx
 * const Component = () => (
 *   <InlineMessage
 *    title="Inline Message Title Example"
 *    secondaryText="Secondary Text"
 *   >
 *    <p>Some text that would be inside the open dialog and otherwise hidden.</p>
 *   </InlineMessage>
 * );
 * ```
 */
const InlineMessage: FC<InlineMessageProps> = ({
  placement = 'bottom-start',
  secondaryText = '',
  title = '',
  type = 'connectivity',
  children,
  testId,
  iconLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDialog = useCallback(() => {
    setIsOpen((oldState) => !oldState);
  }, [setIsOpen]);

  const onCloseDialog = useCallback(() => setIsOpen(false), [setIsOpen]);
  const theme = useGlobalTheme();

  return (
    <div
      css={rootStyles}
      style={
        {
          '--icon-accent-color': iconColor({ appearance: type, theme }),
        } as CSSProperties
      }
      data-testid={testId}
    >
      <InlineDialog
        onClose={onCloseDialog}
        content={children}
        isOpen={isOpen}
        placement={placement}
        testId={testId && `${testId}--inline-dialog`}
      >
        <Button
          data-ds--inline-message--button
          appearance="subtle-link"
          onClick={toggleDialog}
          spacing="none"
          testId={testId && `${testId}--button`}
        >
          <div css={buttonContentsStyles}>
            <MessageIcon isOpen={isOpen} appearance={type} label={iconLabel} />
            {title && (
              <span
                style={{ color: titleColor({ theme }) }}
                css={titleStyles}
                data-testid={testId && `${testId}--title`}
              >
                {title}
              </span>
            )}
            {secondaryText && (
              <span
                style={{ color: textColor({ theme }) }}
                css={textStyles}
                data-testid={testId && `${testId}--text`}
              >
                {secondaryText}
              </span>
            )}
          </div>
        </Button>
      </InlineDialog>
    </div>
  );
};

export default InlineMessage;
