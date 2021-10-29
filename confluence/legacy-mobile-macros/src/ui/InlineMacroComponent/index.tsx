import React from 'react';

import { InlineMacroComponentProps } from '../../types';

import { getInlineMacroUIComponent } from './utils';

export { shouldRenderInline } from './utils';

export const InlineMacroComponent = (props: InlineMacroComponentProps) => {
  const InlineComponent = getInlineMacroUIComponent(
    props.extension.extensionKey,
  );
  return <InlineComponent {...props} />;
};
