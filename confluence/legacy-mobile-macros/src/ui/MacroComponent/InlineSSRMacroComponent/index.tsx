import React, { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';
import { useMemoOne } from 'use-memo-one';

import {
  loadResourceTags,
  useMacroViewedAnalyticsEvent,
} from '../../../common/utils';

import {
  CustomLegacyMacroError,
  CustomLegacyMacroResponse,
  InlineSSRMacroComponentProps,
} from './types';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const SSRMacroWrapper = styled.span`
  white-space: normal;
`;

export const InlineSSRMacroComponent: ((
  props: InlineSSRMacroComponentProps,
) => JSX.Element) & { tocObserver?: MutationObserver } = (
  props: InlineSSRMacroComponentProps,
) => {
  const [macroQueryResponse, setMacroQueryResponse] = useState(
    null as null | CustomLegacyMacroResponse | CustomLegacyMacroError,
  );

  const {
    baseUrl,
    createPromise,
    contentId,
    extension,
    onLinkClick,
    outputDeviceType,
    renderFallback,
  } = props;

  const { extensionKey } = extension;

  if (extensionKey === 'toc') {
    observeHeadingMutationsIfNecessary();
  }

  const legacyMacroArgs = useMemoOne(
    () => ({
      contentId: contentId,
      adf: JSON.stringify({
        attrs: extension,
        type: 'extension',
      }),
      outputDeviceType: outputDeviceType,
    }),
    [contentId, extension, outputDeviceType],
  );

  useEffect(() => {
    createPromise('customLegacyMacro', legacyMacroArgs)
      .submit()
      .then((response: any) => {
        if (!('html' in response) && Object.keys(response).length > 0) {
          const firstKey = Object.keys(response)[0];
          response = response[firstKey];
        }
        if (response.html) {
          loadResourceTags(
            [
              response.resources?.css,
              response.resources?.data,
              response.resources?.js,
            ],
            false,
          ).then(() => setMacroQueryResponse(response));
        } else {
          setMacroQueryResponse(new CustomLegacyMacroError());
        }
      })
      .catch(() => {
        setMacroQueryResponse(new CustomLegacyMacroError());
      });
  }, [createPromise, contentId, outputDeviceType, legacyMacroArgs]);

  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrapper = ref.current;
    if (wrapper) {
      const handleLinkClick = (ev: MouseEvent) => {
        const target = ev.target as HTMLElement;
        if (target && target.tagName === 'A') {
          const href = target.getAttribute('href');
          onLinkClick(ev, href);
        }
      };
      wrapper.addEventListener('click', handleLinkClick);
      return () => {
        wrapper.removeEventListener('click', handleLinkClick);
      };
    }
  }, [macroQueryResponse, onLinkClick]);

  const ssrMacroTestId = `ssr-macro-${outputDeviceType}`;

  const shouldFireAnalytics =
    macroQueryResponse &&
    !(macroQueryResponse instanceof CustomLegacyMacroError) &&
    macroQueryResponse.html;
  const fireMacroViewedAnalyticsEvent = useMacroViewedAnalyticsEvent();
  useEffect(() => {
    if (shouldFireAnalytics) {
      fireMacroViewedAnalyticsEvent(
        extensionKey,
        outputDeviceType === 'MOBILE' ? 'inlineStatic' : 'inlineDynamic',
      );
    }
  }, [
    extensionKey,
    outputDeviceType,
    shouldFireAnalytics,
    fireMacroViewedAnalyticsEvent,
  ]);

  if (macroQueryResponse) {
    if (macroQueryResponse instanceof CustomLegacyMacroError) {
      return (
        <SSRMacroWrapper data-testid={ssrMacroTestId}>
          {renderFallback()}
        </SSRMacroWrapper>
      );
    } else {
      let html = macroQueryResponse.html;
      let adjustedBaseUrl = baseUrl;
      if (!adjustedBaseUrl.endsWith('/')) {
        adjustedBaseUrl = adjustedBaseUrl + '/';
      }
      html = html.replace(
        /(src|href)="\/([^\/])/gi,
        `$1=\"${adjustedBaseUrl}$2`,
      );
      return (
        <SSRMacroWrapper data-testid={ssrMacroTestId}>
          <span ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
        </SSRMacroWrapper>
      );
    }
  } else {
    return <SSRMacroWrapper data-testid={ssrMacroTestId} />;
  }
};

function isHeadingNode(node: Node): boolean {
  return !!node.nodeName.match(/^H\d$/gi);
}

function isInHeadingNode(node: Node): boolean {
  if (isHeadingNode(node)) {
    return true;
  } else if (node.parentNode) {
    return isInHeadingNode(node.parentNode);
  } else {
    return false;
  }
}

/**
 * The toc macro implementation provided by the contentRenderer query does not support
 * updates to the page content. It only runs when the toc div is mounted. Since the
 * mobile renderer may update the content without a full page load, the toc macro needs
 * to also update when there are changes to the headings on the page. This function
 * adds a mutation observer to watch for heading changes in the renderer and will
 * remove and then re-add the toc div to trigger the update.
 *
 * In the future, we can look into adding an explicit inline implementation for toc
 * that does not require workarounds like this.
 */
function observeHeadingMutationsIfNecessary() {
  if (!InlineSSRMacroComponent.tocObserver) {
    const element = document.getElementById('renderer');
    if (element) {
      const config = {
        attributes: false,
        characterData: true,
        childList: true,
        subtree: true,
        attributeOldValue: false,
        characterDataOldValue: false,
      };
      const observer = new MutationObserver((mutations) => {
        let shouldRefresh = false;
        mutations.forEach((mutation) => {
          shouldRefresh = shouldRefresh || isInHeadingNode(mutation.target);
          mutation.addedNodes.forEach((node) => {
            shouldRefresh = shouldRefresh || isInHeadingNode(node);
          });
          mutation.removedNodes.forEach((node) => {
            shouldRefresh = shouldRefresh || isInHeadingNode(node);
          });
        });

        if (shouldRefresh) {
          document
            .querySelectorAll('.client-side-toc-macro')
            .forEach((node) => {
              const parent = node.parentNode;
              const next = node.nextSibling;
              node.remove();
              if (next) {
                parent?.insertBefore(next, node);
              } else {
                parent?.appendChild(node);
              }
            });
        }
      });
      InlineSSRMacroComponent.tocObserver = observer;
      observer.observe(element, config);
    }
  }
}
