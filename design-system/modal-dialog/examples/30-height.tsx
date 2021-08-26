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

const containerStyles = css({
  padding: `${gridSize() * 2}px`,
});

const titleStyles = css({
  marginBottom: '0.66em',
});

const units = [420, '42em', '100%'];

export default function ModalDemo() {
  const [height, setHeight] = useState<number | string | null>(null);
  const close = useCallback(() => setHeight(null), []);

  const btn = (name: string | number) => (
    <Button key={name} onClick={() => setHeight(name)}>
      {name}
    </Button>
  );

  return (
    <div css={containerStyles}>
      <h4 css={titleStyles}>Units</h4>
      <ButtonGroup>{units.map(btn)}</ButtonGroup>

      <ModalTransition>
        {height && (
          <ModalDialog key={height} onClose={close} height={height}>
            <ModalHeader>
              <ModalTitle>Modal: {height}</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Lorem count="1" />
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle">Secondary Action</Button>
              <Button autoFocus onClick={close} appearance="primary">
                Close
              </Button>
            </ModalFooter>
          </ModalDialog>
        )}
      </ModalTransition>
    </div>
  );
}
