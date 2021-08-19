/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/core';

import Switcher from '@atlaskit/icon/glyph/app-switcher';

import Button from '../src';

const Component = React.forwardRef((props, ref: React.Ref<HTMLElement>) => (
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  <header {...props} ref={ref} style={{ backgroundColor: 'pink' }} />
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
