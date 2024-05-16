import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { SmartCardProvider } from '@atlaskit/link-provider';
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
import {
  JIRA_LIST_OF_LINKS_DATASOURCE_ID,
  JiraIssuesConfigModal,
} from '../src';
import {
  type JiraIssueDatasourceParameters,
  type JiraIssuesDatasourceAdf,
} from '../src/ui/jira-issues-modal/types';

mockDatasourceFetchRequests();
mockBasicFilterAGGFetchRequests();

const WithIssueModal = (props?: {
  parameters?: JiraIssueDatasourceParameters;
}) => {
  const [generatedAdf, setGeneratedAdf] = useState<string>('');
  const [showModal, setShowModal] = useState(true);
  const [parameters, setParameters] = useState<
    JiraIssueDatasourceParameters | undefined
  >(props?.parameters);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<
    string[] | undefined
  >(defaultInitialVisibleJiraColumnKeys);
  const [columnCustomSizes, setColumnCustomSizes] = useState<
    { [key: string]: number } | undefined
  >();
  const [wrappedColumnKeys, setWrappedColumnKeys] = useState<
    string[] | undefined
  >();

  const toggleIsOpen = () => setShowModal(prevOpenState => !prevOpenState);
  const closeModal = () => setShowModal(false);

  const onInsert = (
    adf: InlineCardAdf | JiraIssuesDatasourceAdf | DatasourceAdf,
  ) => {
    if (adf.type === 'blockCard') {
      setParameters(
        adf.attrs.datasource.parameters as JiraIssueDatasourceParameters,
      );
      const columnsProp = adf.attrs.datasource.views[0]?.properties?.columns;
      setVisibleColumnKeys(columnsProp?.map(c => c.key));
      const columnsWithWidth = columnsProp?.filter(
        (
          c,
        ): c is Omit<DatasourceAdfTableViewColumn, 'width'> &
          Required<Pick<DatasourceAdfTableViewColumn, 'width'>> => !!c.width,
      );

      if (columnsWithWidth) {
        const keyWidthPairs: [string, number][] = columnsWithWidth.map<
          [string, number]
        >(c => [c.key, c.width]);
        setColumnCustomSizes(Object.fromEntries<number>(keyWidthPairs));
      } else {
        setColumnCustomSizes(undefined);
      }

      const wrappedColumnKeys = columnsProp
        ?.filter(c => c.isWrapped)
        .map(c => c.key);
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
        <code data-testid="generated-adf">{generatedAdf}</code>
      </pre>
      {showModal && (
        <JiraIssuesConfigModal
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

export default () => <WithIssueModal />;

export const WithIssueModalWithParameters = () => (
  <WithIssueModal
    parameters={{
      cloudId: '67899',
      jql: 'project in ("My IT TEST", Test) and type in ("[System] Change", "[System] Incident") and status in (Authorize, "Awaiting approval") and assignee in (empty, "membersOf(administrators)") ORDER BY created DESC',
    }}
  />
);
