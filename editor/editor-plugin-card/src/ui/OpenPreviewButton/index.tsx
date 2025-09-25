import React from 'react';

import { type IntlShape } from 'react-intl-next';

import {
	ACTION,
	type EditorAnalyticsAPI,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { linkMessages } from '@atlaskit/editor-common/messages';
import { FloatingToolbarButton as Button } from '@atlaskit/editor-common/ui';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import PanelRightIcon from '@atlaskit/icon/core/panel-right';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import { Inline, Box, Flex } from '@atlaskit/primitives/compiled';
import { getObjectAri, getObjectIconUrl, getObjectName } from '@atlaskit/smart-card';

import { getResolvedAttributesFromStore } from '../../pm-plugins/utils';
import { appearanceForLink } from '../analytics/utils';

type OpenPreviewPanelToolbarButtonProps = {
	areAnyNewToolbarFlagsEnabled: boolean;
	editorAnalyticsApi?: EditorAnalyticsAPI;
	editorView?: EditorView;
	intl: IntlShape;
	node: PMNode;
};

export const OpenPreviewPanelToolbarButton = ({
	node,
	intl,
	areAnyNewToolbarFlagsEnabled,
	editorAnalyticsApi,
	editorView,
}: OpenPreviewPanelToolbarButtonProps) => {
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

		const icon = areAnyNewToolbarFlagsEnabled ? (
			<PanelRightIcon label="" spacing="spacious" />
		) : (
			// This is a hack required for Jira until areToolbarFlagsEnabled are enabled to ensure the icon has padding
			// Padding is removed when areToolbarFlagsEnabled for a button with icon only in platform/packages/editor/editor-common/src/ui/FloatingToolbar/Button.tsx
			<Inline as="span" space="space.050" alignBlock="center">
				<Box as="span" aria-hidden role="presentation" />
				<PanelRightIcon label="" spacing="spacious" />
				<Box as="span" aria-hidden role="presentation" />
			</Inline>
		);

		if (openPreviewPanel && isPanelAvailable) {
			return (
				<Flex gap="space.050">
					<Button
						testId="open-preview-panel-floating-toolbar-button"
						onClick={handleOpenGlancePanelClick}
						icon={icon}
						title={title}
						areAnyNewToolbarFlagsEnabled={areAnyNewToolbarFlagsEnabled}
					/>
				</Flex>
			);
		}
	}

	return null;
};
