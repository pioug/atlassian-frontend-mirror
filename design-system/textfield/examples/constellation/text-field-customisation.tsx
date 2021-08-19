/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import Textfield from '../../src';

const bigFontStyles = css({
  // container style
  padding: 5,
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > [data-ds--text-field--input]': {
    // input style
    fontSize: 20,
  },
});

export default function TextFieldCustomizationExample() {
  return <Textfield aria-label="customized text field" css={bigFontStyles} />;
}
