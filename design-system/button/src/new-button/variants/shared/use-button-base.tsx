import React, {
  Fragment,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';

import {
  UIAnalyticsEvent,
  usePlatformLeafEventHandler,
} from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';
import useAutoFocus from '@atlaskit/ds-lib/use-auto-focus';
import type { InteractionContextType } from '@atlaskit/interaction-context';
// eslint-disable-next-line no-duplicate-imports
import InteractionContext from '@atlaskit/interaction-context';
import { Box, xcss } from '@atlaskit/primitives';

import { type CommonButtonProps } from '../types';

import blockEvents from './block-events';
import { getXCSS } from './xcss';

export type ControlledEvents<TagName extends HTMLElement> = Pick<
  React.DOMAttributes<TagName>,
  | 'onMouseDownCapture'
  | 'onMouseUpCapture'
  | 'onKeyDownCapture'
  | 'onKeyUpCapture'
  | 'onTouchStartCapture'
  | 'onTouchEndCapture'
  | 'onPointerDownCapture'
  | 'onPointerUpCapture'
  | 'onClickCapture'
  | 'onClick'
>;

// Include modified onClick with analytics
export type ControlledEventsPassed<TagName extends HTMLElement> = Omit<
  ControlledEvents<TagName>,
  'onClick'
> &
  Pick<CommonButtonProps<TagName>, 'onClick'>;

export type UseButtonBaseArgs<TagName extends HTMLElement> = {
  ref: React.Ref<TagName>;
  /**
   * The type of button. Used to pass action subject context to analytics.
   */
  buttonType: 'button' | 'link';
  isIconButton?: boolean;
  hasIconBefore?: boolean;
  hasIconAfter?: boolean;
  shouldFitContainer?: boolean;
} & Pick<
  CommonButtonProps<TagName>,
  | 'analyticsContext'
  | 'appearance'
  | 'autoFocus'
  | 'children'
  | 'interactionName'
  | 'isDisabled'
  | 'isSelected'
  | 'overlay'
  | 'spacing'
> &
  ControlledEventsPassed<TagName>;

export type UseButtonBaseReturn<TagName extends HTMLElement> = {
  xcss: ReturnType<typeof xcss>;
  ref(node: TagName | null): void;
  children: React.ReactNode;
  isDisabled: boolean;
} & ControlledEvents<TagName>;

const overlayStyles = xcss({
  position: 'absolute',
  insetInlineStart: 'space.0',
  insetBlockStart: 'space.0',
  insetInlineEnd: 'space.0',
  insetBlockEnd: 'space.0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

/**
 * __Use button base__
 *
 * A React hook that accepts a set of common Button props,
 * and processes them to return consistent base props for usage
 * across various Button components.
 *
 * It also:
 * - Implements auto focus when enabled.
 * - Appends the `onClick` event with UFO analytics tracking.
 *
 * @private
 */
const useButtonBase = <TagName extends HTMLElement>({
  analyticsContext,
  appearance = 'default',
  autoFocus = false,
  buttonType,
  interactionName,
  isDisabled = false,
  isSelected = false,
  // TODO: Separate Icon Button styling from button base
  isIconButton = false,
  // TODO: Separate icon slot styling from button base
  hasIconBefore = false,
  hasIconAfter = false,
  children,
  onClick: providedOnClick = noop,
  onMouseDownCapture,
  onMouseUpCapture,
  onKeyDownCapture,
  onKeyUpCapture,
  onTouchStartCapture,
  onTouchEndCapture,
  onPointerDownCapture,
  onPointerUpCapture,
  onClickCapture,
  overlay,
  ref,
  shouldFitContainer = false,
  spacing = 'default',
}: UseButtonBaseArgs<TagName>): UseButtonBaseReturn<TagName> => {
  const ourRef = useRef<TagName | null>();

  const setRef = useCallback(
    (node: TagName | null) => {
      ourRef.current = node;

      if (ref === null) {
        return;
      }

      if (typeof ref === 'function') {
        ref(node);
        return;
      }

      // @ts-ignore
      ref.current = node;
    },
    [ourRef, ref],
  );

  useAutoFocus(ourRef, autoFocus);

  const interactionContext = useContext<InteractionContextType | null>(
    InteractionContext,
  );
  const handleClick = useCallback(
    (e: React.MouseEvent<TagName>, analyticsEvent: UIAnalyticsEvent) => {
      interactionContext &&
        interactionContext.tracePress(interactionName, e.timeStamp);
      providedOnClick(e, analyticsEvent);
    },
    [providedOnClick, interactionContext, interactionName],
  );

  const onClick = usePlatformLeafEventHandler({
    fn: handleClick,
    action: 'clicked',
    componentName: 'button',
    packageName: process.env._PACKAGE_NAME_ as string,
    packageVersion: process.env._PACKAGE_VERSION_ as string,
    analyticsData: analyticsContext,
    actionSubject: buttonType,
  });

  const buttonXCSS: ReturnType<typeof xcss> = useMemo(
    () =>
      getXCSS({
        appearance,
        spacing,
        isDisabled,
        isSelected,
        shouldFitContainer,
        isIconButton,
        hasOverlay: Boolean(overlay),
        isLink: buttonType === 'link',
        hasIconBefore,
        hasIconAfter,
      }),
    [
      appearance,
      buttonType,
      spacing,
      isDisabled,
      isSelected,
      isIconButton,
      shouldFitContainer,
      overlay,
      hasIconBefore,
      hasIconAfter,
    ],
  );

  const isEffectivelyDisabled = isDisabled || Boolean(overlay);

  return {
    ref: setRef,
    xcss: buttonXCSS,
    // Consider overlay buttons to be effectively disabled
    isDisabled: isEffectivelyDisabled,
    children: (
      <Fragment>
        {children}
        {overlay ? (
          <Box as="span" xcss={overlayStyles}>
            {overlay}
          </Box>
        ) : null}
      </Fragment>
    ),
    ...blockEvents(isEffectivelyDisabled, {
      onClick,
      onMouseDownCapture,
      onMouseUpCapture,
      onKeyDownCapture,
      onKeyUpCapture,
      onTouchStartCapture,
      onTouchEndCapture,
      onPointerDownCapture,
      onPointerUpCapture,
      onClickCapture,
    }),
  };
};

export default useButtonBase;
