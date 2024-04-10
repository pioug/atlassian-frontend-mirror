import React, { ComponentProps } from 'react';
import { I18nProvider } from '@atlassian/embedded-confluence-common';
import fetchTranslations from '../i18n/fetchTranslations';
import { EditPage as Component } from './EditPage';

export type EditPageProps = ComponentProps<typeof Component> & {
  locale?: string;
};

// Do not place formatMessage / FormattedMessage / useIntl calls here outside of the I18nProvider.
// They will not function correctly due to a lack of I18n context.

export const EditPage = (props: EditPageProps) => (
  <I18nProvider locale={props.locale} fetchTranslations={fetchTranslations}>
    <Component {...props} />
  </I18nProvider>
);
