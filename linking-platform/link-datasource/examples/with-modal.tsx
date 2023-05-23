import React, { useCallback, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { CodeBlock } from '@atlaskit/code';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';
import { InlineCardAdf } from '@atlaskit/linking-common';
import { DatasourceAdf } from '@atlaskit/linking-common/types';

import SmartLinkClient from '../examples-helpers/smartLinkCustomClient';
import {
  JIRA_LIST_OF_LINKS_DATASOURCE_ID,
  JiraIssuesConfigModal,
} from '../src';
import { JiraIssueDatasourceParameters } from '../src/ui/jira-issues-modal/types';

mockDatasourceFetchRequests();

export default () => {
  const [generatedAdf, setGeneratedAdf] = useState<string>('');
  const [showModal, setShowModal] = useState(true);
  const [parameters, setParameters] = useState<
    JiraIssueDatasourceParameters | undefined
  >(undefined);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<
    string[] | undefined
  >(undefined);
  const toggleIsOpen = () => setShowModal(prevOpenState => !prevOpenState);
  const closeModal = () => setShowModal(false);

  const onUpdateParameters = useCallback(
    (newParameterParts: Partial<JiraIssueDatasourceParameters>) => {
      const newParameters: JiraIssueDatasourceParameters = {
        ...(parameters || {
          cloudId: '',
          jql: '',
        }),
      };
      if (newParameterParts.cloudId) {
        newParameters.cloudId = newParameterParts.cloudId;
      }
      if (newParameterParts.jql) {
        newParameters.jql = newParameterParts.jql;
      }
      if (newParameterParts.filter) {
        newParameters.filter = newParameterParts.filter;
      }
      setParameters(newParameters);
    },
    [parameters],
  );

  const onInsert = (adf: InlineCardAdf | DatasourceAdf) => {
    console.log({ adf });
    setGeneratedAdf(JSON.stringify(adf, null, 2));
    closeModal();
  };

  return (
    <IntlProvider locale="en">
      <SmartCardProvider client={new SmartLinkClient()}>
        <Button appearance="primary" onClick={toggleIsOpen}>
          Toggle Modal
        </Button>
        {generatedAdf ? (
          <CodeBlock
            text={generatedAdf}
            language={'JSON'}
            testId={'generated-adf'}
          />
        ) : null}
        {showModal && (
          <JiraIssuesConfigModal
            datasourceId={JIRA_LIST_OF_LINKS_DATASOURCE_ID}
            visibleColumnKeys={visibleColumnKeys}
            parameters={parameters}
            onVisibleColumnKeysChange={setVisibleColumnKeys}
            onUpdateParameters={onUpdateParameters}
            onCancel={closeModal}
            onInsert={onInsert}
          />
        )}
      </SmartCardProvider>
    </IntlProvider>
  );
};
