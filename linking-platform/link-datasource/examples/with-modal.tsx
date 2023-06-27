import React, { useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { SmartCardProvider } from '@atlaskit/link-provider';
import {
  initialVisibleColumnKeys,
  mockDatasourceFetchRequests,
} from '@atlaskit/link-test-helpers/datasource';
import { InlineCardAdf } from '@atlaskit/linking-common/types';

import SmartLinkClient from '../examples-helpers/smartLinkCustomClient';
import {
  JIRA_LIST_OF_LINKS_DATASOURCE_ID,
  JiraIssuesConfigModal,
} from '../src';
import {
  JiraIssueDatasourceParameters,
  JiraIssuesDatasourceAdf,
} from '../src/ui/jira-issues-modal/types';

mockDatasourceFetchRequests();

export default () => {
  const [generatedAdf, setGeneratedAdf] = useState<string>('');
  const [showModal, setShowModal] = useState(true);
  const [parameters, setParameters] = useState<
    JiraIssueDatasourceParameters | undefined
  >(undefined);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<
    string[] | undefined
  >(initialVisibleColumnKeys);
  const toggleIsOpen = () => setShowModal(prevOpenState => !prevOpenState);
  const closeModal = () => setShowModal(false);

  const onInsert = (adf: InlineCardAdf | JiraIssuesDatasourceAdf) => {
    if (adf.type === 'blockCard') {
      setParameters(adf.attrs.datasource.parameters);
      setVisibleColumnKeys(
        adf.attrs.datasource.views[0].properties?.columns.map(c => c.key),
      );
    }
    setGeneratedAdf(JSON.stringify(adf, null, 2));
    closeModal();
  };

  return (
    <IntlProvider locale="en">
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
            parameters={parameters}
            onCancel={closeModal}
            onInsert={onInsert}
          />
        )}
      </SmartCardProvider>
    </IntlProvider>
  );
};
