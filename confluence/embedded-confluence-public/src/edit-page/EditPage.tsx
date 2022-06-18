import React from 'react';

/* eslint-disable-next-line import/no-extraneous-dependencies */
import { EditPage as EditPageCommon } from '@atlassian/embedded-confluence-common';
import type { EditPageProps } from '@atlassian/embedded-confluence-common';

import { I18nProvider } from '../page-common/I18nProvider';

export const EditPage: React.FC<EditPageProps> = props => {
  return (
    <I18nProvider locale={props.locale}>
      <EditPageCommon {...props} />;
    </I18nProvider>
  );
};
