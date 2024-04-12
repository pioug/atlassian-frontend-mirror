import React, { type ReactNode, useContext, useMemo } from 'react';

import InteractionContext, {
  type InteractionContextType,
} from '@atlaskit/interaction-context';

/**
 * Prevent a subtree from holding up an interaction
 * Use this when you have a component which loads in late, but
 * isn't considered to be a breach of SLO
 *
 * ```js
 * <App>
 *   <Main />
 *   <Sidebar>
 *     <UFOInteractionIgnore>
 *       <InsightsButton />
 *     </UFOInteractionIgnore>
 *   </Sidebar>
 * </App>
 * ```
 *
 * Has an `ignore` prop, to allow you to use it conditionally
 */
export default function UFOInteractionIgnore({
  children,
  ignore = true,
}: {
  children?: ReactNode;
  ignore?: boolean;
}) {
  const parentContext = useContext(InteractionContext);

  const ignoredInteractionContext: InteractionContextType | null =
    useMemo(() => {
      if (!parentContext) {
        return null;
      }
      return {
        ...parentContext,
        hold(...args) {
          if (!ignore) {
            return parentContext.hold(...args);
          }
        },
      };
    }, [parentContext, ignore]);

  // react-18: Use children directly
  const kids = children != null ? children : null;

  if (!ignoredInteractionContext) {
    return <>{kids}</>;
  }

  return (
    <InteractionContext.Provider value={ignoredInteractionContext}>
      {kids}
    </InteractionContext.Provider>
  );
}
