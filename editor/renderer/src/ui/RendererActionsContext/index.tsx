/* eslint-disable jsdoc/require-jsdoc */

import React, { useMemo } from 'react';
import type { PropsWithChildren } from 'react';

import { FabricChannel } from '@atlaskit/analytics-listeners/types';
import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import { EVENT_TYPE } from '@atlaskit/editor-common/analytics/types/enums';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import RendererActions from '../../actions/index';
import { IncludeLegacyContentAnnotationsContext } from './include-legacy-content-annotations-context';

export const RendererContext: React.Context<RendererActions> = React.createContext(
	new RendererActions(),
);

type RendererActionsContextProps = PropsWithChildren<{
	context?: RendererActions;
	includeLegacyContentAnnotations?: boolean;
}>;

export function RendererActionsContext({
	children,
	context,
	includeLegacyContentAnnotations,
}: RendererActionsContextProps): React.JSX.Element {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const actions = useMemo(() => new RendererActions(true), []);
	const inheritedIncludeLegacyContentAnnotations = React.useContext(
		IncludeLegacyContentAnnotationsContext,
	);
	const shouldIncludeLegacyContentAnnotations =
		includeLegacyContentAnnotations ?? inheritedIncludeLegacyContentAnnotations;

	// Remove this eventually when root cause is assessed
	if (React.Children.count(children) > 1 && fg('confluence_frontend_fix_view_page_slo')) {
		// Send event when we get more than 1 child

		try {
			throw new Error('Too many children');
		} catch (e) {
			const { stack } = e as Error;

			createAnalyticsEvent({
				eventType: EVENT_TYPE.TRACK,
				action: 'rendered',
				actionSubject: 'multipleChildren',
				actionSubjectId: 'rendererActionsContext',
				attributes: {
					numChildren: React.Children.count(children),
					stackTrace: stack,
				},
			}).fire(FabricChannel.editor);
		}
	}

	return (
		<IncludeLegacyContentAnnotationsContext.Provider value={shouldIncludeLegacyContentAnnotations}>
			<RendererContext.Provider value={context || actions}>
				{fg('confluence_frontend_fix_view_page_slo') ? React.Children.only(children) : children}
			</RendererContext.Provider>
		</IncludeLegacyContentAnnotationsContext.Provider>
	);
}

export const RendererActionsContextConsumer: React.Consumer<RendererActions> =
	RendererContext.Consumer;
