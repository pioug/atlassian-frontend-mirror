/** @jsx jsx */
import { useCallback, useEffect, useRef } from 'react';

import { css, jsx } from '@emotion/react';
import { v4 as uuidv4 } from 'uuid';

import { withAnalyticsContext } from '@atlaskit/analytics-next';
import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';

import { useDatasourceAnalyticsEvents } from '../../analytics';
import { componentMetadata } from '../../analytics/constants';
import { startUfoExperience } from '../../analytics/ufoExperiences';
import { useColumnPickerRenderedFailedUfoExperience } from '../../analytics/ufoExperiences/hooks/useColumnPickerRenderedFailedUfoExperience';
import { useDataRenderedUfoExperience } from '../../analytics/ufoExperiences/hooks/useDataRenderedUfoExperience';
import { fetchMessagesForLocale } from '../../common/utils/locale/fetch-messages-for-locale';
import { useDatasourceTableState } from '../../hooks/useDatasourceTableState';
import i18nEN from '../../i18n/en';
import { ScrollableContainerHeight } from '../../ui/issue-like-table/styled';
import { AccessRequired } from '../common/error-state/access-required';
import { LoadingError } from '../common/error-state/loading-error';
import { NoResults } from '../common/error-state/no-results';
import { ProviderAuthRequired } from '../common/error-state/provider-auth-required';
import { IssueLikeDataTableView } from '../issue-like-table';
import EmptyState from '../issue-like-table/empty-state';
import { TableFooter } from '../table-footer';

import { DatasourceTableViewProps } from './types';

const containerStyles = css({
  borderRadius: 'inherit',
});

const DatasourceTableViewWithoutAnalytics = ({
  datasourceId,
  parameters,
  visibleColumnKeys,
  onVisibleColumnKeysChange,
  url,
  columnCustomSizes,
  onColumnResize,
  wrappedColumnKeys,
  onWrappedColumnChange,
}: DatasourceTableViewProps) => {
  const {
    reset,
    status,
    onNextPage,
    responseItems,
    hasNextPage,
    columns,
    defaultVisibleColumnKeys,
    totalCount,
    loadDatasourceDetails,
    extensionKey = null,
    providerName,
    destinationObjectTypes,
    authDetails,
  } = useDatasourceTableState({
    datasourceId,
    parameters,
    fieldKeys: visibleColumnKeys,
  });

  const { fireEvent } = useDatasourceAnalyticsEvents();
  const { current: tableRenderInstanceId } = useRef(uuidv4());

  const visibleColumnCount = useRef(visibleColumnKeys?.length || 0);

  /*  Need this to make sure that the datasource in the editor gets updated new info if any edits are made in the modal
      But we don't want to call it on initial load. This screws up useDatasourceTableState's internal
      mechanism of initial loading. Use of ref here makes it basically work as a `componentDidUpdate` but not `componentDidMount`
   */
  const isInitialRender = useRef(true);
  const hasColumns = !!columns.length;
  const isDataReady =
    hasColumns && responseItems.length > 0 && totalCount && totalCount > 0;

  visibleColumnCount.current = visibleColumnKeys?.length || 0;

  useEffect(() => {
    if (!isInitialRender.current) {
      reset();
    }
    isInitialRender.current = false;
  }, [reset, parameters]);

  useEffect(() => {
    if (
      onVisibleColumnKeysChange &&
      (visibleColumnKeys || []).length === 0 &&
      defaultVisibleColumnKeys.length > 0
    ) {
      onVisibleColumnKeysChange(defaultVisibleColumnKeys);
    }
  }, [visibleColumnKeys, defaultVisibleColumnKeys, onVisibleColumnKeysChange]);

  useEffect(() => {
    const isTableViewRenderedWithData = status === 'resolved' && isDataReady;

    if (isTableViewRenderedWithData) {
      fireEvent('ui.datasource.renderSuccess', {
        extensionKey,
        destinationObjectTypes,
        totalItemCount: totalCount,
        displayedColumnCount: visibleColumnCount.current,
        display: 'table',
      });
    }
  }, [
    totalCount,
    fireEvent,
    status,
    extensionKey,
    destinationObjectTypes,
    isDataReady,
  ]);

  useEffect(() => {
    const shouldStartUfoExperience =
      datasourceId && parameters && visibleColumnKeys && status === 'loading';

    if (shouldStartUfoExperience) {
      startUfoExperience(
        {
          name: 'datasource-rendered',
        },
        tableRenderInstanceId,
      );
    }
  }, [
    datasourceId,
    parameters,
    status,
    tableRenderInstanceId,
    visibleColumnKeys,
  ]);

  useColumnPickerRenderedFailedUfoExperience(status, tableRenderInstanceId);

  useDataRenderedUfoExperience({
    status,
    experienceId: tableRenderInstanceId,
    itemCount: responseItems.length,
    extensionKey,
  });

  const forcedReset = useCallback(() => {
    reset({ shouldForceRequest: true });
  }, [reset]);

  const onRefresh = useCallback(() => {
    fireEvent('ui.button.clicked.sync', {
      extensionKey,
      destinationObjectTypes,
    });

    forcedReset();
  }, [destinationObjectTypes, extensionKey, fireEvent, forcedReset]);

  const handleErrorRefresh = useCallback(() => {
    reset({ shouldForceRequest: true });
  }, [reset]);

  if (
    (status === 'resolved' && !responseItems.length) ||
    status === 'forbidden'
  ) {
    return <NoResults onRefresh={handleErrorRefresh} />;
  }

  if (status === 'unauthorized') {
    return authDetails?.length && authDetails.length > 0 ? (
      <ProviderAuthRequired
        auth={authDetails}
        extensionKey={extensionKey}
        providerName={providerName}
        onAuthSuccess={forcedReset}
        onAuthError={forcedReset}
        datasourceId={datasourceId}
      />
    ) : (
      <AccessRequired url={url} />
    );
  }

  if (status === 'rejected') {
    return <LoadingError onRefresh={handleErrorRefresh} />;
  }

  return (
    <IntlMessagesProvider
      defaultMessages={i18nEN}
      loaderFn={fetchMessagesForLocale}
    >
      {/* datasource-table classname is to exclude all children from being commentable - exclude list is in CFE*/}
      <div css={containerStyles} className="datasource-table">
        {hasColumns ? (
          <IssueLikeDataTableView
            testId={'datasource-table-view'}
            hasNextPage={hasNextPage}
            items={responseItems}
            onNextPage={onNextPage}
            onLoadDatasourceDetails={loadDatasourceDetails}
            status={status}
            columns={columns}
            visibleColumnKeys={visibleColumnKeys || defaultVisibleColumnKeys}
            onVisibleColumnKeysChange={onVisibleColumnKeysChange}
            columnCustomSizes={columnCustomSizes}
            onColumnResize={onColumnResize}
            wrappedColumnKeys={wrappedColumnKeys}
            onWrappedColumnChange={onWrappedColumnChange}
            scrollableContainerHeight={ScrollableContainerHeight}
            parentContainerRenderInstanceId={tableRenderInstanceId}
            extensionKey={extensionKey}
          />
        ) : (
          <EmptyState testId="datasource-table-view-skeleton" isCompact />
        )}
        <TableFooter
          itemCount={isDataReady ? totalCount : undefined}
          onRefresh={onRefresh}
          isLoading={!isDataReady || status === 'loading'}
          url={url}
        />
      </div>
    </IntlMessagesProvider>
  );
};

export const DatasourceTableView = withAnalyticsContext(
  componentMetadata.tableView,
)(DatasourceTableViewWithoutAnalytics);
