import React from 'react';

import type { ExtensionParams } from '@atlaskit/editor-common/extensions';

import { AnchorProps } from './types';

const getAnchorNameProperty = (extension: ExtensionParams<any>) =>
  extension.parameters.macroParams[''].value || '';

export const Anchor = (props: AnchorProps) => (
  <span id={getAnchorNameProperty(props.extension)} />
);
