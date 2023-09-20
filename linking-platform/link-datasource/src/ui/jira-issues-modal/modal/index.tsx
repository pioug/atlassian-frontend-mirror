/** @jsx jsx */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl-next';
import { v4 as uuidv4 } from 'uuid';

import {
  UIAnalyticsEvent,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
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
import { B400, N0, N40, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import {
  EVENT_CHANNEL,
  useDatasourceAnalyticsEvents,
} from '../../../analytics';
import { packageMetaData } from '../../../analytics/constants';
import type {
  AnalyticsContextAttributesType,
  AnalyticsContextType,
  PackageMetaDataType,
} from '../../../analytics/generated/analytics.types';
import { DatasourceAction, DatasourceDisplay } from '../../../analytics/types';
import { startUfoExperience } from '../../../analytics/ufoExperiences';
import { useColumnPickerRenderedFailedUfoExperience } from '../../../analytics/ufoExperiences/hooks/useColumnPickerRenderedFailedUfoExperience';
import { useDataRenderedUfoExperience } from '../../../analytics/ufoExperiences/hooks/useDataRenderedUfoExperience';
import { mapSearchMethod } from '../../../analytics/utils';
import type { JiraSearchMethod } from '../../../common/types';
import { useDatasourceTableState } from '../../../hooks/useDatasourceTableState';
import {
  getAvailableJiraSites,
  Site,
} from '../../../services/getAvailableJiraSites';
import { AccessRequired } from '../../common/error-state/access-required';
import { ModalLoadingError } from '../../common/error-state/modal-loading-error';
import { NoResults } from '../../common/error-state/no-results';
import { EmptyState, IssueLikeDataTableView } from '../../issue-like-table';
import LinkRenderType from '../../issue-like-table/render-type/link';
import { InitialStateView } from '../initial-state-view';
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
  maxHeight: '420px',
  overflow: 'auto',
  borderBottom: `2px solid ${token(
    'color.background.accent.gray.subtler',
    N40,
  )}`,
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

const getDisplayValue = (
  currentViewMode: JiraIssueViewModes,
  itemCount: number,
) => {
  if (currentViewMode === 'count') {
    return DatasourceDisplay.DATASOURCE_INLINE;
  }
  return itemCount > 1
    ? DatasourceDisplay.DATASOURCE_TABLE
    : DatasourceDisplay.INLINE;
};

/**
 * This method should be called when one atomic action is performed on columns: adding new item, removing one item, changing items order.
 * The assumption is that since only one action is changed at each time, we don't have to verify the actual contents of the lists.
 */
export const getColumnAction = (
  oldVisibleColumnKeys: string[],
  newVisibleColumnKeys: string[],
): DatasourceAction => {
  const newColumnSize = newVisibleColumnKeys.length;
  const oldColumnSize = oldVisibleColumnKeys.length;

  if (newColumnSize > oldColumnSize) {
    return DatasourceAction.COLUMN_ADDED;
  } else if (newColumnSize < oldColumnSize) {
    return DatasourceAction.COLUMN_REMOVED;
  } else {
    return DatasourceAction.COLUMN_REORDERED;
  }
};

export const PlainJiraIssuesConfigModal = (
  props: JiraIssuesConfigModalProps,
) => {
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
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(
    initialVisibleColumnKeys,
  );

  // analytics related parameters
  const searchCount = useRef(0);
  const userInteractionActions = useRef<Set<DatasourceAction>>(new Set());
  const lastSearchMethodRef = useRef<JiraSearchMethod | null>(null);
  const visibleColumnCount = useRef(visibleColumnKeys?.length || 0);

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

  const isParametersSet = !!(jql && cloudId);

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
    extensionKey = null,
    destinationObjectTypes,
  } = useDatasourceTableState({
    datasourceId,
    parameters: isParametersSet ? parameters : undefined,
    fieldKeys: visibleColumnKeys,
  });

  const { formatMessage } = useIntl();
  const { fireEvent } = useDatasourceAnalyticsEvents();
  const { current: modalRenderInstanceId } = useRef(uuidv4());

  const selectedJiraSite = useMemo<Site>(() => {
    if (cloudId) {
      // if the cloud id we're editing isn't in available sites then user is likely unauthorized for that site
      // TODO: unauthorized to edit flow https://product-fabric.atlassian.net/browse/EDM-7216
      return (
        availableSites.find(jiraSite => jiraSite.cloudId === cloudId) ||
        availableSites[0]
      );
    } else {
      const currentlyLoggedInSiteUrl = window.location.origin;
      return (
        availableSites.find(
          jiraSite => jiraSite.url === currentlyLoggedInSiteUrl,
        ) || availableSites[0]
      );
    }
  }, [availableSites, cloudId]);

  const analyticsPayload = useMemo(() => {
    return {
      extensionKey: extensionKey,
      destinationObjectTypes: destinationObjectTypes,
    };
  }, [destinationObjectTypes, extensionKey]);

  const resolvedWithNoResults = status === 'resolved' && !responseItems.length;
  const jqlUrl =
    selectedJiraSite &&
    jql &&
    `${selectedJiraSite.url}/issues/?jql=${encodeURI(jql)}`;

  const isInsertDisabled =
    !isParametersSet ||
    status === 'rejected' ||
    status === 'unauthorized' ||
    status === 'loading' ||
    resolvedWithNoResults;

  const shouldShowIssueCount =
    !!totalCount && totalCount !== 1 && currentViewMode === 'issue';

  const isDataReady = (visibleColumnKeys || []).length > 0;

  useEffect(() => {
    const shouldStartUfoExperience = status === 'loading';

    if (shouldStartUfoExperience) {
      startUfoExperience(
        {
          name: 'datasource-rendered',
        },
        modalRenderInstanceId,
      );
    }
  }, [modalRenderInstanceId, status]);

  useDataRenderedUfoExperience({
    status,
    experienceId: modalRenderInstanceId,
    itemCount: responseItems.length,
    canBeLink: currentViewMode === 'count',
    extensionKey,
  });

  useEffect(() => {
    fireEvent('screen.datasourceModalDialog.viewed', {});
  }, [fireEvent]);

  useEffect(() => {
    const newVisibleColumnKeys =
      !initialVisibleColumnKeys || (initialVisibleColumnKeys || []).length === 0
        ? defaultVisibleColumnKeys
        : initialVisibleColumnKeys;

    visibleColumnCount.current = newVisibleColumnKeys.length;
    setVisibleColumnKeys(newVisibleColumnKeys);
  }, [initialVisibleColumnKeys, defaultVisibleColumnKeys]);

  useEffect(() => {
    const fetchSiteDisplayNames = async () => {
      const jiraSites = await getAvailableJiraSites();
      setAvailableSites(jiraSites);

      fireEvent('ui.modal.ready.datasource', {
        instancesCount: jiraSites.length,
      });
    };

    void fetchSiteDisplayNames();
  }, [fireEvent]);

  useEffect(() => {
    if (
      selectedJiraSite &&
      (!cloudId || cloudId !== selectedJiraSite.cloudId)
    ) {
      setCloudId(selectedJiraSite.cloudId);
    }
  }, [cloudId, selectedJiraSite]);

  const fireSingleItemViewedEvent = useCallback(() => {
    fireEvent('ui.link.viewed.singleItem', {
      ...analyticsPayload,
      searchMethod: mapSearchMethod(lastSearchMethodRef.current),
    });
  }, [analyticsPayload, fireEvent]);

  const fireCountViewedEvent = useCallback(() => {
    fireEvent('ui.link.viewed.count', {
      ...analyticsPayload,
      searchMethod: mapSearchMethod(lastSearchMethodRef.current),
      totalItemCount: totalCount || 0,
    });
  }, [analyticsPayload, fireEvent, totalCount]);

  const fireTableViewedEvent = useCallback(() => {
    if (isDataReady) {
      fireEvent('ui.table.viewed.datasourceConfigModal', {
        ...analyticsPayload,
        totalItemCount: totalCount || 0,
        searchMethod: mapSearchMethod(lastSearchMethodRef.current),
        displayedColumnCount: visibleColumnCount.current,
      });
    }
  }, [analyticsPayload, fireEvent, totalCount, isDataReady]);

  const fireIssueViewAnalytics = useCallback(() => {
    if (!totalCount) {
      return;
    }

    if (totalCount > 1) {
      fireTableViewedEvent();
    } else if (totalCount === 1) {
      fireSingleItemViewedEvent();
    }
  }, [fireSingleItemViewedEvent, fireTableViewedEvent, totalCount]);

  useEffect(() => {
    const isResolved = status === 'resolved';
    const isIssueViewMode = currentViewMode === 'issue';
    const isCountViewMode = currentViewMode === 'count';

    if (!isResolved) {
      return;
    }

    if (isIssueViewMode) {
      fireIssueViewAnalytics();
    } else if (isCountViewMode) {
      fireCountViewedEvent();
    }
  }, [currentViewMode, status, fireIssueViewAnalytics, fireCountViewedEvent]);

  useColumnPickerRenderedFailedUfoExperience(status, modalRenderInstanceId);

  const onSearch = useCallback(
    (
      newParameters: JiraIssueDatasourceParametersQuery,
      searchMethod: JiraSearchMethod,
    ) => {
      searchCount.current++;
      lastSearchMethodRef.current = searchMethod;

      if (jql !== newParameters.jql) {
        userInteractionActions.current.add(DatasourceAction.QUERY_UPDATED);
      }

      setJql(newParameters.jql);
      reset({ shouldForceRequest: true });
    },
    [jql, reset],
  );

  const onCancelClick = useCallback(
    (e, analyticEvent) => {
      analyticEvent
        .update({
          eventType: 'ui',
          actionSubjectId: 'cancel',
          attributes: {
            ...analyticsPayload,
            searchCount: searchCount.current,
            actions: Array.from(userInteractionActions.current),
          },
        })
        .fire(EVENT_CHANNEL);

      onCancel();
    },
    [analyticsPayload, onCancel],
  );

  const onSiteSelection = useCallback(
    (site: Site) => {
      userInteractionActions.current.add(DatasourceAction.INSTANCE_UPDATED);

      setCloudId(site.cloudId);
      reset({ shouldForceRequest: true });
    },
    [reset],
  );

  const retrieveUrlForSmartCardRender = useCallback(() => {
    const [data] = responseItems;
    // agreement with BE that we will use `key` for rendering smartlink
    return (data?.key?.data as Link)?.url;
  }, [responseItems]);

  const onInsertPressed = useCallback(
    (e: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => {
      if (!isParametersSet || !jql || !selectedJiraSite) {
        return;
      }

      const insertButtonClickedEvent = analyticsEvent.update({
        actionSubjectId: 'insert',
        attributes: {
          ...analyticsPayload,
          totalItemCount: totalCount || 0,
          displayedColumnCount: visibleColumnCount.current,
          display: getDisplayValue(currentViewMode, totalCount || 0),
          searchCount: searchCount.current,
          searchMethod: mapSearchMethod(lastSearchMethodRef.current),
          actions: Array.from(userInteractionActions.current),
        },
        eventType: 'ui',
      });
      const consumerEvent = insertButtonClickedEvent.clone() ?? undefined;
      insertButtonClickedEvent.fire(EVENT_CHANNEL);

      const firstIssueUrl = retrieveUrlForSmartCardRender();

      if (currentViewMode === 'count') {
        onInsert(
          {
            type: 'inlineCard',
            attrs: {
              url: jqlUrl,
            },
          } as InlineCardAdf,
          consumerEvent,
        );
      } else if (responseItems.length === 1 && firstIssueUrl) {
        onInsert(
          {
            type: 'inlineCard',
            attrs: {
              url: firstIssueUrl,
            },
          } as InlineCardAdf,
          consumerEvent,
        );
      } else {
        onInsert(
          {
            type: 'blockCard',
            attrs: {
              url: jqlUrl,
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
          } as JiraIssuesDatasourceAdf,
          consumerEvent,
        );
      }
    },
    [
      isParametersSet,
      jql,
      selectedJiraSite,
      analyticsPayload,
      totalCount,
      visibleColumnKeys,
      currentViewMode,
      retrieveUrlForSmartCardRender,
      responseItems.length,
      onInsert,
      jqlUrl,
      datasourceId,
      cloudId,
    ],
  );

  const handleViewModeChange = (selectedMode: string) => {
    userInteractionActions.current.add(DatasourceAction.DISPLAY_VIEW_CHANGED);
    setCurrentViewMode(selectedMode as JiraIssueViewModes);
  };

  const handleOnNextPage = useCallback(() => {
    userInteractionActions.current.add(DatasourceAction.NEXT_PAGE_SCROLLED);
    onNextPage();
  }, [onNextPage]);

  const handleVisibleColumnKeysChange = useCallback(
    (newVisibleColumnKeys: string[] = []) => {
      const columnAction = getColumnAction(
        visibleColumnKeys || [],
        newVisibleColumnKeys,
      );
      userInteractionActions.current.add(columnAction);
      visibleColumnCount.current = newVisibleColumnKeys.length;

      setVisibleColumnKeys(newVisibleColumnKeys);
    },
    [visibleColumnKeys],
  );

  const issueLikeDataTableView = useMemo(
    () => (
      <div css={contentContainerStyles}>
        <IssueLikeDataTableView
          testId="jira-jql-datasource-table"
          status={status}
          columns={columns}
          items={responseItems}
          hasNextPage={hasNextPage}
          visibleColumnKeys={visibleColumnKeys || defaultVisibleColumnKeys}
          onNextPage={handleOnNextPage}
          onLoadDatasourceDetails={loadDatasourceDetails}
          onVisibleColumnKeysChange={handleVisibleColumnKeysChange}
          parentContainerRenderInstanceId={modalRenderInstanceId}
          extensionKey={extensionKey}
        />
      </div>
    ),
    [
      columns,
      defaultVisibleColumnKeys,
      handleOnNextPage,
      handleVisibleColumnKeysChange,
      hasNextPage,
      loadDatasourceDetails,
      modalRenderInstanceId,
      responseItems,
      status,
      visibleColumnKeys,
      extensionKey,
    ],
  );

  const renderCountModeContent = useCallback(() => {
    const url = selectedJiraSite?.url;
    if (status === 'unauthorized') {
      return <AccessRequired siteName={selectedJiraSite?.displayName} />;
    } else if (status === 'empty' || !jql || !url) {
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
  }, [jql, selectedJiraSite, status]);

  const renderIssuesModeContent = useCallback(() => {
    if (status === 'rejected' && jqlUrl) {
      return <ModalLoadingError url={jqlUrl} />;
    } else if (status === 'unauthorized') {
      return <AccessRequired siteName={selectedJiraSite?.displayName} />;
    } else if (resolvedWithNoResults) {
      return <NoResults />;
    } else if (status === 'empty' || !columns.length) {
      // persist the empty state when making the initial /data request which contains the columns
      return (
        <div css={contentContainerStyles}>
          {!!jql ? (
            <EmptyState
              testId={`jira-jql-datasource-modal--empty-state`}
              isLoading={true}
            />
          ) : (
            <InitialStateView />
          )}
        </div>
      );
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
    jqlUrl,
    resolvedWithNoResults,
    columns.length,
    retrieveUrlForSmartCardRender,
    responseItems.length,
    issueLikeDataTableView,
    selectedJiraSite?.displayName,
    jql,
  ]);

  return (
    <ModalTransition>
      <Modal
        testId={'jira-jql-datasource-modal'}
        onClose={onCancel}
        width="calc(100% - 80px)"
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
          {currentViewMode === 'count'
            ? renderCountModeContent()
            : renderIssuesModeContent()}
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
          <Button appearance="default" onClick={onCancelClick}>
            <FormattedMessage {...modalMessages.cancelButtonText} />
          </Button>
          <Button
            appearance="primary"
            onClick={onInsertPressed}
            isDisabled={isInsertDisabled}
            testId={'jira-jql-datasource-modal--insert-button'}
          >
            <FormattedMessage {...modalMessages.insertIssuesButtonText} />
          </Button>
        </ModalFooter>
      </Modal>
    </ModalTransition>
  );
};

const analyticsContextAttributes: AnalyticsContextAttributesType = {
  dataProvider: 'jira-issues',
};

const analyticsContextData: AnalyticsContextType & PackageMetaDataType = {
  ...packageMetaData,
  source: 'datasourceConfigModal',
};

const contextData = {
  ...analyticsContextData,
  attributes: {
    ...analyticsContextAttributes,
  },
};

export const JiraIssuesConfigModal = withAnalyticsContext(contextData)(
  PlainJiraIssuesConfigModal,
);
