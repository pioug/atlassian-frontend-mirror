/** @jsx jsx */
import React, { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';
import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { Inline } from '@atlaskit/primitives';
import { N30, N500, R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

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
  padding: token('space.200', '16px'),
});

const titleStyles = css({
  marginBottom: token('space.200', '16px'),
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
          <CrossIcon
            label="Close Modal"
            primaryColor={token('color.icon.danger', R400)}
            size="small"
          />
        </Button>
      </span>
    </div>
  );
};

const bodyStyles: React.CSSProperties = {
  padding: 90,
  backgroundColor: token('elevation.surface.overlay', N30),
  overflowY: 'auto',
  overflowX: 'hidden',
};

const CustomBody = React.forwardRef<
  HTMLDivElement,
  React.AllHTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div ref={ref} style={bodyStyles}>
    {props.children}
  </div>
));

const CustomFooter = () => {
  const { onClose } = useModal();

  return (
    <ModalFooter>
      <Inline grow="fill" alignBlock="center" spread="space-between">
        <Tooltip content="Some hint text?">
          <Button>Hover Me!</Button>
        </Tooltip>
        <Button appearance="primary" onClick={onClose}>
          Close
        </Button>
      </Inline>
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
            {variant === 'header' && (
              <ModalHeader>
                <ModalTitle>Modal: {variant}</ModalTitle>
              </ModalHeader>
            )}
            {['both', 'custom footer', 'footer'].includes(variant) && (
              <ModalHeader>
                <ModalTitle>Modal: {variant}</ModalTitle>
                <Button onClick={close} appearance="link">
                  <CrossIcon
                    label="Close Modal"
                    primaryColor={token('color.text.subtle', N500)}
                    size="small"
                  />
                </Button>
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
                <Button appearance="primary" onClick={close}>
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
