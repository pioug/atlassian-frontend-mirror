/** @jsx jsx */
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { css, jsx } from '@emotion/react';
import { FormattedMessage, FormattedNumber } from 'react-intl-next';
import { v4 as uuidv4 } from 'uuid';

import {
  UIAnalyticsEvent,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/standard-button';
import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';
import { InlineCardAdf } from '@atlaskit/linking-common/types';
import { Link } from '@atlaskit/linking-types';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import LinkUrl from '@atlaskit/smart-card/link-url';
import { B400, N0, N40, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import {
  EVENT_CHANNEL,
  useDatasourceAnalyticsEvents,
} from '../../../analytics';
import { componentMetadata } from '../../../analytics/constants';
import type {
  AnalyticsContextAttributesType,
  AnalyticsContextType,
  ComponentMetaDataType,
} from '../../../analytics/generated/analytics.types';
import { DatasourceAction, DatasourceDisplay } from '../../../analytics/types';
import { startUfoExperience } from '../../../analytics/ufoExperiences';
import { useColumnPickerRenderedFailedUfoExperience } from '../../../analytics/ufoExperiences/hooks/useColumnPickerRenderedFailedUfoExperience';
import { useDataRenderedUfoExperience } from '../../../analytics/ufoExperiences/hooks/useDataRenderedUfoExperience';
import { mapSearchMethod } from '../../../analytics/utils';
import type { JiraSearchMethod } from '../../../common/types';
import { buildDatasourceAdf } from '../../../common/utils/adf';
import { fetchMessagesForLocale } from '../../../common/utils/locale/fetch-messages-for-locale';
import {
  onNextPageProps,
  useDatasourceTableState,
} from '../../../hooks/useDatasourceTableState';
import i18nEN from '../../../i18n/en';
import { getAvailableJiraSites } from '../../../services/getAvailableJiraSites';
import { AccessRequired } from '../../common/error-state/access-required';
import { ModalLoadingError } from '../../common/error-state/modal-loading-error';
import { NoInstancesView } from '../../common/error-state/no-instances';
import { NoResults } from '../../common/error-state/no-results';
import {
  EmptyState,
  IssueLikeDataTableView,
  scrollableContainerShadowsCssComponents,
} from '../../issue-like-table';
import LinkRenderType from '../../issue-like-table/render-type/link';
import { ColumnSizesMap } from '../../issue-like-table/types';
import { SelectedOptionsMap } from '../basic-filters/types';
import { availableBasicFilterTypes } from '../basic-filters/ui';
import { isQueryTooComplex } from '../basic-filters/utils/isQueryTooComplex';
import { InitialStateView } from '../initial-state-view';
import { JiraSearchContainer } from '../jira-search-container';
import { JiraSiteSelector } from '../site-selector';
import {
  JiraIssueDatasourceParameters,
  JiraIssueDatasourceParametersQuery,
  JiraIssuesConfigModalProps,
  JiraIssueViewModes,
  Site,
} from '../types';

import { DisplayViewDropDown } from './display-view-dropdown/display-view-drop-down';
import { modalMessages } from './messages';

const dropdownContainerStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: token('space.100', '0.5rem'),
  minHeight: '40px', // to prevent vertical shifting when site selector pops in
});

const tableContainerStyles = css({
  borderTopLeftRadius: token('border.radius.200', '8px'),
  borderTopRightRadius: token('border.radius.200', '8px'),
  border: `1px solid ${token('color.border', N40)}`,
});

const contentContainerStyles = css({
  display: 'grid',
  maxHeight: '420px',
  overflow: 'auto',
  borderBottom: `2px solid ${token(
    'color.background.accent.gray.subtler',
    N40,
  )}`,
  backgroundImage: scrollableContainerShadowsCssComponents.backgroundImage,
  backgroundPosition:
    scrollableContainerShadowsCssComponents.backgroundPosition,
  backgroundRepeat: scrollableContainerShadowsCssComponents.backgroundRepeat,
  backgroundSize: scrollableContainerShadowsCssComponents.backgroundSize,
  backgroundAttachment:
    scrollableContainerShadowsCssComponents.backgroundAttachment,
});

