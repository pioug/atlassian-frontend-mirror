/** @jsx jsx */
import React, { useRef, useMemo, useState, useCallback } from 'react';
import { jsx } from '@emotion/react';

import Button, { ButtonProps } from '@atlaskit/button';
import ChevronLeftIcon from '@atlaskit/icon/glyph/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';

import {
  scrollBack,
  scrollForward,
  ConditionalButtons,
  calculateConditionalButtons,
  getTabList,
  createGhost,
} from './scrolling-tabs';

import {
  containerStyles,
  scrollingContainerStyles,
  nextButtonStyles,
  backButtonStyles,
} from './styles';

function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    // eslint-disable-next-line compat/compat
    navigator.maxTouchPoints > 0
  );
}

interface ScrollingTabListProps {
  children: JSX.Element;
}

const initialConditionalButtonsState: ConditionalButtons = {
  back: false,
  forward: false,
};

export const ScrollingTabList = (props: ScrollingTabListProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [conditionalButtons, setConditionalButtons] =
    useState<ConditionalButtons>(initialConditionalButtonsState);
  const ghost = useMemo(() => createGhost(), []);

  const onTabClick = useCallback((e: Event) => {
    const target = e.currentTarget as Element;
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, []);

  React.useLayoutEffect(() => {
    const container = ref.current;

    let scrollingContainer: HTMLElement | null | undefined;
    let tabs: Element[];

    const handleConditionalButtonsChange = () => {
      const buttons = calculateConditionalButtons(
        scrollingContainer,
        isTouchDevice(),
      );

      setConditionalButtons(buttons);
    };

    const observerCallback: MutationCallback = mutationList => {
      const tablist = getTabList(ref);

      for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes) as HTMLElement[];
          const found = addedNodes.find(
            node => node.getAttribute('role') === 'tab',
          );

          if (found && tablist) {
            ghost.remove();
            const tabs = Array.from(tablist.children);
            tabs.forEach(tab => {
              tab.removeEventListener('click', onTabClick);
              tab.addEventListener('click', onTabClick);
            });
            tablist.appendChild(ghost);
            handleConditionalButtonsChange();
          }
        }
      }
    };

    const observer = new MutationObserver(observerCallback);

    if (container) {
      const tablist = getTabList(ref);
      scrollingContainer = tablist?.parentElement;

      observer.observe(container, {
        attributes: false,
        childList: true,
        subtree: true,
      });

      if (scrollingContainer instanceof HTMLElement && tablist) {
        tablist.appendChild(ghost);
        tabs = Array.from(tablist.children);

        tabs.forEach(tab => tab.addEventListener('click', onTabClick));

        handleConditionalButtonsChange();

        scrollingContainer.addEventListener(
          'scroll',
          handleConditionalButtonsChange,
        );
      }

      return () => {
        if (scrollingContainer) {
          scrollingContainer.removeEventListener(
            'scroll',
            handleConditionalButtonsChange,
          );
        }
        if (tabs.length) {
          tabs.forEach(tab => tab.removeEventListener('click', onTabClick));
        }
      };
    }
  }, [onTabClick, ghost, ref]);

  const buttonProps: ButtonProps = {
    appearance: 'subtle',
    spacing: 'none',
  };

  return (
    <div css={containerStyles} ref={ref} data-testid="scrolling-tabs">
      {conditionalButtons.back && (
        <div className="back" css={backButtonStyles}>
          <Button
            data-test-id="back"
            {...buttonProps}
            iconBefore={<ChevronLeftIcon label="back" />}
            onClick={() => scrollBack(ref)}
          ></Button>
        </div>
      )}
      <div css={scrollingContainerStyles}>{props.children}</div>
      {conditionalButtons.forward && (
        <div css={nextButtonStyles}>
          <Button
            data-test-id="forward"
            {...buttonProps}
            iconBefore={<ChevronRightIcon label="forward" />}
            onClick={() => scrollForward(ref)}
          ></Button>
        </div>
      )}
    </div>
  );
};

export default ScrollingTabList;
