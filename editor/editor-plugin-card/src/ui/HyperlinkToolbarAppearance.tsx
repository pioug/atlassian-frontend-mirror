import React, { Component, useEffect, useRef, useState } from 'react';

import type { IntlShape } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { CardOptions } from '@atlaskit/editor-common/card';
import type { CardProvider, ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { FloatingToolbarSeparator as Separator } from '@atlaskit/editor-common/ui';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { Flex } from '@atlaskit/primitives';
import type { CardPlatform } from '@atlaskit/smart-card';

import { type CardPlugin } from '../plugin';

import { DatasourceAppearanceButton } from './DatasourceAppearanceButton';
import { EditDatasourceButton } from './EditDatasourceButton';
import { LinkToolbarAppearance } from './LinkToolbarAppearance';

export interface HyperlinkToolbarAppearanceProps {
	intl: IntlShape;
	editorState: EditorState;
	providerFactory: ProviderFactory;
	url: string;
	editorView?: EditorView;
	platform?: CardPlatform;
	cardOptions?: CardOptions;
	editorAnalyticsApi: EditorAnalyticsAPI | undefined;
	editorPluginApi: ExtractInjectionAPI<CardPlugin> | undefined;
}

export interface HyperlinkToolbarAppearanceState {
	supportedUrlsMap: Map<string, boolean>;
}

function HyperlinkToolbarAppearanceFunctional(props: HyperlinkToolbarAppearanceProps) {
	const [supportedUrlsMap, setSupportedUrlsMap] = useState<Map<string, boolean>>(new Map());
	const cardProvider = useRef<CardProvider | undefined>(undefined);

	const { url, intl, editorView, editorState, cardOptions, platform, editorAnalyticsApi } = props;

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
		<Flex>
			{!fg('platform.linking-platform.enable-datasource-edit-dropdown-toolbar') && (
				<EditDatasourceButton
					url={url}
					intl={intl}
					editorView={editorView}
					editorAnalyticsApi={editorAnalyticsApi}
					currentAppearance="url"
				/>
			)}
			<LinkToolbarAppearance
				key="link-appearance"
				url={url}
				intl={intl}
				editorView={editorView}
				editorState={editorState}
				allowEmbeds={cardOptions?.allowEmbeds}
				allowBlockCards={cardOptions?.allowBlockCards}
				platform={platform}
				editorAnalyticsApi={editorAnalyticsApi}
			/>
			{cardOptions?.allowDatasource && (
				<DatasourceAppearanceButton
					intl={intl}
					url={url}
					editorState={editorState}
					editorView={editorView}
					editorAnalyticsApi={editorAnalyticsApi}
					inputMethod={INPUT_METHOD.FLOATING_TB}
				/>
			)}
			<Separator />
		</Flex>
	);
}

// eslint-disable-next-line @repo/internal/react/no-class-components
class HyperlinkToolbarAppearanceClass extends Component<
	HyperlinkToolbarAppearanceProps,
	HyperlinkToolbarAppearanceState
> {
	state: HyperlinkToolbarAppearanceState = {
		supportedUrlsMap: new Map(),
	};
	cardProvider?: CardProvider;

	private getProvider = async (): Promise<CardProvider> => {
		if (this.cardProvider) {
			return this.cardProvider;
		}

		return new Promise<CardProvider>((resolve) => {
			const { providerFactory } = this.props;
			providerFactory.subscribe('cardProvider', async (_, cardProvider) => {
				if (!cardProvider) {
					return;
				}

				this.cardProvider = await cardProvider;
				resolve(this.cardProvider);
			});
		});
	};

	private resolveUrl = async (url: string) => {
		const { supportedUrlsMap } = this.state;
		if (supportedUrlsMap.has(url)) {
			return;
		}

		let isUrlSupported = false;
		try {
			const provider = await this.getProvider();
			isUrlSupported = (await provider?.findPattern(url)) ?? false;
		} catch (error) {
			isUrlSupported = false;
		}

		const newMap = new Map(supportedUrlsMap);
		newMap.set(url, isUrlSupported);
		this.setState({ supportedUrlsMap: newMap });
	};

	componentDidMount = () => this.resolveUrl(this.props.url);

	// needed so we display the right state on the Toolbar while the same Toolbar
	// instance is visible and we click other link
	UNSAFE_componentWillReceiveProps(nextProps: HyperlinkToolbarAppearanceProps) {
		if (nextProps.url !== this.props.url) {
			this.resolveUrl(nextProps.url);
		}
	}

	render() {
		const { url, intl, editorView, editorState, cardOptions, platform, editorAnalyticsApi } =
			this.props;
		const { supportedUrlsMap } = this.state;

		if (!supportedUrlsMap.get(url)) {
			return null;
		}
		return (
			<Flex>
				{!fg('platform.linking-platform.enable-datasource-edit-dropdown-toolbar') && (
					<EditDatasourceButton
						url={url}
						intl={intl}
						editorView={editorView}
						editorAnalyticsApi={editorAnalyticsApi}
						currentAppearance="url"
					/>
				)}
				<LinkToolbarAppearance
					key="link-appearance"
					url={url}
					intl={intl}
					editorView={editorView}
					editorState={editorState}
					allowEmbeds={cardOptions?.allowEmbeds}
					allowBlockCards={cardOptions?.allowBlockCards}
					platform={platform}
					editorAnalyticsApi={editorAnalyticsApi}
				/>
				{cardOptions?.allowDatasource && (
					<DatasourceAppearanceButton
						intl={intl}
						url={url}
						editorState={editorState}
						editorView={editorView}
						editorAnalyticsApi={editorAnalyticsApi}
						inputMethod={INPUT_METHOD.FLOATING_TB}
					/>
				)}
				<Separator />
			</Flex>
		);
	}
}

export const HyperlinkToolbarAppearance = (props: HyperlinkToolbarAppearanceProps) => {
	if (fg('platform_editor_get_card_provider_from_config')) {
		return <HyperlinkToolbarAppearanceFunctional {...props} />;
	}
	return <HyperlinkToolbarAppearanceClass {...props} />;
};
