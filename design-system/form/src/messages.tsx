/** @jsx jsx */

import { type ReactNode } from 'react';

import { css, jsx, type SerializedStyles } from '@emotion/react';

import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { FieldId } from './field-id-context';

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

const messageStyles = css({
  display: 'flex',
  justifyContent: 'baseline',
  gap: token('space.050', '4px'),
  font: token('font.body.UNSAFE_small'),
  marginBlockStart: token('space.050', '4px'),
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

const IconWrapper = ({ children }: { children: ReactNode }) => {
  return <span css={iconWrapperStyles}>{children}</span>;
};

const messageIcons: Partial<Record<MessageAppearance, JSX.Element>> = {
  error: <ErrorIcon size="small" label="error" />,
  valid: <SuccessIcon size="small" label="success" />,
};

const Message = ({
  children,
  appearance = 'default',
  fieldId,
  testId,
}: InternalMessageProps) => {
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
      css={[messageStyles, messageAppearanceStyles[appearance]]}
      data-testid={testId}
      id={fieldId}
      aria-live="polite"
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
export const HelperMessage = ({ children, testId }: MessageProps) => (
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
export const ErrorMessage = ({ children, testId }: MessageProps) => (
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
export const ValidMessage = ({ children, testId }: MessageProps) => (
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
