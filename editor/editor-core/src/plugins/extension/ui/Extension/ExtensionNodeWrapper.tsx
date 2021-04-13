import React from 'react';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common';

type Props = {
  children: React.ReactNode;
  nodeType: string;
};
const ExtensionNodeWrapper = ({ children, nodeType }: Props) => (
  <span>
    {children}
    {nodeType === 'inlineExtension' && ZERO_WIDTH_SPACE}
  </span>
);

export default ExtensionNodeWrapper;
