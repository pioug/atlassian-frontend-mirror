import React from 'react';

import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import type { ReactComponents } from './types';
import { BeforePrimaryToolbarWrapper } from './ui/BeforePrimaryToolbarWrapper';

type Config = {
  beforePrimaryToolbarComponents?: ReactComponents;
};

export type BeforePrimaryToolbarPlugin = NextEditorPlugin<
  'beforePrimaryToolbar',
  {
    pluginConfiguration: Config;
  }
>;

export const beforePrimaryToolbarPlugin: BeforePrimaryToolbarPlugin = ({
  config: props,
}) => ({
  name: 'beforePrimaryToolbar',

  primaryToolbarComponent() {
    return (
      <BeforePrimaryToolbarWrapper
        beforePrimaryToolbarComponents={props?.beforePrimaryToolbarComponents}
      />
    );
  },
});
