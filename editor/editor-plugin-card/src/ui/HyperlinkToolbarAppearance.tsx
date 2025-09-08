import React, { useEffect, useRef, useState } from 'react';

import type { IntlShape } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { CardOptions } from '@atlaskit/editor-common/card';
import type { CardProvider } from '@atlaskit/editor-common/provider-factory';
import { areToolbarFlagsEnabled } from '@atlaskit/editor-common/toolbar-flag-check';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { FloatingToolbarSeparator as Separator } from '@atlaskit/editor-common/ui';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Flex } from '@atlaskit/primitives/compiled';

import { type CardPlugin } from '../cardPluginType';

import { DatasourceAppearanceButton } from './DatasourceAppearanceButton';
import { LinkToolbarAppearance } from './LinkToolbarAppearance';

export interface HyperlinkToolbarAppearanceProps {
	cardOptions?: CardOptions;
	editorAnalyticsApi: EditorAnalyticsAPI | undefined;
	editorPluginApi: ExtractInjectionAPI<CardPlugin> | undefined;
	editorState: EditorState;
	editorView?: EditorView;
	intl: IntlShape;
	url: string;
}

export function HyperlinkToolbarAppearance(props: HyperlinkToolbarAppearanceProps) {
	const [supportedUrlsMap, setSupportedUrlsMap] = useState<Map<string, boolean>>(new Map());
	const cardProvider = useRef<CardProvider | undefined>(undefined);

	const { url, intl, editorView, editorState, cardOptions, editorAnalyticsApi } = props;

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

	const areAnyNewToolbarFlagsEnabled = areToolbarFlagsEnabled(
		Boolean(props.editorPluginApi?.toolbar),
	);

	return (
		<Flex>
			<LinkToolbarAppearance
				key="link-appearance"
				url={url}
				intl={intl}
				editorView={editorView}
				editorState={editorState}
				allowEmbeds={cardOptions?.allowEmbeds}
				allowBlockCards={cardOptions?.allowBlockCards}
				editorAnalyticsApi={editorAnalyticsApi}
				areAnyNewToolbarFlagsEnabled={areAnyNewToolbarFlagsEnabled}
			/>
			{cardOptions?.allowDatasource && (
				<DatasourceAppearanceButton
					intl={intl}
					url={url}
					editorState={editorState}
					editorView={editorView}
					editorAnalyticsApi={editorAnalyticsApi}
					inputMethod={INPUT_METHOD.FLOATING_TB}
					areAnyNewToolbarFlagsEnabled={areAnyNewToolbarFlagsEnabled}
				/>
			)}
			<Separator areAnyNewToolbarFlagsEnabled={areAnyNewToolbarFlagsEnabled} />
		</Flex>
	);
}
