import React from 'react';

import { type GasPurePayload } from '@atlaskit/analytics-gas-types';
import { AnalyticsListener, type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { ExtensionManifest } from '@atlaskit/editor-common/extensions';
import addonIcon from '@atlaskit/icon/glyph/editor/addon';

import { loadResourceTags } from '../common/utils';

import { ChartPlaceholder } from './ChartPlaceholder';
import { MacroComponent, macroExtensionHandlerKey } from './MacroComponent';

const chartExtensionType = 'com.atlassian.chart';
const chartExtensionKey = 'chart';

let contentIdDeferred = {
	promise: new Promise<number>(() => {}),
};

function getConfluenceMobileMacroManifests<createPromiseType extends Function, eventDispatcherType>(
	createPromise: createPromiseType,
	eventDispatcher: eventDispatcherType,
	handleAnalyticsEvent: (event: GasPurePayload) => void,
	onLinkClick?: Function,
): Promise<ExtensionManifest[]> {
	let resolveContentId: (contentId: number) => void;
	contentIdDeferred.promise = new Promise((resolve) => {
		resolveContentId = resolve;
	});
	return createPromise('customConfigurationMacro')
		.submit()
		.then((result: any) => {
			wrapRendererIfNecessary();

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
				!('renderingStrategyMap' in resultObj) && Object.keys(resultObj).length > 0;
			if (shouldExtractFirstKey) {
				const firstKey = Object.keys(resultObj)[0];
				resultObj = resultObj[firstKey];
			}

			const contentId = resultObj.contentId;
			const baseUrl = resultObj.siteUrlString;

			resolveContentId(contentId);

			loadResourceTags(
				[
					resultObj?.superbatchTags?.css,
					resultObj?.superbatchTags?.data,
					resultObj?.superbatchTags?.js,
				],
				true,
			);

			const hasSuperbatch = !!(
				resultObj?.superbatchTags?.css ||
				resultObj?.superbatchTags?.data ||
				resultObj?.superbatchTags?.js
			);
			const hasLinkHandler = !!onLinkClick;
			const useRenderingStrategyMap = hasSuperbatch && hasLinkHandler;
			const defaultRenderingStrategy = useRenderingStrategyMap
				? resultObj.renderingStrategyMap?.['default']?.['default']
				: 'fallback';

			let macroManifests = resultObj.legacyMacroManifests.macros.map((macro: any) => {
				return {
					title: macro.title,
					type: macroExtensionHandlerKey,
					key: macro.macroName,
					description: macro.description,
					icons: {
						'48': () => Promise.resolve(addonIcon),
					},
					modules: {
						nodes: {
							default: {
								type: 'extension',
								render: () =>
									contentIdDeferred.promise.then((latestContentId) => ({ node }: { node: any }) => {
										const foundRenderingStrategy = useRenderingStrategyMap
											? resultObj.renderingStrategyMap?.[node.extensionType]?.[node.extensionKey]
											: null;
										const renderingStrategy = foundRenderingStrategy || defaultRenderingStrategy;
										return renderMacro(
											node,
											latestContentId,
											baseUrl,
											renderingStrategy,
											defaultRenderingStrategy,
											createPromise,
											eventDispatcher,
											handleAnalyticsEvent,
											onLinkClick,
										);
									}),
							},
						},
					},
				};
			});

			const chartRenderingStrategy =
				resultObj.renderingStrategyMap?.[chartExtensionType]?.[chartExtensionKey];

			if (chartRenderingStrategy === 'placeholder') {
				macroManifests.push(getChartPlaceholderManifest());
			} else if (chartRenderingStrategy === 'fallback') {
				macroManifests.push(
					getChartFallbackManifest(
						contentId,
						chartRenderingStrategy,
						defaultRenderingStrategy,
						createPromise,
						eventDispatcher,
						handleAnalyticsEvent,
						onLinkClick,
					),
				);
			}

			return macroManifests;
		});
}

function wrapRendererIfNecessary() {
	const existingWrapper = document.getElementById('main-content');
	if (!existingWrapper) {
		const renderer = document.getElementById('renderer');
		if (renderer) {
			const mainContent = document.createElement('DIV');
			mainContent.setAttribute('id', 'main-content');
			document.body.appendChild(mainContent);
			mainContent.appendChild(renderer);
		}
	}
}

function createHandleAnalyticsEventWrapper(
	handleAnalyticsEvent: (event: GasPurePayload) => void,
): (event: UIAnalyticsEvent) => void {
	return (event) => {
		handleAnalyticsEvent(event.payload as GasPurePayload);
	};
}

function renderMacro<createPromiseType extends Function, eventDispatcherType>(
	node: any,
	contentId: number,
	baseUrl: string,
	renderingStrategy: string,
	defaultRenderingStrategy: string,
	createPromise: createPromiseType,
	eventDispatcher: eventDispatcherType,
	handleAnalyticsEvent: (event: GasPurePayload) => void,
	onLinkClick?: Function,
) {
	const unhandledLinkClick: Function = () => {
		throw new Error(
			'Unhandled link click! No link handler provided for Confluence Macros. Some macros may not behave as expected.',
		);
	};
	return (
		<AnalyticsListener
			channel="confluence-mobile-macros"
			onEvent={createHandleAnalyticsEventWrapper(handleAnalyticsEvent)}
		>
			<MacroComponent
				extension={node}
				contentId={contentId}
				baseUrl={baseUrl}
				renderingStrategy={renderingStrategy}
				defaultRenderingStrategy={defaultRenderingStrategy}
				createPromise={createPromise}
				eventDispatcher={eventDispatcher}
				onLinkClick={onLinkClick || unhandledLinkClick}
			/>
		</AnalyticsListener>
	);
}

function getChartPlaceholderManifest(): ExtensionManifest {
	return {
		title: 'Chart Placeholder',
		type: chartExtensionType,
		key: chartExtensionKey,
		description: 'Placeholder for the chart extension until it can be fully supported on mobile',
		icons: {
			'48': () => Promise.resolve(addonIcon),
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

function getChartFallbackManifest<createPromiseType extends Function, eventDispatcherType>(
	contentId: number,
	baseUrl: string,
	defaultRenderingStrategy: string,
	createPromise: createPromiseType,
	eventDispatcher: eventDispatcherType,
	handleAnalyticsEvent: (event: GasPurePayload) => void,
	onLinkClick?: Function,
): ExtensionManifest {
	return {
		title: 'Chart Fallback',
		type: chartExtensionType,
		key: chartExtensionKey,
		description: 'Adapter to render chart extensions through macro fallback on mobile',
		icons: {
			'48': () => Promise.resolve(addonIcon),
		},
		modules: {
			nodes: {
				default: {
					type: 'extension',
					render: () =>
						Promise.resolve(({ node }: { node: any }) =>
							renderMacro(
								node,
								contentId,
								baseUrl,
								defaultRenderingStrategy,
								defaultRenderingStrategy,
								createPromise,
								eventDispatcher,
								handleAnalyticsEvent,
								onLinkClick,
							),
						),
				},
			},
		},
	};
}

export { getConfluenceMobileMacroManifests, MacroComponent, macroExtensionHandlerKey };

export {
	InlineMacroComponent,
	InlineSSRMacroComponent,
	MacroFallbackCard,
	MacroFallbackComponent,
} from './MacroComponent';
