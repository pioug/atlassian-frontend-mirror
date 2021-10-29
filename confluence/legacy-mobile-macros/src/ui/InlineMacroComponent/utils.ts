import { InlineMacroComponentProps } from '../../types';

import { Anchor } from './Anchor';

const InlineMacroComponents: {
  [index: string]: (props: InlineMacroComponentProps) => JSX.Element;
} = {
  anchor: Anchor,
};

export const shouldRenderInline = (extensionKey: string) =>
  Object.keys(InlineMacroComponents).includes(extensionKey);

export const getInlineMacroUIComponent = (extensionKey: string) => {
  const component = InlineMacroComponents[extensionKey];
  if (!component) {
    throw new Error(extensionKey + ' extension key is not supported inline');
  }
  return component;
};
