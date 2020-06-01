import React from 'react';
import {
  calcBreakoutWidth as exportedBreakoutWidth,
  mapBreakpointToLayoutMaxWidth as exportedMapBreakpointToLayoutMaxWidth,
  getBreakpoint as exportedGetBreakpoint,
  breakoutConsts as exportedBreakoutConsts,
  calcWideWidth,
} from '@atlaskit/editor-common';

/**
 * Inline Script that updates breakout node width on client side,
 * before main JavaScript bundle is ready.
 *
 * More info: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1216218119/Renderer+SSR+for+Breakout+Nodes
 */
export function BreakoutSSRInlineScript({
  allowDynamicTextSizing,
}: {
  allowDynamicTextSizing: boolean;
}) {
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
  const context = createBreakoutInlineScript(id, allowDynamicTextSizing);

  return (
    <script
      data-breakout-script-id={id}
      dangerouslySetInnerHTML={{ __html: context }}
    ></script>
  );
}

export function createBreakoutInlineScript(
  id: number,
  allowDynamicTextSizing: boolean,
) {
  return `
  (function(window){
    ${breakoutInlineScriptContext};
    (${applyBreakoutAfterSSR.toString()})("${id}", ${allowDynamicTextSizing});
  })(window);
`;
}

/**
 * Need a reasignment to have a cleaner variable name:
 * calcBreakoutWidth instead of ModuleName.calcBreakoutWidth,
 * etc...
 */
const calcBreakoutWidth = exportedBreakoutWidth;
const mapBreakpointToLayoutMaxWidth = exportedMapBreakpointToLayoutMaxWidth;
const getBreakpoint = exportedGetBreakpoint;
const breakoutConsts = exportedBreakoutConsts;

/**
 * Creates all variables that need to be available in scope for calcBreakoutWidth.
 */
const calcLineLength = (
  containerWidth?: number,
  allowDynamicTextSizing?: boolean,
) =>
  allowDynamicTextSizing && containerWidth
    ? mapBreakpointToLayoutMaxWidth(getBreakpoint(containerWidth))
    : breakoutConsts.defaultLayoutWidth;

export const breakoutInlineScriptContext = `
  var breakoutConsts = ${JSON.stringify(breakoutConsts)};
  var calcWideWidth = ${calcWideWidth.toString()};
  var calcBreakoutWidth = ${calcBreakoutWidth.toString()};
  var calcLineLength = ${calcLineLength.toString()};

  // TODO: remove after dynamic text sizing is fully unshipped: https://product-fabric.atlassian.net/browse/ED-8942
  var mapBreakpointToLayoutMaxWidth = ${mapBreakpointToLayoutMaxWidth.toString()};
  var getBreakpoint = ${getBreakpoint.toString()};
`;

function applyBreakoutAfterSSR(id: string, allowDynamicTextSizing: boolean) {
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

          // Tables require some special logic, as they are not using common css transform approach,
          // because it breaks with sticky headers. This logic is copied from a table node:
          // https://bitbucket.org/atlassian/atlassian-frontend/src/77938aee0c140d02ff99b98a03849be1236865b4/packages/editor/renderer/src/react/nodes/table.tsx#table.tsx-235:245
          if (node.classList.contains('pm-table-container')) {
            const lineLength = calcLineLength(
              renderer!.offsetWidth,
              allowDynamicTextSizing,
            );
            const left = lineLength / 2 - parseInt(width) / 2;
            if (left < 0) {
              node.style.left = left + 'px';
            }
          }
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

export { calcLineLength };
