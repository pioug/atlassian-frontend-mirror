/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { IntlShape } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	type EditorAnalyticsAPI,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { cardMessages as messages } from '@atlaskit/editor-common/messages';
import { type Command } from '@atlaskit/editor-common/types';
import {
	FloatingToolbarButton as Button,
	FloatingToolbarSeparator as Separator,
	SmallerEditIcon,
} from '@atlaskit/editor-common/ui';
import { getDatasourceType } from '@atlaskit/editor-common/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { CardContext } from '@atlaskit/link-provider';
import { Flex } from '@atlaskit/primitives';

import { showDatasourceModal } from '../pm-plugins/actions';
import { type CardType } from '../types';
import { focusEditorView, isDatasourceConfigEditable } from '../utils';

import { CardContextProvider } from './CardContextProvider';
import { useFetchDatasourceInfo } from './useFetchDatasourceInfo';

export interface EditDatasourceButtonProps {
	datasourceId?: string;
	intl: IntlShape;
	editorAnalyticsApi?: EditorAnalyticsAPI;
	url?: string;
	editorView?: EditorView;
	cardContext?: CardContext;
	currentAppearance?: CardType;
}

const buttonStyles = css({
	pointerEvents: 'auto',
});

// Edit button in toolbar to open datasource modal. This button is shown for inline, block, and embed cards
// if they can resolve into a datasource.
const EditDatasourceButtonWithCardContext = ({
	cardContext,
	datasourceId: datasourceIdFromAdf,
	intl,
	editorAnalyticsApi,
	url,
	editorView,
	currentAppearance,
}: EditDatasourceButtonProps) => {
	const { datasourceId: datasourceIdFromUrl, extensionKey } = useFetchDatasourceInfo({
		isRegularCardNode: true,
		url,
		cardContext,
	});

	const datasourceId = datasourceIdFromUrl ?? datasourceIdFromAdf;

	const onEditDatasource = useCallback(() => {
		if (editorView && datasourceId) {
			editDatasource(
				datasourceId,
				editorAnalyticsApi,
				currentAppearance,
				extensionKey,
			)(editorView.state, editorView.dispatch);
			focusEditorView(editorView);
		}
	}, [currentAppearance, datasourceId, editorAnalyticsApi, editorView, extensionKey]);

	if (!datasourceId || !isDatasourceConfigEditable(datasourceId)) {
		return null;
	}

	if (url) {
		const urlState = cardContext?.store?.getState()[url];
		if (urlState?.error?.kind === 'fatal') {
			return null;
		}
	}

	return (
		<Flex>
			<Button
				css={buttonStyles}
				title={intl.formatMessage(messages.datasourceTitle)}
				icon={<SmallerEditIcon />}
				selected={false}
				onClick={onEditDatasource}
				testId={'card-edit-datasource-button'}
			/>
			<Separator />
		</Flex>
	);
};

export const EditDatasourceButton = ({
	datasourceId,
	intl,
	editorAnalyticsApi,
	url,
	editorView,
	currentAppearance,
}: EditDatasourceButtonProps) => {
	return (
		<CardContextProvider>
			{({ cardContext }) => (
				<EditDatasourceButtonWithCardContext
					datasourceId={datasourceId}
					url={url}
					intl={intl}
					editorAnalyticsApi={editorAnalyticsApi}
					editorView={editorView}
					cardContext={cardContext}
					currentAppearance={currentAppearance}
				/>
			)}
		</CardContextProvider>
	);
};

export const editDatasource =
	(
		datasourceId: string,
		editorAnalyticsApi?: EditorAnalyticsAPI,
		appearance?: CardType,
		extensionKey?: string,
	): Command =>
	(state, dispatch) => {
		const datasourceType = getDatasourceType(datasourceId);
		if (dispatch && datasourceType) {
			const { tr } = state;
			showDatasourceModal(datasourceType)(tr);
			editorAnalyticsApi?.attachAnalyticsEvent({
				action: ACTION.CLICKED,
				actionSubject: ACTION_SUBJECT.BUTTON,
				actionSubjectId: ACTION_SUBJECT_ID.EDIT_DATASOURCE,
				eventType: EVENT_TYPE.UI,
				attributes: {
					extensionKey,
					appearance,
				},
			})(tr);
			dispatch(tr);
			return true;
		}
		return false;
	};
