import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

import { HoverableContainer } from '../../examples-helpers/hoverableContainer';
import SmartLinkClient from '../../examples-helpers/smartLinkCustomClient';
import { useCommonTableProps } from '../../examples-helpers/useCommonTableProps';
import { DatasourceTableViewWithWrappers as DatasourceTableView } from '../../src/ui/datasource-table-view/DatasourceTableViewWithWrappers';

mockDatasourceFetchRequests();

export default (): React.JSX.Element => {
	const {
		visibleColumnKeys,
		onVisibleColumnKeysChange,
		columnCustomSizes,
		onColumnResize,
		wrappedColumnKeys,
		onWrappedColumnChange,
		onWrappedColumnsChange,
	} = useCommonTableProps({
		defaultColumnCustomSizes: {
			people: 100,
			summary: 200,
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
					onWrappedColumnsChange={onWrappedColumnsChange}
					wrappedColumnKeys={wrappedColumnKeys}
				/>
			</SmartCardProvider>
		</HoverableContainer>
	);
};
