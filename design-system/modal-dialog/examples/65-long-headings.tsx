import React, { useState } from 'react';

import styled from '@emotion/styled';
import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';

import ModalDialog, { ModalTransition } from '../src';

const oneLineNonBreakableString = 'one line heading without spaces';
const multiLineNonBreakableString = 'multiline heading without spaces';
const oneLineBreakableString = 'one line heading with spaces';
const multiLineBreakableString = 'multiline heading with spaces';

const variants = [
  oneLineNonBreakableString,
  oneLineBreakableString,
  multiLineNonBreakableString,
  multiLineBreakableString,
];

const variantToHeading = (variant: string) => {
  switch (variant) {
    case oneLineNonBreakableString:
    case multiLineNonBreakableString:
      return `ThisIs${'long'.repeat(20)}NonBreakableHeading`;

    case oneLineBreakableString:
    case multiLineBreakableString:
      return `This is ${'long '.repeat(20)} breakable heading`;

    default:
      return 'This should never happen';
  }
};

const variantToMultiline = (variant: string) =>
  [oneLineBreakableString, oneLineNonBreakableString].includes(variant);

const H4 = styled.h4`
  margin-bottom: 0.66em;
`;

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
      <H4>Variants</H4>
      <ButtonGroup>{variants.map(btn)}</ButtonGroup>

      <ModalTransition>
        {variants
          .filter(w => w === isOpen)
          .map(name => (
            <ModalDialog
              key={name}
              appearance="warning"
              actions={actions}
              heading={variantToHeading(name)}
              onClose={close}
              isHeadingMultiline={variantToMultiline(name)}
              width="medium"
            >
              <Lorem count="5" />
            </ModalDialog>
          ))}
      </ModalTransition>
    </div>
  );
}
