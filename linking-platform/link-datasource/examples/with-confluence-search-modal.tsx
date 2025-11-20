import React, { useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { SmartCardProvider } from '@atlaskit/link-provider';
import {
	defaultInitialVisibleConfluenceColumnKeys,
	mockBasicFilterAGGFetchRequests,
	mockDatasourceFetchRequests,
} from '@atlaskit/link-test-helpers/datasource';
import {
	type DatasourceAdfTableViewColumn,
	type InlineCardAdf,
} from '@atlaskit/linking-common/types';

import SmartLinkClient from '../examples-helpers/smartLinkCustomClient';
import { CONFLUENCE_SEARCH_DATASOURCE_ID } from '../src/ui/confluence-search-modal';
import { ConfluenceSearchConfigModal } from '../src/ui/confluence-search-modal/modal';
import {
	type ConfluenceSearchDatasourceAdf,
	type ConfluenceSearchDatasourceParameters,
} from '../src/ui/confluence-search-modal/types';

mockDatasourceFetchRequests({ type: 'confluence' });
mockBasicFilterAGGFetchRequests();

export default (): React.JSX.Element => {
	const [generatedAdf, setGeneratedAdf] = useState<string>('');
	const [showModal, setShowModal] = useState(true);
	const [parameters, setParameters] = useState<ConfluenceSearchDatasourceParameters | undefined>(
		undefined,
	);
	const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[] | undefined>(
		defaultInitialVisibleConfluenceColumnKeys,
	);
	const [columnCustomSizes, setColumnCustomSizes] = useState<
		{ [key: string]: number } | undefined
	>();
	const [wrappedColumnKeys, setWrappedColumnKeys] = useState<string[] | undefined>();

	const toggleIsOpen = () => setShowModal((prevOpenState) => !prevOpenState);
	const closeModal = () => setShowModal(false);

	const onInsert = (adf: InlineCardAdf | ConfluenceSearchDatasourceAdf) => {
		if (adf.type === 'blockCard') {
			setParameters(adf.attrs.datasource.parameters);
			const columnsProp = adf.attrs.datasource.views[0]?.properties?.columns;
			setVisibleColumnKeys(columnsProp?.map((c) => c.key));
			const columnsWithWidth = columnsProp?.filter(
				(
					c,
				): c is Omit<DatasourceAdfTableViewColumn, 'width'> &
					Required<Pick<DatasourceAdfTableViewColumn, 'width'>> => !!c.width,
			);

			if (columnsWithWidth) {
				const keyWidthPairs: [string, number][] = columnsWithWidth.map<[string, number]>((c) => [
					c.key,
					c.width,
				]);
				setColumnCustomSizes(Object.fromEntries<number>(keyWidthPairs));
			} else {
				setColumnCustomSizes(undefined);
			}

			const wrappedColumnKeys = columnsProp?.filter((c) => c.isWrapped).map((c) => c.key);
			setWrappedColumnKeys(wrappedColumnKeys);
		}
		setGeneratedAdf(JSON.stringify(adf, null, 2));
		closeModal();
	};

	return (
		<IntlProvider locale="en">
			<SmartCardProvider client={new SmartLinkClient()}>
				<Button appearance="primary" onClick={toggleIsOpen} testId="example-toggle-modal">
					Toggle Modal
				</Button>
				<div>Generated ADF:</div>
				<pre>
					{/* eslint-disable-next-line @atlaskit/design-system/no-html-code */}
					<code data-testid="generated-adf">{generatedAdf}</code>
				</pre>
				{showModal && (
					<ConfluenceSearchConfigModal
						datasourceId={CONFLUENCE_SEARCH_DATASOURCE_ID}
						visibleColumnKeys={visibleColumnKeys}
						columnCustomSizes={columnCustomSizes}
						wrappedColumnKeys={wrappedColumnKeys}
						parameters={parameters}
						onCancel={closeModal}
						onInsert={onInsert}
					/>
				)}
			</SmartCardProvider>
		</IntlProvider>
	);
};
