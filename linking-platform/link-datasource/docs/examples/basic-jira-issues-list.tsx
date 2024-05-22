import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

import { HoverableContainer } from '../../examples-helpers/hoverableContainer';
import SmartLinkClient from '../../examples-helpers/smartLinkCustomClient';
import { useCommonTableProps } from '../../examples-helpers/useCommonTableProps';
import { DatasourceTableView } from '../../src';

mockDatasourceFetchRequests();

export default () => {
  const {
    visibleColumnKeys,
    onVisibleColumnKeysChange,
    columnCustomSizes,
    onColumnResize,
    wrappedColumnKeys,
    onWrappedColumnChange,
  } = useCommonTableProps({
    defaultColumnCustomSizes: {
      people: 100,
    },
  });

  return (
    <HoverableContainer>
      <SmartCardProvider client={new SmartLinkClient()}>
        <DatasourceTableView
          datasourceId={'some-datasource-id'}
          parameters={{ cloudId: 'doc-cloudId' }}
          visibleColumnKeys={visibleColumnKeys}
          onVisibleColumnKeysChange={onVisibleColumnKeysChange}
          columnCustomSizes={columnCustomSizes}
          onColumnResize={onColumnResize}
          onWrappedColumnChange={onWrappedColumnChange}
          wrappedColumnKeys={wrappedColumnKeys}
        />
      </SmartCardProvider>
    </HoverableContainer>
  );
};
