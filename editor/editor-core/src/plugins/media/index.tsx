import React from 'react';
import { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import {
  media,
  mediaGroup,
  mediaSingle,
  mediaSingleWithCaption,
} from '@atlaskit/adf-schema';
import { EditorPlugin, PMPlugin, PMPluginFactoryParams } from '../../types';
import {
  stateKey as pluginKey,
  createPlugin,
  MediaState,
} from './pm-plugins/main';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import { createPlugin as createMediaEditorPlugin } from './pm-plugins/media-editor';
import { pluginKey as mediaEditorPluginKey } from './pm-plugins/media-editor-plugin-factory';
import { createPlugin as createMediaAltTextPlugin } from './pm-plugins/alt-text';
import keymapMediaAltTextPlugin from './pm-plugins/alt-text/keymap';
import keymapMediaSinglePlugin from './pm-plugins/keymap-media-single';
import keymapLinkingPlugin from './pm-plugins/linking/keymap';
import keymapPlugin from './pm-plugins/keymap';
import linkingPlugin from './pm-plugins/linking';
import ToolbarMedia from './ui/ToolbarMedia';
import { ReactMediaGroupNode } from './nodeviews/mediaGroup';
import { ReactMediaSingleNode } from './nodeviews/mediaSingle';
import { CustomMediaPicker, MediaOptions } from './types';
import { floatingToolbar } from './toolbar';

import {
  addAnalytics,
  ACTION,
  ACTION_SUBJECT,
  INPUT_METHOD,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '../analytics';
import { IconImages } from '../quick-insert/assets';
import WithPluginState from '../../ui/WithPluginState';
import MediaEditor from './ui/MediaEditor';
import { MediaPickerComponents } from './ui/MediaPicker';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { ReactMediaNode } from './nodeviews/mediaNodeView';

export type { MediaState, MediaProvider, CustomMediaPicker };
export { insertMediaSingleNode } from './utils/media-single';

const mediaPlugin = (options?: MediaOptions): EditorPlugin => ({
  name: 'media',

  nodes() {
    const { allowMediaGroup = true, allowMediaSingle = false, featureFlags } =
      options || {};

    const captions = getMediaFeatureFlag('captions', featureFlags);

    const mediaSingleNode = captions ? mediaSingleWithCaption : mediaSingle;

    return [
      { name: 'mediaGroup', node: mediaGroup },
      { name: 'mediaSingle', node: mediaSingleNode },
      { name: 'media', node: media },
    ].filter((node) => {
      if (node.name === 'mediaGroup') {
        return allowMediaGroup;
      }

      if (node.name === 'mediaSingle') {
        return allowMediaSingle;
      }

      return true;
    });
  },

  pmPlugins() {
    const pmPlugins: Array<PMPlugin> = [
      {
        name: 'media',
        plugin: ({
          schema,
          dispatch,
          eventDispatcher,
          providerFactory,
          errorReporter,
          portalProviderAPI,
          reactContext,
          dispatchAnalyticsEvent,
        }: PMPluginFactoryParams) =>
          createPlugin(
            schema,
            {
              providerFactory,
              nodeViews: {
                mediaGroup: ReactMediaGroupNode(
                  portalProviderAPI,
                  eventDispatcher,
                  providerFactory,
                  options,
                ),
                mediaSingle: ReactMediaSingleNode(
                  portalProviderAPI,
                  eventDispatcher,
                  providerFactory,
                  dispatchAnalyticsEvent,
                  options,
                ),
                media: ReactMediaNode(
                  portalProviderAPI,
                  eventDispatcher,
                  providerFactory,
                  options,
                ),
              },
              errorReporter,
              uploadErrorHandler: options && options.uploadErrorHandler,
              waitForMediaUpload: options && options.waitForMediaUpload,
              customDropzoneContainer:
                options && options.customDropzoneContainer,
              customMediaPicker: options && options.customMediaPicker,
              allowResizing: !!(options && options.allowResizing),
            },
            reactContext,
            dispatch,
            options,
          ),
      },
      { name: 'mediaKeymap', plugin: () => keymapPlugin(options) },
    ];

    if (options && options.allowMediaSingle) {
      pmPlugins.push({
        name: 'mediaSingleKeymap',
        plugin: ({ schema }) => keymapMediaSinglePlugin(schema),
      });
    }

    if (options && options.allowAnnotation) {
      pmPlugins.push({ name: 'mediaEditor', plugin: createMediaEditorPlugin });
    }

    if (options && options.allowAltTextOnImages) {
      pmPlugins.push({
        name: 'mediaAltText',
        plugin: createMediaAltTextPlugin,
      });
      pmPlugins.push({
        name: 'mediaAltTextKeymap',
        plugin: ({ schema }) => keymapMediaAltTextPlugin(schema),
      });
    }

    if (options && options.allowLinking) {
      pmPlugins.push({
        name: 'mediaLinking',
        plugin: ({ dispatch }: PMPluginFactoryParams) =>
          linkingPlugin(dispatch),
      });
      pmPlugins.push({
        name: 'mediaLinkingKeymap',
        plugin: ({ schema }) => keymapLinkingPlugin(schema),
      });
    }

    return pmPlugins;
  },

  contentComponent({ editorView, eventDispatcher, appearance }) {
    // render MediaEditor separately because it doesn't depend on media plugin state
    // so we can utilise EventDispatcher-based rerendering
    const mediaEditor =
      options && options.allowAnnotation ? (
        <WithPluginState
          editorView={editorView}
          plugins={{ mediaEditorState: mediaEditorPluginKey }}
          eventDispatcher={eventDispatcher}
          render={({ mediaEditorState }) => (
            <MediaEditor
              mediaEditorState={mediaEditorState!}
              view={editorView}
            />
          )}
        />
      ) : null;

    return (
      <>
        <WithPluginState
          editorView={editorView}
          plugins={{
            mediaState: pluginKey,
          }}
          render={({ mediaState }) => (
            <MediaPickerComponents
              editorDomElement={editorView.dom}
              mediaState={mediaState!}
              appearance={appearance}
            />
          )}
        />

        {mediaEditor}
      </>
    );
  },

  secondaryToolbarComponent({ editorView, eventDispatcher, disabled }) {
    return (
      <ToolbarMedia
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        pluginKey={pluginKey}
        isDisabled={disabled}
        isReducedSpacing={true}
      />
    );
  },

  pluginsOptions: {
    quickInsert: ({ formatMessage }) => [
      {
        id: 'media',
        title: formatMessage(messages.filesAndImages),
        description: formatMessage(messages.filesAndImagesDescription),
        priority: 400,
        keywords: ['attachment', 'gif', 'media', 'picture'],
        icon: () => <IconImages />,
        action(insert, state) {
          const pluginState = pluginKey.getState(state);
          pluginState.showMediaPicker();
          const tr = insert('');
          return addAnalytics(state, tr, {
            action: ACTION.OPENED,
            actionSubject: ACTION_SUBJECT.PICKER,
            actionSubjectId: ACTION_SUBJECT_ID.PICKER_CLOUD,
            attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
            eventType: EVENT_TYPE.UI,
          });
        },
      },
    ],

    floatingToolbar: (state, intl, providerFactory) =>
      floatingToolbar(state, intl, {
        providerFactory,
        allowMediaInline: options && options.allowMediaInline,
        allowResizing: options && options.allowResizing,
        allowResizingInTables: options && options.allowResizingInTables,
        allowAnnotation: options && options.allowAnnotation,
        allowLinking: options && options.allowLinking,
        allowAdvancedToolBarOptions:
          options && options.allowAdvancedToolBarOptions,
        allowAltTextOnImages: options && options.allowAltTextOnImages,
        altTextValidator: options && options.altTextValidator,
      }),
  },
});

export default mediaPlugin;
