import React from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
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
import type { ConfigModalProps } from '@atlaskit/link-datasource/src/common/types';
import type { DatasourceAdf, InlineCardAdf } from '@atlaskit/linking-common';
import type { DatasourceParameters } from '@atlaskit/linking-types';

import { DatasourceErrorBoundary } from '../../datasourceErrorBoundary';
import type { cardPlugin } from '../../plugin';
import { CardContextProvider } from '../CardContextProvider';

import { DatasourceModal } from './index';

const ModalWithState = ({
	api,
	editorView,
}: {
	api: ExtractInjectionAPI<typeof cardPlugin> | undefined;
	editorView: EditorView;
}) => {
	const { cardState } = useSharedPluginState(api, ['card']);
	if (!cardState) {
		return null;
	}

	const { showDatasourceModal, datasourceModalType } = cardState;
	if (!showDatasourceModal || !datasourceModalType) {
		return null;
	}

	const { datasourceId, componentType } = modalTypeToComponentMap[datasourceModalType];

	return (
		<DatasourceErrorBoundary view={editorView} datasourceModalType={datasourceModalType}>
			<CardContextProvider>
				{({ cardContext }) => (
					<DatasourceModal
						view={editorView}
						cardContext={cardContext}
						datasourceId={datasourceId}
						componentType={componentType}
					/>
				)}
			</CardContextProvider>
		</DatasourceErrorBoundary>
	);
};

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

export default ModalWithState;
