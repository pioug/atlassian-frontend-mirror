/** @jsx jsx */
import React, { FC, memo, useCallback, useEffect, useRef } from 'react';

import { jsx } from '@emotion/core';
import { bind, UnbindFn } from 'bind-event-listener';
import NodeResolver from 'react-node-resolver';

import {
  createAndFireEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';
import { Manager, Popper, Reference } from '@atlaskit/popper';

import type { InlineDialogProps } from '../types';

import { Container } from './styled/container';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const checkIsChildOfPortal = (node: HTMLElement | null): boolean => {
  if (!node) {
    return false;
  }

  return (
    (node.classList && node.classList.contains('atlaskit-portal-container')) ||
    checkIsChildOfPortal(node.parentElement)
  );
};

const InlineDialog: FC<InlineDialogProps> = memo<InlineDialogProps>(
  function InlineDialog({
    isOpen = false,
    onContentBlur = noop,
    onContentClick = noop,
    onContentFocus = noop,
    onClose = noop,
    placement = 'bottom-start',
    testId,
    content,
    children,
  }) {
    const containerRef = useRef<HTMLElement | null>(null);
    const triggerRef = useRef<HTMLElement | null>(null);

    const handleClickOutside = useCallback(
      (event: MouseEvent) => {
        if (event.defaultPrevented) {
          return;
        }

        const { target } = event;

        // checks for when target is not HTMLElement
        if (!(target instanceof HTMLElement)) {
          return;
        }

        // TODO: This is to handle the case where the target is no longer in the DOM.
        // This happens with react-select in datetime picker. There might be other
        // edge cases for this.
        if (!document.body.contains(target)) {
          return;
        }

        // exit if we click outside but on the trigger — it can handle the clicks itself
        if (triggerRef.current && triggerRef.current.contains(target)) {
          return;
        }

        // handles the case where inline dialog opens portalled elements such as modal
        if (checkIsChildOfPortal(target)) {
          return;
        }

        // call onClose if the click originated from outside the dialog
        if (containerRef.current && !containerRef.current.contains(target)) {
          onClose && onClose({ isOpen: false, event: event as any });
        }
      },
      [onClose],
    );
    useEffect(() => {
      if (!isOpen) {
        return;
      }

      let unbind: UnbindFn;

      // Under most circumstances, `useEffect` should run after an event has ended
      // In this particular case, the popperjs library has a setState inside of a ref,
      // which cases `useEffect` to run synchronously instead. To avoid this, we use a
      // `setTimeout` so `useEffect` after the event. We only want to start listening
      // for clicks after the original click event that triggered the dialog
      // has finished. You can see more in the Codesandbox here:
      // https://codesandbox.io/s/useeffect-and-event-timing-refs-in-state-5tys3?file=/src/App.tsx
      const timeoutId = setTimeout(() => {
        unbind = bind(window, {
          type: 'click',
          listener: (event) => handleClickOutside(event as MouseEvent),
          options: { capture: false },
        });
      });

      return () => {
        window.clearTimeout(timeoutId);
        unbind?.();
      };
    }, [handleClickOutside, isOpen]);

    const popper = isOpen ? (
      <Popper placement={placement}>
        {({ ref, style }) => (
          <Container
            onBlur={onContentBlur}
            onFocus={onContentFocus}
            onClick={onContentClick}
            ref={(node) => {
              if (node) {
                containerRef.current = node;
                if (typeof ref === 'function') {
                  ref(node);
                } else {
                  (ref as React.MutableRefObject<HTMLElement>).current = node;
                }
              }
            }}
            style={style}
            testId={testId}
          >
            {content}
          </Container>
        )}
      </Popper>
    ) : null;

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <NodeResolver
              innerRef={(node: HTMLElement) => {
                triggerRef.current = node;
                if (typeof ref === 'function') {
                  ref(node);
                } else {
                  (ref as React.MutableRefObject<HTMLElement>).current = node;
                }
              }}
            >
              {children}
            </NodeResolver>
          )}
        </Reference>
        {popper}
      </Manager>
    );
  },
);

// enzyme relies on components having a display name
InlineDialog.displayName = 'InlineDialog';

export { InlineDialog as InlineDialogWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'inlineDialog',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onClose: createAndFireEventOnAtlaskit({
      action: 'closed',
      actionSubject: 'inlineDialog',

      attributes: {
        componentName: 'inlineDialog',
        packageName,
        packageVersion,
      },
    }),
  })(InlineDialog),
);
