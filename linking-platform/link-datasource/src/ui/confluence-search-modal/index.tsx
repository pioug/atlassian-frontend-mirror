import React, { lazy, Suspense } from 'react';

import { ConfigModalProps } from '../../common/types';

export const CONFLUENCE_SEARCH_DATASOURCE_ID =
  '768fc736-3af4-4a8f-b27e-203602bff8ca';

const LazyConfluenceSearchConfigModal = lazy(() =>
  import(
    /* webpackChunkName: "@atlaskit-internal_linkdatasource-confluencesearchmodal" */ './modal'
  ).then(module => ({ default: module.ConfluenceSearchConfigModal })),
);

const ConfluenceSearchConfigModalWithWrappers = (props: ConfigModalProps) => {
  return (
    <Suspense
      fallback={
        <div data-testid={'confluence-search-datasource-table-suspense'} />
      }
    >
      <LazyConfluenceSearchConfigModal {...props} />
    </Suspense>
  );
};

export default ConfluenceSearchConfigModalWithWrappers;
