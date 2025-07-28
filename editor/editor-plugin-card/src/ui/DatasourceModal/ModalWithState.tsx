import React from 'react';

import {
	type NamedPluginStatesFromInjectionAPI,
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { DatasourceModalType, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
	AssetsConfigModal,
	CONFLUENCE_SEARCH_DATASOURCE_ID,
	ConfluenceSearchConfigModal,
	JIRA_LIST_OF_LINKS_DATASOURCE_ID,
	JiraIssuesConfigModal,
} from '@atlaskit/link-datasource';
import type { ConfigModalProps } from '@atlaskit/link-datasource';
import { EditorSmartCardProviderValueGuard, useSmartLinkContext } from '@atlaskit/link-provider';
import type { DatasourceAdf, InlineCardAdf } from '@atlaskit/linking-common';
import type { DatasourceParameters } from '@atlaskit/linking-types';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { cardPlugin } from '../../cardPlugin';
import { DatasourceErrorBoundary } from '../datasourceErrorBoundary';

import { DatasourceModal } from './index';

type ModalWithStateProps = {
	api: ExtractInjectionAPI<typeof cardPlugin> | undefined;
	editorView: EditorView;
};

const selector = (
	states: NamedPluginStatesFromInjectionAPI<ExtractInjectionAPI<typeof cardPlugin>, 'card'>,
) => {
	return {
		cardState: undefined,
		showDatasourceModal: states.cardState?.showDatasourceModal,
		datasourceModalType: states.cardState?.datasourceModalType,
	};
};

const useSharedState = sharedPluginStateHookMigratorFactory(
	(pluginInjectionApi: ExtractInjectionAPI<typeof cardPlugin> | undefined) => {
		return useSharedPluginStateWithSelector(pluginInjectionApi, ['card'], selector);
	},
	(pluginInjectionApi: ExtractInjectionAPI<typeof cardPlugin> | undefined) => {
		const { cardState } = useSharedPluginState(pluginInjectionApi, ['card']);
		return {
			cardState,
			showDatasourceModal: cardState?.showDatasourceModal,
			datasourceModalType: cardState?.datasourceModalType,
		};
	},
);

const ModalWithState = ({ api, editorView }: ModalWithStateProps) => {
	const cardContext = useSmartLinkContext();
	const { cardState, showDatasourceModal, datasourceModalType } = useSharedState(api);
	if (
		!cardState &&
		expValEquals('platform_editor_usesharedpluginstatewithselector', 'isEnabled', false)
	) {
		return null;
	}

	if (!showDatasourceModal || !datasourceModalType) {
		return null;
	}

	const { datasourceId, componentType } = modalTypeToComponentMap[datasourceModalType];

	return (
		<DatasourceErrorBoundary view={editorView} datasourceModalType={datasourceModalType}>
			<DatasourceModal
				view={editorView}
				cardContext={cardContext}
				datasourceId={datasourceId}
				componentType={componentType}
			/>
		</DatasourceErrorBoundary>
	);
};

const SafeModalWithState = React.memo(({ api, editorView }: ModalWithStateProps) => {
	return (
		<EditorSmartCardProviderValueGuard>
			<ModalWithState api={api} editorView={editorView} />
		</EditorSmartCardProviderValueGuard>
	);
});

export type ModalTypeToComponentMap = {
	componentType: React.ComponentType<
		ConfigModalProps<InlineCardAdf | DatasourceAdf, DatasourceParameters>
	>;
	datasourceId: string;
};

export const modalTypeToComponentMap: {
	[key in DatasourceModalType]: ModalTypeToComponentMap;
} = {
	jira: {
		componentType: JiraIssuesConfigModal,
		datasourceId: JIRA_LIST_OF_LINKS_DATASOURCE_ID,
	},
	'confluence-search': {
		componentType: ConfluenceSearchConfigModal,
		datasourceId: CONFLUENCE_SEARCH_DATASOURCE_ID,
	},
	assets: {
		componentType: AssetsConfigModal,
		datasourceId: ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
	},
};

export default SafeModalWithState;
