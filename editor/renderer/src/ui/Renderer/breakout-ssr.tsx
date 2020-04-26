import React from 'react';
import {
  calcBreakoutWidth as exportedBreakoutWidth,
  breakoutConsts,
  calcWideWidth,
  mapBreakpointToLayoutMaxWidth,
  getBreakpoint,
} from '@atlaskit/editor-common';

/**
 * Inline Script that updates breakout node width on client side,
 * before main JavaScript bundle is ready.
 *
 * More info: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1216218119/Renderer+SSR+for+Breakout+Nodes
 */
export function BreakoutSSRInlineScript() {
  /**
   * Should only inline this script while SSR,
   * not needed on the client side.
   */
  if (
    typeof window !== 'undefined' &&
    !window.navigator.userAgent.includes('jsdom')
  ) {
    return null;
  }

  const id = Math.floor(Math.random() * (9999999999 - 9999 + 1)) + 9999;
  const context = createBreakoutInlineScript(id);

  return (
    <script
      data-breakout-script-id={id}
      dangerouslySetInnerHTML={{ __html: context }}
    ></script>
  );
}

export function createBreakoutInlineScript(id: number) {
  return `
  (function(window){
    ${breakoutInlineScriptContext};
    (${applyBreakoutAfterSSR.toString()})("${id}");
  })(window);
`;
}

/**
 * Need a reasignment to have a cleaner variable name:
 * calcBreakoutWidth instead of ModuleName.calcBreakoutWidth
 */
const calcBreakoutWidth = exportedBreakoutWidth;

/**
 * Creates all variables that need to be available in scope for calcBreakoutWidth.
 */
export const breakoutInlineScriptContext = `
  var breakoutConsts = ${JSON.stringify(breakoutConsts)};
  var calcWideWidth = ${calcWideWidth.toString()};
  var calcBreakoutWidth = ${calcBreakoutWidth.toString()};

  // TODO: remove after dynamic text sizing is fully unshipped: https://product-fabric.atlassian.net/browse/ED-8942
  var mapBreakpointToLayoutMaxWidth = ${mapBreakpointToLayoutMaxWidth.toString()};
  var getBreakpoint = ${getBreakpoint.toString()};
`;

function applyBreakoutAfterSSR(id: string) {
  function findUp(element: HTMLElement | null, selector: string) {
    if (!element) {
      return;
    }

    while (element.parentElement) {
      if (element.parentElement.classList.contains(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  const renderer: HTMLElement | undefined = findUp(
    document.querySelector('[data-breakout-script-id="' + id + '"]'),
    'ak-renderer-wrapper',
  );

  if (!renderer) {
    return;
  }

  const observer = new MutationObserver(mutationsList => {
    mutationsList.forEach(item => {
      if (item.target.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      if (
        (item.target as HTMLElement).classList.contains('ak-renderer-document')
      ) {
        item.addedNodes.forEach(maybeNode => {
          const node = maybeNode as HTMLElement;
          const mode = node.dataset.mode || node.dataset.layout || '';

          if (!mode || !['full-width', 'wide'].includes(mode)) {
            return;
          }

          const width = calcBreakoutWidth(mode, renderer!.offsetWidth);
          if (node.style.width === width) {
            return;
          }
          node.style.width = width;
        });
      }
    });
  });

  observer.observe(renderer, {
    childList: true,
    subtree: true,
  });

  /**
   * Using window load event to unsubscribe from mutation observer, as at this stage document is fully rendered.
   * Experiment with DOMContentLoaded showed that some of the blocks were not processed at all.
   * That's why window load is necessary.
   *
   * More info:
   * – https://html.spec.whatwg.org/multipage/parsing.html#the-end
   * – https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event
   * – https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
   */
  const disconnect = () => {
    observer.disconnect();
    window.removeEventListener('load', disconnect);
  };
  window.addEventListener('load', disconnect);
}
