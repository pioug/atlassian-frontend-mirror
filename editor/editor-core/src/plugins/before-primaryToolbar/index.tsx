import React from 'react';
import { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { BeforePrimaryToolbarWrapper } from './ui/BeforePrimaryToolbarWrapper';

type Config = {
  beforePrimaryToolbarComponents?: any;
};

const beforePrimaryToolbar: NextEditorPlugin<
  'beforePrimaryToolbar',
  {
    pluginConfiguration: Config;
  }
> = (props) => ({
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
