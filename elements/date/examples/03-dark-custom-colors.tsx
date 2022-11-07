/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';
import { Date, Color } from '../src';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';

const DateInParagraph = ({ color }: { color?: Color }) => (
  <p>
    <Date value={586137600000} color={color} />
  </p>
);

export default () => (
  <AtlaskitThemeProvider mode={'dark'}>
    <DateInParagraph />
    <DateInParagraph color="red" />
    <DateInParagraph color="green" />
    <DateInParagraph color="blue" />
    <DateInParagraph color="purple" />
    <DateInParagraph color="yellow" />
  </AtlaskitThemeProvider>
);
