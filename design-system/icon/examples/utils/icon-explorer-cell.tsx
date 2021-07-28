/** @jsx jsx */
import { useRef, useState, ComponentType, FC } from 'react';
import { css, jsx } from '@emotion/core';

import Textfield from '@atlaskit/textfield';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import Tooltip from '@atlaskit/tooltip';
import { gridSize } from '@atlaskit/theme/constants';
import { N30A } from '@atlaskit/theme/colors';

const iconExplorerLinkStyles = css({
  '&,&:hover,&:active,&:focus': {
    display: 'block',
    padding: 10,
    borderRadius: gridSize() / 2,
    color: 'inherit',
    cursor: 'pointer',
    lineHeight: 0,
  },
  '&:hover': {
    background: N30A,
  },
});

const iconModalHeaderStyles = css({
  display: 'flex',
  padding: 20,
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexDirection: 'row',
});

const IconModalHeader: FC = (props) => (
  <h3 css={iconModalHeaderStyles} {...props}>
    {props.children}
  </h3>
);

const dividerStyles = css({
  width: '100%',
  textAlign: 'center',
});

const Divider: FC = (props) => (
  <h4 css={dividerStyles} {...props}>
    {props.children}
  </h4>
);

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
        <a css={iconExplorerLinkStyles} onClick={openModal}>
          <Icon label={componentName} size="medium" />
        </a>
      </Tooltip>
      <ModalTransition>{isModalOpen ? modal : null}</ModalTransition>
    </div>
  );
};

export default IconExplorerCell;
