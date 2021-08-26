/** @jsx jsx */
import React, { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';
import Lorem from 'react-lorem-component';

import Avatar from '@atlaskit/avatar';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import InlineDialog from '@atlaskit/inline-dialog';
import { N30, R400, subtleText } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

import ModalDialog, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
  useModal,
} from '../src';

const defaults = ['header', 'footer', 'both', 'neither'];
const custom = ['custom header', 'custom body', 'custom footer'];

const containerStyles = css({
  padding: `${gridSize() * 2}px`,
});

const titleStyles = css({
  marginBottom: '0.66em',
});

const hintStyles = css({
  display: 'flex',
  marginRight: 'auto',
  alignItems: 'center',
  color: subtleText(),
  cursor: 'help',
});

const hintTextStyles = css({
  marginLeft: '1em',
});

const headerStyles: React.CSSProperties = {
  background:
    'url(https://atlassian.design/react_assets/images/cards/personality.png) center top no-repeat',
  backgroundSize: 'cover',
  borderRadius: '4px 4px 0 0',
  paddingTop: 170,
  position: 'relative',
};

const CustomHeader = () => {
  const { onClose } = useModal();

  return (
    <div style={headerStyles}>
      <span style={{ position: 'absolute', right: 0, top: 4 }}>
        <Button onClick={onClose} appearance="link">
          <CrossIcon label="Close Modal" primaryColor={R400} size="small" />
        </Button>
      </span>
    </div>
  );
};

const bodyStyles: React.CSSProperties = {
  padding: 90,
  backgroundColor: N30,
  overflowY: 'auto',
  overflowX: 'hidden',
};

const CustomBody = React.forwardRef<
  HTMLDivElement,
  React.AllHTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div ref={ref} style={bodyStyles}>
      {props.children}
    </div>
  );
});

const CustomFooter = () => {
  const [isHintOpen, setIsHintOpen] = useState(false);
  const openHint = useCallback(() => setIsHintOpen(true), []);
  const closeHint = useCallback(() => setIsHintOpen(false), []);

  const { onClose } = useModal();

  return (
    <ModalFooter>
      <InlineDialog
        content="Some hint text?"
        isOpen={isHintOpen}
        placement="top-start"
      >
        {/* eslint-disable-next-line styled-components-a11y/no-static-element-interactions */}
        <span css={hintStyles} onMouseEnter={openHint} onMouseLeave={closeHint}>
          <Avatar size="small" />
          <span css={hintTextStyles}>Hover Me!</span>
        </span>
      </InlineDialog>
      <Button appearance="primary" onClick={onClose}>
        Close
      </Button>
    </ModalFooter>
  );
};

export default function ModalDemo() {
  const [variant, setVariant] = useState<string | null>(null);
  const open = useCallback((name: string) => setVariant(name), []);
  const close = useCallback(() => setVariant(null), []);

  const btn = (name: string) => (
    <Button key={name} onClick={() => open(name)}>
      {name}
    </Button>
  );

  return (
    <div css={containerStyles}>
      <h4 css={titleStyles}>Default Header/Footer</h4>
      <ButtonGroup>{defaults.map(btn)}</ButtonGroup>

      <h4 css={titleStyles}>Custom Components</h4>
      <ButtonGroup>{custom.map(btn)}</ButtonGroup>

      <ModalTransition>
        {variant && (
          <ModalDialog
            key={variant}
            onClose={close}
            width={variant === 'custom header' ? 300 : undefined}
          >
            {variant === 'custom header' && <CustomHeader />}
            {['header', 'both'].includes(variant) && (
              <ModalHeader>
                <ModalTitle>Modal: {variant}</ModalTitle>
              </ModalHeader>
            )}

            {variant === 'custom body' ? (
              <CustomBody>
                <Lorem count="5" />
              </CustomBody>
            ) : (
              <ModalBody>
                <Lorem count="5" />
              </ModalBody>
            )}

            {variant === 'custom footer' && <CustomFooter />}
            {['footer', 'both'].includes(variant) && (
              <ModalFooter>
                <Button appearance="subtle">Secondary Action</Button>
                <Button autoFocus appearance="primary" onClick={close}>
                  Close
                </Button>
              </ModalFooter>
            )}
          </ModalDialog>
        )}
      </ModalTransition>
    </div>
  );
}
