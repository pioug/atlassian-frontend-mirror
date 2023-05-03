/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { subtleHeading } from '@atlaskit/theme/colors';
import { useGlobalTheme } from '@atlaskit/theme/components';
import {
  fontFamily as getFontFamily,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { h200 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

const fontFamily = getFontFamily();
const gridSize = getGridSize();

export interface LabelProps {
  id?: string;
  htmlFor: string;
  children: ReactNode;
  testId?: string;
}

const labelStyles = css({
  display: 'inline-block',
  marginTop: 0,
  marginBottom: gridSize / 2,
  fontFamily: fontFamily,
});

/**
 * TODO: Address duplication with packages/design-system/form/src/fieldset.tsx
 * in https://product-fabric.atlassian.net/browse/DSP-7731
 */
const getFieldsetLabelDynamicStyles = (mode: 'dark' | 'light') =>
  css([
    h200({ theme: { mode } }),
    {
      color: token('color.text.subtle', subtleHeading({ theme: { mode } })),
    },
  ]);

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const lightH200Styles = getFieldsetLabelDynamicStyles('light');

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const darkH200Styles = getFieldsetLabelDynamicStyles('dark');

/**
 * __Label__
 *
 * A label represents a caption for an item in a user interface.
 *
 * It's recommended that a label has a `4px` spacing above its associated
 * control element.
 */
const Label: FC<LabelProps> = ({ children, htmlFor, id, testId }) => {
  const { mode } = useGlobalTheme();
  return (
    <label
      css={[mode === 'light' ? lightH200Styles : darkH200Styles, labelStyles]}
      id={id}
      htmlFor={htmlFor}
      data-testid={testId}
    >
      {children}
    </label>
  );
};

export default Label;
