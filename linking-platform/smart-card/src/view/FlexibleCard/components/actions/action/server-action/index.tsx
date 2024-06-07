import React, { useCallback, useState } from 'react';

import useInvoke from '../../../../../../state/hooks/use-invoke';
import { getInvokeFailureReason } from '../../../../../../state/hooks/use-invoke/utils';
import useResolve from '../../../../../../state/hooks/use-resolve';
import createInvokeRequest from '../../../../../../utils/actions/create-invoke-request';
import Action from '../index';
import type { ServerActionProps } from './types';
import { useFlexibleUiAnalyticsContext } from '../../../../../../state/flexible-ui-context';

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

	const handleClick = useCallback(async () => {
		if (action) {
			const smartLinkActionType = action.action?.actionType;

			try {
				setIsLoading(true);

				analytics?.ui.smartLinkServerActionClickedEvent({
					smartLinkActionType,
				});

				analytics?.track.smartLinkQuickActionStarted({ smartLinkActionType });

				const request = createInvokeRequest(action);
				await invoke(request);

				analytics?.track.smartLinkQuickActionSuccess({ smartLinkActionType });

				if (action.reload && action.reload.url) {
					await reload(action.reload.url, true, undefined, action.reload.id);
				}

				setIsLoading(false);

				if (onClick) {
					onClick();
				}
			} catch (err: any) {
				setIsLoading(false);

				analytics?.track.smartLinkQuickActionFailed({
					smartLinkActionType,
					reason: getInvokeFailureReason(err),
				});

				onErrorCallback?.();
			}
		}
	}, [action, analytics?.track, analytics?.ui, invoke, onClick, onErrorCallback, reload]);

	return <Action {...props} isLoading={isLoading} onClick={handleClick} />;
};

export default ServerAction;
