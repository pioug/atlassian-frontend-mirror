import React from 'react';

import { typeAheadQuery } from '@atlaskit/adf-schema';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';

import { inputRulePlugin } from './pm-plugins/input-rules';
import { keymapPlugin } from './pm-plugins/keymap';
import {
  createInitialPluginState,
  createPlugin,
  pluginKey as typeAheadPluginKey,
  TypeAheadPluginState,
} from './pm-plugins/main';
import { TypeAheadHandler } from './types';
import { TypeAhead } from './ui/TypeAhead';

export type TypeAheadPluginOptions = {
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
};

const typeAheadPlugin = (options?: TypeAheadPluginOptions): EditorPlugin => ({
  name: 'typeAhead',

  marks() {
    return [{ name: 'typeAheadQuery', mark: typeAheadQuery }];
  },

  pmPlugins(typeAhead: Array<TypeAheadHandler> = []) {
    return [
      {
        name: 'typeAhead',
        plugin: ({ dispatch, reactContext }) =>
          createPlugin(dispatch, reactContext, typeAhead),
      },
      {
        name: 'typeAheadInputRule',
        plugin: ({ schema, featureFlags }) =>
          inputRulePlugin(schema, typeAhead, featureFlags),
      },
      {
        name: 'typeAheadKeymap',
        plugin: () => keymapPlugin(),
      },
    ];
  },

  contentComponent({
    editorView,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
  }) {
    return (
      <WithPluginState
        plugins={{
          typeAhead: typeAheadPluginKey,
        }}
        render={({
          typeAhead = createInitialPluginState(),
        }: {
          typeAhead?: TypeAheadPluginState;
        }) => {
          if (
            typeAhead.typeAheadHandler &&
            typeAhead.typeAheadHandler.headless
          ) {
            return null;
          }

          const { queryMarkPos } = typeAhead;
          let domRef = null;
          if (queryMarkPos !== null) {
            // temporary fix to avoid page crash until it is fixed properly
            try {
              domRef = editorView.domAtPos(queryMarkPos);
            } catch (ex) {
              return null;
            }
          }

          const anchorElement = domRef
            ? ((domRef.node as HTMLElement).childNodes[
                domRef.offset
              ] as HTMLElement)
            : undefined;

          return (
            <TypeAhead
              editorView={editorView}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
              popupsScrollableElement={popupsScrollableElement}
              anchorElement={anchorElement}
              active={typeAhead.active}
              isLoading={!!typeAhead.itemsLoader}
              items={typeAhead.items}
              currentIndex={typeAhead.currentIndex}
              highlight={typeAhead.highlight}
              createAnalyticsEvent={options?.createAnalyticsEvent}
              query={typeAhead.query}
            />
          );
        }}
      />
    );
  },
});

export { typeAheadPluginKey };
export type { TypeAheadPluginState };
export default typeAheadPlugin;