const placeholderSmartLinkStyles = css({
  backgroundColor: token('elevation.surface.raised', N0),
  borderRadius: token('border.radius.200', '3px'),
  boxShadow:
    '0px 1px 1px rgba(9, 30, 66, 0.25), 0px 0px 1px rgba(9, 30, 66, 0.31)',
  color: token('color.text.brand', B400),
  padding: `${token('space.0', '0px')} ${token('space.025', '2px')}`,
});

const issueCountStyles = css({
  flex: 1,
  fontWeight: 600,
});

const smartLinkContainerStyles = css({
  paddingLeft: token('space.025', '2px'),
});

const getDisplayValue = (
  currentViewMode: JiraIssueViewModes,
  itemCount: number,
) => {
  if (currentViewMode === 'issue') {
    return DatasourceDisplay.DATASOURCE_TABLE;
  }
  return itemCount === 1
    ? DatasourceDisplay.INLINE
    : DatasourceDisplay.DATASOURCE_INLINE;
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
    columnCustomSizes: initialColumnCustomSizes,
    onCancel,
    onInsert,
    viewMode = 'issue',
    parameters: initialParameters,
    url: urlBeingEdited,
    visibleColumnKeys: initialVisibleColumnKeys,
  } = props;

  const [availableSites, setAvailableSites] = useState<Site[] | undefined>(
    undefined,
  );
  const [currentViewMode, setCurrentViewMode] =
    useState<JiraIssueViewModes>(viewMode);
  const [cloudId, setCloudId] = useState(initialParameters?.cloudId);
  const [jql, setJql] = useState(initialParameters?.jql);
  const [searchBarJql, setSearchBarJql] = useState<string | undefined>(
    initialParameters?.jql,
  );
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(
    initialVisibleColumnKeys,
  );

  // analytics related parameters
  const searchCount = useRef(0);
  const userInteractionActions = useRef<Set<DatasourceAction>>(new Set());
  const initialSearchMethod: JiraSearchMethod =
    getBooleanFF(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
    ) && !isQueryTooComplex(initialParameters?.jql || '')
      ? 'basic'
      : 'jql';
  const [currentSearchMethod, setCurrentSearchMethod] =
    useState<JiraSearchMethod>(initialSearchMethod);
  const searchMethodSearchedWith = useRef<JiraSearchMethod | null>(null);
  const visibleColumnCount = useRef(visibleColumnKeys?.length || 0);
  const basicFilterSelectionsSearchedWith = useRef<SelectedOptionsMap>({});
  const isSearchedWithComplexQuery = useRef<boolean>(false);

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

  const [columnCustomSizes, setColumnCustomSizes] = useState<
    ColumnSizesMap | undefined
  >(initialColumnCustomSizes);

  const onColumnResize = useCallback(
    (key: string, width: number) => {
      setColumnCustomSizes({ ...columnCustomSizes, [key]: width });
    },
    [columnCustomSizes],
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
    extensionKey = null,
    destinationObjectTypes,
  } = useDatasourceTableState({
    datasourceId,
    parameters: isParametersSet ? parameters : undefined,
    fieldKeys: visibleColumnKeys,
  });

  const { fireEvent } = useDatasourceAnalyticsEvents();
  const { current: modalRenderInstanceId } = useRef(uuidv4());

  const selectedJiraSite = useMemo<Site | undefined>(() => {
    if (cloudId) {
      return availableSites?.find(jiraSite => jiraSite.cloudId === cloudId);
    } else {
      let currentlyLoggedInSiteUrl: string | undefined;
      if (typeof window.location !== 'undefined') {
        currentlyLoggedInSiteUrl = window.location.origin;
      }
      return (
        availableSites?.find(
          jiraSite => jiraSite.url === currentlyLoggedInSiteUrl,
        ) || availableSites?.[0]
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
    status === 'loading';

  const shouldShowIssueCount =
    !!totalCount && totalCount !== 1 && currentViewMode === 'issue';

  const isDataReady = (visibleColumnKeys || []).length > 0;
  const hasNoJiraSites = availableSites && availableSites.length === 0;

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
      const sortedAvailableSites = [...jiraSites].sort((a, b) =>
        a.displayName.localeCompare(b.displayName),
      );
      setAvailableSites(sortedAvailableSites);

      fireEvent('ui.modal.ready.datasource', {
        instancesCount: sortedAvailableSites.length,
        schemasCount: null,
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
      searchMethod: mapSearchMethod(searchMethodSearchedWith.current),
    });
  }, [analyticsPayload, fireEvent]);

  const fireCountViewedEvent = useCallback(() => {
    fireEvent('ui.link.viewed.count', {
      ...analyticsPayload,
      searchMethod: mapSearchMethod(searchMethodSearchedWith.current),
      totalItemCount: totalCount || 0,
    });
  }, [analyticsPayload, fireEvent, totalCount]);

  const fireTableViewedEvent = useCallback(() => {
    if (isDataReady) {
      fireEvent('ui.table.viewed.datasourceConfigModal', {
        ...analyticsPayload,
        totalItemCount: totalCount || 0,
        searchMethod: mapSearchMethod(searchMethodSearchedWith.current),
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
      {
        searchMethod,
        basicFilterSelections,
        isQueryComplex,
      }: {
        searchMethod: JiraSearchMethod;
        basicFilterSelections: SelectedOptionsMap;
        isQueryComplex: boolean;
      },
    ) => {
      searchCount.current++;
      searchMethodSearchedWith.current = searchMethod;
      basicFilterSelectionsSearchedWith.current = basicFilterSelections;
      isSearchedWithComplexQuery.current = isQueryComplex;

      if (jql !== newParameters.jql) {
        userInteractionActions.current.add(DatasourceAction.QUERY_UPDATED);
      }

      setJql(newParameters.jql);
      reset({ shouldForceRequest: true });
    },
    [jql, reset],
  );

  const onCancelClick = useCallback(
    (
      e: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticEvent: UIAnalyticsEvent,
    ) => {
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
      setJql('');
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

      // During insertion, we want the JQL of the datasource to be whatever is in the search bar,
      // even if the user didn't previously click search
      const upToDateJql = searchBarJql ?? jql;
      const upToDateJqlUrl =
        selectedJiraSite &&
        jql &&
        `${selectedJiraSite.url}/issues/?jql=${encodeURI(upToDateJql)}`;

      const filterSelectionCount = availableBasicFilterTypes.reduce(
        (current, filter) => ({
          ...current,
          [`${filter}BasicFilterSelectionCount`]:
            basicFilterSelectionsSearchedWith.current[filter]?.length || 0,
        }),
        {},
      );

      const insertButtonClickedEvent = analyticsEvent.update({
        actionSubjectId: 'insert',
        attributes: {
          ...analyticsPayload,
          totalItemCount: totalCount || 0,
          displayedColumnCount: visibleColumnCount.current,
          display: getDisplayValue(currentViewMode, totalCount || 0),
          searchCount: searchCount.current,
          searchMethod: mapSearchMethod(searchMethodSearchedWith.current),
          actions: Array.from(userInteractionActions.current),
          isQueryComplex: isSearchedWithComplexQuery.current,
          ...(searchMethodSearchedWith.current === 'basic'
            ? { ...filterSelectionCount }
            : {}),
        },
        eventType: 'ui',
      });

      // additional event for tracking in confluence against JIM
      const macroInsertedEvent = analyticsEvent.clone();
      macroInsertedEvent?.update({
        eventType: 'track',
        action: 'inserted',
        actionSubject: 'macro',
        actionSubjectId: 'jlol',
        attributes: {
          ...analyticsPayload,
          totalItemCount: totalCount || 0,
          displayedColumnCount: visibleColumnCount.current,
          display: getDisplayValue(currentViewMode, totalCount || 0),
          searchCount: searchCount.current,
          searchMethod: mapSearchMethod(searchMethodSearchedWith.current),
          actions: Array.from(userInteractionActions.current),
        },
      });

      const consumerEvent = insertButtonClickedEvent.clone() ?? undefined;
      insertButtonClickedEvent.fire(EVENT_CHANNEL);

      const firstIssueUrl = retrieveUrlForSmartCardRender();

      if (currentViewMode === 'count') {
        macroInsertedEvent?.fire(EVENT_CHANNEL);
        const url = responseItems.length === 1 ? firstIssueUrl : upToDateJqlUrl;
        onInsert(
          {
            type: 'inlineCard',
            attrs: {
              url,
            },
          } as InlineCardAdf,
          consumerEvent,
        );
      } else {
        onInsert(
          buildDatasourceAdf<JiraIssueDatasourceParameters>(
            {
              id: datasourceId,
              parameters: {
                cloudId,
                jql: upToDateJql, // TODO support non JQL type
              },
              views: [
                {
                  type: 'table',
                  properties: {
                    columns: (visibleColumnKeys || []).map(key => ({
                      key,
                      width: columnCustomSizes?.[key],
                    })),
                  },
                },
              ],
            },
            upToDateJqlUrl,
          ),
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
      onInsert,
      datasourceId,
      cloudId,
      columnCustomSizes,
      searchBarJql,
      responseItems,
    ],
  );

  const handleViewModeChange = (selectedMode: string) => {
    userInteractionActions.current.add(DatasourceAction.DISPLAY_VIEW_CHANGED);
    setCurrentViewMode(selectedMode as JiraIssueViewModes);
  };

  const handleOnNextPage = useCallback(
    (onNextPageProps: onNextPageProps = {}) => {
      userInteractionActions.current.add(DatasourceAction.NEXT_PAGE_SCROLLED);
      onNextPage(onNextPageProps);
    },
    [onNextPage],
  );

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
      <div css={[tableContainerStyles, contentContainerStyles]}>
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
          columnCustomSizes={columnCustomSizes}
          onColumnResize={onColumnResize}
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
      columnCustomSizes,
      onColumnResize,
    ],
  );

  const renderCountModeContent = useCallback(() => {
    const selectedJiraSiteUrl = selectedJiraSite?.url;
    if (status === 'unauthorized') {
      return <AccessRequired url={selectedJiraSiteUrl || urlBeingEdited} />;
    } else if (status === 'empty' || !jql || !selectedJiraSiteUrl) {
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
      let url;
      if (responseItems.length === 1 && retrieveUrlForSmartCardRender()) {
        url = retrieveUrlForSmartCardRender();
      } else {
        url = `${selectedJiraSiteUrl}/issues/?jql=${encodeURI(jql)}`;
      }

      return (
        <div css={smartLinkContainerStyles}>
          <LinkRenderType url={url} />
        </div>
      );
    }
  }, [
    jql,
    selectedJiraSite?.url,
    status,
    urlBeingEdited,
    responseItems,
    retrieveUrlForSmartCardRender,
  ]);

  const renderIssuesModeContent = useCallback(() => {
    const selectedJiraSiteUrl = selectedJiraSite?.url;
    if (status === 'rejected' && jqlUrl) {
      return <ModalLoadingError url={jqlUrl} />;
    } else if (status === 'unauthorized') {
      return <AccessRequired url={selectedJiraSiteUrl || urlBeingEdited} />;
    } else if (resolvedWithNoResults || status === 'forbidden') {
      return <NoResults />;
    } else if (status === 'empty' || !columns.length) {
      // persist the empty state when making the initial /data request which contains the columns
      return (
        <div css={[contentContainerStyles, !!jql && tableContainerStyles]}>
          {!!jql ? (
            <EmptyState testId={`jira-jql-datasource-modal--empty-state`} />
          ) : (
            <InitialStateView searchMethod={currentSearchMethod} />
          )}
        </div>
      );
    }

    return issueLikeDataTableView;
  }, [
    columns.length,
    currentSearchMethod,
    issueLikeDataTableView,
    jql,
    jqlUrl,
    resolvedWithNoResults,
    selectedJiraSite?.url,
    status,
    urlBeingEdited,
  ]);

  return (
    <IntlMessagesProvider
      defaultMessages={i18nEN}
      loaderFn={fetchMessagesForLocale}
    >
      <ModalTransition>
        <Modal
          testId="jira-jql-datasource-modal"
          onClose={onCancel}
          width="calc(100% - 80px)"
          shouldScrollInViewport={true}
        >
          <ModalHeader>
            <ModalTitle>
              <div css={dropdownContainerStyles}>
                {availableSites && availableSites.length > 1 ? (
                  <Fragment>
                    <FormattedMessage
                      {...modalMessages.insertIssuesTitleManySites}
                    />
                    <JiraSiteSelector
                      availableSites={availableSites}
                      onSiteSelection={onSiteSelection}
                      selectedJiraSite={selectedJiraSite}
                      testId="jira-jql-datasource-modal--site-selector"
                    />
                  </Fragment>
                ) : (
                  <FormattedMessage {...modalMessages.insertIssuesTitle} />
                )}
              </div>
            </ModalTitle>
            {!hasNoJiraSites && (
              <DisplayViewDropDown
                onViewModeChange={handleViewModeChange}
                viewMode={currentViewMode}
              />
            )}
          </ModalHeader>
          <ModalBody>
            {!hasNoJiraSites ? (
              <Fragment>
                <JiraSearchContainer
                  setSearchBarJql={setSearchBarJql}
                  searchBarJql={searchBarJql}
                  isSearching={status === 'loading'}
                  parameters={parameters}
                  onSearch={onSearch}
                  initialSearchMethod={initialSearchMethod}
                  onSearchMethodChange={setCurrentSearchMethod}
                  site={selectedJiraSite}
                />
                {currentViewMode === 'count'
                  ? renderCountModeContent()
                  : renderIssuesModeContent()}
              </Fragment>
            ) : (
              <NoInstancesView />
            )}
          </ModalBody>
          <ModalFooter>
            {shouldShowIssueCount && (
              <div
                data-testid="jira-jql-datasource-modal-total-issues-count"
                css={issueCountStyles}
              >
                <LinkUrl
                  href={jqlUrl}
                  target="_blank"
                  testId="item-count-url"
                  style={{ color: token('color.text.accent.gray', N800) }}
                >
                  <FormattedNumber value={totalCount} />{' '}
                  <FormattedMessage
                    {...modalMessages.issueText}
                    values={{ totalCount }}
                  />
                </LinkUrl>
              </div>
            )}
            <Button appearance="default" onClick={onCancelClick}>
              <FormattedMessage {...modalMessages.cancelButtonText} />
            </Button>
            {!hasNoJiraSites && (
              <Button
                appearance="primary"
                onClick={onInsertPressed}
                isDisabled={isInsertDisabled}
                testId="jira-jql-datasource-modal--insert-button"
              >
                <FormattedMessage {...modalMessages.insertIssuesButtonText} />
              </Button>
            )}
          </ModalFooter>
        </Modal>
      </ModalTransition>
    </IntlMessagesProvider>
  );
};

const analyticsContextAttributes: AnalyticsContextAttributesType = {
  dataProvider: 'jira-issues',
};

const analyticsContextData: AnalyticsContextType & ComponentMetaDataType = {
  ...componentMetadata.configModal,
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
