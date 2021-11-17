import React from 'react';
import { EditorPlugin } from '../../types';
import { BeforePrimaryToolbarWrapper } from './ui/BeforePrimaryToolbarWrapper';

const beforePrimaryToolbar = (props: {
  beforePrimaryToolbarComponents?: any;
}): EditorPlugin => ({
  name: 'beforePrimaryToolbar',

  primaryToolbarComponent() {
    return (
      <BeforePrimaryToolbarWrapper
        beforePrimaryToolbarComponents={props.beforePrimaryToolbarComponents}
      />
    );
  },
});

export default beforePrimaryToolbar;
