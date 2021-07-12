import React, { useEffect } from 'react';
import debounce from 'lodash/debounce';
import ReactDOM from 'react-dom';
import { ReactRenderer } from '@atlaskit/renderer';

import { BODY_FORMAT_TYPES } from '../../model/HelpArticle';
import type { AdfDoc } from '../../model/HelpArticle';

import resetCSS from './resetCss';
import { ArticleFrame } from './styled';

export interface Props {
  // Article Content
  body?: string | AdfDoc;
  // Format of the body content. The defaut value is "html"
  bodyFormat: BODY_FORMAT_TYPES;
  // Function executed when the article rendering begins
  onArticleRenderBegin?(): void;
  // Function executed when the article rendering finishes
  onArticleRenderDone?(): void;
}

const IFRAME_CONTAINER_ID = 'help-iframe-container';
const IFRAME_ID = 'help-iframe';

export const ArticleBody = (props: Props) => {
  /**
   * Set article height
   */
  const resizeIframe = (onArticleRenderDone?: () => void) => {
    const currentIframe: HTMLIFrameElement | null = document.getElementById(
      IFRAME_ID,
    ) as HTMLIFrameElement;

    if (!currentIframe) {
      return;
    }

    if (currentIframe !== null && currentIframe.contentWindow !== null) {
      if (currentIframe.contentWindow.document.body) {
        const iframeContent: Element | null =
          currentIframe.contentWindow.document.body.firstElementChild;
        /* if the iframe has content, set the height of the iframe body
           and of the iframe itself */
        if (iframeContent) {
          const contentHeight: number = iframeContent.scrollHeight;
          currentIframe.style.height = contentHeight + 10 + 'px';
          currentIframe.contentWindow.document.body.style.height =
            contentHeight + 'px';
        }
      }
    }
  };

  /**
   * When the article content changes, update the content of the iframe and
   * resize the iframe based on the new content
   */
  useEffect(() => {
    /**
     * Set iframe content
     */

    const setIframeContent = (
      body: string = '',
      onArticleRenderBegin?: () => void,
    ) => {
      /**
       * We update the content this way because we can't use srcdoc (Edge and IE don't support it)
       * Every time the article content changes we replace the iframe with an empty div and right after the
       * newly created div is rendered, we replace it with an iframe. Creating a new iframe allow us to
       * fire the iframe's onload function (we need it to resize the iframe after all content is loaded).
       * If we replace the content of the iframe directly, the onload function won't be fired
       */

      const currentIframe: HTMLIFrameElement | null = document.getElementById(
        IFRAME_ID,
      ) as HTMLIFrameElement;

      let divSyle: {
        height: string;
      } = {
        height: 'auto',
      };

      if (currentIframe !== null && currentIframe.contentWindow !== null) {
        divSyle = {
          height: `${currentIframe.contentWindow.document.body.scrollHeight}px`,
        };
      }

      const iframeContainer = document.getElementById(IFRAME_CONTAINER_ID);
      if (!iframeContainer) {
        return;
      }

      ReactDOM.render(<div style={divSyle} />, iframeContainer, () => {
        if (!iframeContainer) {
          return;
        }
        ReactDOM.render(
          <ArticleFrame
            id={IFRAME_ID}
            name={IFRAME_ID}
            onLoad={() => {
              resizeIframe(props.onArticleRenderDone);
            }}
            sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />,
          iframeContainer,
          () => {
            const iframeContainer: HTMLElement | null = document.getElementById(
              IFRAME_CONTAINER_ID,
            );

            if (iframeContainer) {
              const newIframe: Window = (frames as { [key: string]: any })[
                IFRAME_ID
              ] as Window;

              if (newIframe !== null) {
                const iframeDocument = newIframe.document;
                iframeDocument.open();
                iframeDocument.write(`<div>${body}</div>`);
                iframeDocument.close();

                const head =
                  iframeDocument.head ||
                  iframeDocument.getElementsByTagName('head')[0];
                const style = iframeDocument.createElement('style');
                style.innerText = resetCSS;
                head.appendChild(style);

                resizeIframe();

                if (onArticleRenderBegin) {
                  onArticleRenderBegin();
                }
              }
            }
          },
        );
      });
    };

    if (
      props.bodyFormat === BODY_FORMAT_TYPES.html &&
      typeof props.body === 'string'
    ) {
      setIframeContent(props.body, props.onArticleRenderBegin);
    }
  }, [
    props.body,
    props.bodyFormat,
    props.onArticleRenderBegin,
    props.onArticleRenderDone,
  ]);

  useEffect(() => {
    if (props.bodyFormat === BODY_FORMAT_TYPES.html) {
      /**
       * Resize the iframe when the browser window resizes
       */
      const onWindowResize = debounce(() => resizeIframe(), 500);
      window.addEventListener('resize', onWindowResize);

      return () => {
        window.removeEventListener('resize', onWindowResize);
      };
    }
  }, [props.onArticleRenderDone, props.bodyFormat]);

  return props.body ? (
    props.bodyFormat === BODY_FORMAT_TYPES.html ? (
      <div id={IFRAME_CONTAINER_ID} />
    ) : (
      <ReactRenderer document={props.body} />
    )
  ) : null;
};

export default ArticleBody;
