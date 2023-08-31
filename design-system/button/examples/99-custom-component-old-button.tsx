/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import Switcher from '@atlaskit/icon/glyph/app-switcher';
import { token } from '@atlaskit/tokens';

import Button from '../src';

const Component = React.forwardRef((props, ref: React.Ref<HTMLElement>) => (
  <header
    {...props}
    ref={ref}
    style={{
      backgroundColor: token('color.background.accent.red.subtler', 'N500A'),
    }}
  />
));

export default () => (
  <div className="sample">
    <Button iconBefore={<Switcher label="" />} component={Component}>
      App Switcher custom component
    </Button>
  </div>
);
