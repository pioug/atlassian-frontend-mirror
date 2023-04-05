/**
 * Module loaded synchronously.
 * Must minimise dependencies.
 * */

import React from 'react';
import { default as Modal } from '@atlaskit/media-ui/modalSpinner';
import { useThemeObserver } from '@atlaskit/tokens';

export const headerAndSidebarBackgroundColor = '#101214';

const ModalSpinner = () => {
  const { colorMode } = useThemeObserver();

  return (
    <Modal
      blankedColor={headerAndSidebarBackgroundColor}
      invertSpinnerColor={colorMode !== 'dark'}
    />
  );
};

export default ModalSpinner;
