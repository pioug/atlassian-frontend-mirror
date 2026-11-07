import React from 'react';

import IntlMessagesProvider from '@atlaskit/intl-messages-provider/main';

import { fetchMessagesForLocale } from '../../../common/utils/locale/fetch-messages-for-locale';
import i18nEN from '../../../i18n/en';
import { JiraSearchContainer as SearchContainer, type SearchContainerProps } from './index';

/** Embedded consumers need the same translated search controls as the configuration modal. */
export const JiraSearchContainer = (props: SearchContainerProps): React.JSX.Element => (
	<IntlMessagesProvider defaultMessages={i18nEN} loaderFn={fetchMessagesForLocale}>
		<SearchContainer {...props} />
	</IntlMessagesProvider>
);
