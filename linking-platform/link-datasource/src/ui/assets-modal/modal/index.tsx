/** @jsx jsx */
import { useCallback, useMemo, useState } from 'react';

import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';

import { useDatasourceTableState } from '../../../hooks/useDatasourceTableState';
import { AssetsConfigModalProps, AssetsDatasourceParameters } from '../types';

import { modalMessages } from './messages';
import { RenderAssetsContent } from './render-assets-content';
import { ModalContentContainer } from './styled';

export const AssetsConfigModal = (props: AssetsConfigModalProps) => {
  const { datasourceId, parameters: initialParameters, onCancel } = props;
  const [aql] = useState(initialParameters?.aql);
  const [schemaId] = useState(initialParameters?.schemaId);

  const parameters: AssetsDatasourceParameters = useMemo<any | undefined>(
    () => ({
      aql: aql || '',
      schemaId: schemaId || '',
      workspaceId: '' /* TODO FLY-1240: Add workspace Id */,
    }),
    [aql, schemaId],
  );

  const { status, responseItems } = useDatasourceTableState({
    datasourceId,
    parameters,
  });

  const isDisabled =
    status === 'rejected' ||
    status === 'loading' ||
    status === 'empty' ||
    (status === 'resolved' && !responseItems.length);

  const onInsertPressed = useCallback(() => {
    /* Placeholder for inserting of ADF, to do in FLY-1241 */
  }, []);

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
