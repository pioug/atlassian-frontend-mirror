import React, { useEffect } from 'react';

import { useMacroViewedAnalyticsEvent } from '../../../common/utils';

import { type InlineMacroComponentProps } from './types';
import { getInlineMacroUIComponent } from './utils';

export { hasInlineImplementation } from './utils';

export const InlineMacroComponent = (props: InlineMacroComponentProps) => {
  const { extension } = props;
  const { extensionKey } = extension;
  const fireMacroViewedAnalyticsEvent = useMacroViewedAnalyticsEvent();
  useEffect(() => {
    fireMacroViewedAnalyticsEvent(extensionKey, 'inline');
    return undefined;
  }, [extensionKey, fireMacroViewedAnalyticsEvent]);
  const InlineComponent = getInlineMacroUIComponent(extensionKey);
  return (
    <span data-testid="inline-macro">
      <InlineComponent {...props} />
    </span>
  );
};
