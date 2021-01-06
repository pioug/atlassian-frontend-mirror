import React, { useRef, useState, ComponentType, FC } from 'react';
import styled from 'styled-components';

import Textfield from '@atlaskit/textfield';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import Tooltip from '@atlaskit/tooltip';
import { gridSize } from '@atlaskit/theme/constants';
import { N30A } from '@atlaskit/theme/colors';

const IconExplorerLink = styled.a`
  &,
  &:hover,
  &:active,
  &:focus {
    border-radius: ${gridSize() / 2}px;
    color: inherit;
    cursor: pointer;
    display: block;
    line-height: 0;
    padding: 10px;
  }

  &:hover {
    background: ${N30A};
  }
`;

const IconModalHeader = styled.h3`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
`;

const Divider = styled.h4`
  width: 100%;
  text-align: center;
`;

interface Props {
  component: ComponentType<any>;
  componentName: string;
  package?: string;
  divider?: boolean;
  namedImport?: boolean;
}

interface State {
  isModalOpen: boolean;
}

const IconExplorerCell: FC<Props> = ({
  component: Icon,
  componentName,
  package: packageName,
  divider,
  namedImport: isNamedImport,
}) => {
  const inputEl = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<State>({
    isModalOpen: false,
  });

  const closeModal = () => setState({ isModalOpen: false });
  const openModal = () => setState({ isModalOpen: true });
  const copyToClipboard = () => {
    if (!state.isModalOpen || !inputEl) {
      return;
    }

    try {
      inputEl.current!.select();
      const wasCopied = document.execCommand('copy');

      if (!wasCopied) {
        throw new Error();
      }
    } catch (err) {
      console.error('Unable to copy text');
    }
  };

  if (divider) {
    return (
      <Divider>
        <Icon />
      </Divider>
    );
  }

  const importStatement = isNamedImport
    ? `import { ${componentName} } from '${packageName}';`
    : `import ${componentName} from '${packageName}';`;

  const modal = (
    <Modal
      onClose={closeModal}
      components={{
        Header: () => (
          <IconModalHeader>
            <Icon label={componentName} size="medium" />
            {componentName}
          </IconModalHeader>
        ),
      }}
      actions={[
        {
          text: 'Copy',
          onClick: copyToClipboard,
        },
        {
          text: 'Close',
          onClick: closeModal,
        },
      ]}
    >
      <div
        onClick={() => inputEl && inputEl.current!.select()}
        role="presentation"
      >
        <Textfield isReadOnly value={importStatement} ref={inputEl} />
      </div>
    </Modal>
  );

  return (
    <div>
      <Tooltip content={componentName}>
        {/* eslint-disable-next-line styled-components-a11y/anchor-is-valid,styled-components-a11y/click-events-have-key-events,styled-components-a11y/no-static-element-interactions */}
        <IconExplorerLink onClick={openModal}>
          <Icon label={componentName} size="medium" />
        </IconExplorerLink>
      </Tooltip>
      <ModalTransition>{state.isModalOpen ? modal : null}</ModalTransition>
    </div>
  );
};

export default IconExplorerCell;
