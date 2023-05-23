/** @jsx jsx */
import { useCallback, useMemo, useState } from 'react';

import { css, jsx } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button';
import {
  DatasourceTableView,
  JIRA_LIST_OF_LINKS_DATASOURCE_ID,
  JiraIssuesConfigModal,
} from '@atlaskit/link-datasource';
import {
  CardClient as SmartCardClient,
  SmartCardProvider,
} from '@atlaskit/link-provider';
import { forceBaseUrl } from '@atlaskit/link-test-helpers/datasource';
import { InlineCardAdf } from '@atlaskit/linking-common';
import { DatasourceAdf } from '@atlaskit/linking-common/types';
import { Card } from '@atlaskit/smart-card';

import { JiraIssueDatasourceParameters } from '../src/ui/jira-issues-modal/types';

forceBaseUrl('https://jdog.jira-dev.com');

const tableContainerStyles = css({
  width: '700px',
  height: '400px',
  overflow: 'scroll',
});

export default () => {
  const [generatedAdf, setGeneratedAdf] = useState<
    InlineCardAdf | DatasourceAdf | null
  >(null);
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
    ``;
    setGeneratedAdf(adf);
    closeModal();
  };

  const resultingComponent = useMemo(() => {
    if (!generatedAdf) {
      return null;
    }

    if (generatedAdf.type === 'blockCard') {
      const {
        datasource: { parameters: adfParameters, id, views },
      } = generatedAdf.attrs;
      const adfVisibleColumnKeys: string[] = (views[0]?.properties &&
        ((views[0].properties as any).columnKeys as string[])) || ['id'];
      return (
        <div>
          <div css={tableContainerStyles}>
            In renderer:
            <DatasourceTableView
              datasourceId={id}
              parameters={adfParameters}
              visibleColumnKeys={adfVisibleColumnKeys}
              onVisibleColumnKeysChange={undefined} // readonly
            />
          </div>
          {parameters ? (
            <div css={tableContainerStyles}>
              In Editor:
              <DatasourceTableView
                datasourceId={id}
                parameters={parameters}
                visibleColumnKeys={visibleColumnKeys}
                onVisibleColumnKeysChange={setVisibleColumnKeys}
              />
            </div>
          ) : null}
        </div>
      );
    } else {
      return <Card url={generatedAdf.attrs.url} appearance={'inline'} />;
    }
  }, [generatedAdf, parameters, visibleColumnKeys]);

  return (
    <IntlProvider locale="en">
      <SmartCardProvider client={new SmartCardClient('staging')}>
        <Button appearance="primary" onClick={toggleIsOpen}>
          Toggle Modal
        </Button>
        {resultingComponent}
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
