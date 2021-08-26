/** @jsx jsx */
import React, { useState } from 'react';
import chromatism from 'chromatism';
import { jsx, CSSObject } from '@emotion/core';

import ModalDialog, {
  ModalTransition,
  useModal,
  ModalBody as AKModalBody,
} from '@atlaskit/modal-dialog';

import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import Button from '@atlaskit/button/custom-theme-button';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import { N40A, N30A, N900 } from '@atlaskit/theme/colors';

import { DROPBOX_IFRAME_NAME } from './constants';

const gridSize = gridSizeFn();

const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.AllHTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div ref={ref} style={{ height: '100%' }}>
      {props.children}
    </div>
  );
});

const iframeStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0 0 3px 3px',
};

/*
BC: I have stolen hexToRGBA and bottomShadow from atlassian-navigation. Having a direct dependency
on Atlassian navigation seemed bad, but wanted to get us close enough. Finding a
better solution to have this as common would be good.
*/
const hexToRGBA = (hex: string, opacity: number = 1) => {
  const rgba = { ...chromatism.convert(hex).rgb, ...{ a: opacity } };

  return `rgba(${Object.values(rgba).join(', ')})`;
};

const bottomShadow: CSSObject = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  '&:after': {
    content: '""',
    left: 0,
    right: 0,
    position: 'absolute',
    top: '33px',
    height: gridSize / 2,
    background: `linear-gradient(180deg, ${N40A} 0, ${N40A} 1px, ${N30A} 1px, ${hexToRGBA(
      N900,
      0,
    )} 4px)`,
  },
};

const spacingDivStyle = { width: '28px' };
const headingStyle = { marginTop: '8px' };

const Header = () => {
  const { onClose, titleId } = useModal();
  return (
    <div css={bottomShadow}>
      {/* This div is offsetting the button to the right */}
      <div css={spacingDivStyle} />
      <h5 id={titleId} css={headingStyle}>
        Dropbox
      </h5>
      <div>
        <Button
          appearance="subtle"
          iconBefore={<EditorCloseIcon label="close dropbox modal" />}
          onClick={onClose}
        />
      </div>
    </div>
  );
};

const Modal = ({
  onClose,
  TEST_ONLY_src,
  showModal,
}: {
  onClose: () => any;
  TEST_ONLY_src?: string;
  showModal?: boolean;
}) => {
  let [isOpen, setIsOpen] = useState(true);

  if (typeof showModal === 'boolean' && isOpen !== showModal) {
    setIsOpen(showModal);
  }

  return (
    <ModalTransition>
      {isOpen && (
        <ModalDialog
          height="100%"
          width="large"
          onClose={() => {
            setIsOpen(false);
            onClose();
          }}
        >
          <Header />
          <AKModalBody>
            <ModalBody>
              {TEST_ONLY_src ? (
                <iframe
                  css={iframeStyle}
                  name={DROPBOX_IFRAME_NAME}
                  frameBorder={0}
                  src={TEST_ONLY_src}
                />
              ) : (
                <iframe
                  css={iframeStyle}
                  name={DROPBOX_IFRAME_NAME}
                  frameBorder={0}
                />
              )}
            </ModalBody>
          </AKModalBody>
        </ModalDialog>
      )}
    </ModalTransition>
  );
};

export default Modal;
