import React from 'react';

import { ExtensionParams } from '@atlaskit/editor-common';

import { InlineMacroComponentProps } from '../../../types';

const getAnchorNameProperty = (extension: ExtensionParams<any>) =>
  extension.parameters.macroParams[''].value || '';

export const Anchor = (props: InlineMacroComponentProps) => (
  <span id={getAnchorNameProperty(props.extension)} />
);
