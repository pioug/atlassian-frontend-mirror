import React from 'react';

import { useIntl } from 'react-intl';

/* eslint-disable-next-line import/no-extraneous-dependencies */
import {
	EditPage as EditPageCommon,
	type EditPageProps as Props,
} from '@atlassian/embedded-confluence-common/edit-page';

export type EditPageProps = Omit<Props, 'locale'>;

export const EditPage = (props: EditPageProps): React.JSX.Element => {
	const { locale } = useIntl();

	return <EditPageCommon locale={locale} {...props} />;
};
