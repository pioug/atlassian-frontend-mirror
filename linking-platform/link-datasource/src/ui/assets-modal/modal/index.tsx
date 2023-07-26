/** @jsx jsx */
import { useCallback, useEffect, useMemo, useState } from 'react';

import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { Link } from '@atlaskit/linking-types';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';

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
import { ModalContentContainer } from './styled';

const AssetsModalTitle = (
  <ModalTitle>
    <FormattedMessage {...modalMessages.insertObjectsTitle} />
  </ModalTitle>
);

export const AssetsConfigModal = (props: AssetsConfigModalProps) => {
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

  // If a workspaceError occurs this is a critical error
  const { workspaceId, workspaceError, objectSchema, assetsClientLoading } =
    useAssetsClient(initialParameters);

  const parameters = useMemo<AssetsDatasourceParameters>(
    () => ({
      aql: aql || '',
      schemaId: schemaId || '',
      workspaceId: '',
      cloudId: '',
    }),
    [aql, schemaId],
  );
  const { status, responseItems, defaultVisibleColumnKeys } =
    useDatasourceTableState({
      datasourceId,
      parameters,
    });

  useEffect(() => {
    const newVisibleColumnKeys =
      !initialVisibleColumnKeys || (initialVisibleColumnKeys || []).length === 0
        ? defaultVisibleColumnKeys
        : initialVisibleColumnKeys;

    setVisibleColumnKeys(newVisibleColumnKeys);
  }, [initialVisibleColumnKeys, defaultVisibleColumnKeys]);

  const isDisabled =
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
    if (!aql || !schemaId) {
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
              cloudId: '', // TODO FLY-1278: get actual cloudID
              aql: aql,
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
    datasourceId,
    onInsert,
    responseItems.length,
    retrieveUrlForSmartCardRender,
    schemaId,
    visibleColumnKeys,
  ]);

  const handleOnSearch = useCallback((aql: string, schemaId: string) => {
    setAql(aql);
    setSchemaId(schemaId);
  }, []);

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
        />
      );
    }
  }, [
    aql,
    assetsClientLoading,
    handleOnSearch,
    objectSchema,
    workspaceError,
    workspaceId,
  ]);

  return (
    <ModalTransition>
      <Modal
        testId={'asset-datasource-modal'}
        onClose={onCancel}
        width="x-large"
        shouldScrollInViewport={true}
      >
        <ModalHeader>{renderModalTitleContent()}</ModalHeader>
        <ModalBody>
          <ModalContentContainer>
            {workspaceError ? (
              <ModalLoadingError />
            ) : (
              <RenderAssetsContent
                status={status}
                responseItems={responseItems}
              />
            )}
          </ModalContentContainer>
        </ModalBody>
        <ModalFooter>
          <Button appearance="default" onClick={onCancel}>
            <FormattedMessage {...modalMessages.cancelButtonText} />
          </Button>
          <Button
            appearance="primary"
            onClick={onInsertPressed}
            isDisabled={isDisabled}
            testId={'asset-datasource-modal--insert-button'}
          >
            <FormattedMessage {...modalMessages.insertIssuesButtonText} />
          </Button>
        </ModalFooter>
      </Modal>
    </ModalTransition>
  );
};
