/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { DN300, N200 } from '@atlaskit/theme/colors';
import { themed, useGlobalTheme } from '@atlaskit/theme/components';
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

const fieldsetLabelStyles = css({
  display: 'inline-block',
  marginTop: 0,
  marginBottom: token('space.050', '4px'),
  fontFamily: fontFamily,
});

const getFieldsetLabelDynamicStyles = (mode: 'dark' | 'light') =>
  css([
    h200({ theme: { mode } }),
    {
      color: themed({
        dark: token('color.text.subtle', DN300),
        light: token('color.text.subtle', N200),
      })({ theme: { mode } }),
    },
  ]);

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const lightH200Styles = getFieldsetLabelDynamicStyles('light');

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const darkH200Styles = getFieldsetLabelDynamicStyles('dark');

/**
 * __Label__
 *
 * A label represents a caption for an item in a user interface.
 *
 * It's recommended that a label has a `4px` spacing above its associated
 * control element.
 */
export const Label: FC<LabelProps> = ({ children, htmlFor, id, testId }) => {
  const { mode } = useGlobalTheme();
  return (
    <label
      css={[
        mode === 'light' ? lightH200Styles : darkH200Styles,
        fieldsetLabelStyles,
      ]}
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
  const { mode } = useGlobalTheme();

  return (
    <legend
      css={[
        mode === 'light' ? lightH200Styles : darkH200Styles,
        fieldsetLabelStyles,
      ]}
    >
      {children}
    </legend>
  );
};

export default Label;
