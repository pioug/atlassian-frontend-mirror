import React, { useEffect, useRef, useState } from 'react';

import { appearancePropsMap } from '@atlaskit/editor-common/card';
import type { CardProvider } from '@atlaskit/editor-common/provider-factory';
import type {
	Command,
	DropdownOptions,
	FloatingToolbarDropdown,
	FloatingToolbarItem,
} from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import type { HyperlinkToolbarAppearanceProps } from './HyperlinkToolbarAppearance';
import { LinkAppearanceMenu } from './LinkToolbarAppearanceDropdown';

const HyperlinkDropdown = (
	props: HyperlinkToolbarAppearanceProps & {
		dispatchCommand: (command: Command) => void;
		settingsConfig: FloatingToolbarItem<Command>;
		allowDatasource?: boolean;
		isDatasourceView?: boolean;
	},
) => {
	const [supportedUrlsMap, setSupportedUrlsMap] = useState<Map<string, boolean>>(new Map());
	const cardProvider = useRef<CardProvider | undefined>(undefined);

	const {
		url,
		intl,
		editorState,
		cardOptions,
		editorAnalyticsApi,
		allowDatasource,
		isDatasourceView,
	} = props;
	// Ignored via go/ees005
	// eslint-disable-next-line require-await
	const getProvider = async (): Promise<CardProvider> => {
		if (props.cardOptions?.provider) {
			return props.cardOptions?.provider;
		}

		if (cardProvider.current) {
			return cardProvider.current;
		}

		return new Promise<CardProvider>((resolve) => {
			const cardProvider = props.editorPluginApi?.card?.sharedState?.currentState()?.provider;
			if (cardProvider) {
				resolve(cardProvider);
			}
		});
	};

	const resolveUrl = async (url: string) => {
		if (supportedUrlsMap.has(url)) {
			return;
		}

		let isUrlSupported = false;
		try {
			const provider = await getProvider();
			isUrlSupported = (await provider?.findPattern(url)) ?? false;
		} catch (error) {
			isUrlSupported = false;
		}

		const newMap = new Map(supportedUrlsMap);
		newMap.set(url, isUrlSupported);
		setSupportedUrlsMap(newMap);
	};

	useEffect(() => {
		resolveUrl(url);
		// before migrating from a class to a functional component, we were only reacting to changes in the url
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [url, props.cardOptions?.provider, props.editorPluginApi]);

	if (!supportedUrlsMap.get(url)) {
		return null;
	}

	return (
		<LinkAppearanceMenu
			url={url}
			intl={intl}
			editorState={editorState}
			allowEmbeds={cardOptions?.allowEmbeds}
			allowBlockCards={cardOptions?.allowBlockCards}
			allowDatasource={allowDatasource}
			editorAnalyticsApi={editorAnalyticsApi}
			dispatchCommand={props.dispatchCommand}
			settingsConfig={props.settingsConfig}
			isDatasourceView={isDatasourceView}
		/>
	);
};

export const getHyperlinkAppearanceDropdown = ({
	url,
	intl,
	editorState,
	editorAnalyticsApi,
	editorPluginApi,
	settingsConfig,
	cardOptions,
	allowDatasource,
	isDatasourceView,
}: Omit<HyperlinkToolbarAppearanceProps, 'editorState'> & {
	settingsConfig: FloatingToolbarItem<Command>;
	editorState?: EditorState;
	allowDatasource?: boolean;
	isDatasourceView?: boolean;
}) => {
	const alignmentItemOptions: DropdownOptions<Command> = {
		render: (props) => {
			if (!editorState) {
				return null;
			}

			return (
				<HyperlinkDropdown
					intl={intl}
					editorState={editorState}
					url={url}
					editorAnalyticsApi={editorAnalyticsApi}
					editorPluginApi={editorPluginApi}
					dispatchCommand={props.dispatchCommand}
					settingsConfig={settingsConfig}
					cardOptions={cardOptions}
					allowDatasource={allowDatasource}
					isDatasourceView={isDatasourceView}
				/>
			);
		},
		width: 200,
		height: 400,
	};

	const currentAppearanceDisplayInformation = appearancePropsMap['url'];

	const alignmentToolbarItem: FloatingToolbarDropdown<Command> = {
		id: 'hyperlink-appearance',
		testId: 'hyperlink-appearance-dropdown',
		type: 'dropdown',
		options: alignmentItemOptions,
		title: intl.formatMessage(currentAppearanceDisplayInformation.title),
		iconBefore: currentAppearanceDisplayInformation.icon,
	};

	return alignmentToolbarItem;
};
