import React from 'react';

import type { ExtensionManifest } from '@atlaskit/editor-common/extensions';

import { loadResourceTags } from '../common/utils';

import { ChartPlaceholder } from './ChartPlaceholder';
import { MacroComponent, macroExtensionHandlerKey } from './MacroComponent';

const chartExtensionType = 'com.atlassian.chart';
const chartExtensionKey = 'chart';

function getConfluenceMobileMacroManifests<
  createPromiseType extends Function,
  eventDispatcherType
>(
  createPromise: createPromiseType,
  eventDispatcher: eventDispatcherType,
): Promise<ExtensionManifest[]> {
  return createPromise('customConfigurationMacro')
    .submit()
    .then((result: any) => {
      var resultObj = JSON.parse(JSON.stringify(result));
      /*
        The workaround below is for iOS
        The returned from iOS is wrapped as an Object with the key being resultId:
        {
          "<request id>": {
            "contentId": "...",
            "legacyMacroManifests": { },
            "renderStrategyMap": { }
          }
        }
        Since the value of the requestId is not a constant we take the value of the
        first key in the result and pass it as the result Object.
      */
      // Format the object ony if there is no key called `renderStrategyMap` in the result Object
      const shouldExtractFirstKey =
        !('renderingStrategyMap' in resultObj) &&
        Object.keys(resultObj).length > 0;
      if (shouldExtractFirstKey) {
        const firstKey = Object.keys(resultObj)[0];
        resultObj = resultObj[firstKey];
      }

      loadResourceTags(
        [
          resultObj?.superbatchTags?.css,
          resultObj?.superbatchTags?.data,
          resultObj?.superbatchTags?.js,
        ],
        true,
      );

      let macroManifests = resultObj.legacyMacroManifests.macros.map(
        (macro: any) => {
          return {
            title: macro.title,
            type: macroExtensionHandlerKey,
            key: macro.macroName,
            description: macro.description,
            icons: {
              '48': () => import('@atlaskit/icon/glyph/editor/addon'),
            },
            modules: {
              nodes: {
                default: {
                  type: 'extension',
                  render: () =>
                    Promise.resolve(({ node }: { node: any }) =>
                      renderFallback(
                        node,
                        resultObj.renderingStrategyMap?.[node.extensionType]?.[
                          node.extensionKey
                        ],
                        createPromise,
                        eventDispatcher,
                      ),
                    ),
                },
              },
            },
          };
        },
      );

      const chartRenderingStrategy =
        resultObj.renderingStrategyMap?.[chartExtensionType]?.[
          chartExtensionKey
        ];

      if (chartRenderingStrategy === 'placeholder') {
        macroManifests.push(getChartPlaceholderManifest());
      } else if (chartRenderingStrategy === 'fallback') {
        macroManifests.push(
          getChartFallbackManifest(
            chartRenderingStrategy,
            createPromise,
            eventDispatcher,
          ),
        );
      }

      return macroManifests;
    });
}

function renderFallback<
  createPromiseType extends Function,
  eventDispatcherType
>(
  node: any,
  renderingStrategy: string,
  createPromise: createPromiseType,
  eventDispatcher: eventDispatcherType,
) {
  return (
    <MacroComponent
      extension={node}
      renderingStrategy={renderingStrategy}
      createPromise={createPromise}
      eventDispatcher={eventDispatcher}
    />
  );
}

function getChartPlaceholderManifest(): ExtensionManifest {
  return {
    title: 'Chart Placeholder',
    type: chartExtensionType,
    key: chartExtensionKey,
    description:
      'Placeholder for the chart extension until it can be fully supported on mobile',
    icons: {
      '48': () => import('@atlaskit/icon/glyph/editor/addon'),
    },
    modules: {
      nodes: {
        default: {
          type: 'extension',
          render: () =>
            Promise.resolve(({ node }: { node: any }) => {
              return <ChartPlaceholder />;
            }),
        },
      },
    },
  };
}

function getChartFallbackManifest<
  createPromiseType extends Function,
  eventDispatcherType
>(
  renderingStrategy: string,
  createPromise: createPromiseType,
  eventDispatcher: eventDispatcherType,
): ExtensionManifest {
  return {
    title: 'Chart Fallback',
    type: chartExtensionType,
    key: chartExtensionKey,
    description:
      'Adapter to render chart extensions through macro fallback on mobile',
    icons: {
      '48': () => import('@atlaskit/icon/glyph/editor/addon'),
    },
    modules: {
      nodes: {
        default: {
          type: 'extension',
          render: () =>
            Promise.resolve(({ node }: { node: any }) =>
              renderFallback(node, 'fallback', createPromise, eventDispatcher),
            ),
        },
      },
    },
  };
}

export {
  getConfluenceMobileMacroManifests,
  MacroComponent,
  macroExtensionHandlerKey,
};

export {
  InlineMacroComponent,
  MacroFallbackCard,
  MacroFallbackComponent,
} from './MacroComponent';
