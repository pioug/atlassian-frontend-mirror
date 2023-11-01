/** @jsx jsx */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';
import { v4 as uuidv4 } from 'uuid';

import {
  UIAnalyticsEvent,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/standard-button';
import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';
import { Link } from '@atlaskit/linking-types';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';

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
import {
  DatasourceAction,
  DatasourceDisplay,
  DatasourceSearchMethod,
} from '../../../analytics/types';
import { startUfoExperience } from '../../../analytics/ufoExperiences';
import { useColumnPickerRenderedFailedUfoExperience } from '../../../analytics/ufoExperiences/hooks/useColumnPickerRenderedFailedUfoExperience';
import { useDataRenderedUfoExperience } from '../../../analytics/ufoExperiences/hooks/useDataRenderedUfoExperience';
import { fetchMessagesForLocale } from '../../../common/utils/locale/fetch-messages-for-locale';
import { useAssetsClient } from '../../../hooks/useAssetsClient';
import { useDatasourceTableState } from '../../../hooks/useDatasourceTableState';
import i18nEN from '../../../i18n/en';
import { ModalLoadingError } from '../../common/error-state/modal-loading-error';
import { AssetsSearchContainer } from '../search-container';
import { AssetsSearchContainerLoading } from '../search-container/loading-state';
import {
  AssetsConfigModalProps,
  AssetsDatasourceAdf,
  AssetsDatasourceParameters,
} from '../types';

import { modalMessages } from './messages';
import { RenderAssetsContent } from './render-assets-content';

const modalBodyWrapperStyles = css({
  display: 'grid',
  height: '420px',
  overflow: 'auto',
});
const AssetsModalTitle = (
  <ModalTitle>
    <FormattedMessage {...modalMessages.insertObjectsTitle} />
  </ModalTitle>
);

const PlainAssetsConfigModal = (props: AssetsConfigModalProps) => {
  const {
    datasourceId,
    parameters: initialParameters,
    onCancel,
    onInsert,
    visibleColumnKeys: initialVisibleColumnKeys,
  } = props;
  const [aql, setAql] = useState(initialParameters?.aql);
  const [schemaId, setSchemaId] = useState(initialParameters?.schemaId);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(
    initialVisibleColumnKeys,
  );
  const [isNewSearch, setIsNewSearch] = useState<boolean>(false);
  const { fireEvent } = useDatasourceAnalyticsEvents();
  const { current: modalRenderInstanceId } = useRef<string>(uuidv4());

  // If a workspaceError occurs this is a critical error
  const { workspaceId, workspaceError, objectSchema, assetsClientLoading } =
    useAssetsClient(initialParameters);

  const parameters = useMemo<AssetsDatasourceParameters>(
    () => ({
      aql: aql || '',
      schemaId: schemaId || '',
      workspaceId: workspaceId || '',
    }),
    [aql, schemaId, workspaceId],
  );

  const isParametersSet = !!(aql && workspaceId && schemaId);
  const {
    status,
    onNextPage,
    responseItems,
    reset,
    loadDatasourceDetails,
    hasNextPage,
    columns,
    defaultVisibleColumnKeys,
    extensionKey = null,
    destinationObjectTypes,
    totalCount,
  } = useDatasourceTableState({
    datasourceId,
    parameters: isParametersSet ? parameters : undefined,
    fieldKeys: isNewSearch ? [] : visibleColumnKeys,
  });

  /* ------------------------------ OBSERVABILITY ------------------------------ */
  const searchCount = useRef(0);
  const userInteractionActions = useRef<Set<DatasourceAction>>(new Set());
  const visibleColumnCount = useRef(visibleColumnKeys?.length || 0);
  const isDataReady = (visibleColumnKeys || []).length > 0;

  const analyticsPayload = useMemo(() => {
    return {
      extensionKey: extensionKey,
      destinationObjectTypes: destinationObjectTypes,
    };
  }, [destinationObjectTypes, extensionKey]);

  useEffect(() => {
    fireEvent('screen.datasourceModalDialog.viewed', {});
  }, [fireEvent]);

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

    if (!isResolved || !totalCount) {
      return;
    }

    if (totalCount > 1) {
      fireTableViewedEvent();
    }
  }, [fireTableViewedEvent, status, totalCount]);

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
    canBeLink: false,
    extensionKey,
  });

  useColumnPickerRenderedFailedUfoExperience(status, modalRenderInstanceId);
  /* ------------------------------ END OBSERVABILITY ------------------------------ */

  const onVisibleColumnKeysChange = useCallback(
    (visibleColumnKeys: string[]) => {
      setVisibleColumnKeys(visibleColumnKeys);
      setIsNewSearch(false);
    },
    [],
  );

  useEffect(() => {
    const newVisibleColumnKeys =
      !initialVisibleColumnKeys || (initialVisibleColumnKeys || []).length === 0
        ? defaultVisibleColumnKeys
        : initialVisibleColumnKeys;

    visibleColumnCount.current = newVisibleColumnKeys.length;
    setVisibleColumnKeys(newVisibleColumnKeys);
  }, [initialVisibleColumnKeys, defaultVisibleColumnKeys]);

  useEffect(() => {
    if (isNewSearch) {
      setVisibleColumnKeys(defaultVisibleColumnKeys);
    }
  }, [defaultVisibleColumnKeys, isNewSearch]);

  const isDisabled =
    !!workspaceError ||
    status === 'rejected' ||
    status === 'loading' ||
    status === 'empty' ||
    assetsClientLoading ||
    !aql ||
    !schemaId;

  const retrieveUrlForSmartCardRender = useCallback(() => {
    const [data] = responseItems;
    // agreement with BE that we will use `key` for rendering smartlink
    return (data?.key?.data as Link)?.url;
  }, [responseItems]);

  const onInsertPressed = useCallback(
    (e: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => {
      if (!aql || !schemaId || !workspaceId) {
        return;
      }

      const insertButtonClickedEvent = analyticsEvent.update({
        actionSubjectId: 'insert',
        attributes: {
          ...analyticsPayload,
          totalItemCount: totalCount || 0,
          displayedColumnCount: visibleColumnCount.current,
          display: DatasourceDisplay.DATASOURCE_TABLE,
          searchCount: searchCount.current,
          searchMethod: DatasourceSearchMethod.DATASOURCE_SEARCH_QUERY,
          actions: Array.from(userInteractionActions.current),
        },
        eventType: 'ui',
      });
      const consumerEvent = insertButtonClickedEvent.clone() ?? undefined;
      insertButtonClickedEvent.fire(EVENT_CHANNEL);

      const firstAssetUrl = retrieveUrlForSmartCardRender();
      if (responseItems.length === 1 && firstAssetUrl) {
        onInsert(
          {
            type: 'inlineCard',
            attrs: {
              url: firstAssetUrl,
            },
          },
          consumerEvent,
        );
      } else {
        onInsert(
          {
            type: 'blockCard',
            attrs: {
              datasource: {
                id: datasourceId,
                parameters: {
                  workspaceId,
                  aql,
                  schemaId,
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
          } as AssetsDatasourceAdf,
          consumerEvent,
        );
      }
    },
    [
      aql,
      schemaId,
      workspaceId,
      analyticsPayload,
      totalCount,
      retrieveUrlForSmartCardRender,
      responseItems.length,
      onInsert,
      datasourceId,
      visibleColumnKeys,
    ],
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

  const handleOnSearch = useCallback(
    async (searchAql: string, searchSchemaId: string) => {
      if (schemaId !== searchSchemaId || aql !== searchAql) {
        searchCount.current++;
        if (schemaId !== searchSchemaId) {
          userInteractionActions.current.add(DatasourceAction.SCHEMA_UPDATED);
        }
        if (aql !== searchAql) {
          userInteractionActions.current.add(DatasourceAction.QUERY_UPDATED);
        }
        reset({ shouldResetColumns: true });
        setAql(searchAql);
        setSchemaId(searchSchemaId);
        setIsNewSearch(true);
      }
    },
    [aql, reset, schemaId],
  );

  const renderModalTitleContent = useCallback(() => {
    if (workspaceError) {
      return undefined;
    } else {
      if (!workspaceId || assetsClientLoading) {
        return <AssetsSearchContainerLoading modalTitle={AssetsModalTitle} />;
      }
      return (
        <AssetsSearchContainer
          workspaceId={workspaceId}
          initialSearchData={{ aql, objectSchema }}
          onSearch={handleOnSearch}
          modalTitle={AssetsModalTitle}
          isSearching={status === 'loading'}
        />
      );
    }
  }, [
    aql,
    assetsClientLoading,
    handleOnSearch,
    objectSchema,
    status,
    workspaceError,
    workspaceId,
  ]);

  return (
    <IntlMessagesProvider
      defaultMessages={i18nEN}
      loaderFn={fetchMessagesForLocale}
    >
      <ModalTransition>
        <Modal
          testId={'asset-datasource-modal'}
          onClose={onCancel}
          width="calc(100% - 80px)"
          shouldScrollInViewport={true}
          shouldCloseOnOverlayClick={false}
        >
          <ModalHeader>{renderModalTitleContent()}</ModalHeader>
          <ModalBody>
            <div css={modalBodyWrapperStyles}>
              {workspaceError ? (
                <ModalLoadingError />
              ) : (
                <RenderAssetsContent
                  status={status}
                  responseItems={responseItems}
                  visibleColumnKeys={visibleColumnKeys}
                  onVisibleColumnKeysChange={onVisibleColumnKeysChange}
                  datasourceId={datasourceId}
                  aql={aql}
                  schemaId={schemaId}
                  onNextPage={onNextPage}
                  hasNextPage={hasNextPage}
                  loadDatasourceDetails={loadDatasourceDetails}
                  columns={columns}
                  defaultVisibleColumnKeys={defaultVisibleColumnKeys}
                  modalRenderInstanceId={modalRenderInstanceId}
                />
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              appearance="default"
              onClick={onCancelClick}
              testId={'asset-datasource-modal--cancel-button'}
            >
              <FormattedMessage {...modalMessages.cancelButtonText} />
            </Button>
            <Button
              appearance="primary"
              onClick={onInsertPressed}
              isDisabled={isDisabled}
              testId={'assets-datasource-modal--insert-button'}
            >
              <FormattedMessage
                {...modalMessages.insertIssuesButtonText}
                values={{
                  objectsCount: responseItems.length,
                }}
              />
            </Button>
          </ModalFooter>
        </Modal>
      </ModalTransition>
    </IntlMessagesProvider>
  );
};

const analyticsContextAttributes: AnalyticsContextAttributesType = {
  dataProvider: 'jsm-assets',
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

export const AssetsConfigModal = withAnalyticsContext(contextData)(
  PlainAssetsConfigModal,
);
