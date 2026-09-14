import { useMemo } from 'react';

import { createActionsHook } from 'react-sweet-state';

import { useDatasourceClientExtension } from '@atlaskit/link-client-extension/use-data-source-client-extension';
import type { ActionsDiscoveryRequest } from '@atlaskit/linking-types/datasource-actions';

import {
	type DatasourceOperationFailedAttributesType,
	type EventKey,
} from '../../analytics/generated/analytics.types';
import type createEventPayload from '../../analytics/generated/create-event-payload';

import { ActionsStore } from './index';

type AnalyticsCaptureError = (
	errorLocation: DatasourceOperationFailedAttributesType['errorLocation'],
	error: unknown,
) => void;

type AnalyticsFireEvent = <K extends EventKey>(
	...params: Parameters<typeof createEventPayload<K>>
) => void;

interface UseDiscoverActionsProps {
	captureError: AnalyticsCaptureError;
	fireEvent: AnalyticsFireEvent;
}

const useActionStoreActions = createActionsHook(ActionsStore);

export const useDiscoverActions = ({
	captureError,
	fireEvent,
}: UseDiscoverActionsProps): {
	discoverActions: (request: ActionsDiscoveryRequest) => void | Promise<void>;
} => {
	const { getDatasourceActionsAndPermissions } = useDatasourceClientExtension();
	const { discoverActions } = useActionStoreActions();

	return {
		discoverActions: useMemo(
			() =>
				discoverActions.bind(null, captureError, fireEvent, { getDatasourceActionsAndPermissions }),
			[captureError, discoverActions, fireEvent, getDatasourceActionsAndPermissions],
		),
	};
};
