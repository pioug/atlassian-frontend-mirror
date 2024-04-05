import React from 'react';

import {
  EditPageProps,
  Page as PageCommon,
  ViewPageProps,
} from '@atlassian/embedded-confluence-common';

import { ViewPage } from '../view-page/ViewPage';
import { EditPage } from '../edit-page/EditPage';

const ViewComponent = (props: ViewPageProps) => <ViewPage {...props} />;
const EditComponent = (props: EditPageProps) => <EditPage {...props} />;

export type PageProps = Omit<
  React.ComponentProps<typeof PageCommon>,
  'viewComponent' | 'editComponent'
>;

export const Page = (props: PageProps) => (
  <PageCommon
    {...props}
    viewComponent={ViewComponent}
    editComponent={EditComponent}
  />
);
