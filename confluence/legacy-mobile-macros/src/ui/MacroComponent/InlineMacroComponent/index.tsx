import React from 'react';

import { InlineMacroComponentProps } from './types';
import { getInlineMacroUIComponent } from './utils';

export { hasInlineImplementation } from './utils';

export const InlineMacroComponent = (props: InlineMacroComponentProps) => {
  const InlineComponent = getInlineMacroUIComponent(
    props.extension.extensionKey,
  );
  return (
    <div data-testid="inline-macro">
      <InlineComponent {...props} />
    </div>
  );
};
