/** @jsx jsx */
import { CSSProperties, FC, ReactNode, useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';
import InlineDialog from '@atlaskit/inline-dialog';
import * as colors from '@atlaskit/theme/colors';
import { themed, useGlobalTheme } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';

import { VAR_SECONDARY_TEXT_COLOR } from '../../constants';
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
  appearance?: IconAppearance;
  /**
   * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-162 Internal documentation for deprecation (no external access)} Please avoid using this prop as we intend to remove the prop completely in a future release. See DSP-5207 for more information.
   * Instead use the 'appearance' prop.
   * Set the icon to be used before the title.
   */
  type?: IconAppearance;
  /**
   * A unique string that appears as a data attribute, `data-testid`,
   * in the rendered code. It is provided to serve as a hook for automated tests.
   *
   * The value of `testId` is attached to the different sub-components in Inline Message:
   *  - `testId`: the top-level inline message component
   *  - `testId--inline-dialog`: the content of the message
   *  - `testId--button`: the button element that opens the dialog on press
   *  - `testId--title`: the title of the message
   *  - `testId--text`: the text of the message
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
  padding: `${token('space.0', '0px')} ${token('space.050', '4px')}`,
  fontWeight: token('font.weight.medium', '500'),
});

const textStyles = css({
  padding: `${token('space.0', '0px')} ${token('space.050', '4px')}`,
  color: `var(${VAR_SECONDARY_TEXT_COLOR})`,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  // Use "clip" overflow to allow ellipses on x-axis without clipping descenders
  '@supports not (overflow-x: clip)': {
    overflow: 'hidden',
  },
  '@supports (overflow-x: clip)': {
    overflowX: 'clip',
  },
});

const rootStyles = css({
  display: 'inline-block',
  maxWidth: '100%',
  '&:focus': {
    outline: '1px solid',
  },
  '&:hover': {
    // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
    '[data-ds--inline-message--icon]': {
      // Legacy style
      color: 'var(--icon-accent-color)',
    },
    // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
    '[data-ds--inline-message--button]': {
      textDecoration: 'underline',
    },
  },
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '[data-ds--inline-message--button]': {
    '&:active [data-ds--inline-message--secondary-text]': {
      color: token('color.text.subtle', `var(${VAR_SECONDARY_TEXT_COLOR})`),
    },
  },
});

const titleColor = themed({
  light: token('color.text', colors.N600),
  dark: token('color.text', colors.DN600),
});
const textColor = themed({
  light: token('color.text.subtlest', colors.N300),
  dark: token('color.text.subtlest', colors.DN100),
});

const iconColor = themed('appearance', {
  connectivity: {
    light: token('color.icon.brand', colors.B300),
    dark: token('color.icon.brand', colors.B75),
  },
  confirmation: {
    light: token('color.icon.success', colors.G200),
    dark: token('color.icon.success', colors.G200),
  },
  info: {
    light: token('color.icon.discovery', colors.P200),
    dark: token('color.icon.discovery', colors.P200),
  },
  warning: {
    light: token('color.icon.warning', colors.Y200),
    dark: token('color.icon.warning', colors.Y200),
  },
  error: {
    light: token('color.icon.danger', colors.R300),
    dark: token('color.icon.danger', colors.R300),
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
  appearance,
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

  if (!appearance) {
    appearance = type;
  }

  return (
    <div
      css={rootStyles}
      style={
        {
          '--icon-accent-color': iconColor({ appearance: appearance, theme }),
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
            <MessageIcon
              isOpen={isOpen}
              appearance={appearance}
              label={iconLabel}
            />
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
                data-ds--inline-message--secondary-text
                style={
                  {
                    [VAR_SECONDARY_TEXT_COLOR]: textColor({ theme }),
                  } as CSSProperties
                }
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
