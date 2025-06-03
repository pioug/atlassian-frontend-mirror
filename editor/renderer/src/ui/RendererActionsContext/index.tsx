import React, { type PropsWithChildren, useMemo } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import { EVENT_TYPE } from '@atlaskit/editor-common/analytics';

import RendererActions from '../../actions/index';

export const RendererContext = React.createContext(new RendererActions());

type RendererActionsContextProps = PropsWithChildren<{
	context?: RendererActions;
}>;

export function RendererActionsContext({ children, context }: RendererActionsContextProps) {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const actions = useMemo(() => new RendererActions(true), []);

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
		<RendererContext.Provider value={context || actions}>
			{fg('confluence_frontend_fix_view_page_slo') ? React.Children.only(children) : children}
		</RendererContext.Provider>
	);
}

export const RendererActionsContextConsumer = RendererContext.Consumer;
