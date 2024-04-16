/** @jsx jsx */
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { jsx } from '@emotion/react';
import { FormattedMessage, FormattedNumber } from 'react-intl-next';
import { v4 as uuidv4 } from 'uuid';

import {
  UIAnalyticsEvent,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/standard-button';
import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';
import { InlineCardAdf } from '@atlaskit/linking-common/types';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@atlaskit/modal-dialog';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';
import LinkUrl from '@atlaskit/smart-card/link-url';
import { N800 } from '@atlaskit/theme/colors';
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
import {
  DatasourceAction,
  DatasourceDisplay,
  DatasourceSearchMethod,
} from '../../../analytics/types';
import { DisplayViewModes, Site } from '../../../common/types';
import { buildDatasourceAdf } from '../../../common/utils/adf';
import { fetchMessagesForLocale } from '../../../common/utils/locale/fetch-messages-for-locale';
import { useDatasourceTableState } from '../../../hooks/useDatasourceTableState';
import i18nEN from '../../../i18n/en';
import { getAvailableSites } from '../../../services/getAvailableSites';
import { AccessRequired } from '../../common/error-state/access-required';
import { ModalLoadingError } from '../../common/error-state/modal-loading-error';
import { NoInstancesView } from '../../common/error-state/no-instances';
import { NoResults } from '../../common/error-state/no-results';
import { InitialStateView } from '../../common/initial-state-view';
import { CancelButton } from '../../common/modal/cancel-button';
import { ContentContainer } from '../../common/modal/content-container';
import {
  SmartCardPlaceholder,
  SmartLink,
} from '../../common/modal/count-view-smart-link';
import { DisplayViewDropDown } from '../../common/modal/display-view-dropdown/display-view-drop-down';
import { SiteSelector } from '../../common/modal/site-selector';
import { EmptyState, IssueLikeDataTableView } from '../../issue-like-table';
import { ColumnSizesMap } from '../../issue-like-table/types';
import ConfluenceSearchContainer from '../confluence-search-container';
import {
  ConfluenceSearchConfigModalProps,
  ConfluenceSearchDatasourceParameters,
} from '../types';

import { ConfluenceSearchInitialStateSVG } from './confluence-search-initial-state-svg';
import { confluenceSearchModalMessages } from './messages';

const inputContainerStyles = xcss({
  alignItems: 'baseline',
  display: 'flex',
  minHeight: '72px',
});

const searchCountStyles = xcss({
  flex: 1,
  fontWeight: 600,
});

// TODO: common functionality of all modals refactor in EDM-9573
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

export const PlainConfluenceSearchConfigModal = (
  props: ConfluenceSearchConfigModalProps,
) => {
  const { current: modalRenderInstanceId } = useRef(uuidv4());

  const {
    datasourceId,
    columnCustomSizes: initialColumnCustomSizes,
    wrappedColumnKeys: initialWrappedColumnKeys,
    onCancel,
    onInsert,
    viewMode = 'table',
    parameters: initialParameters,
    url: urlBeingEdited,
    visibleColumnKeys: initialVisibleColumnKeys,
  } = props;

  const [availableSites, setAvailableSites] = useState<Site[] | undefined>(
    undefined,
  );
  const [currentViewMode, setCurrentViewMode] =
    useState<DisplayViewModes>(viewMode);
  const [cloudId, setCloudId] = useState(initialParameters?.cloudId);
  const [searchString, setSearchString] = useState<string | undefined>(
    initialParameters?.searchString,
  );
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(
    initialVisibleColumnKeys,
  );

  // analytics related parameters
  const searchCount = useRef(0);
  const userInteractionActions = useRef<Set<DatasourceAction>>(new Set());
  const visibleColumnCount = useRef(visibleColumnKeys?.length || 0);

  // TODO: further refactoring in EDM-9573
  // https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/82725/overview?commentId=6829210
  const parameters = useMemo(
    () => ({ ...initialParameters, cloudId, searchString }),
    [
      cloudId,
      initialParameters,
      searchString /** Add more parameters when more filters are added */,
    ],
  );

  const isParametersSet = useMemo(
    () =>
      !!cloudId &&
      Object.values(parameters ?? {}).filter(v => v !== undefined).length > 1,
    [cloudId, parameters],
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

  const hasNoConfluenceSites = availableSites && availableSites.length === 0;

  const selectedConfluenceSite = useMemo<Site | undefined>(() => {
    if (cloudId) {
      return availableSites?.find(
        confluenceSite => confluenceSite.cloudId === cloudId,
      );
    } else {
      let currentlyLoggedInSiteUrl: string | undefined;
      if (typeof window.location !== 'undefined') {
        currentlyLoggedInSiteUrl = window.location.origin;
      }
      return (
        availableSites?.find(
          confluenceSite => confluenceSite.url === currentlyLoggedInSiteUrl,
        ) || availableSites?.[0]
      );
    }
  }, [availableSites, cloudId]);

  useEffect(() => {
    fireEvent('screen.datasourceModalDialog.viewed', {});
  }, [fireEvent]);

  // TODO: further refactoring in EDM-9573
  // https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/82725/overview?commentId=6828283
  useEffect(() => {
    if (
      selectedConfluenceSite &&
      (!cloudId || cloudId !== selectedConfluenceSite.cloudId)
    ) {
      setCloudId(selectedConfluenceSite.cloudId);
    }
  }, [cloudId, selectedConfluenceSite]);

  // TODO: further refactoring in EDM-9573
  // https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/82725/overview?commentId=6829171
  const onSiteSelection = useCallback(
    (site: Site) => {
      userInteractionActions.current.add(DatasourceAction.INSTANCE_UPDATED);
      setSearchString(undefined);
      setCloudId(site.cloudId);
      reset({ shouldForceRequest: true });
    },
    [reset],
  );

  useEffect(() => {
    const fetchSiteDisplayNames = async () => {
      const confluenceSites = await getAvailableSites('confluence');
      const sortedAvailableSites = [...confluenceSites].sort((a, b) =>
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
    const newVisibleColumnKeys =
      !initialVisibleColumnKeys || (initialVisibleColumnKeys || []).length === 0
        ? defaultVisibleColumnKeys
        : initialVisibleColumnKeys;

    visibleColumnCount.current = newVisibleColumnKeys.length;
    setVisibleColumnKeys(newVisibleColumnKeys);
  }, [initialVisibleColumnKeys, defaultVisibleColumnKeys]);

  const siteSelectorLabel =
    availableSites && availableSites.length > 1
      ? confluenceSearchModalMessages.insertIssuesTitleManySites
      : confluenceSearchModalMessages.insertIssuesTitle;

  const [columnCustomSizes, setColumnCustomSizes] = useState<
    ColumnSizesMap | undefined
  >(initialColumnCustomSizes);

  const onColumnResize = useCallback(
    (key: string, width: number) => {
      setColumnCustomSizes({ ...columnCustomSizes, [key]: width });
    },
    [columnCustomSizes],
  );

  const [wrappedColumnKeys, setWrappedColumnKeys] = useState<
    string[] | undefined
  >(initialWrappedColumnKeys);

  const onWrappedColumnChange = useCallback(
    (key: string, isWrapped: boolean) => {
      const set = new Set(wrappedColumnKeys);
      if (isWrapped) {
        set.add(key);
      } else {
        set.delete(key);
      }
      setWrappedColumnKeys(Array.from(set));
    },
    [wrappedColumnKeys],
  );

  // TODO: common functionality of all modals refactor in EDM-9573
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

  // TODO: further refactoring in EDM-9573
  // https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/82725/overview?commentId=6798258
  const confluenceSearchTable = useMemo(
    () => (
      <ContentContainer withTableBorder>
        <IssueLikeDataTableView
          testId="confluence-search-datasource-table"
          status={status}
          columns={columns}
          items={responseItems}
          hasNextPage={hasNextPage}
          visibleColumnKeys={visibleColumnKeys || defaultVisibleColumnKeys}
          onNextPage={onNextPage}
          onLoadDatasourceDetails={loadDatasourceDetails}
          onVisibleColumnKeysChange={handleVisibleColumnKeysChange}
          parentContainerRenderInstanceId={modalRenderInstanceId}
          extensionKey={extensionKey}
          columnCustomSizes={columnCustomSizes}
          onColumnResize={onColumnResize}
          wrappedColumnKeys={wrappedColumnKeys}
          onWrappedColumnChange={
            getBooleanFF('platform.linking-platform.datasource-word_wrap')
              ? onWrappedColumnChange
              : undefined
          }
        />
      </ContentContainer>
    ),
    [
      status,
      columns,
      responseItems,
      hasNextPage,
      visibleColumnKeys,
      defaultVisibleColumnKeys,
      onNextPage,
      loadDatasourceDetails,
      handleVisibleColumnKeysChange,
      modalRenderInstanceId,
      extensionKey,
      columnCustomSizes,
      onColumnResize,
      wrappedColumnKeys,
      onWrappedColumnChange,
    ],
  );

  const resolvedWithNoResults = status === 'resolved' && !responseItems.length;

  const hasConfluenceSearchParams = selectedConfluenceSite && searchString;

  const selectedConfluenceSiteUrl = selectedConfluenceSite?.url;
  const confluenceSearchUrl =
    selectedConfluenceSiteUrl &&
    searchString !== undefined &&
    `${selectedConfluenceSiteUrl}/wiki/search?text=${encodeURI(searchString)}`;

  const analyticsPayload = useMemo(
    () => ({
      extensionKey,
      destinationObjectTypes,
      searchCount: searchCount.current,
      actions: Array.from(userInteractionActions.current),
    }),
    [destinationObjectTypes, extensionKey],
  );

  const isDataReady = (visibleColumnKeys || []).length > 0;

  const fireInlineViewedEvent = useCallback(() => {
    fireEvent('ui.link.viewed.count', {
      ...analyticsPayload,
      searchMethod: DatasourceSearchMethod.DATASOURCE_SEARCH_QUERY,
      totalItemCount: totalCount || 0,
    });
  }, [analyticsPayload, fireEvent, totalCount]);

  const fireTableViewedEvent = useCallback(() => {
    if (isDataReady) {
      fireEvent('ui.table.viewed.datasourceConfigModal', {
        ...analyticsPayload,
        totalItemCount: totalCount || 0,
        searchMethod: DatasourceSearchMethod.DATASOURCE_SEARCH_QUERY,
        displayedColumnCount: visibleColumnCount.current,
      });
    }
  }, [analyticsPayload, fireEvent, totalCount, isDataReady]);

  useEffect(() => {
    const isResolved = status === 'resolved';
    const isTableViewMode =
      currentViewMode === 'issue' || currentViewMode === 'table';
    const isInlineViewMode =
      currentViewMode === 'count' || currentViewMode === 'inline';

    if (!isResolved) {
      return;
    }

    if (isTableViewMode) {
      fireTableViewedEvent();
    } else if (isInlineViewMode) {
      fireInlineViewedEvent();
    }
  }, [currentViewMode, fireInlineViewedEvent, fireTableViewedEvent, status]);

  const renderTableModalContent = useCallback(() => {
    if (status === 'rejected') {
      return <ModalLoadingError />;
    } else if (status === 'unauthorized') {
      return (
        <AccessRequired url={selectedConfluenceSiteUrl || urlBeingEdited} />
      );
    } else if (resolvedWithNoResults || status === 'forbidden') {
      return <NoResults />;
    } else if (status === 'empty' || !columns.length) {
      // persist the empty state when making the initial /data request which contains the columns
      if (hasConfluenceSearchParams !== undefined) {
        return (
          <EmptyState
            testId={`confluence-search-datasource-modal--empty-state`}
          />
        );
      }
      return (
        <ContentContainer>
          <InitialStateView
            icon={<ConfluenceSearchInitialStateSVG />}
            title={confluenceSearchModalMessages.initialViewSearchTitle}
            description={
              confluenceSearchModalMessages.initialViewSearchDescription
            }
          />
        </ContentContainer>
      );
    }
    return confluenceSearchTable;
  }, [
    columns.length,
    selectedConfluenceSiteUrl,
    confluenceSearchTable,
    resolvedWithNoResults,
    status,
    urlBeingEdited,
    hasConfluenceSearchParams,
  ]);

  const renderInlineLinkModalContent = useCallback(() => {
    if (status === 'unauthorized') {
      return (
        <AccessRequired url={selectedConfluenceSiteUrl || urlBeingEdited} />
      );
    } else if (status === 'empty' || !selectedConfluenceSiteUrl) {
      return (
        <SmartCardPlaceholder
          placeholderText={
            confluenceSearchModalMessages.resultsCountSmartCardPlaceholderText
          }
        />
      );
    } else {
      return confluenceSearchUrl && <SmartLink url={confluenceSearchUrl} />;
    }
  }, [confluenceSearchUrl, selectedConfluenceSiteUrl, status, urlBeingEdited]);

  const shouldShowResultsCount = !!totalCount && currentViewMode === 'table';

  const onInsertPressed = useCallback(
    (e: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => {
      if (!isParametersSet || !cloudId) {
        return;
      }

      const insertButtonClickedEvent = analyticsEvent.update({
        actionSubjectId: 'insert',
        attributes: {
          ...analyticsPayload,
          totalItemCount: totalCount || 0,
          displayedColumnCount: visibleColumnCount.current,
          display:
            currentViewMode === 'inline'
              ? DatasourceDisplay.DATASOURCE_INLINE
              : DatasourceDisplay.DATASOURCE_TABLE,
          searchCount: searchCount.current,
          searchMethod: DatasourceSearchMethod.DATASOURCE_SEARCH_QUERY,
          actions: Array.from(userInteractionActions.current),
        },
        eventType: 'ui',
      });

      const consumerEvent = insertButtonClickedEvent.clone() ?? undefined;
      insertButtonClickedEvent.fire(EVENT_CHANNEL);

      if (currentViewMode === 'inline') {
        onInsert(
          {
            type: 'inlineCard',
            attrs: {
              url: confluenceSearchUrl,
            },
          } as InlineCardAdf,
          consumerEvent,
        );
      } else {
        onInsert(
          buildDatasourceAdf<ConfluenceSearchDatasourceParameters>({
            id: datasourceId,
            parameters: {
              ...parameters,
              cloudId,
            },
            views: [
              {
                type: 'table',
                properties: {
                  columns: (visibleColumnKeys || []).map(key => {
                    const width = columnCustomSizes?.[key];
                    const isWrapped = wrappedColumnKeys?.includes(key);
                    return {
                      key,
                      ...(width ? { width } : {}),
                      ...(isWrapped ? { isWrapped } : {}),
                    };
                  }),
                },
              },
            ],
          }),
          consumerEvent,
        );
      }
    },
    [
      isParametersSet,
      cloudId,
      analyticsPayload,
      totalCount,
      currentViewMode,
      onInsert,
      confluenceSearchUrl,
      datasourceId,
      parameters,
      visibleColumnKeys,
      columnCustomSizes,
      wrappedColumnKeys,
    ],
  );

  const handleViewModeChange = (selectedMode: DisplayViewModes) => {
    userInteractionActions.current.add(DatasourceAction.DISPLAY_VIEW_CHANGED);
    setCurrentViewMode(selectedMode);
  };

  const onSearch = useCallback(
    (newSearchString: string) => {
      searchCount.current++;
      userInteractionActions.current.add(DatasourceAction.QUERY_UPDATED);
      setSearchString(newSearchString);
      reset({ shouldForceRequest: true });
    },
    [reset],
  );

  const isInsertDisabled =
    !isParametersSet ||
    status === 'rejected' ||
    status === 'unauthorized' ||
    status === 'loading';

  const getCancelButtonAnalyticsPayload = useCallback(() => {
    return {
      extensionKey,
      destinationObjectTypes,
      searchCount: searchCount.current,
      actions: Array.from(userInteractionActions.current),
    };
  }, [destinationObjectTypes, extensionKey]);

  return (
    <IntlMessagesProvider
      defaultMessages={i18nEN}
      loaderFn={fetchMessagesForLocale}
    >
      <Modal
        testId="confluence-search-datasource-modal"
        onClose={onCancel}
        width="calc(100% - 80px)"
        shouldScrollInViewport={true}
      >
        <ModalHeader>
          <ModalTitle>
            <SiteSelector
              availableSites={availableSites}
              onSiteSelection={onSiteSelection}
              selectedSite={selectedConfluenceSite}
              testId="confluence-search-datasource-modal--site-selector"
              label={siteSelectorLabel}
            />
          </ModalTitle>
          {!hasNoConfluenceSites && (
            <DisplayViewDropDown
              onViewModeChange={handleViewModeChange}
              viewMode={currentViewMode}
            />
          )}
        </ModalHeader>
        <ModalBody>
          {!hasNoConfluenceSites ? (
            <Fragment>
              <Box xcss={inputContainerStyles}>
                <ConfluenceSearchContainer
                  cloudId={cloudId}
                  isSearching={status === 'loading'}
                  onSearch={onSearch}
                  initialSearchValue={initialParameters?.searchString}
                />
              </Box>
              {currentViewMode === 'inline'
                ? renderInlineLinkModalContent()
                : renderTableModalContent()}
            </Fragment>
          ) : (
            <NoInstancesView
              title={
                confluenceSearchModalMessages.noAccessToConfluenceSitesTitle
              }
              description={
                confluenceSearchModalMessages.noAccessToConfluenceSitesDescription
              }
              testId={'no-confluence-instances-content'}
            />
          )}
        </ModalBody>
        <ModalFooter>
          {shouldShowResultsCount && confluenceSearchUrl && (
            <Box
              testId="confluence-search-datasource-modal-total-results-count"
              xcss={searchCountStyles}
            >
              <LinkUrl
                href={confluenceSearchUrl}
                target="_blank"
                testId="item-count-url"
                style={{ color: token('color.text.accent.gray', N800) }}
              >
                <FormattedNumber value={totalCount} />{' '}
                <FormattedMessage
                  {...confluenceSearchModalMessages.searchCountText}
                  values={{ totalCount }}
                />
              </LinkUrl>
            </Box>
          )}
          <CancelButton
            onCancel={onCancel}
            getAnalyticsPayload={getCancelButtonAnalyticsPayload}
            testId="confluence-search-modal--cancel-button"
          />
          {!hasNoConfluenceSites && (
            <Button
              appearance="primary"
              onClick={onInsertPressed}
              isDisabled={isInsertDisabled}
              testId="confluence-search-datasource-modal--insert-button"
            >
              <FormattedMessage
                {...confluenceSearchModalMessages.insertResultsButtonText}
              />
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </IntlMessagesProvider>
  );
};

const analyticsContextAttributes: AnalyticsContextAttributesType = {
  dataProvider: 'confluence-search',
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

export const ConfluenceSearchConfigModal = withAnalyticsContext(contextData)(
  PlainConfluenceSearchConfigModal,
);
