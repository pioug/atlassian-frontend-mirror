import { PluginKey, Plugin } from 'prosemirror-state';
import { isNodeSelection } from 'prosemirror-utils';

function isDivHTMLElement(elm: Element): elm is HTMLDivElement {
  return elm.tagName.toLowerCase() === 'div';
}

export const fixChromeSelectionKey = new PluginKey('fixChromeSelectionPlugin');
export default () =>
  new Plugin({
    key: fixChromeSelectionKey,
    props: {
      handleDOMEvents: {
        focus: (view) => {
          // We don't need to reset when there's a NodeSelection
          // It creates other problem. @see HOT-94478
          if (
            isDivHTMLElement(view.dom) &&
            !isNodeSelection(view.state.selection)
          ) {
            view.dom.style.display = 'inline-block';
            view.dom.offsetHeight;
            view.dom.style.display = 'block';
          }
          return false;
        },
      },
    },
  });
