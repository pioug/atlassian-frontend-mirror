import { PluginKey, Plugin } from 'prosemirror-state';

function isDivHTMLElement(elm: Element): elm is HTMLDivElement {
  return elm.tagName.toLowerCase() === 'div';
}

export const fixChromeSelectionKey = new PluginKey('fixChromeSelectionPlugin');
export default () =>
  new Plugin({
    key: fixChromeSelectionKey,
    props: {
      handleDOMEvents: {
        focus: view => {
          if (isDivHTMLElement(view.dom)) {
            view.dom.style.display = 'inline-block';
            view.dom.offsetHeight;
            view.dom.style.display = 'block';
          }
          return false;
        },
      },
    },
  });
