import type React from 'react';

import { injectIntl } from 'react-intl';

import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';

import { ErrorMessage, type Props } from './errorMessage';
import { withInsetViewer } from './insetViewerContext';

// @ts-ignore: [PIT-1685] Fails in post-office due to backwards incompatibility issue with React 18
const ErroMsg: React.ComponentType<Props & WithAnalyticsEventsProps> = withAnalyticsEvents()(
	withInsetViewer(injectIntl(ErrorMessage)),
);

export default ErroMsg;
