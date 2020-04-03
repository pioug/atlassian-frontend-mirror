/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import Switcher from '@atlaskit/icon/glyph/app-switcher';
import Button from '../src';

export default () => (
  <div className="sample">
    <Button
      iconBefore={<Switcher label="app switcher" />}
      component={React.forwardRef<
        HTMLElement,
        React.AllHTMLAttributes<HTMLElement>
      >((props, ref) => (
        <header {...props} ref={ref} css={{ backgroundColor: 'pink' }} />
      ))}
    >
      App Switcher custom component
    </Button>
  </div>
);
