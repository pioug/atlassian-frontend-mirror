import React, { useRef, useState, ComponentType, FC } from 'react';
import styled from '@emotion/styled';

import Textfield from '@atlaskit/textfield';
import Button from '@atlaskit/button/standard-button';
import Modal, {
  ModalTransition,
  ModalBody,
  ModalFooter,
} from '@atlaskit/modal-dialog';
import Tooltip from '@atlaskit/tooltip';
import { gridSize } from '@atlaskit/theme/constants';
import { N30A } from '@atlaskit/theme/colors';

const IconExplorerLink = styled.a`
  &,
  &:hover,
  &:active,
  &:focus {
    display: block;
    padding: 10px;
    border-radius: ${gridSize() / 2}px;
    color: inherit;
    cursor: pointer;
    line-height: 0;
  }
  &:hover {
    background: ${N30A};
  }
`;

const IconModalHeader = styled.h3`
  display: flex;
  padding: 20px;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
`;

const Divider = styled.h4`
  width: 100%;
  text-align: center;
`;

interface IconExplorerCellProps {
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  component: ComponentType<any>;
  componentName: string;
  package?: string;
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  divider?: boolean;
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  namedImport?: boolean;
}

const IconExplorerCell: FC<IconExplorerCellProps> = ({
  component: Icon,
  componentName,
  package: packageName,
  divider,
  namedImport: isNamedImport,
}) => {
  const inputEl = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);
  const copyToClipboard = () => {
    if (!isModalOpen || !inputEl) {
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
    <Modal onClose={closeModal}>
      <IconModalHeader>
        <Icon label={componentName} size="medium" />
        {componentName}
      </IconModalHeader>
      <ModalBody>
        <div
          onClick={() => inputEl && inputEl.current!.select()}
          role="presentation"
        >
          <Textfield isReadOnly value={importStatement} ref={inputEl} />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} appearance="subtle">
          Close
        </Button>
        <Button onClick={copyToClipboard} appearance="primary" autoFocus>
          Copy
        </Button>
      </ModalFooter>
    </Modal>
  );

  return (
    <div>
      <Tooltip content={componentName}>
        {/* eslint-disable-next-line styled-components-a11y/click-events-have-key-events, styled-components-a11y/no-static-element-interactions, styled-components-a11y/anchor-is-valid */}
        <IconExplorerLink onClick={openModal}>
          <Icon label={componentName} size="medium" />
        </IconExplorerLink>
      </Tooltip>
      <ModalTransition>{isModalOpen ? modal : null}</ModalTransition>
    </div>
  );
};

export default IconExplorerCell;
