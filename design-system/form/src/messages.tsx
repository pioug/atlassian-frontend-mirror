/** @jsx jsx */

import React, { ReactNode } from 'react';

import { css, jsx, SerializedStyles } from '@emotion/react';

import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { N200 } from '@atlaskit/theme/colors';
import { useGlobalTheme } from '@atlaskit/theme/components';
import {
  fontFamily as getFontFamily,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { h200 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { FieldId } from './field';

type MessageAppearance = 'default' | 'error' | 'valid';

/**
 * API for the internal `<Message />` component. This is not public API.
 */
interface InternalMessageProps {
  /**
   * The content of the message
   */
  children: ReactNode;
  /**
   * A testId prop is provided for specified elements, which is a unique string
   *  that appears as a data attribute data-testid in the rendered code,
   *  serving as a hook for automated tests
   */
  testId?: string;
  /**
   * Determines the appearance of the message.
   */
  appearance?: MessageAppearance;
  fieldId?: string;
}

/**
 * Public API of the various message components.
 */
type MessageProps = Pick<InternalMessageProps, 'children' | 'testId'>;

const gridSize = getGridSize();
const fontFamily = getFontFamily();

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const lightH200Styles = css(h200({ theme: { mode: 'light' } }));
// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const darkH200Styles = css(h200({ theme: { mode: 'dark' } }));

const messageStyles = css({
  display: 'flex',
  marginTop: `${gridSize * 0.5}px`,
  justifyContent: 'baseline',
  fontFamily: `${fontFamily}`,
  fontWeight: 'normal',
});

const messageAppearanceStyles: Record<MessageAppearance, SerializedStyles> = {
  default: css({
    color: token('color.text.subtlest', N200),
  }),
  error: css({
    color: token('color.text.danger', '#AE2A19'),
  }),
  valid: css({
    color: token('color.text.success', '#216E4E'),
  }),
};

const iconWrapperStyles = css({
  display: 'flex',
});

const IconWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <span css={iconWrapperStyles}>{children}</span>;
};

const messageIcons: Partial<Record<MessageAppearance, JSX.Element>> = {
  error: <ErrorIcon size="small" label="error" />,
  valid: <SuccessIcon size="small" label="success" />,
};

const Message: React.FC<InternalMessageProps> = ({
  children,
  appearance = 'default',
  fieldId,
  testId,
}) => {
  const { mode } = useGlobalTheme();

  const icon = messageIcons[appearance];

  /**
   * The wrapping span is necessary to preserve spaces between children.
   * Otherwise the flex layout of the message will remove any whitespace
   * between children.
   *
   * If the child is just a string, this is not required and we can use one
   * less DOM element.
   */
  const content =
    typeof children === 'string' ? children : <span>{children}</span>;

  return (
    <div
      css={[
        mode === 'light' ? lightH200Styles : darkH200Styles,
        messageStyles,
        messageAppearanceStyles[appearance],
      ]}
      data-testid={testId}
      id={fieldId}
    >
      {icon && <IconWrapper>{icon}</IconWrapper>}
      {content}
    </div>
  );
};

/**
 * __Helper message__
 *
 * A helper message tells the user what kind of input the field takes. For example, a helper message could be
 * 'Password should be more than 4 characters'
 *
 */
export const HelperMessage: React.FC<MessageProps> = ({
  children,
  testId,
}: MessageProps) => (
  <FieldId.Consumer>
    {(fieldId) => (
      <Message
        fieldId={fieldId ? `${fieldId}-helper` : undefined}
        testId={testId}
      >
        {children}
      </Message>
    )}
  </FieldId.Consumer>
);

/**
 * __Error message__
 *
 * An error message is used to tell a user that the field input is invalid. For example, an error message could be
 * 'Invalid username, needs to be more than 4 characters'.
 *
 */
export const ErrorMessage: React.FC<MessageProps> = ({
  children,
  testId,
}: MessageProps) => (
  <FieldId.Consumer>
    {(fieldId) => (
      <Message
        appearance="error"
        fieldId={fieldId ? `${fieldId}-error` : undefined}
        testId={testId}
      >
        {children}
      </Message>
    )}
  </FieldId.Consumer>
);

/**
 * __Valid message__
 *
 * A valid message is used to tell a user that the field input is valid. For example,
 * a helper message could be 'Nice one, this username is available'.
 *
 */
export const ValidMessage: React.FC<MessageProps> = ({
  children,
  testId,
}: MessageProps) => (
  <FieldId.Consumer>
    {(fieldId) => (
      <Message
        appearance="valid"
        fieldId={fieldId ? `${fieldId}-valid` : undefined}
        testId={testId}
      >
        {children}
      </Message>
    )}
  </FieldId.Consumer>
);
