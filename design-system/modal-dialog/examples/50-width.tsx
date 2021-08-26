/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';
import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import { gridSize } from '@atlaskit/theme/constants';

import ModalDialog, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../src';
import { width } from '../src/internal/constants';

const units = [420, '42%', '42em'];
const sizes: (string | number)[] = width.values;

const containerStyles = css({
  padding: `${gridSize() * 2}px`,
});

const titleStyles = css({
  marginBottom: '0.66em',
});

export default function ModalDemo() {
  const [width, setWidth] = useState<string | number | null>(null);
  const close = useCallback(() => setWidth(null), []);

  const btn = (name: string | number) => (
    <Button key={name} onClick={() => setWidth(name)}>
      {name}
    </Button>
  );

  return (
    <div css={containerStyles}>
      <h4 css={titleStyles}>Sizes</h4>
      <ButtonGroup>{sizes.map(btn)}</ButtonGroup>
      <h4 css={titleStyles}>Units</h4>
      <ButtonGroup>{units.map(btn)}</ButtonGroup>

      <ModalTransition>
        {width && (
          <ModalDialog key={width} onClose={close} width={width}>
            <ModalHeader>
              <ModalTitle>Modal: {String(width)}</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Lorem count="1" />
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle">Secondary Action</Button>
              <Button autoFocus appearance="primary" onClick={close}>
                Close
              </Button>
            </ModalFooter>
          </ModalDialog>
        )}
      </ModalTransition>
    </div>
  );
}
