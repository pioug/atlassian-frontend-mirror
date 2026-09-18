import React from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { NamedPluginStatesFromInjectionAPI } from '@atlaskit/editor-common/hooks';
import type { DatasourceModalType, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { AssetsConfigModalWithWrappers as AssetsConfigModal } from '@atlaskit/link-datasource/assets-config-modal-with-wrappers';
import { ASSETS_LIST_OF_LINKS_DATASOURCE_ID } from '@atlaskit/link-datasource/assets-modal';
import { ConfluenceSearchConfigModalWithWrappers as ConfluenceSearchConfigModal } from '@atlaskit/link-datasource/confluence-search-config-modal-with-wrappers';
import { CONFLUENCE_SEARCH_DATASOURCE_ID } from '@atlaskit/link-datasource/confluence-search-modal';
import { JiraIssuesConfigModalWithWrappers as JiraIssuesConfigModal } from '@atlaskit/link-datasource/jira-issues-config-modal-with-wrappers';
import { JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '@atlaskit/link-datasource/jira-issues-modal';
import type { ConfigModalProps } from '@atlaskit/link-datasource/types';
import { EditorSmartCardProviderValueGuard } from '@atlaskit/link-provider/editor-smart-card-provider-value-guard';
import { useSmartLinkContext } from '@atlaskit/link-provider/use-smart-link-context';
import type { DatasourceAdf, InlineCardAdf } from '@atlaskit/linking-common/types';
import type { DatasourceParameters } from '@atlaskit/linking-types/datasource';

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
		showDatasourceModal: states.cardState?.showDatasourceModal,
		datasourceModalType: states.cardState?.datasourceModalType,
	};
};

const ModalWithState = ({ api, editorView }: ModalWithStateProps) => {
	const cardContext = useSmartLinkContext();
	const { showDatasourceModal, datasourceModalType } = useSharedPluginStateWithSelector(
		api,
		['card'],
		selector,
	);

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

const SafeModalWithState: React.MemoExoticComponent<
	({ api, editorView }: ModalWithStateProps) => React.JSX.Element
> = React.memo(({ api, editorView }: ModalWithStateProps): React.JSX.Element => {
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
