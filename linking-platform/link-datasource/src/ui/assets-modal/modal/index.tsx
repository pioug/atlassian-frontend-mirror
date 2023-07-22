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
import {
  AssetsConfigModalProps,
  AssetsDatasourceAdf,
  AssetsDatasourceParameters,
} from '../types';

import { modalMessages } from './messages';
import { RenderAssetsContent } from './render-assets-content';
import { ModalContentContainer } from './styled';

export const AssetsConfigModal = (props: AssetsConfigModalProps) => {
  const {
    datasourceId,
    parameters: initialParameters,
    onCancel,
    onInsert,
    visibleColumnKeys: initialVisibleColumnKeys,
  } = props;
  const [aql] = useState(initialParameters?.aql);
  const [schemaId] = useState(initialParameters?.schemaId);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(
    initialVisibleColumnKeys,
  );

  const { workspaceId } = useAssetsClient();
  const parameters: AssetsDatasourceParameters = useMemo<any | undefined>(
    () => ({
      aql: aql || '',
      schemaId: schemaId || '',
      workspaceId: '' /* TODO FLY-1240: Add workspace Id */,
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
    !aql ||
    !workspaceId ||
    !schemaId;

  const retrieveUrlForSmartCardRender = useCallback(() => {
    const [data] = responseItems;
    // agreement with BE that we will use `key` for rendering smartlink
    return (data?.key?.data as Link)?.url;
  }, [responseItems]);

  const onInsertPressed = useCallback(() => {
    if (!aql) {
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

  return (
    <ModalTransition>
      <Modal
        testId={'asset-datasource-modal'}
        onClose={onCancel}
        width="x-large"
        shouldScrollInViewport={true}
      >
        <ModalHeader>
          <ModalTitle></ModalTitle>
        </ModalHeader>
        <ModalBody>
          <ModalContentContainer>
            <RenderAssetsContent
              status={status}
              responseItems={responseItems}
            />
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
