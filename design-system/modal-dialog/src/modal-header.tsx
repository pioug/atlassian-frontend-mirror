/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/core';

import { useModal } from './hooks';
import { keylineHeight, padding } from './internal/constants';

const headerStyles = css({
  display: 'flex',

  padding: padding,
  paddingBottom: `${padding - keylineHeight}px`,

  position: 'relative',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export interface ModalHeaderProps {
  /**
   * Children of modal dialog header.
   */
  children?: React.ReactNode;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

const ModalHeader = (props: ModalHeaderProps) => {
  const { children, testId: userDefinedTestId } = props;
  const { testId: modalTestId } = useModal();

  const testId = userDefinedTestId || (modalTestId && `${modalTestId}--header`);

  return (
    <div css={headerStyles} data-testid={testId}>
      {children}
    </div>
  );
};

export default ModalHeader;
