/** @jsx jsx */
import React, { useCallback, useEffect, useRef } from 'react';

import { CSSObject, jsx } from '@emotion/core';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import useAutoFocus from '@atlaskit/ds-lib/use-auto-focus';

import { BaseProps } from '../types';

import blockEvents from './block-events';
import { getContentStyle, getFadingCss, getIconStyle, overlayCss } from './css';

function noop() {}

// Disabled buttons will still publish events for nested elements in webkit.
// We are disabling pointer events on child elements so that
// the button will always be the target of events
// Note: firefox does not have this behaviour for child elements
const noPointerEventsOnChildrenCss: CSSObject = {
  '> *': {
    pointerEvents: 'none',
  },
};

type Props = BaseProps & {
  buttonCss: CSSObject;
};

export default React.forwardRef<HTMLElement, Props>(function ButtonBase(
  props: Props,
  ref: React.Ref<HTMLElement>,
) {
  const {
    appearance = 'default',
    buttonCss,
    spacing = 'default',
    autoFocus = false,
    isDisabled = false,
    shouldFitContainer = false,
    isSelected = false,
    iconBefore,
    iconAfter,
    children,
    className,
    href,
    overlay,
    tabIndex = 0,
    type = !href ? 'button' : undefined,
    onMouseDown: providedOnMouseDown = noop,
    onClick: providedOnClick = noop,
    // use the provided component prop,
    // else default to anchor if there is a href, and button if there is no href
    component: Component = href ? 'a' : 'button',
    testId,
    // I don't think this should be in button, but for now it is
    analyticsContext,
    ...rest
  } = props;

  const ourRef = useRef<HTMLElement | null>();

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      ourRef.current = node;

      if (ref == null) {
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

  // Cross browser auto focusing is pretty broken, so we are doing it ourselves
  useAutoFocus(ourRef, autoFocus);

  const onClick = usePlatformLeafEventHandler({
    fn: providedOnClick,
    action: 'clicked',
    componentName: 'button',
    packageName: process.env._PACKAGE_NAME_ as string,
    packageVersion: process.env._PACKAGE_VERSION_ as string,
    analyticsData: analyticsContext,
  });

  // Button currently calls preventDefault, which is not standard button behaviour
  const onMouseDown = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      providedOnMouseDown(event);
    },
    [providedOnMouseDown],
  );

  // Lose focus when becoming disabled (standard button behaviour)
  useEffect(() => {
    const el = ourRef.current;
    if (isDisabled && el && el === document.activeElement) {
      el.blur();
    }
  }, [isDisabled]);

  // we are 'disabling' input with a button when there is an overlay
  const hasOverlay: boolean = Boolean(overlay);
  const fadeCss: CSSObject = getFadingCss({ hasOverlay });

  const isInteractive: boolean = !isDisabled && !hasOverlay;

  return (
    <Component
      {...rest}
      css={[buttonCss, isInteractive ? null : noPointerEventsOnChildrenCss]}
      className={className}
      ref={setRef}
      onClick={onClick}
      onMouseDown={onMouseDown}
      disabled={isDisabled}
      href={isInteractive ? href : undefined}
      // using undefined so that the property doesn't exist when false
      data-has-overlay={hasOverlay ? true : undefined}
      data-testid={testId}
      type={type}
      // Adding a tab index so element is always focusable, even when not a <button> or <a>
      // Disabling focus via keyboard navigation when disabled
      // as this is standard button behaviour
      tabIndex={isDisabled ? -1 : tabIndex}
      {...blockEvents({ isInteractive })}
    >
      {iconBefore ? (
        <span css={[fadeCss, getIconStyle({ spacing })]}>{iconBefore}</span>
      ) : null}
      {children ? (
        <span css={[fadeCss, getContentStyle({ spacing })]}>{children}</span>
      ) : null}
      {iconAfter ? (
        <span css={[fadeCss, getIconStyle({ spacing })]}>{iconAfter}</span>
      ) : null}
      {overlay ? <span css={overlayCss}>{overlay}</span> : null}
    </Component>
  );
});
