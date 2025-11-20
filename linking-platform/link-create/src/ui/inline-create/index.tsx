import React, { memo } from 'react';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';

import { PACKAGE_DATA } from '../../common/constants';
import type { LinkCreateProps } from '../../common/types';
import { ErrorBoundary } from '../../common/ui/error-boundary';
import { Experience } from '../../common/ui/experience-tracker';
import { withLinkCreateAnalyticsContext } from '../../common/utils/analytics';
import { fetchMessagesForLocale } from '../../common/utils/locale/fetch-messages-for-locale';
import i18nEN from '../../i18n/en';

import InlineCreate from './main';

const LinkCreateWithAnalyticsContext = withLinkCreateAnalyticsContext(
	memo((props: LinkCreateProps) => {
		return (
			<Experience>
				<ErrorBoundary>
					<InlineCreate {...props} />
				</ErrorBoundary>
			</Experience>
		);
	}),
);

const ComposedLinkCreate = memo((props: LinkCreateProps): React.JSX.Element => {
	return (
		<AnalyticsContext data={PACKAGE_DATA}>
			<IntlMessagesProvider defaultMessages={i18nEN} loaderFn={fetchMessagesForLocale}>
				<LinkCreateWithAnalyticsContext {...props} />
			</IntlMessagesProvider>
		</AnalyticsContext>
	);
});

export default ComposedLinkCreate;
