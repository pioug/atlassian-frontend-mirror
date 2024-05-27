import { type RefObject } from 'react';

const BUTTON_SIZE = 24;
const GUTTER = 48;
const GHOST_WIDTH = 342 - GUTTER - 40;

export interface ConditionalButtons {
  back: boolean;
  forward: boolean;
}

export const scrollBack = (ref: RefObject<HTMLDivElement>) => {
  moveTabsScroll(ref, findPrevious);
};

export const scrollForward = (ref: RefObject<HTMLDivElement>) => {
  moveTabsScroll(ref, findNext);
};

export const calculateConditionalButtons = (
  container: HTMLElement | null | undefined,
  hideButtons: boolean,
): ConditionalButtons => {
  const initialState = {
    back: false,
    forward: false,
  };

  if (!container || hideButtons) {
    return initialState;
  }
  const maxScrollValue = container.scrollWidth - container.clientWidth;

  return {
    back: container.scrollLeft > 0,
    forward: container.scrollLeft < maxScrollValue - GHOST_WIDTH,
  };
};

export const createGhost = () => {
  const ghost = document.createElement('div');
  ghost.setAttribute('id', 'scrolling-tabs-ghost');
  ghost.style.minWidth = `${GHOST_WIDTH}px`;
  ghost.style.pointerEvents = 'none';
  return ghost;
};

const moveTabsScroll = (
  ref: RefObject<HTMLDivElement>,
  findFn: FindFn,
): void => {
  const container = getContainer(ref);
  if (container) {
    const tablist = container.children[0];
    const tabs = Array.from(tablist.children);
    if (tabs.length > 0) {
      const target = findFn(container, tabs as HTMLElement[]);
      if (target) {
        const left =
          container.scrollLeft +
          target.getBoundingClientRect().left -
          container.getBoundingClientRect().left -
          BUTTON_SIZE;
        scrollTo(container, left);
      }
    }
  }
};

const scrollTo = (container: HTMLElement, left: number): void => {
  container.scrollTo({
    left,
  });
};

export const getTabList = (ref: RefObject<HTMLDivElement>) =>
  ref.current?.querySelector('[role="tablist"]');

export const getContainer = (ref: RefObject<HTMLDivElement>) =>
  getTabList(ref)?.parentElement;

type FindFn = (
  container: HTMLElement,
  tabs: HTMLElement[],
) => HTMLElement | null | undefined;

const findPrevious: FindFn = (container, tabs) => {
  const previousTabs = tabs.filter(tab => {
    const [containerRect, tabRect] = [
      container.getBoundingClientRect(),
      tab.getBoundingClientRect(),
    ];
    const [containerArea, tabArea] = [
      containerRect.left + container.scrollLeft - GUTTER,
      container.scrollLeft + tabRect.left + tabRect.width,
    ];
    return containerArea > tabArea;
  });

  if (previousTabs.length < 3) {
    return previousTabs[0];
  }
  return previousTabs[previousTabs.length - 1];
};

const findNext: FindFn = (container, tabs) => {
  const containerRect = container.getBoundingClientRect();
  return tabs.find(tab => {
    const tabRect = tab.getBoundingClientRect();
    const [containerArea, tabArea] = [
      container.clientWidth + containerRect.left - GUTTER,
      tabRect.left + tabRect.width,
    ];
    return containerArea < tabArea;
  });
};
