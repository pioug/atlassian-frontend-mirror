/** @jsx jsx */

import React, { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { G400, N200, R400 } from '@atlaskit/theme/colors';
import { useGlobalTheme } from '@atlaskit/theme/components';
import {
  fontFamily as getFontFamily,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { h200 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { FieldId } from './field';

const gridSize = getGridSize();
const fontFamily = getFontFamily();

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const lightH200Styles = css(h200({ theme: { mode: 'light' } }));
// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const darkH200Styles = css(h200({ theme: { mode: 'dark' } }));

const messageErrorColorStyles = css({
  color: token('color.text.danger', R400),
});

const messageNeutralColorStyles = css({
  color: token('color.text.lowEmphasis', N200),
});

const messageValidColorStyles = css({
  color: token('color.text.success', G400),
});

const messageStyles = css({
  display: 'flex',
  marginTop: `${gridSize * 0.5}px`,
  justifyContent: 'baseline',
  fontFamily: `${fontFamily}`,
  fontWeight: 'normal',
});

const iconWrapperStyles = css({
  display: 'flex',
});

const IconWrapper: React.FC = ({ children }) => {
  return <span css={iconWrapperStyles}>{children}</span>;
};

const Message: React.FC<MessageProps> = ({
  children,
  error,
  valid,
  fieldId,
  testId,
}) => {
  const { mode } = useGlobalTheme();
  return (
    <div
      css={[
        mode === 'light' ? lightH200Styles : darkH200Styles,
        messageStyles,
        error
          ? messageErrorColorStyles
          : valid
          ? messageValidColorStyles
          : messageNeutralColorStyles,
      ]}
      data-testid={testId}
      id={fieldId}
    >
      {children}
    </div>
  );
};

interface MessageProps {
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
   * Checks whether message input is invalid and should show an error.
   */
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  error?: boolean;
  /**
   * Checks whether message input is valid.
   */
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  valid?: boolean;
  fieldId?: string;
}

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
        error
        fieldId={fieldId ? `${fieldId}-error` : undefined}
        testId={testId}
      >
        <IconWrapper>
          <ErrorIcon size="small" label="error" />
        </IconWrapper>
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
        fieldId={fieldId ? `${fieldId}-valid` : undefined}
        testId={testId}
        valid
      >
        <IconWrapper>
          <SuccessIcon size="small" label="success" />
        </IconWrapper>
        {children}
      </Message>
    )}
  </FieldId.Consumer>
);
