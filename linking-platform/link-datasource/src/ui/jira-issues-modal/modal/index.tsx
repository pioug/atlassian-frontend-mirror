/** @jsx jsx */
import { useCallback, useEffect, useMemo, useState } from 'react';

import { css, jsx } from '@emotion/react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { InlineCardAdf } from '@atlaskit/linking-common/types';
import { Link } from '@atlaskit/linking-types';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import { B400, N0, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { useDatasourceTableState } from '../../../hooks/useDatasourceTableState';
import {
  getAvailableJiraSites,
  Site,
} from '../../../services/getAvailableJiraSites';
import { ModalLoadingError } from '../../common/error-state/modal-loading-error';
import { NoResults } from '../../common/error-state/no-results';
import { EmptyState, IssueLikeDataTableView } from '../../issue-like-table';
import LinkRenderType from '../../issue-like-table/render-type/link';
import { JiraSearchContainer } from '../jira-search-container';
import { ModeSwitcher } from '../mode-switcher';
import { JiraSiteSelector } from '../site-selector';
import {
  JiraIssueDatasourceParameters,
  JiraIssueDatasourceParametersQuery,
  JiraIssuesConfigModalProps,
  JiraIssuesDatasourceAdf,
  JiraIssueViewModes,
} from '../types';

import { modalMessages } from './messages';

const dropdownContainerStyles = css({
  display: 'flex',
  gap: token('space.100', '0.5rem'),
});

const contentContainerStyles = css({
  display: 'grid',
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

const issueCountStyles = css({
  color: token('color.text.accent.gray', N800),
  flex: 1,
  fontWeight: 600,
});

const smartLinkContainerStyles = css({
  paddingLeft: '1px',
});

export const JiraIssuesConfigModal = (props: JiraIssuesConfigModalProps) => {
  const {
    datasourceId,
    parameters: initialParameters,
    visibleColumnKeys: initialVisibleColumnKeys,
    onCancel,
    onInsert,
  } = props;

  const [availableSites, setAvailableSites] = useState<Site[]>([]);
  const [currentViewMode, setCurrentViewMode] =
    useState<JiraIssueViewModes>('issue');

  const [cloudId, setCloudId] = useState(initialParameters?.cloudId);
  const [jql, setJql] = useState(initialParameters?.jql);

  const isParametersSet = !!(jql && cloudId);

  const parameters = useMemo<JiraIssueDatasourceParameters | undefined>(
    () =>
      !!cloudId
        ? {
            cloudId,
            jql: jql || '',
          }
        : undefined,
    [cloudId, jql],
  );

  const [visibleColumnKeys, setVisibleColumnKeys] = useState(
    initialVisibleColumnKeys,
  );

  const {
    reset,
    status,
    onNextPage,
    responseItems,
    hasNextPage,
    columns,
    defaultVisibleColumnKeys,
    loadDatasourceDetails,
    totalCount,
  } = useDatasourceTableState({
    datasourceId,
    parameters: isParametersSet ? parameters : undefined,
    fieldKeys: visibleColumnKeys,
  });

  const { formatMessage } = useIntl();

  const selectedJiraSite = useMemo<Site | undefined>(
    () =>
      availableSites.find(jiraSite => jiraSite.cloudId === cloudId) ||
      availableSites[0],
    [availableSites, cloudId],
  );

  const resolvedWithNoResults = status === 'resolved' && !responseItems.length;
  const jqlUrl =
    selectedJiraSite &&
    jql &&
    `${selectedJiraSite.url}/issues/?jql=${encodeURI(jql)}`;

  const isDisabled =
    !isParametersSet ||
    status === 'rejected' ||
    status === 'loading' ||
    resolvedWithNoResults;

  const shouldShowIssueCount =
    !!totalCount && totalCount !== 1 && currentViewMode === 'issue';

  useEffect(() => {
    const newVisibleColumnKeys =
      !initialVisibleColumnKeys || (initialVisibleColumnKeys || []).length === 0
        ? defaultVisibleColumnKeys
        : initialVisibleColumnKeys;

    setVisibleColumnKeys(newVisibleColumnKeys);
  }, [initialVisibleColumnKeys, defaultVisibleColumnKeys]);

  useEffect(() => {
    const fetchSiteDisplayNames = async () => {
      const jiraSites = await getAvailableJiraSites();
      setAvailableSites(jiraSites);
    };

    void fetchSiteDisplayNames();
  }, []);

  useEffect(() => {
    if (!cloudId && selectedJiraSite) {
      setCloudId(selectedJiraSite.cloudId);
    }
  }, [cloudId, selectedJiraSite]);

  const onSearch = useCallback(
    (newParameters: JiraIssueDatasourceParametersQuery) => {
      setJql(newParameters.jql);
      reset();
    },
    [reset],
  );

  const onSiteSelection = useCallback(
    (site: Site) => {
      setCloudId(site.cloudId);
      reset();
    },
    [reset],
  );

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
          url: jqlUrl,
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
                  columns: visibleColumnKeys?.map(key => ({ key })),
                },
              },
            ],
          },
        },
      } as JiraIssuesDatasourceAdf);
    }
  }, [
    isParametersSet,
    jql,
    jqlUrl,
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
        onLoadDatasourceDetails={loadDatasourceDetails}
        onVisibleColumnKeysChange={setVisibleColumnKeys}
      />
    ),
    [
      columns,
      defaultVisibleColumnKeys,
      hasNextPage,
      loadDatasourceDetails,
      onNextPage,
      responseItems,
      status,
      visibleColumnKeys,
    ],
  );

  const renderCountModeContent = useCallback(() => {
    const url = selectedJiraSite?.url;
    if (status === 'empty' || !jql || !url) {
      return (
        <div css={smartLinkContainerStyles}>
          <span
            data-testid={`jira-jql-datasource-modal--smart-card-placeholder`}
            css={placeholderSmartLinkStyles}
          >
            <FormattedMessage
              {...modalMessages.issuesCountSmartCardPlaceholderText}
            />
          </span>
        </div>
      );
    } else {
      const urlWithEncodedJql = `${url}/issues/?jql=${encodeURI(jql)}`;
      return (
        <div css={smartLinkContainerStyles}>
          <LinkRenderType url={urlWithEncodedJql} />
        </div>
      );
    }
  }, [jql, selectedJiraSite?.url, status]);

  const renderIssuesModeContent = useCallback(() => {
    if (status === 'rejected' && jqlUrl) {
      return <ModalLoadingError url={jqlUrl} />;
    } else if (resolvedWithNoResults) {
      return <NoResults />;
      // persist the empty state when making the initial /data request which contains the columns
    } else if (status === 'empty' || !columns.length) {
      return <EmptyState testId={`jira-jql-datasource-modal--empty-state`} />;
    }

    const firstIssueUrl = retrieveUrlForSmartCardRender();
    if (responseItems.length === 1 && firstIssueUrl) {
      return (
        <div css={smartLinkContainerStyles}>
          <LinkRenderType url={firstIssueUrl} />
        </div>
      );
    }

    return issueLikeDataTableView;
  }, [
    status,
    columns.length,
    resolvedWithNoResults,
    jqlUrl,
    retrieveUrlForSmartCardRender,
    responseItems.length,
    issueLikeDataTableView,
  ]);

  return (
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
          <JiraSearchContainer
            isSearching={status === 'loading'}
            parameters={parameters}
            onSearch={onSearch}
          />
          <div css={contentContainerStyles}>
            {currentViewMode === 'count'
              ? renderCountModeContent()
              : renderIssuesModeContent()}
          </div>
        </ModalBody>
        <ModalFooter>
          {shouldShowIssueCount && (
            <div
              data-testid="jira-jql-datasource-modal-total-issues-count"
              css={issueCountStyles}
            >
              <FormattedNumber value={totalCount} />{' '}
              <FormattedMessage
                {...modalMessages.issueText}
                values={{ totalCount }}
              />
            </div>
          )}
          <Button appearance="default" onClick={onCancel}>
            <FormattedMessage {...modalMessages.cancelButtonText} />
          </Button>
          <Button
            appearance="primary"
            onClick={onInsertPressed}
            isDisabled={isDisabled}
            testId={'jira-jql-datasource-modal--insert-button'}
          >
            <FormattedMessage {...modalMessages.insertIssuesButtonText} />
          </Button>
        </ModalFooter>
      </Modal>
    </ModalTransition>
  );
};
