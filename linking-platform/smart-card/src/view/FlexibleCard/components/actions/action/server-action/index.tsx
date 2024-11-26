import React, { useCallback, useState } from 'react';

import { useAnalyticsEvents } from '../../../../../../common/analytics/generated/use-analytics-events';
import { useFlexibleUiAnalyticsContext } from '../../../../../../state/flexible-ui-context';
import useInvoke from '../../../../../../state/hooks/use-invoke';
import { getInvokeFailureReason } from '../../../../../../state/hooks/use-invoke/utils';
import useResolve from '../../../../../../state/hooks/use-resolve';
import createInvokeRequest from '../../../../../../utils/actions/create-invoke-request';
import Action from '../index';

import type { ServerActionProps } from './types';

const ServerAction = ({
	action,
	onClick,
	onError: onErrorCallback,
	...props
}: ServerActionProps) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const analytics = useFlexibleUiAnalyticsContext();
	const invoke = useInvoke();
	const reload = useResolve();
	const { fireEvent } = useAnalyticsEvents();

	const handleClick = useCallback(async () => {
		if (action) {
			const smartLinkActionType = action.action?.actionType;

			try {
				setIsLoading(true);
				analytics?.ui.smartLinkServerActionClickedEvent({
					smartLinkActionType,
				});
				fireEvent('track.smartLinkQuickAction.started', {
					smartLinkActionType,
				});
				const request = createInvokeRequest(action);
				await invoke(request);
				fireEvent('track.smartLinkQuickAction.success', {
					smartLinkActionType,
				});
				if (action.reload && action.reload.url) {
					await reload(action.reload.url, true, undefined, action.reload.id);
				}
				setIsLoading(false);
				if (onClick) {
					onClick();
				}
			} catch (err: any) {
				setIsLoading(false);
				fireEvent('track.smartLinkQuickAction.failed', {
					smartLinkActionType,
					reason: getInvokeFailureReason(err),
				});
				onErrorCallback?.();
			}
		}
	}, [action, analytics?.ui, invoke, onClick, onErrorCallback, reload, fireEvent]);

	return <Action {...props} isLoading={isLoading} onClick={handleClick} />;
};

export default ServerAction;
