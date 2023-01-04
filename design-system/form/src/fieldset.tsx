/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { subtleHeading } from '@atlaskit/theme/colors';
import { useGlobalTheme } from '@atlaskit/theme/components';
import {
  fontFamily as getFontFamily,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { h200 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

export interface FieldsetProps {
  /**
   * Content to render in the fieldset.
   */
  children: ReactNode;
  /**
   * Label describing the contents of the fieldset.
   */
  legend?: ReactNode;
}

const fontFamily = getFontFamily();
const gridSize = getGridSize();

const fieldsetLabelStyles = css({
  display: 'inline-block',
  marginTop: 0,
  marginBottom: 0,
  fontFamily: `${fontFamily}`,
});

const fieldSetStyles = css({
  marginTop: `${gridSize}px`,
});

/**
 * TODO: Address duplication with packages/design-system/form/src/label.tsx
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

const FieldsetLabel: React.FC = ({ children }) => {
  const { mode } = useGlobalTheme();
  return (
    <label
      css={[
        mode === 'light' ? lightH200Styles : darkH200Styles,
        fieldsetLabelStyles,
      ]}
    >
      {children}
    </label>
  );
};

/**
 * __Fieldset__
 *
 * A fieldset groups a number of fields together. For example, when multiple CheckboxFields share the same name,
 * a fieldset can be used to group them together. This makes the form more accessible.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/form/docs/fields)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/form/docs/fields)
 * - [Usage](https://atlaskit.atlassian.com/packages/design-system/form/docs/fields)
 */
const Fieldset = ({ children, legend }: FieldsetProps) => {
  return (
    <fieldset css={fieldSetStyles}>
      {legend && (
        <legend>
          <FieldsetLabel>{legend}</FieldsetLabel>
        </legend>
      )}
      {children}
    </fieldset>
  );
};

export default Fieldset;
