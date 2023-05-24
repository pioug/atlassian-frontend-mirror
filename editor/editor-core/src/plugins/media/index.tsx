import React from 'react';
import { PluginKey, NodeSelection } from 'prosemirror-state';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import {
  media,
  mediaGroup,
  mediaSingle,
  mediaSingleWithCaption,
  mediaInline,
} from '@atlaskit/adf-schema';
import { NextEditorPlugin, PMPlugin, PMPluginFactoryParams } from '../../types';
import { OptionalPlugin } from '@atlaskit/editor-common/types';
import {
  stateKey as pluginKey,
  createPlugin,
  MediaState,
} from './pm-plugins/main';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
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
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  INPUT_METHOD,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '@atlaskit/editor-common/analytics';
import { IconImages } from '../quick-insert/assets';
import WithPluginState from '../../ui/WithPluginState';
import { MediaPickerComponents } from './ui/MediaPicker';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { ReactMediaNode } from './nodeviews/mediaNodeView';
import { ReactMediaInlineNode } from './nodeviews/mediaInline';
import type featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import type { gridPlugin } from '@atlaskit/editor-plugin-grid';
import type { widthPlugin } from '@atlaskit/editor-plugin-width';
import { MediaPluginState } from './pm-plugins/types';
import { stateKey } from './pm-plugins/plugin-key';

export type { MediaState, MediaProvider, CustomMediaPicker };
export { insertMediaSingleNode } from './utils/media-single';

const mediaPlugin: NextEditorPlugin<
  'media',
  {
    pluginConfiguration: MediaOptions | undefined;
    dependencies: [
      typeof featureFlagsPlugin,
      OptionalPlugin<typeof analyticsPlugin>,
      typeof gridPlugin,
      typeof widthPlugin,
    ];
    sharedState: MediaPluginState | null;
  }
> = (options = {}, api) => {
  const featureFlags =
    api?.dependencies?.featureFlags?.sharedState.currentState() || {};

  return {
    name: 'media',

    getSharedState(editorState) {
      if (!editorState) {
        return null;
      }
      return stateKey.getState(editorState);
    },

    nodes() {
      const {
        allowMediaGroup = true,
        allowMediaSingle = false,
        featureFlags: mediaFeatureFlags,
      } = options || {};

      const captions = getMediaFeatureFlag('captions', mediaFeatureFlags);
      const allowMediaInline = getMediaFeatureFlag(
        'mediaInline',
        mediaFeatureFlags,
      );

      const mediaSingleNode = captions ? mediaSingleWithCaption : mediaSingle;
      return [
        { name: 'mediaGroup', node: mediaGroup },
        { name: 'mediaSingle', node: mediaSingleNode },
        { name: 'media', node: media },
        { name: 'mediaInline', node: mediaInline },
      ].filter((node) => {
        if (node.name === 'mediaGroup') {
          return allowMediaGroup;
        }

        if (node.name === 'mediaSingle') {
          return allowMediaSingle;
        }

        if (node.name === 'mediaInline') {
          return allowMediaInline;
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
            getIntl,
            eventDispatcher,
            providerFactory,
            errorReporter,
            portalProviderAPI,
            reactContext,
            dispatchAnalyticsEvent,
          }: PMPluginFactoryParams) => {
            return createPlugin(
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
                    api,
                  ),
                  media: ReactMediaNode(
                    portalProviderAPI,
                    eventDispatcher,
                    providerFactory,
                    options,
                    api,
                  ),
                  mediaInline: ReactMediaInlineNode(
                    portalProviderAPI,
                    eventDispatcher,
                    providerFactory,
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
              getIntl,
              dispatch,
              options,
              featureFlags.newInsertionBehaviour,
            );
          },
        },
        { name: 'mediaKeymap', plugin: () => keymapPlugin(options) },
      ];

      if (options && options.allowMediaSingle) {
        pmPlugins.push({
          name: 'mediaSingleKeymap',
          plugin: ({ schema }) => keymapMediaSinglePlugin(schema),
        });
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

      pmPlugins.push({
        name: 'mediaSelectionHandler',
        plugin: () => {
          const mediaSelectionHandlerPlugin = new SafePlugin({
            key: new PluginKey('mediaSelectionHandlerPlugin'),
            props: {
              handleScrollToSelection: (view) => {
                const {
                  state: { selection },
                } = view;
                if (
                  !(selection instanceof NodeSelection) ||
                  selection.node.type.name !== 'media'
                ) {
                  return false;
                }

                const { node, offset } = view.domAtPos(selection.from);
                if (
                  // Is the media element mounted already?
                  offset === node.childNodes.length
                ) {
                  // Media is not ready, so stop the scroll request
                  return true;
                }

                // Media is ready, keep the scrolling request
                return false;
              },
            },
          });

          return mediaSelectionHandlerPlugin;
        },
      });

      return pmPlugins;
    },

    contentComponent({ editorView, appearance }) {
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
          title: formatMessage(messages.mediaFiles),
          description: formatMessage(messages.mediaFilesDescription),
          priority: 400,
          keywords: ['attachment', 'gif', 'media', 'picture', 'image', 'video'],
          icon: () => <IconImages />,
          action(insert, state) {
            const pluginState = pluginKey.getState(state);
            pluginState.showMediaPicker();
            const tr = insert('');
            api?.dependencies.analytics?.actions.attachAnalyticsEvent({
              action: ACTION.OPENED,
              actionSubject: ACTION_SUBJECT.PICKER,
              actionSubjectId: ACTION_SUBJECT_ID.PICKER_CLOUD,
              attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
              eventType: EVENT_TYPE.UI,
            })(tr);

            return tr;
          },
        },
      ],

      floatingToolbar: (state, intl, providerFactory) =>
        floatingToolbar(
          state,
          intl,
          {
            providerFactory,
            allowMediaInline:
              options &&
              getMediaFeatureFlag('mediaInline', options.featureFlags),
            allowResizing: options && options.allowResizing,
            allowResizingInTables: options && options.allowResizingInTables,
            allowLinking: options && options.allowLinking,
            allowAdvancedToolBarOptions:
              options && options.allowAdvancedToolBarOptions,
            allowAltTextOnImages: options && options.allowAltTextOnImages,
            altTextValidator: options && options.altTextValidator,
          },
          api,
        ),
    },
  };
};

export default mediaPlugin;
