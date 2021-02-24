/** @jsx jsx */
import { useRef, useState, ComponentType, FC } from 'react';
import { css, jsx } from '@emotion/core';

import Textfield from '@atlaskit/textfield';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import Tooltip from '@atlaskit/tooltip';
import { gridSize } from '@atlaskit/theme/constants';
import { N30A } from '@atlaskit/theme/colors';

const iconExplorerLink = css`
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

const IconModalHeader: FC = props => (
  // eslint-disable-next-line jsx-a11y/heading-has-content
  <h3
    css={css`
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      padding: 20px;
    `}
    {...props}
  />
);

const Divider: FC = props => (
  // eslint-disable-next-line jsx-a11y/heading-has-content
  <h4
    css={css`
      width: 100%;
      text-align: center;
    `}
    {...props}
  />
);

interface Props {
  component: ComponentType<any>;
  componentName: string;
  package?: string;
  divider?: boolean;
  namedImport?: boolean;
}

const IconExplorerCell: FC<Props> = ({
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
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, jsx-a11y/anchor-is-valid */}
        <a css={iconExplorerLink} onClick={openModal}>
          <Icon label={componentName} size="medium" />
        </a>
      </Tooltip>
      <ModalTransition>{isModalOpen ? modal : null}</ModalTransition>
    </div>
  );
};

export default IconExplorerCell;
