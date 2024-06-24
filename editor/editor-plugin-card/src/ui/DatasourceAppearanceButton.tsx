/** @jsx jsx */
import { useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { IntlShape } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { cardMessages as messages } from '@atlaskit/editor-common/messages';
import { FloatingToolbarButton as Button } from '@atlaskit/editor-common/ui';
import { canRenderDatasource } from '@atlaskit/editor-common/utils';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { buildDatasourceAdf } from '@atlaskit/link-datasource';
import type { CardContext } from '@atlaskit/link-provider';
import type { DatasourceAdf } from '@atlaskit/linking-common/types';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Flex } from '@atlaskit/primitives';

import { updateCardViaDatasource } from '../pm-plugins/doc';
import { pluginKey } from '../pm-plugins/plugin-key';
import type { CardPluginState } from '../types';

import { CardContextProvider } from './CardContextProvider';
import { DatasourceIcon } from './DatasourceIcon';
import { useFetchDatasourceInfo } from './useFetchDatasourceInfo';

export interface DatasourceAppearanceButtonProps {
	intl: IntlShape;
	editorAnalyticsApi?: EditorAnalyticsAPI;
	url: string;
	editorView?: EditorView;
	editorState: EditorState;
	cardContext?: CardContext;
	selected?: boolean;
	inputMethod: string;
}

const buttonStyles = css({
	pointerEvents: 'auto',
});

const DatasourceAppearanceButtonWithCardContext = ({
	cardContext,
	intl,
	url,
	editorView,
	editorState,
	selected,
	inputMethod,
}: DatasourceAppearanceButtonProps) => {
	const { datasourceId, parameters } = useFetchDatasourceInfo({
		isRegularCardNode: true,
		url,
		cardContext,
	});

	const onChangeAppearance = useCallback(() => {
		if (!editorView || !datasourceId || !parameters) {
			return;
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
		if (getBooleanFF('platform.linking-platform.enable-datasource-appearance-toolbar')) {
			// Check if the selection contains a link mark
			const $pos = editorState.doc.resolve(selection.from);
			const isLinkMark = $pos.marks().some((mark) => mark.type === editorState.schema.marks.link);

			// When selection is a TextNode and a link Mark is present return that node
			if (selection instanceof NodeSelection) {
				existingNode = selection.node;
			} else if (isLinkMark) {
				existingNode = editorState.doc.nodeAt(selection.from) ?? undefined;
			}
		} else {
			existingNode = selection instanceof NodeSelection ? selection.node : undefined;
		}

		if (existingNode) {
			updateCardViaDatasource({
				state: editorState,
				node: existingNode,
				newAdf,
				view: editorView,
				sourceEvent: undefined,
				isDeletingConfig: true,
				inputMethod,
			});
		}
	}, [parameters, datasourceId, inputMethod, editorState, editorView, url]);

	if (!parameters || !datasourceId || !canRenderDatasource(datasourceId)) {
		return null;
	}

	if (url) {
		const urlState = cardContext?.store?.getState()[url];
		if (urlState?.error?.kind === 'fatal') {
			return null;
		}
	}

	const buttonLabel = intl.formatMessage(messages.datasourceAppearanceTitle);

	return (
		<Flex>
			<Button
				css={buttonStyles}
				title={buttonLabel}
				icon={<DatasourceIcon label={buttonLabel} />}
				selected={selected}
				onClick={onChangeAppearance}
				testId={'card-datasource-appearance-button'}
			/>
		</Flex>
	);
};

export const DatasourceAppearanceButton = ({
	intl,
	editorAnalyticsApi,
	url,
	editorView,
	editorState,
	selected,
	inputMethod,
}: DatasourceAppearanceButtonProps) => {
	return (
		<CardContextProvider>
			{({ cardContext }) => (
				<DatasourceAppearanceButtonWithCardContext
					url={url}
					intl={intl}
					editorAnalyticsApi={editorAnalyticsApi}
					editorView={editorView}
					editorState={editorState}
					cardContext={cardContext}
					selected={selected}
					inputMethod={inputMethod}
				/>
			)}
		</CardContextProvider>
	);
};
