import React, { useEffect } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import type { CardContext } from '@atlaskit/link-provider';

import { setResolvedToolbarAttributes } from '../pm-plugins/actions';
import { getPluginState } from '../pm-plugins/util/state';
import { getResolvedAttributesFromStore } from '../pm-plugins/utils';

import type { EditorAnalyticsContextProps } from './EditorAnalyticsContext';
import { EditorAnalyticsContext } from './EditorAnalyticsContext';

type ToolbarViewedEventProps = {
	display: string | null;
	url?: string;
};

const areResolvedAttributesEqual = (
	current?: ReturnType<typeof getResolvedAttributesFromStore>,
	next?: ReturnType<typeof getResolvedAttributesFromStore>,
) =>
	current?.displayCategory === next?.displayCategory &&
	current?.extensionKey === next?.extensionKey &&
	current?.status === next?.status &&
	current?.statusDetails === next?.statusDetails;

/**
 * Handles firing the toolbar viewed event
 */
const ToolbarViewedEventBase = ({
	url,
	display,
	cardContext,
	editorView,
}: Required<ToolbarViewedEventProps> & {
	cardContext?: CardContext;
	editorView?: EditorAnalyticsContextProps['editorView'];
}) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const store = cardContext?.store;

	useEffect(() => {
		const resolvedAttributes = getResolvedAttributesFromStore(url, display, store);

		createAnalyticsEvent({
			action: 'viewed',
			actionSubject: 'inlineDialog',
			actionSubjectId: 'editLinkToolbar',
			eventType: 'ui',
			attributes: {
				...resolvedAttributes,
				display,
			},
		}).fire('media');

		if (!editorView) {
			return;
		}

		const currentResolvedAttributes = getPluginState(editorView.state)
			?.resolvedToolbarAttributesByUrl[url];
		if (areResolvedAttributesEqual(currentResolvedAttributes, resolvedAttributes)) {
			return;
		}

		editorView.dispatch(setResolvedToolbarAttributes(url, resolvedAttributes)(editorView.state.tr));
	}, [createAnalyticsEvent, display, editorView, url, store]);

	return null;
};

/**
 * Provides analytics context and card context
 */
export const ToolbarViewedEvent = ({
	url,
	display,
	editorView,
}: ToolbarViewedEventProps & Omit<EditorAnalyticsContextProps, 'children'>): React.JSX.Element => {
	const cardContext = useSmartLinkContext();
	return (
		<EditorAnalyticsContext editorView={editorView}>
			{url ? (
				<ToolbarViewedEventBase
					url={url}
					display={display}
					cardContext={cardContext}
					editorView={editorView}
				/>
			) : null}
		</EditorAnalyticsContext>
	);
};
