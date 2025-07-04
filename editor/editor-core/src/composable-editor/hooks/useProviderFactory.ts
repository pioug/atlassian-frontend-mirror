import { useEffect, useMemo, useRef } from 'react';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import { type EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { QuickInsertProvider } from '@atlaskit/editor-common/provider-factory';
import type { QuickInsertOptions, PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';

import type EditorActions from '../../actions';
import type { EditorNextProps, ExtensionProvidersProp } from '../../types/editor-props';
import prepareExtensionProvider from '../../utils/prepare-extension-provider';
import prepareQuickInsertProvider from '../../utils/prepare-quick-insert-provider';
import getProvidersFromEditorProps from '../utils/getProvidersFromEditorProps';
import handleProviders from '../utils/handleProviders';

function useEditorRef(
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	preset: EditorPresetBuilder<any, any> | undefined,
): React.MutableRefObject<PublicPluginAPI<[ExtensionPlugin]> | undefined | undefined> {
	const apiRef = useRef<PublicPluginAPI<[ExtensionPlugin]> | undefined | undefined>();
	useEffect(() => {
		return preset?.apiResolver.on((api) => {
			apiRef.current = api as unknown as PublicPluginAPI<[ExtensionPlugin]> | undefined;
		});
	}, [preset?.apiResolver]);

	return apiRef;
}

type PreparedProviders = {
	extensionProvider?: ExtensionProvider;
	quickInsertProvider?: Promise<QuickInsertProvider>;
};

function prepareProviders(
	editorActions: EditorActions,
	apiRef: React.MutableRefObject<PublicPluginAPI<[ExtensionPlugin]> | undefined>,
	quickInsert: QuickInsertOptions | undefined,
	extensionProviders: ExtensionProvidersProp | undefined,
	createAnalyticsEvent: CreateUIAnalyticsEvent,
): PreparedProviders {
	const extensionProvider = prepareExtensionProvider(() => editorActions)(extensionProviders);
	const quickInsertProvider = prepareQuickInsertProvider(
		editorActions,
		apiRef,
		extensionProvider,
		quickInsert,
		createAnalyticsEvent,
	);
	return {
		extensionProvider,
		quickInsertProvider,
	};
}

/**
 *
 * This hook is used to create the provider factory object.
 *
 * @param props
 * @param editorActions
 * @param createAnalyticsEvent
 * @returns ProviderFactory for Editor
 */
export default function useProviderFactory(
	props: EditorNextProps,
	editorActions: EditorActions,
	createAnalyticsEvent: CreateUIAnalyticsEvent,
): ProviderFactory {
	const {
		autoformattingProvider,
		emojiProvider,
		mentionProvider,
		legacyImageUploadProvider,
		taskDecisionProvider,
		contextIdentifierProvider,
		searchProvider,
		macroProvider,
		activityProvider,
		collabEdit,
		collabEditProvider,
		presenceProvider,
		quickInsert,
		extensionProviders,
	} = props;

	const providers = useMemo(
		() =>
			getProvidersFromEditorProps({
				autoformattingProvider,
				emojiProvider,
				mentionProvider,
				legacyImageUploadProvider,
				taskDecisionProvider,
				contextIdentifierProvider,
				searchProvider,
				macroProvider,
				activityProvider,
				collabEdit,
				collabEditProvider,
				presenceProvider,
			}),
		[
			autoformattingProvider,
			emojiProvider,
			mentionProvider,
			legacyImageUploadProvider,
			taskDecisionProvider,
			contextIdentifierProvider,
			searchProvider,
			macroProvider,
			activityProvider,
			collabEdit,
			collabEditProvider,
			presenceProvider,
		],
	);

	const providerFactory = useRef(new ProviderFactory());
	const editorRef = useEditorRef(props.preset);

	const preparedProviders = useMemo(
		() =>
			// Though this will introduce some performance regression related to quick insert
			// loading but we can remove it soon when Forge will move to new API.
			// quickInsert={Promise.resolve(consumerQuickInsert)} is one of the main reason behind this performance issue.
			prepareProviders(
				editorActions,
				editorRef,
				quickInsert,
				extensionProviders,
				createAnalyticsEvent,
			),
		[extensionProviders, quickInsert, editorActions, createAnalyticsEvent, editorRef],
	);

	useEffect(() => {
		handleProviders(
			providerFactory.current,
			providers,
			preparedProviders.extensionProvider,
			preparedProviders.quickInsertProvider,
		);
	}, [providers, preparedProviders]);

	// componentWillUnmount equivalent
	useEffect(() => {
		return () => {
			// Disable this next line because it is not a React node
			// so we can safely call destroy on the ref.
			// eslint-disable-next-line react-hooks/exhaustive-deps
			providerFactory.current.destroy();
		};
	}, []);

	return providerFactory.current;
}
