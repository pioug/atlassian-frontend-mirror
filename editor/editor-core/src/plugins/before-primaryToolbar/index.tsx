import React from 'react';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { BeforePrimaryToolbarWrapper } from './ui/BeforePrimaryToolbarWrapper';

type Config = {
  beforePrimaryToolbarComponents?: any;
};

const beforePrimaryToolbar: NextEditorPlugin<
  'beforePrimaryToolbar',
  {
    pluginConfiguration: Config;
  }
> = ({ config: props }) => ({
  name: 'beforePrimaryToolbar',

  primaryToolbarComponent() {
    return (
      <BeforePrimaryToolbarWrapper
        beforePrimaryToolbarComponents={props?.beforePrimaryToolbarComponents}
      />
    );
  },
});

export default beforePrimaryToolbar;
