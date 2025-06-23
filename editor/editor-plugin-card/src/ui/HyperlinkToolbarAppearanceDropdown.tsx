import React, { useEffect, useRef, useState } from 'react';

import { appearancePropsMap } from '@atlaskit/editor-common/card';
import type { CardProvider } from '@atlaskit/editor-common/provider-factory';
import type {
	Command,
	FloatingToolbarCustom,
	FloatingToolbarItem,
} from '@atlaskit/editor-common/types';
import {
	FloatingToolbarButton as Button,
	FloatingToolbarSeparator as Separator,
} from '@atlaskit/editor-common/ui';
import {
	ArrowKeyNavigationType,
	DropdownContainer as UiDropdown,
} from '@atlaskit/editor-common/ui-menu';
import ChevronDownIcon from '@atlaskit/icon/core/migration/chevron-down';
import { Flex } from '@atlaskit/primitives/compiled';

import type { HyperlinkToolbarAppearanceProps } from './HyperlinkToolbarAppearance';
import { LinkAppearanceMenu } from './LinkToolbarAppearanceDropdown';

const CustomHyperlinkDropdown = (
	props: Omit<HyperlinkToolbarAppearanceProps, 'editorState'> & {
		settingsConfig: FloatingToolbarItem<Command>;
		allowDatasource?: boolean;
		isDatasourceView?: boolean;
	},
) => {
	const [supportedUrlsMap, setSupportedUrlsMap] = useState<Map<string, boolean>>(new Map());
	const [isOpen, setIsOpen] = useState(false);
	const cardProvider = useRef<CardProvider | undefined>(undefined);
	const containerRef = useRef<HTMLElement | undefined>(undefined);

	const {
		url,
		intl,
		editorView,
		cardOptions,
		editorAnalyticsApi,
		allowDatasource,
		isDatasourceView,
		settingsConfig,
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

	if (!editorView) {
		return null;
	}

	const dispatchCommand = (fn?: Function) => {
		fn && fn(editorView && editorView.state, editorView && editorView.dispatch, editorView);
		// Refocus the view to ensure the editor has focus
		if (editorView && !editorView.hasFocus()) {
			editorView.focus();
		}
	};

	const toggleOpen = () => setIsOpen((open) => !open);
	const close = () => setIsOpen(false);

	const currentAppearanceDisplayInformation = appearancePropsMap['url'];
	const title = intl.formatMessage(currentAppearanceDisplayInformation.title);

	const trigger = (
		<Button
			selected={isOpen}
			title={title}
			aria-label={title}
			aria-expanded={isOpen}
			aria-haspopup
			onClick={toggleOpen}
			icon={currentAppearanceDisplayInformation.icon({ label: '' })}
			iconAfter={<ChevronDownIcon label="" spacing="compact" size="small" />}
		>
			{title}
		</Button>
	);

	return (
		<Flex ref={containerRef} gap="space.075">
			<UiDropdown
				mountTo={containerRef.current}
				isOpen={isOpen}
				handleClickOutside={close}
				handleEscapeKeydown={close}
				trigger={trigger}
				scrollableElement={containerRef.current}
				arrowKeyNavigationProviderOptions={{
					type: ArrowKeyNavigationType.MENU,
				}}
				fitHeight={400}
				fitWidth={200}
			>
				<LinkAppearanceMenu
					url={url}
					intl={intl}
					currentAppearance={undefined}
					editorState={editorView.state}
					allowEmbeds={cardOptions?.allowEmbeds}
					allowBlockCards={cardOptions?.allowBlockCards}
					editorAnalyticsApi={editorAnalyticsApi}
					isDatasourceView={isDatasourceView}
					allowDatasource={allowDatasource}
					dispatchCommand={dispatchCommand}
					settingsConfig={settingsConfig}
				/>
			</UiDropdown>
			<Separator />
		</Flex>
	);
};

export const getCustomHyperlinkAppearanceDropdown = ({
	url,
	intl,
	editorAnalyticsApi,
	editorPluginApi,
	settingsConfig,
	cardOptions,
	allowDatasource,
	isDatasourceView,
}: Omit<HyperlinkToolbarAppearanceProps, 'editorState'> & {
	settingsConfig: FloatingToolbarItem<Command>;
	allowDatasource?: boolean;
	isDatasourceView?: boolean;
}): FloatingToolbarCustom<Command> => {
	return {
		type: 'custom',
		fallback: [],
		render: (editorView) => {
			if (!editorView) {
				return;
			}

			return (
				<CustomHyperlinkDropdown
					intl={intl}
					url={url}
					editorAnalyticsApi={editorAnalyticsApi}
					editorPluginApi={editorPluginApi}
					editorView={editorView}
					settingsConfig={settingsConfig}
					cardOptions={cardOptions}
					allowDatasource={allowDatasource}
					isDatasourceView={isDatasourceView}
				/>
			);
		},
	};
};
