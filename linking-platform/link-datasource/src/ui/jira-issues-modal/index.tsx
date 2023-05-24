/** @jsx jsx */
import { useCallback, useEffect, useMemo, useState } from 'react';

import { css, jsx } from '@emotion/react';
import { FormattedMessage, IntlProvider, useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { DatasourceAdf, InlineCardAdf } from '@atlaskit/linking-common/types';
import { Link } from '@atlaskit/linking-types';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import { B400, N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { useDatasourceTableState } from '../../hooks/useDatasourceTableState';
import {
  getAvailableJiraSites,
  Site,
} from '../../services/getAvailableJiraSites';
import { EmptyState, IssueLikeDataTableView } from '../issue-like-table';
import LinkRenderType from '../issue-like-table/render-type/link';

import { JiraSearchContainer } from './jira-search-container';
import { modalMessages } from './messages';
import { ModeSwitcher } from './mode-switcher';
import { JiraSiteSelector } from './site-selector';
import {
  JiraIssueDatasourceParameters,
  JiraIssueDatasourceParametersQuery,
  JiraIssueViewModes,
} from './types';

const dropdownContainerStyles = css({
  display: 'flex',
  gap: token('space.100', '0.5rem'),
});

const contentContainerStyles = css({
  height: '420px',
  overflow: 'auto',
});

const placeholderSmartLinkStyles = css({
  backgroundColor: token('elevation.surface.raised', N0),
  borderRadius: '3px',
  boxShadow:
    '0px 1px 1px rgba(9, 30, 66, 0.25), 0px 0px 1px rgba(9, 30, 66, 0.31)',
  color: token('color.text.brand', B400),
  padding: '0px 2px',
});

export const JIRA_LIST_OF_LINKS_DATASOURCE_ID =
  'd8b75300-dfda-4519-b6cd-e49abbd50401';

export interface JiraIssuesConfigModalProps {
  datasourceId: string;
  onVisibleColumnKeysChange: (visibleColumnKeys: string[]) => void;
  visibleColumnKeys?: string[];

  parameters?: JiraIssueDatasourceParameters;
  onUpdateParameters: (
    parameters: Partial<JiraIssueDatasourceParameters>,
  ) => void;
  onCancel: () => void;
  // TODO: Add `| DatatypeCardAdf` once it is available in linking-common
  // https://product-fabric.atlassian.net/browse/EDM-5733
  onInsert: (adf: InlineCardAdf | DatasourceAdf) => void;
}

export const JiraIssuesConfigModal = (props: JiraIssuesConfigModalProps) => {
  const [availableSites, setAvailableSites] = useState<Site[]>([]);
  const [currentViewMode, setCurrentViewMode] =
    useState<JiraIssueViewModes>('issue');

  const {
    datasourceId,
    parameters,
    visibleColumnKeys,
    onCancel,
    onInsert,
    onUpdateParameters,
    onVisibleColumnKeysChange,
  } = props;
  const isParametersSet = !!(
    parameters &&
    parameters.jql &&
    parameters.cloudId
  );
  const { cloudId, jql } = parameters || {};

  const {
    reset,
    status,
    onNextPage,
    responseItems,
    hasNextPage,
    columns,
    defaultVisibleColumnKeys,
  } = useDatasourceTableState(datasourceId, parameters);
  const { formatMessage } = useIntl();

  useEffect(() => {
    const fetchSiteDisplayNames = async () => {
      const jiraSites = await getAvailableJiraSites();
      setAvailableSites(jiraSites);
    };

    void fetchSiteDisplayNames();
  }, []);

  const onSearch = useCallback(
    (parameters: JiraIssueDatasourceParametersQuery) => {
      onUpdateParameters(parameters);
      reset();
    },
    [reset, onUpdateParameters],
  );

  const onSiteSelection = useCallback(
    (site: Site) => {
      onUpdateParameters({ cloudId: site.cloudId });
      reset();
    },
    [reset, onUpdateParameters],
  );

  const selectedJiraSite = useMemo<Site | undefined>(
    () =>
      availableSites.find(jiraSite => jiraSite.cloudId === cloudId) ||
      availableSites[0],
    [availableSites, cloudId],
  );

  useEffect(() => {
    if (!cloudId && selectedJiraSite) {
      onUpdateParameters({
        cloudId: selectedJiraSite.cloudId,
      });
    }
  }, [cloudId, onUpdateParameters, selectedJiraSite]);

  useEffect(() => {
    if (
      (visibleColumnKeys || []).length === 0 &&
      defaultVisibleColumnKeys.length > 0
    ) {
      onVisibleColumnKeysChange(defaultVisibleColumnKeys);
    }
  }, [visibleColumnKeys, defaultVisibleColumnKeys, onVisibleColumnKeysChange]);

  const retrieveUrlForSmartCardRender = useCallback(() => {
    const [data] = responseItems;
    // agrement with BE that we will use `key` for rendering smartlink
    return (data?.key?.data as Link)?.url;
  }, [responseItems]);

  const onInsertPressed = useCallback(() => {
    if (!isParametersSet || !jql || !selectedJiraSite) {
      return;
    }

    const firstIssueUrl = retrieveUrlForSmartCardRender();

    if (currentViewMode === 'count') {
      onInsert({
        type: 'inlineCard',
        attrs: {
          url: `${selectedJiraSite.url}/issues/${encodeURI(jql)}`,
        },
      } as InlineCardAdf);
    } else if (responseItems.length === 1 && firstIssueUrl) {
      onInsert({
        type: 'inlineCard',
        attrs: {
          url: firstIssueUrl,
        },
      } as InlineCardAdf);
    } else {
      onInsert({
        type: 'blockCard',
        attrs: {
          datasource: {
            id: datasourceId,
            parameters: {
              cloudId,
              jql, // TODO support non JQL type
            },
            views: [
              {
                type: 'table',
                properties: {
                  columnKeys: visibleColumnKeys,
                },
              },
            ],
          },
        },
      } as DatasourceAdf);
    }
  }, [
    isParametersSet,
    jql,
    selectedJiraSite,
    retrieveUrlForSmartCardRender,
    currentViewMode,
    responseItems.length,
    onInsert,
    datasourceId,
    cloudId,
    visibleColumnKeys,
  ]);

  const handleViewModeChange = (selectedMode: string) => {
    setCurrentViewMode(selectedMode as JiraIssueViewModes);
  };

  useEffect(() => {
    if (status === 'empty' && isParametersSet) {
      void onNextPage();
    }
  }, [status, isParametersSet, onNextPage, reset]);

  const issueLikeDataTableView = useMemo(
    () => (
      <IssueLikeDataTableView
        testId="jira-jql-datasource-table"
        status={status}
        columns={columns}
        items={responseItems}
        hasNextPage={hasNextPage}
        visibleColumnKeys={visibleColumnKeys || defaultVisibleColumnKeys}
        onNextPage={onNextPage}
        onVisibleColumnKeysChange={onVisibleColumnKeysChange}
      />
    ),
    [
      columns,
      defaultVisibleColumnKeys,
      hasNextPage,
      onNextPage,
      onVisibleColumnKeysChange,
      responseItems,
      status,
      visibleColumnKeys,
    ],
  );

  const renderCountModeContent = useCallback(() => {
    const url = selectedJiraSite?.url;
    if (status === 'empty' || !jql || !url) {
      return (
        <span
          data-testid={`jira-jql-datasource-modal--smart-card-placeholder`}
          css={placeholderSmartLinkStyles}
        >
          <FormattedMessage
            {...modalMessages.issuesCountSmartCardPlaceholderText}
          />
        </span>
      );
    } else {
      const urlWithEncodedJql = `${url}/issues/?jql=${encodeURI(jql)}`;
      return <LinkRenderType url={urlWithEncodedJql} />;
    }
  }, [jql, selectedJiraSite?.url, status]);

  const renderIssuesModeContent = useCallback(() => {
    if (status === 'empty' || columns.length === 0) {
      return <EmptyState testId={`jira-jql-datasource-modal--empty-state`} />;
    }

    const firstIssueUrl = retrieveUrlForSmartCardRender();
    if (responseItems.length === 1 && firstIssueUrl) {
      return <LinkRenderType url={firstIssueUrl} />;
    }

    return issueLikeDataTableView;
  }, [
    columns.length,
    issueLikeDataTableView,
    responseItems.length,
    retrieveUrlForSmartCardRender,
    status,
  ]);

  return (
    <IntlProvider locale="en">
      <ModalTransition>
        <Modal
          testId={'jira-jql-datasource-modal'}
          onClose={onCancel}
          width="x-large"
          shouldScrollInViewport={true}
        >
          <ModalHeader>
            <ModalTitle>
              {availableSites.length < 2 ? (
                <FormattedMessage {...modalMessages.insertIssuesTitle} />
              ) : (
                <div css={dropdownContainerStyles}>
                  <FormattedMessage
                    {...modalMessages.insertIssuesTitleManySites}
                    values={{ siteName: selectedJiraSite?.displayName }}
                  />
                  <JiraSiteSelector
                    testId={`jira-jql-datasource-modal--site-selector`}
                    availableSites={availableSites}
                    onSiteSelection={onSiteSelection}
                    selectedJiraSite={selectedJiraSite}
                  />
                </div>
              )}
            </ModalTitle>
            <ModeSwitcher
              isCompact
              options={[
                {
                  label: formatMessage(modalMessages.issueViewModeLabel),
                  value: 'issue' as JiraIssueViewModes,
                },
                {
                  label: formatMessage(modalMessages.countViewModeLabel),
                  value: 'count' as JiraIssueViewModes,
                },
              ]}
              onOptionValueChange={handleViewModeChange}
              selectedOptionValue={currentViewMode}
            />
          </ModalHeader>
          <ModalBody>
            <JiraSearchContainer parameters={parameters} onSearch={onSearch} />
            <div css={contentContainerStyles}>
              {currentViewMode === 'count'
                ? renderCountModeContent()
                : renderIssuesModeContent()}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button appearance="default" onClick={onCancel}>
              <FormattedMessage {...modalMessages.cancelButtonText} />
            </Button>
            <Button
              appearance="primary"
              onClick={onInsertPressed}
              isDisabled={!isParametersSet}
              testId={'jira-jql-datasource-modal--insert-button'}
            >
              <FormattedMessage {...modalMessages.insertIssuesButtonText} />
            </Button>
          </ModalFooter>
        </Modal>
      </ModalTransition>
    </IntlProvider>
  );
};
