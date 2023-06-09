import React from 'react';

import { N200 } from '@atlaskit/theme/colors';
import { fontSize } from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import Textfield from '../src';

export default function HtmlPropsExample() {
  return (
    <div>
      <Label htmlFor="password">Password text field</Label>
      <Textfield name="password" type="password" id="password" />
      <Label htmlFor="number">Number field (with min/max values)</Label>
      <Textfield name="number" type="number" id="number" max={5} min={0} />
    </div>
  );
}

const Label = function (props: { htmlFor: string; children: React.ReactNode }) {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for
    <label
      htmlFor={props.htmlFor}
      style={{
        display: 'inline-block',
        fontSize: `${headingSizes.h200.size / fontSize()}em`,
        fontStyle: 'inherit',
        lineHeight: `${headingSizes.h200.lineHeight / headingSizes.h200.size}`,
        color: token('color.text.subtlest', N200),
        fontWeight: 600,
        marginTop: token('space.200', '16px'),
      }}
    >
      {props.children}
    </label>
  );
};
