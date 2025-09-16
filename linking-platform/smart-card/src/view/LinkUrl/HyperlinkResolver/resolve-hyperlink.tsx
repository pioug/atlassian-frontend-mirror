import { useEffect, useState } from 'react';

import uuid from 'uuid';

import { useAnalyticsEvents } from '../../../common/analytics/generated/use-analytics-events';
import { useSmartCardActions } from '../../../state/actions';
import { getDefinitionId, getExtensionKey, getResourceType } from '../../../state/helpers';
import { useScheduledRegister } from '../../../state/hooks/use-resolve-hyperlink/useScheduledRegister';
import { useSmartCardState } from '../../../state/store';
import * as measure from '../../../utils/performance';

// Remove on navx-1834-refactor-resolved-hyperlink cleanup
export const ResolveHyperlink = ({ href }: { href: string }) => {
	const [id] = useState(() => uuid() satisfies string);
	const state = useSmartCardState(href);
	const definitionId = getDefinitionId(state.details);
	const extensionKey = getExtensionKey(state.details);
	const resourceType = getResourceType(state.details);

	const { register } = useSmartCardActions(id, href);
	const scheduledRegister = useScheduledRegister(href, register);

	const { fireEvent } = useAnalyticsEvents();

	useEffect(() => {
		scheduledRegister().catch((error) => {
			throw error;
		});
	}, [scheduledRegister]);

	useEffect(() => {
		measure.mark(id, state.status);
		if (state.status !== 'pending' && state.status !== 'resolving') {
			measure.create(id, state.status);

			if (state.status === 'resolved') {
				fireEvent('operational.hyperlink.resolved', {
					definitionId: definitionId ?? null,
					extensionKey: extensionKey ?? null,
					resourceType: resourceType ?? null,
					duration: measure.getMeasure(id, state.status)?.duration ?? null,
				});
			} else if (
				state.error?.type !== 'ResolveUnsupportedError' &&
				state.error?.type !== 'UnsupportedError'
			) {
				fireEvent('operational.hyperlink.unresolved', {
					definitionId: definitionId ?? null,
					extensionKey: extensionKey ?? null,
					resourceType: resourceType ?? null,
					reason: state.status,
					error:
						state.error === undefined
							? null
							: {
									name: state.error.name,
									kind: state.error.kind,
									type: state.error.type,
								},
				});
			}
		}
	}, [id, state.status, state.error, definitionId, extensionKey, resourceType, fireEvent]);

	return null;
};
