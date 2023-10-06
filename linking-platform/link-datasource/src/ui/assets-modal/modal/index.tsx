/** @jsx jsx */
import { useCallback, useEffect, useMemo, useState } from 'react';

import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { withAnalyticsContext } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/standard-button';
import { Link } from '@atlaskit/linking-types';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import type {
  AnalyticsContextAttributesType,
  AnalyticsContextType,
  PackageMetaDataType,
} from '../../../analytics/generated/analytics.types';
import { useAssetsClient } from '../../../hooks/useAssetsClient';
import { useDatasourceTableState } from '../../../hooks/useDatasourceTableState';
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
  } = useDatasourceTableState({
    datasourceId,
    parameters: isParametersSet ? parameters : undefined,
    fieldKeys: isNewSearch ? [] : visibleColumnKeys,
  });

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
    fireEvent('screen.datasourceModalDialog.viewed', {});
  }, [fireEvent]);

  const isDisabled =
    !!workspaceError ||
    status === 'rejected' ||
    status === 'loading' ||
    status === 'empty' ||
    !!workspaceError ||
    assetsClientLoading ||
    !aql ||
    !schemaId;

  const retrieveUrlForSmartCardRender = useCallback(() => {
    const [data] = responseItems;
    // agreement with BE that we will use `key` for rendering smartlink
    return (data?.key?.data as Link)?.url;
  }, [responseItems]);

  const onInsertPressed = useCallback(() => {
    if (!aql || !schemaId || !workspaceId) {
      return;
    }

    const firstAssetUrl = retrieveUrlForSmartCardRender();
    if (responseItems.length === 1 && firstAssetUrl) {
      onInsert({
        type: 'inlineCard',
        attrs: {
          url: firstAssetUrl,
        },
      });
    } else {
      onInsert({
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
      } as AssetsDatasourceAdf);
    }
  }, [
    aql,
    schemaId,
    workspaceId,
    retrieveUrlForSmartCardRender,
    responseItems.length,
    onInsert,
    datasourceId,
    visibleColumnKeys,
  ]);

  const handleOnSearch = useCallback(
    async (searchAql: string, searchSchemaId: string) => {
      if (schemaId !== searchSchemaId || aql !== searchAql) {
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
              />
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            appearance="default"
            onClick={onCancel}
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
  );
};

const analyticsContextAttributes: AnalyticsContextAttributesType = {
  dataProvider: 'jsm-assets',
};

const analyticsContextData: AnalyticsContextType & PackageMetaDataType = {
  packageName: process.env._PACKAGE_NAME_,
  packageVersion: process.env._PACKAGE_VERSION_,
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
