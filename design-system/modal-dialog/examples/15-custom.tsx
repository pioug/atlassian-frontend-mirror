import React, { FC, useState } from 'react';

import styled from '@emotion/styled';
import Lorem from 'react-lorem-component';

import Avatar from '@atlaskit/avatar';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import InlineDialog from '@atlaskit/inline-dialog';
import { N30, R400, subtleText } from '@atlaskit/theme/colors';

import ModalDialog, { ModalFooter, ModalTransition } from '../src';
import { FooterComponentProps } from '../src/internal/components/footer';
import { HeaderComponentProps } from '../src/internal/components/header';

const defaults = ['header', 'footer', 'both', 'neither'];
const custom = ['custom header', 'custom body', 'custom footer'];
const variants = defaults.concat(custom);

const H4 = styled.h4`
  margin-bottom: 0.66em;
`;

const Hint = styled.span`
  align-items: center;
  color: ${subtleText};
  cursor: help;
  display: flex;
`;

const HintText = styled.span`
  margin-left: 1em;
`;

const headerStyles: React.CSSProperties = {
  background:
    'url(https://atlassian.design/react_assets/images/cards/personality.png) center top no-repeat',
  backgroundSize: 'cover',
  borderRadius: '4px 4px 0 0',
  paddingTop: 170,
  position: 'relative',
};

const Header: FC<HeaderComponentProps> = ({ onClose }) => (
  <div style={headerStyles}>
    <span style={{ position: 'absolute', right: 0, top: 4 }}>
      <Button onClick={onClose} appearance="link">
        <CrossIcon label="Close Modal" primaryColor={R400} size="small" />
      </Button>
    </span>
  </div>
);

const bodyStyles: React.CSSProperties = {
  padding: 90,
  backgroundColor: N30,
  overflowY: 'auto',
  overflowX: 'hidden',
};

const Body = React.forwardRef<
  HTMLDivElement,
  React.AllHTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div ref={ref} style={bodyStyles}>
      {props.children}
    </div>
  );
});

function Footer(props: FooterComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <ModalFooter>
      <InlineDialog
        content="Some hint text?"
        isOpen={isOpen}
        placement="top-start"
      >
        {/* eslint-disable-next-line styled-components-a11y/no-static-element-interactions */}
        <Hint onMouseEnter={open} onMouseLeave={close}>
          <Avatar size="small" />
          <HintText>Hover Me!</HintText>
        </Hint>
      </InlineDialog>
      <Button appearance="subtle" onClick={props.onClose}>
        Close
      </Button>
    </ModalFooter>
  );
}

export default function ModalDemo() {
  const [isOpen, setIsOpen] = useState('');
  const open = (name: string) => setIsOpen(name);
  const close = () => setIsOpen('');

  const btn = (name: string) => (
    <Button key={name} onClick={() => open(name)}>
      {name}
    </Button>
  );
  const actions = [
    { text: 'Close', onClick: close },
    { text: 'Secondary Action' },
  ];

  return (
    <div style={{ padding: 16 }}>
      <H4>Default Header/Footer</H4>
      <ButtonGroup>{defaults.map(btn)}</ButtonGroup>

      <H4>Custom Components</H4>
      <ButtonGroup>{custom.map(btn)}</ButtonGroup>

      <ModalTransition>
        {variants
          .filter((w) => w === isOpen)
          .map((name) => (
            <ModalDialog
              key={name}
              actions={['footer', 'both'].includes(name) ? actions : undefined}
              components={{
                Header: name === 'custom header' ? Header : undefined,
                Body: name === 'custom body' ? Body : undefined,
                Footer: name === 'custom footer' ? Footer : undefined,
                Container: 'div',
              }}
              heading={
                ['header', 'both'].includes(name) ? `Modal: ${name}` : undefined
              }
              onClose={close}
              width={name === 'custom header' ? 300 : undefined}
            >
              <Lorem count="5" />
            </ModalDialog>
          ))}
      </ModalTransition>
    </div>
  );
}
