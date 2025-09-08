import { type IntlShape } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { Command } from '@atlaskit/editor-common/types';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { CardContext } from '@atlaskit/link-provider';

import { type CardType } from '../../types';

export type EditVariant = 'none' | 'edit-link' | 'edit-datasource' | 'edit-dropdown';

export interface EditDatasourceToolbarButtonWithCommonProps {
	areAnyNewToolbarFlagsEnabled: boolean;
	currentAppearance?: CardType;
	editorAnalyticsApi?: EditorAnalyticsAPI;
	editorView?: EditorView;
	intl: IntlShape;
	onLinkEditClick: Command;
}

export interface EditDatasourceToolbarButtonWithUrlProps
	extends EditDatasourceToolbarButtonWithCommonProps {
	cardContext?: CardContext;
	datasourceId?: string;
	url: string;
}

export interface EditDatasourceToolbarButtonWithDatasourceIdProps
	extends EditDatasourceToolbarButtonWithCommonProps {
	datasourceId: string;
	node: Node;
}

export type EditDatasourceToolbarButtonProps = EditDatasourceToolbarButtonWithCommonProps & {
	cardContext?: CardContext;
	datasourceId?: string;
	node?: Node;
	url?: string;
};
