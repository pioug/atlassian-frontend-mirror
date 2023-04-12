import React from 'react';

import {
  EditPageProps,
  Page as PageCommon,
  ViewPageProps,
} from '@atlassian/embedded-confluence-common';

import { ViewPage } from '../view-page/ViewPage';
import { EditPage } from '../edit-page/EditPage';

const viewComponent = (props: ViewPageProps) => <ViewPage {...props} />;
const editComponent = (props: EditPageProps) => <EditPage {...props} />;

export const Page = (
  props: Omit<
    React.ComponentProps<typeof PageCommon>,
    'viewComponent' | 'editComponent'
  >,
) => {
  return (
    <PageCommon
      {...props}
      viewComponent={viewComponent}
      editComponent={editComponent}
    />
  );
};
