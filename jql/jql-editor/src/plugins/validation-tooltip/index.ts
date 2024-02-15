import { Plugin } from '@atlaskit/editor-prosemirror/state';

import { JQLValidationTooltipPluginKey } from './constants';
import { ValidationTooltipPluginView } from './view';

const validationTooltipPlugin = (mainId: string) => {
  const plugin: Plugin<boolean> = new Plugin<boolean>({
    key: JQLValidationTooltipPluginKey,
    view: () => new ValidationTooltipPluginView(mainId),
    state: {
      init() {
        return false;
      },
      // @ts-ignore
      apply(tr, value) {
        if (tr.getMeta(plugin) !== undefined) {
          return tr.getMeta(plugin);
        } else {
          return value;
        }
      },
    },
    props: {
      handleDOMEvents: {
        mouseover: ({ state, dispatch }, event) => {
          const isHovered = plugin.getState(state);

          if (
            event.target instanceof Element &&
            event.target.closest('[data-token-type="error"]')
          ) {
            if (!isHovered) {
              dispatch(state.tr.setMeta(plugin, true));
            }
          } else if (isHovered) {
            dispatch(state.tr.setMeta(plugin, false));
          }

          return false;
        },
        mouseleave: ({ state, dispatch }) => {
          const isHovered = plugin.getState(state);
          if (isHovered) {
            dispatch(state.tr.setMeta(plugin, false));
          }
          return false;
        },
      },
    },
  });

  return plugin;
};

export default validationTooltipPlugin;
