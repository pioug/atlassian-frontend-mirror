import React from 'react';
/* eslint-disable-next-line import/no-extraneous-dependencies */
import {
	ViewPage as ViewPageCommon,
	type ViewPageProps as Props,
} from '@atlassian/embedded-confluence-common';
import { useIntl } from 'react-intl-next';

export type ViewPageProps = Omit<Props, 'locale'>;

export const ViewPage = (props: ViewPageProps): React.JSX.Element => {
	const { locale } = useIntl();

	return <ViewPageCommon locale={locale} {...props} />;
};
