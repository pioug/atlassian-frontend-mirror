/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/core';

import Switcher from '@atlaskit/icon/glyph/app-switcher';

import Button, { ButtonProps } from '../src';

const Component = React.forwardRef<HTMLElement, ButtonProps>((props, ref) => (
  // TODO: fix
  // @ts-ignore
  <header {...props} ref={ref} css={{ backgroundColor: 'pink' }} />
));

export default () => (
  <div className="sample">
    <Button
      iconBefore={<Switcher label="app switcher" />}
      component={Component}
    >
      App Switcher custom component
    </Button>
  </div>
);
