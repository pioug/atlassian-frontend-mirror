/** @jsx jsx */
import { token } from '@atlaskit/tokens';

import {
  Children,
  createContext,
  type ReactElement,
  useContext,
  useMemo,
} from 'react';

import { css, jsx } from '@emotion/react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { easeIn, ExitingPersistence, SlideIn } from '@atlaskit/motion';
import VisuallyHidden from '@atlaskit/visually-hidden';
import noop from '@atlaskit/ds-lib/noop';
import Portal from '@atlaskit/portal';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize as getGridSize, layers } from '@atlaskit/theme/constants';

type FlagGroupProps = {
  /**
   * ID attribute used for DOM selection.
   */
  id?: string;
  /**
   * Describes the specific role of this FlagGroup for users viewing the page with a screen reader (defaults to `Flag notifications`).
   */
  label?: string;
  /**
   * Describes the specific tag on which the screen reader text will be rendered (defaults to `h2`).
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  labelTag?: React.ElementType;
  /**
   * Flag elements to be displayed.
   */
  children?: Array<ReactElement> | ReactElement | null | boolean;
  /**
   * Handler which will be called when a Flag's dismiss button is clicked.
   * Receives the id of the dismissed Flag as a parameter.
   */
  onDismissed?: (id: number | string, analyticsEvent: UIAnalyticsEvent) => void;
  /**
   * The root element where the flag group should be rendered.
   * `true` - rendering in the DOM node closest to the trigger. `false` - rendering in React.Portal.
   * Defaults to `false`.
   */
  shouldRenderToParent?: boolean;
};

const gridSize = getGridSize();
export const flagWidth = gridSize * 50;
export const flagAnimationTime = 400;

type FlagGroupAPI = {
  onDismissed: (id: number | string, analyticsEvent: UIAnalyticsEvent) => void;
  isDismissAllowed: boolean;
};

const defaultFlagGroupContext = {
  onDismissed: noop,
  isDismissAllowed: false,
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const FlagGroupContext = createContext<FlagGroupAPI>(
  defaultFlagGroupContext,
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export function useFlagGroup() {
  return useContext(FlagGroupContext);
}

// transition: none is set on first-of-type to prevent a bug in Firefox
// that causes a broken transition
const baseStyles = css({
  width: flagWidth,
  position: 'absolute',
  insetBlockEnd: 0,
  transition: `transform ${flagAnimationTime}ms ease-in-out`,
  // TODO: Use new breakpoints
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '@media (max-width: 560px)': {
    width: '100vw',
  },
  ':first-of-type': {
    transform: `translate(0,0)`,
    transition: 'none',
  },
  ':nth-of-type(n + 2)': {
    animationDuration: '0ms',
    transform: `translateX(0) translateY(100%) translateY(${2 * gridSize}px)`,
  },
  ':nth-of-type(1)': {
    zIndex: 5,
  },
  ':nth-of-type(2)': {
    zIndex: 4,
  },
  '&:nth-of-type(n + 4)': {
    visibility: 'hidden',
  },
});

// Transform needed to push up while 1st flag is leaving
// Exiting time should match the exiting time of motion so is halved
const dismissAllowedStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '&& + *': {
    transform: `translate(0, 0)`,
    transitionDuration: `${flagAnimationTime / 2}ms`,
  },
});

const flagGroupContainerStyles = css({
  position: 'fixed',
  zIndex: 'flag',
  insetBlockEnd: token('space.600', '48px'),
  insetInlineStart: token('space.1000', '80px'),
  // TODO: Use new breakpoints
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '@media (max-width: 560px)': {
    insetBlockEnd: 0,
    insetInlineStart: 0,
  },
});

/**
 * __Flag group__
 *
 * A flag group is used to group a set of related flags, with entry and exit animations.
 *
 * - [Examples](https://atlassian.design/components/flag/flag-group/examples)
 * - [Code](https://atlassian.design/components/flag/flag-group/code)
 */
const FlagGroup = (props: FlagGroupProps) => {
  const {
    id,
    label = 'Flag notifications',
    labelTag: LabelTag = 'h2',
    shouldRenderToParent = false,
    children,
    onDismissed = noop,
  } = props;

  const hasFlags = Array.isArray(children)
    ? children.length > 0
    : Boolean(children);

  const dismissFlagContext: FlagGroupAPI = useMemo(
    () => ({
      onDismissed: onDismissed,
      isDismissAllowed: true,
    }),
    [onDismissed],
  );

  const renderChildren = () => {
    return children && typeof children === 'object'
      ? Children.map(children, (flag: ReactElement, index: number) => {
          const isDismissAllowed = index === 0;

          return (
            <SlideIn
              enterFrom="left"
              fade="inout"
              duration={flagAnimationTime}
              animationTimingFunction={() => easeIn}
            >
              {({ className, ref }) => (
                <div
                  css={[baseStyles, isDismissAllowed && dismissAllowedStyles]}
                  className={className}
                  ref={ref}
                >
                  <FlagGroupContext.Provider
                    value={
                      // Only the first flag should be able to be dismissed.
                      isDismissAllowed
                        ? dismissFlagContext
                        : defaultFlagGroupContext
                    }
                  >
                    {flag}
                  </FlagGroupContext.Provider>
                </div>
              )}
            </SlideIn>
          );
        })
      : false;
  };

  const flags = (
    <div id={id} css={flagGroupContainerStyles}>
      {hasFlags ? (
        <VisuallyHidden>
          <LabelTag>{label}</LabelTag>
        </VisuallyHidden>
      ) : null}

      <ExitingPersistence appear={false}>{renderChildren()}</ExitingPersistence>
    </div>
  );

  return shouldRenderToParent ? (
    flags
  ) : (
    <Portal zIndex={layers.flag()}>{flags}</Portal>
  );
};

export default FlagGroup;
