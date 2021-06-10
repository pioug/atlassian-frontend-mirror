import React, {
  Children,
  createContext,
  memo,
  ReactNode,
  useContext,
  useMemo,
  useRef,
} from 'react';

import { isReducedMotion } from '../utils/accessibility';
import { useForceRender } from '../utils/use-force-render';

/**
 * Internally we will be playing with an element that will always have a key defined.
 */
type ElementWithKey = JSX.Element & { key: string };

export interface ExitingPersistenceProps {
  /**
   * Children can be any valid react node.
   * Either a single element,
   * multiple elements,
   * or multiple elements in an array.
   */
  children?: ReactNode;

  /**
   * When elements are exiting will exit all elements first and then mount the new ones.
   * Defaults to `false`.
   */
  exitThenEnter?: boolean;

  /**
   * When initially mounting if set to `true` all child motions will animate in.
   */
  appear?: boolean;
}

/**
 * Internal data passed to child motions.
 */
interface ExitingChildContext {
  /**
   * Will perform an exit animation instead of an enter animation.
   */
  isExiting: boolean;

  /**
   * Will be called when the animation has completed.
   */
  onFinish?: () => void;

  /**
   * Used to tell the child motions to animate in when initially mounting.
   */
  appear: boolean;
}

// We define empty context here so the object doesn't change.
const emptyContext: ExitingChildContext = {
  // Motions will always appear if not inside a exiting persistence component.
  appear: true,
  isExiting: false,
};

const ExitingContext = createContext<ExitingChildContext>(emptyContext);

const isAnyPreviousKeysMissingFromCurrent = (
  currentMap: { [key: string]: ElementWithKey },
  previous: ElementWithKey[],
): boolean => {
  for (let i = 0; i < previous.length; i++) {
    const element = previous[i];
    const key = element.key;
    if (!currentMap[key]) {
      return true;
    }
  }

  return false;
};

/**
 * This method will wrap any React element with a context provider. We're using context (instead of
 * cloneElement) so we can communicate between multiple elements without the need of prop drilling
 * (results in a better API for consumers).
 */
const wrapChildWithContextProvider = (
  child: JSX.Element,
  value: ExitingChildContext = emptyContext,
) => {
  return (
    <ExitingContext.Provider key={`${child.key}-provider`} value={value}>
      {child}
    </ExitingContext.Provider>
  );
};

const childrenToObj = (children: ElementWithKey[]) => {
  return children.reduce<{ [key: string]: ElementWithKey }>((acc, child) => {
    acc[child.key] = child;
    return acc;
  }, {});
};

const spliceNewElementsIntoPrevious = (
  current: ElementWithKey[],
  previous: ElementWithKey[],
): ElementWithKey[] => {
  const splicedChildren: ElementWithKey[] = previous.concat([]);
  const previousMap = childrenToObj(previous);

  for (let i = 0; i < current.length; i++) {
    const child = current[i];
    const childIsNew = !previousMap[child.key];

    if (childIsNew) {
      // This will insert the new element after the previous element.
      splicedChildren.splice(i + 1, 0, child);
    }
  }

  return splicedChildren;
};

/**
 * This function will convert all children types to an array while also filtering out non-valid React elements.
 */
const childrenToArray = (children?: ReactNode): ElementWithKey[] => {
  const childrenAsArray: ElementWithKey[] = [];

  // We convert children to an array using this helper method as it will add keys to children that do not
  // have them, such as when we have hardcoded children that are conditionally rendered.
  Children.toArray(children).forEach((child) => {
    // We ignore any boolean children to make our code a little more simple later on,
    // and also filter out any falsies (empty strings, nulls, and undefined).
    if (typeof child !== 'boolean' && Boolean(child)) {
      // Children WILL have a key after being forced into an array using the React.Children helper.
      childrenAsArray.push(child as ElementWithKey);
    }
  });

  return childrenAsArray;
};

/**
 * This handles the case when a render updates during an exit motion.
 * If any child is mounted again we removed them from the exiting children object and return true.
 */
const hasAnyExitingChildMountedAgain = (
  exitingChildren: React.MutableRefObject<{
    [key: string]: boolean;
  }>,
  children: ElementWithKey[],
): boolean => {
  let exitingChildMountedAgain = false;

  children.forEach((child) => {
    if (exitingChildren.current[child.key]) {
      exitingChildMountedAgain = true;
      delete exitingChildren.current[child.key];
    }
  });

  return exitingChildMountedAgain;
};

const ExitingPersistence: React.FC<ExitingPersistenceProps> = memo(
  ({
    appear: appearFromProp = false,
    children: childs,
    exitThenEnter,
  }: ExitingPersistenceProps): any => {
    const children = childrenToArray(childs);
    const childrenObj = childrenToObj(children);
    const previousChildren = useRef<ElementWithKey[]>([]);
    const persistedChildren = useRef<ElementWithKey[]>([]);
    const forceRender = useForceRender();
    const exitingChildren = useRef<{ [key: string]: boolean }>({});
    const appear = useRef(appearFromProp);
    const defaultContextValue: ExitingChildContext = useMemo(
      () => ({
        appear: appear.current,
        isExiting: false,
      }),
      // React rules of hooks says this isn't needed because mutating appear won't cause a re-render.
      // While technically true - it will trigger this to make a new object on the _next_ render which is what we want.
      // Remove this or use appear instead of appear.current and you will notice a test breaks.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [appear.current],
    );

    if (isReducedMotion()) {
      return children;
    }

    if (!appear.current) {
      // We always want child motions to appear after the initial mount.
      appear.current = true;
    }

    // This entire block can't be an effect because we need it to run synchronously during a render
    // else when elements are being removed they will be remounted instead of being updated.
    if (
      previousChildren.current.length &&
      isAnyPreviousKeysMissingFromCurrent(childrenObj, previousChildren.current)
    ) {
      if (
        persistedChildren.current.length === 0 ||
        hasAnyExitingChildMountedAgain(exitingChildren, children)
      ) {
        persistedChildren.current = previousChildren.current;
      }

      // We have persisted children now set from previous children.
      // Let's update previous children so we have it available next render.
      previousChildren.current = children;

      return (exitThenEnter
        ? persistedChildren.current
        : spliceNewElementsIntoPrevious(children, persistedChildren.current)
      ).map((child) => {
        const currentChild = childrenObj[child.key];
        if (!currentChild) {
          // We've found an exiting child - mark it!
          exitingChildren.current[child.key] = true;

          return wrapChildWithContextProvider(child, {
            isExiting: true,
            appear: true,
            onFinish: () => {
              delete exitingChildren.current[child.key];

              // We will only remove the exiting elements when any subsequent exiting elements have also finished.
              // Think of removing many items from a todo list - when removing a few over a few clicks we don't
              // want the list jumping around when they exit.
              if (Object.keys(exitingChildren.current).length === 0) {
                // Set previous children to nothing.
                // This let's us skip the next render check as it's assumed children and previous will be the same.
                previousChildren.current = [];
                persistedChildren.current = [];

                // Re-render after the element(s) have animated away which will end up rendering the latest children.
                forceRender();
              }
            },
          });
        }

        // This element isn't exiting.
        // Wrap context and let's continue on our way.
        return wrapChildWithContextProvider(currentChild, defaultContextValue);
      });
    } else {
      previousChildren.current = children;
    }

    return children.map((child) =>
      wrapChildWithContextProvider(child, defaultContextValue),
    );
  },
);

export const useExitingPersistence = () => {
  return useContext(ExitingContext);
};

ExitingPersistence.displayName = 'ExitingPersistence';

export default ExitingPersistence;
