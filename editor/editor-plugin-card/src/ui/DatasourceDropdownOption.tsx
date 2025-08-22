import React from 'react';

import type { IntlShape } from 'react-intl-next';

import { cardMessages as messages } from '@atlaskit/editor-common/messages';
import type { Command } from '@atlaskit/editor-common/types';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import SmartLinkListIcon from '@atlaskit/icon/core/smart-link-list';
import { buildDatasourceAdf } from '@atlaskit/link-datasource';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import type { DatasourceAdf } from '@atlaskit/linking-common/types';
import { ButtonItem } from '@atlaskit/menu';

import { updateCardViaDatasource } from '../pm-plugins/doc';
import { pluginKey } from '../pm-plugins/plugin-key';
import type { CardPluginState } from '../types';

import { useFetchDatasourceInfo } from './useFetchDatasourceInfo';

interface Props {
	allowDatasource?: boolean;
	dispatchCommand: (command: Command) => void;
	inputMethod: string;
	intl: IntlShape;
	selected: boolean;
	url: string;
}

export const datasourceDisplayInformation = {
	title: messages.datasourceAppearanceTitle,
	icon: SmartLinkListIcon,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	iconFallback: SmartLinkListIcon,
};

export const DatasourceDropdownOption = ({
	allowDatasource,
	intl,
	url,
	selected,
	inputMethod,
	dispatchCommand,
}: Props) => {
	const cardContext = useSmartLinkContext();

	const { datasourceId, parameters } = useFetchDatasourceInfo({
		isRegularCardNode: true,
		url,
		cardContext,
	});

	if (!allowDatasource || !datasourceId || !parameters) {
		return null;
	}

	const onChangeAppearance: Command = (editorState, _dispatch, view) => {
		if (!view || !datasourceId || !parameters) {
			return false;
		}

		const state = pluginKey.getState(editorState) as CardPluginState | undefined;

		const newAdf: DatasourceAdf = buildDatasourceAdf(
			{
				id: datasourceId,
				parameters,
				views: state?.datasourceStash[url]?.views ?? [{ type: 'table' }],
			},
			url,
		);

		const { selection } = editorState;
		let existingNode: Node | undefined;
		// Check if the selection contains a link mark
		const $pos = editorState.doc.resolve(selection.from);
		const isLinkMark = $pos.marks().some((mark) => mark.type === editorState.schema.marks.link);

		// When selection is a TextNode and a link Mark is present return that node
		if (selection instanceof NodeSelection) {
			existingNode = selection.node;
		} else if (isLinkMark) {
			existingNode = editorState.doc.nodeAt(selection.from) ?? undefined;
		}

		if (existingNode) {
			updateCardViaDatasource({
				state: editorState,
				node: existingNode,
				newAdf,
				view,
				sourceEvent: undefined,
				isDeletingConfig: true,
				inputMethod,
			});
			return true;
		}
		return false;
	};

	if (url) {
		const urlState = cardContext?.store?.getState()[url];
		if (urlState?.error?.kind === 'fatal') {
			return null;
		}
	}

	return (
		<ButtonItem
			key={intl.formatMessage(messages.datasourceAppearanceTitle)}
			iconBefore={SmartLinkListIcon({
				label: intl.formatMessage(messages.datasourceAppearanceTitle),
			})}
			onClick={() => dispatchCommand(onChangeAppearance)}
			isSelected={selected}
		>
			{intl.formatMessage(messages.datasourceAppearanceTitle)}
		</ButtonItem>
	);
};
