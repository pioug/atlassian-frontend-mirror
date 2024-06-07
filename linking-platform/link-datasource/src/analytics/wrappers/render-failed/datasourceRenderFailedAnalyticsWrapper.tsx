import { useEffect } from 'react';

import { withAnalyticsContext } from '@atlaskit/analytics-next';

import { logToSentry } from '../../../hooks/useErrorLogger';
import { componentMetadata } from '../../constants';
import { useDatasourceAnalyticsEvents } from '../../index';

const DatasourceRenderFailedAnalyticsWrapper = withAnalyticsContext(componentMetadata.generic)((
	props: any,
) => {
	const { fireEvent } = useDatasourceAnalyticsEvents();

	useEffect(() => {
		fireEvent('operational.datasource.renderFailure', {
			reason: 'internal',
		});
	}, [fireEvent]);

	useEffect(() => {
		logToSentry(props.error, 'link-datasource', {
			...(props.datasourceId && {
				datasourceId: props.datasourceId,
			}),
			...(props.datasourceModalType && {
				datasourceModalType: props.datasourceModalType,
			}),
		});
	}, [props.error, props.datasourceId, props.datasourceModalType]);

	return props.children;
});

export default DatasourceRenderFailedAnalyticsWrapper;
