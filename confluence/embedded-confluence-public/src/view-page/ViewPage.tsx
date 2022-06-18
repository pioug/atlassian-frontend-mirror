import React from 'react';

/* eslint-disable-next-line import/no-extraneous-dependencies */
import { ViewPage as ViewPageCommon } from '@atlassian/embedded-confluence-common';
import type { ViewPageProps } from '@atlassian/embedded-confluence-common';

import { I18nProvider } from '../page-common/I18nProvider';

export const ViewPage: React.FC<ViewPageProps> = props => {
  return (
    <I18nProvider locale={props.locale}>
      <ViewPageCommon {...props} />
    </I18nProvider>
  );
};
