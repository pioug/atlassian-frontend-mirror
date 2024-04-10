import React from 'react';
/* eslint-disable-next-line import/no-extraneous-dependencies */
import {
  EditPage as EditPageCommon,
  type EditPageProps as Props,
} from '@atlassian/embedded-confluence-common';
import { useIntl } from 'react-intl-next';

export type EditPageProps = Omit<Props, 'locale'>;

export const EditPage = (props: EditPageProps) => {
  const { locale } = useIntl();

  return <EditPageCommon locale={locale} {...props} />;
};
