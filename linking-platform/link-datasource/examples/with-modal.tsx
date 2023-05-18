import React, { useCallback, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { CodeBlock } from '@atlaskit/code';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';
import { InlineCardAdf } from '@atlaskit/linking-common';
import { DatasourceAdf } from '@atlaskit/linking-common/types';

import SmartLinkClient from '../examples-helpers/smartLinkCustomClient';
import { JiraIssuesConfigModal } from '../src';
import { JiraIssueDatasourceParameters } from '../src/ui/jira-issues/types';

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
    (someParameters: Partial<JiraIssueDatasourceParameters>) => {
      const newParameters: JiraIssueDatasourceParameters = {
        ...(parameters || { cloudId: '', type: 'jql', value: '' }),
        ...someParameters,
      };
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
            datasourceId={'some-datasource-id'}
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
