import React from 'react';
/* eslint-disable-next-line import/no-extraneous-dependencies */
import {
  Page as PageCommon,
  type PageProps as Props,
  type EditPageProps,
  type ViewPageProps,
} from '@atlassian/embedded-confluence-common';
import { useIntl } from 'react-intl-next';

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

export type PageProps = Omit<
  Props,
  'viewComponent' | 'editComponent' | 'locale'
>;

export const Page = (props: PageProps) => {
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
