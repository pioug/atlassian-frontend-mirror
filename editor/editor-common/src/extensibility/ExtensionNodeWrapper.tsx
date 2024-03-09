import React from 'react';

import { ZERO_WIDTH_SPACE } from '../utils';

type Props = {
  children: React.ReactNode;
  nodeType: string;
};
/**
 * If inlineExtension, add zero width space to the end of the nodes and wrap with span;
 * else wrap with a div (for multi bodied extensions)
 *
 * @param param0
 * @returns
 */
export const ExtensionNodeWrapper = ({ children, nodeType }: Props) => (
  <span>
    {children}
    {nodeType === 'inlineExtension' && ZERO_WIDTH_SPACE}
  </span>
);
