import React, { memo } from 'react';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';
import { fg } from '@atlaskit/platform-feature-flags';

import { PACKAGE_DATA } from '../../common/constants';
import { type LinkCreateWithModalProps } from '../../common/types';
import { ErrorBoundary } from '../../common/ui/error-boundary';
import { ErrorBoundaryModal } from '../../common/ui/error-boundary-modal';
import { Experience } from '../../common/ui/experience-tracker';
import { withLinkCreateAnalyticsContext } from '../../common/utils/analytics';
import { fetchMessagesForLocale } from '../../common/utils/locale/fetch-messages-for-locale';
import i18nEN from '../../i18n/en';

import LinkCreate from './main';
import ComposedLinkCreateOld from './old';

const LinkCreateWithAnalyticsContext = withLinkCreateAnalyticsContext(
	memo((props: LinkCreateWithModalProps) => {
		return (
			<Experience>
				<ErrorBoundary
					errorComponent={<ErrorBoundaryModal active={props.active} onClose={props.onCancel} />}
				>
					<LinkCreate {...props} />
				</ErrorBoundary>
			</Experience>
		);
	}),
);

const ComposedLinkCreateNew = memo((props: LinkCreateWithModalProps) => {
	return (
		<AnalyticsContext data={PACKAGE_DATA}>
			<IntlMessagesProvider defaultMessages={i18nEN} loaderFn={fetchMessagesForLocale}>
				<LinkCreateWithAnalyticsContext {...props} />
			</IntlMessagesProvider>
		</AnalyticsContext>
	);
});

const ComposedLinkCreate = memo((props: LinkCreateWithModalProps) => {
	if (fg('platform_bandicoots-link-create-css')) {
		return <ComposedLinkCreateNew {...props} />;
	}
	return <ComposedLinkCreateOld {...props} />;
});

export default ComposedLinkCreate;
