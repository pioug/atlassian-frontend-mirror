/** @jsx jsx */
import { jsx } from '@emotion/core';

import Textfield from '../../src';

export default function TextFieldCustomizationExample() {
  return (
    <Textfield
      css={{
        // container style
        padding: 5,
        '& > [data-ds--text-field--input]': {
          // input style
          fontSize: 20,
        },
      }}
    />
  );
}
