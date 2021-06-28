import React from 'react';
import { breakoutConsts } from '@atlaskit/editor-common';

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
    (${applyBreakoutAfterSSR.toString()})("${id}", ${allowDynamicTextSizing}, breakoutConsts);
  })(window);
`;
}

export const breakoutInlineScriptContext = `
  var breakoutConsts = ${JSON.stringify(breakoutConsts)};
  breakoutConsts.mapBreakpointToLayoutMaxWidth = ${breakoutConsts.mapBreakpointToLayoutMaxWidth.toString()};
  breakoutConsts.getBreakpoint = ${breakoutConsts.getBreakpoint.toString()};
  breakoutConsts.calcBreakoutWidth = ${breakoutConsts.calcBreakoutWidth.toString()};
  breakoutConsts.calcLineLength = ${breakoutConsts.calcLineLength.toString()};
  breakoutConsts.calcWideWidth = ${breakoutConsts.calcWideWidth.toString()};
`;

function applyBreakoutAfterSSR(
  id: string,
  allowDynamicTextSizing: boolean,
  breakoutConsts: any,
) {
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

  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((item) => {
      if (item.target.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      if (
        (item.target as HTMLElement).classList.contains('ak-renderer-document')
      ) {
        item.addedNodes.forEach((maybeNode) => {
          const node = maybeNode as HTMLElement;
          const mode = node.dataset.mode || node.dataset.layout || '';

          if (!mode || !['full-width', 'wide'].includes(mode)) {
            return;
          }

          const width = breakoutConsts.calcBreakoutWidth(
            mode,
            renderer!.offsetWidth,
          );
          if (node.style.width === width) {
            return;
          }
          node.style.width = width;

          // Tables require some special logic, as they are not using common css transform approach,
          // because it breaks with sticky headers. This logic is copied from a table node:
          // https://bitbucket.org/atlassian/atlassian-frontend/src/77938aee0c140d02ff99b98a03849be1236865b4/packages/editor/renderer/src/react/nodes/table.tsx#table.tsx-235:245
          if (node.classList.contains('pm-table-container')) {
            const lineLength = breakoutConsts.calcLineLength(
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

export const calcLineLength = breakoutConsts.calcLineLength;
