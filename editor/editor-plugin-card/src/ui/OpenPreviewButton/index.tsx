import React from 'react';

import type { IntlShape } from 'react-intl';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics/api';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics/types/enums';
import Button from '@atlaskit/editor-common/FloatingToolbar/Button';
import { linkMessages } from '@atlaskit/editor-common/messages/link';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import PanelRightIcon from '@atlaskit/icon/core/panel-right';
import { extractSmartLinkEmbed } from '@atlaskit/link-extractors/extract-smart-link-embed';
import { useSmartLinkContext } from '@atlaskit/link-provider/use-smart-link-context';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { getObjectAri, getObjectIconUrl, getObjectName } from '@atlaskit/smart-card';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { getResolvedAttributesFromStore } from '../../pm-plugins/utils';
import { appearanceForLink } from '../analytics/utils';

type OpenPreviewPanelToolbarButtonProps = {
	editorAnalyticsApi?: EditorAnalyticsAPI;
	editorView?: EditorView;
	intl: IntlShape;
	node: PMNode;
};

export const OpenPreviewPanelToolbarButton = ({
	node,
	intl,
	editorAnalyticsApi,
	editorView,
}: OpenPreviewPanelToolbarButtonProps): React.JSX.Element | null => {
	const { store, isPreviewPanelAvailable, openPreviewPanel } = useSmartLinkContext();
	const url = node.attrs.url;
	const display = appearanceForLink(node);
	const cardState = store?.getState()[url];

	if (cardState) {
		const ari = getObjectAri(cardState.details);
		const name = getObjectName(cardState.details);
		const iconUrl = getObjectIconUrl(cardState.details);
		const isPanelAvailable = ari && isPreviewPanelAvailable?.({ ari });

		const handleOpenGlancePanelClick = () => {
			if (openPreviewPanel && isPanelAvailable) {
				openPreviewPanel({
					url,
					ari,
					name: name || '',
					iconUrl,
					panelData: {
						embedUrl: expValEquals('platform_hover_card_preview_panel', 'cohort', 'test')
							? extractSmartLinkEmbed(cardState?.details)?.src
							: undefined,
					},
				});
			}
			editorAnalyticsApi?.fireAnalyticsEvent({
				action: ACTION.CLICKED,
				actionSubject: ACTION_SUBJECT.SMART_LINK,
				actionSubjectId: ACTION_SUBJECT_ID.TOOLBAR_PREVIEW,
				attributes: {
					previewType: 'panel',
					...getResolvedAttributesFromStore(url, display, store),
				},
				eventType: EVENT_TYPE.UI,
			});
		};

		const title = intl.formatMessage(linkMessages.openPreviewPanel);

		const icon = <PanelRightIcon label="" spacing="spacious" />;

		if (openPreviewPanel && isPanelAvailable) {
			return (
				<Flex gap="space.050">
					<Button
						testId="open-preview-panel-floating-toolbar-button"
						onClick={handleOpenGlancePanelClick}
						icon={icon}
						title={title}
					/>
				</Flex>
			);
		}
	}

	return null;
};
