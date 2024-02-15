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
import { startUfoExperience } from '../../../analytics/ufoExperiences';
import { useColumnPickerRenderedFailedUfoExperience } from '../../../analytics/ufoExperiences/hooks/useColumnPickerRenderedFailedUfoExperience';
import { useDataRenderedUfoExperience } from '../../../analytics/ufoExperiences/hooks/useDataRenderedUfoExperience';
import { buildDatasourceAdf } from '../../../common/utils/adf';
import { fetchMessagesForLocale } from '../../../common/utils/locale/fetch-messages-for-locale';
import { useAssetsClient } from '../../../hooks/useAssetsClient';
import { useDatasourceTableState } from '../../../hooks/useDatasourceTableState';
import i18nEN from '../../../i18n/en';
import { PermissionError } from '../../../services/cmdbService.utils';
import { AccessRequired } from '../../../ui/common/error-state/access-required';
import { ModalLoadingError } from '../../common/error-state/modal-loading-error';
import { AssetsSearchContainer } from '../search-container';
import { AssetsSearchContainerLoading } from '../search-container/loading-state';
import { AssetsConfigModalProps, AssetsDatasourceParameters } from '../types';

import { modalMessages } from './messages';
import { MODAL_HEIGHT, RenderAssetsContent } from './render-assets-content';

type ErrorState = 'permission' | 'network';

const modalBodyErrorWrapperStyles = css({
  alignItems: 'center',
  display: 'grid',
  height: MODAL_HEIGHT,
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
  const [errorState, setErrorState] = useState<ErrorState | undefined>();
  const { fireEvent } = useDatasourceAnalyticsEvents();
  const { current: modalRenderInstanceId } = useRef<string>(uuidv4());

  const {
    workspaceId,
    workspaceError,
    existingObjectSchema,
    existingObjectSchemaError,
    objectSchemas,
    objectSchemasError,
    totalObjectSchemas,
    assetsClientLoading,
  } = useAssetsClient(initialParameters);

  /* ------------------------------ PERMISSIONS ------------------------------ */
  useEffect(() => {
    if (workspaceError) {
      // If a workspaceError occurs this is a critical error
      if (workspaceError instanceof PermissionError) {
        setErrorState('permission');
      } else {
        setErrorState('network');
      }
    }
  }, [workspaceError]);

  useEffect(() => {
    if (objectSchemasError) {
      // We only care about permission errors for objectSchemas fetching as the user can retry this action
      if (objectSchemasError instanceof PermissionError) {
        setErrorState('permission');
      }
    }
  }, [objectSchemasError]);

  useEffect(() => {
    if (existingObjectSchemaError) {
      // We only care about permission errors for existingObjectSchema fetching as the user can retry this action
      if (existingObjectSchemaError instanceof PermissionError) {
        setErrorState('permission');
      }
    }
  }, [existingObjectSchemaError]);
  /* ------------------------------ END PERMISSIONS ------------------------------ */

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
    // We only want to send modal ready event once after we've fetched the schema count
    if (totalObjectSchemas !== undefined) {
      fireEvent('ui.modal.ready.datasource', {
        schemasCount: totalObjectSchemas,
        instancesCount: null,
      });
    }
  }, [fireEvent, totalObjectSchemas]);

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

    setVisibleColumnKeys(newVisibleColumnKeys);
  }, [initialVisibleColumnKeys, defaultVisibleColumnKeys]);

  useEffect(() => {
    if (isNewSearch) {
      setVisibleColumnKeys(defaultVisibleColumnKeys);
    }
  }, [defaultVisibleColumnKeys, isNewSearch]);

  useEffect(() => {
    visibleColumnCount.current = (visibleColumnKeys ?? []).length;
  }, [visibleColumnKeys]);

  const isDisabled =
    !!errorState ||
    status !== 'resolved' ||
    assetsClientLoading ||
    !aql ||
    !schemaId;

  const isEditingExistingTable = !!(
    initialParameters?.aql &&
    initialParameters?.schemaId &&
    initialParameters?.workspaceId
  );

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
          buildDatasourceAdf({
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
                  columns: (visibleColumnKeys ?? []).map(key => ({ key })),
                },
              },
            ],
          }),
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
    (searchAql: string, searchSchemaId: string) => {
      if (
        schemaId !== searchSchemaId ||
        aql !== searchAql ||
        status === 'rejected'
      ) {
        searchCount.current++;
        if (schemaId !== searchSchemaId) {
          userInteractionActions.current.add(DatasourceAction.SCHEMA_UPDATED);
        }
        if (aql !== searchAql) {
          userInteractionActions.current.add(DatasourceAction.QUERY_UPDATED);
        }
        setAql(searchAql);
        setSchemaId(searchSchemaId);
        setVisibleColumnKeys([]);
        setIsNewSearch(true);
        reset({ shouldForceRequest: true, shouldResetColumns: true });
      }
    },
    [aql, reset, schemaId, status],
  );

  const renderErrorState = useCallback(() => {
    if (errorState) {
      switch (errorState) {
        case 'permission':
          return <AccessRequired />;
        case 'network':
          return <ModalLoadingError />;
        default:
          return <ModalLoadingError />;
      }
    }
  }, [errorState]);

  const renderModalTitleContent = useCallback(() => {
    if (errorState) {
      return undefined;
    } else {
      if (!workspaceId || assetsClientLoading) {
        return <AssetsSearchContainerLoading modalTitle={AssetsModalTitle} />;
      }
      return (
        <AssetsSearchContainer
          workspaceId={workspaceId}
          initialSearchData={{
            aql: initialParameters?.aql,
            objectSchema: existingObjectSchema,
            objectSchemas,
          }}
          onSearch={handleOnSearch}
          modalTitle={AssetsModalTitle}
          isSearching={status === 'loading'}
        />
      );
    }
  }, [
    errorState,
    workspaceId,
    assetsClientLoading,
    initialParameters?.aql,
    existingObjectSchema,
    objectSchemas,
    handleOnSearch,
    status,
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
            {errorState ? (
              <div css={modalBodyErrorWrapperStyles}>{renderErrorState()}</div>
            ) : (
              <RenderAssetsContent
                isFetchingInitialData={assetsClientLoading}
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
                {...(isEditingExistingTable
                  ? modalMessages.updateObjectsButtonText
                  : modalMessages.insertIssuesButtonText)}
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

export const AssetsConfigModal = withAnalyticsContext(contextData)(
  PlainAssetsConfigModal,
);
