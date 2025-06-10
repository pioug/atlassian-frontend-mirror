import React, { useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { withWaitForItem } from '@atlaskit/link-test-helpers';
import {
	defaultInitialVisibleJiraColumnKeys,
	mockBasicFilterAGGFetchRequests,
	mockDatasourceFetchRequests,
} from '@atlaskit/link-test-helpers/datasource';
import {
	type DatasourceAdf,
	type DatasourceAdfTableViewColumn,
	type InlineCardAdf,
} from '@atlaskit/linking-common/types';

import SmartLinkClient from '../examples-helpers/smartLinkCustomClient';
import { JIRA_LIST_OF_LINKS_DATASOURCE_ID, JiraIssuesConfigModal } from '../src';
import { JiraIssuesConfigModalNoSuspense } from '../src/ui/jira-issues-modal/modal';
import {
	type JiraIssueDatasourceParameters,
	type JiraIssuesDatasourceAdf,
} from '../src/ui/jira-issues-modal/types';

mockDatasourceFetchRequests();
mockBasicFilterAGGFetchRequests();

type Props = {
	/**
	 * Used to use the lazy loaded version for examples on atlaskit
	 */
	JiraIssueConfigModalComponent?:
		| typeof JiraIssuesConfigModalNoSuspense
		| typeof JiraIssuesConfigModal;
};

const WithIssueModal = ({
	JiraIssueConfigModalComponent = JiraIssuesConfigModalNoSuspense,
	...props
}: { parameters?: JiraIssueDatasourceParameters } & Props) => {
	const [generatedAdf, setGeneratedAdf] = useState<string>('');
	const [showModal, setShowModal] = useState(true);
	const [parameters, setParameters] = useState<JiraIssueDatasourceParameters | undefined>(
		props?.parameters,
	);
	const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[] | undefined>(
		defaultInitialVisibleJiraColumnKeys,
	);
	const [columnCustomSizes, setColumnCustomSizes] = useState<
		{ [key: string]: number } | undefined
	>();
	const [wrappedColumnKeys, setWrappedColumnKeys] = useState<string[] | undefined>();

	const toggleIsOpen = () => setShowModal((prevOpenState) => !prevOpenState);
	const closeModal = () => setShowModal(false);

	const onInsert = (adf: InlineCardAdf | JiraIssuesDatasourceAdf | DatasourceAdf) => {
		if (adf.type === 'blockCard') {
			setParameters(adf.attrs.datasource.parameters as JiraIssueDatasourceParameters);
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
		<SmartCardProvider client={new SmartLinkClient()}>
			<Button appearance="primary" onClick={toggleIsOpen}>
				Toggle Modal
			</Button>
			<div>Generated ADF:</div>
			<pre>
				{/* eslint-disable-next-line @atlaskit/design-system/no-html-code */}
				<code data-testid="generated-adf">{generatedAdf}</code>
			</pre>
			{showModal && (
				<JiraIssueConfigModalComponent
					datasourceId={JIRA_LIST_OF_LINKS_DATASOURCE_ID}
					visibleColumnKeys={visibleColumnKeys}
					columnCustomSizes={columnCustomSizes}
					wrappedColumnKeys={wrappedColumnKeys}
					parameters={parameters}
					onCancel={closeModal}
					onInsert={onInsert}
				/>
			)}
		</SmartCardProvider>
	);
};

export default () => <Component JiraIssueConfigModalComponent={JiraIssuesConfigModal} />;

const Component = (props: Props) => (
	<IntlProvider locale="en">
		<WithIssueModal {...props} />
	</IntlProvider>
);

export const JiraModalNoSuspense = () => (
	<Component JiraIssueConfigModalComponent={JiraIssuesConfigModalNoSuspense} />
);

export const WithIssueModalWithParameters = (props: Props) => (
	<WithIssueModal
		parameters={{
			cloudId: '67899',
			jql: 'project in ("My IT TEST", Test) and type in ("[System] Change", "[System] Incident") and status in (Authorize, "Awaiting approval") and assignee in (empty, "membersOf(administrators)") ORDER BY created DESC',
		}}
		{...props}
	/>
);

export const WithIssueModalWithParametersInformational = withWaitForItem(
	WithIssueModalWithParameters,
	() => document.body.querySelector('[data-testid="jira-datasource-table"]') !== null,
);
