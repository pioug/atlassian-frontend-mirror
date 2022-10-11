/** @jsx jsx */

import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { useModal } from './hooks';
import { footerItemGap, keylineHeight, padding } from './internal/constants';

const footerStyles = css({
  display: 'flex',

  padding,
  paddingTop: `${padding - keylineHeight}px`,

  position: 'relative',
  alignItems: 'center',
  justifyContent: 'flex-end',

  gap: `${footerItemGap}px`,
});

export interface ModalFooterProps {
  /**
   * Children of modal dialog footer.
   */
  children?: ReactNode;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

/**
 * __Modal footer__
 *
 * A modal footer often contains a primary action and the ability to cancel and close the dialog, though can contain any React element.
 *
 * - [Examples](https://atlassian.design/components/modal-dialog/examples#modal-footer)
 * - [Code](https://atlassian.design/components/modal-dialog/code#modal-footer-props)
 * - [Usage](https://atlassian.design/components/modal-dialog/usage)
 */
const ModalFooter = (props: ModalFooterProps) => {
  const { children, testId: userDefinedTestId } = props;
  const { testId: modalTestId } = useModal();

  const testId = userDefinedTestId || (modalTestId && `${modalTestId}--footer`);

  return (
    <div css={footerStyles} data-testid={testId}>
      {children}
    </div>
  );
};

export default ModalFooter;
