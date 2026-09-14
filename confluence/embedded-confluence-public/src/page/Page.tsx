import React from 'react';
/* eslint-disable-next-line import/no-extraneous-dependencies */
import {
	Page as PageCommon,
	type PageProps as Props,
} from '@atlassian/embedded-confluence-common/page';
import type { EditPageProps } from '@atlassian/embedded-confluence-common/edit-page';
import type { ViewPageProps } from '@atlassian/embedded-confluence-common/view-page';
import { useIntl } from 'react-intl';

import { ViewPage } from '../view-page';
import { EditPage } from '../edit-page';

const ViewComponent = (props: Omit<ViewPageProps, 'locale'>) => {
	const { locale } = useIntl();
	return <ViewPage locale={locale} {...props} />;
};

const EditComponent = (props: Omit<EditPageProps, 'locale'>) => {
	const { locale } = useIntl();
	return <EditPage locale={locale} {...props} />;
};

export type PageProps = Omit<Props, 'viewComponent' | 'editComponent' | 'locale'>;

export const Page = (props: PageProps): React.JSX.Element => {
	const { locale } = useIntl();

	return (
		<PageCommon
			locale={locale}
			{...props}
			viewComponent={ViewComponent}
			editComponent={EditComponent}
		/>
	);
};
