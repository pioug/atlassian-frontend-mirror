/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/react';

import { useGlobalTheme } from '@atlaskit/theme/components';
import {
  fontFamily as getFontFamily,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { h200 } from '@atlaskit/theme/typography';

const fontFamily = getFontFamily();
const gridSize = getGridSize();
export interface LabelProps {
  id?: string;
  htmlFor: string;
}

const labelStyles = css({
  display: 'inline-block',
  marginTop: 0,
  marginBottom: gridSize / 2,
  fontFamily: fontFamily,
});

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const lightH200Styles = css(h200({ theme: { mode: 'light' } }));
// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const darkH200Styles = css(h200({ theme: { mode: 'dark' } }));

/**
 * __Label__
 *
 * A label represents a caption for an item in a user interface.
 *
 * It's recommended that a label has a `4px` spacing above its associated
 * control element.
 */
const Label: FC<LabelProps> = ({ children, htmlFor, id }) => {
  const { mode } = useGlobalTheme();
  return (
    <label
      css={[mode === 'light' ? lightH200Styles : darkH200Styles, labelStyles]}
      id={id}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
};

export default Label;
