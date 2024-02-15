/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';
import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import ModalDialog, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../src';

const containerStyles = xcss({
  padding: 'space.200',
});

const titleStyles = css({
  marginBlockEnd: token('space.200', '16px'),
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
    <Box xcss={containerStyles}>
      <h4 id="units-title" css={titleStyles}>
        Units
      </h4>
      <ButtonGroup titleId="units-title">{units.map(btn)}</ButtonGroup>

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
              <Button onClick={close} appearance="primary">
                Close
              </Button>
            </ModalFooter>
          </ModalDialog>
        )}
      </ModalTransition>
    </Box>
  );
}
