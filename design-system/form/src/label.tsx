/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { N200 } from '@atlaskit/theme/colors';
import { fontFamily as getFontFamily } from '@atlaskit/theme/constants';
import { h200 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

const fontFamily = getFontFamily();

export interface LabelProps {
  id?: string;
  htmlFor: string;
  children: ReactNode;
  testId?: string;
}

export interface LegendProps {
  children: ReactNode;
}

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const fieldsetLabelStyles = css([
  h200({ theme: { mode: 'light' } }),
  {
    display: 'inline-block',
    marginTop: 0,
    marginBottom: token('space.050', '4px'),
    color: token('color.text.subtle', N200),
    fontFamily: fontFamily,
  },
]);

/**
 * __Label__
 *
 * A label represents a caption for an item in a user interface.
 *
 * It's recommended that a label has a `4px` spacing above its associated
 * control element.
 */
export const Label: FC<LabelProps> = ({ children, htmlFor, id, testId }) => {
  return (
    <label
      css={fieldsetLabelStyles}
      id={id}
      htmlFor={htmlFor}
      data-testid={testId}
    >
      {children}
    </label>
  );
};

/**
 * __Legend__
 *
 * A Legend represents a caption for a fieldset in a user interface.
 */
export const Legend: FC<LegendProps> = ({ children }) => {
  return <legend css={fieldsetLabelStyles}>{children}</legend>;
};

export default Label;
