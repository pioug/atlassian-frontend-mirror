/** @jsx jsx */

import React from 'react';

import { css, jsx } from '@emotion/core';
import { TouchScrollable } from 'react-scrolllock';

import { useModal } from './hooks';
import ScrollContainer from './internal/components/scroll-container';
import { keylineHeight, padding } from './internal/constants';
import useScroll from './internal/hooks/use-scroll';

const bodyStyles = css({
  /* This ensures the body fills the whole space between header and footer. */
  flex: '1 1 auto',
});

/**
 * Adding the padding here avoids cropping the keyline on its sides.
 * The combined vertical spacing is maintained by subtracting the
 * keyline height from header and footer. */
const bodyScrollStyles = css({
  padding: `${keylineHeight}px ${padding}px`,
});

/**
 * Keylines will not be shown if scrolling in viewport so we do
 * not account for them in this case. */
const viewportScrollStyles = css({
  padding: `0px ${padding}px`,
});

export interface ModalBodyProps {
  /**
   * Children of modal dialog footer.
   */
  children: React.ReactNode;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

const ModalBody = (props: ModalBodyProps) => {
  const { children, testId: userDefinedTestId } = props;
  const { testId: modalTestId } = useModal();
  const shouldScrollInViewport = useScroll();

  const testId = userDefinedTestId || (modalTestId && `${modalTestId}--body`);

  return shouldScrollInViewport ? (
    <div css={[bodyStyles, viewportScrollStyles]} data-testid={testId}>
      {children}
    </div>
  ) : (
    <TouchScrollable>
      <ScrollContainer testId={userDefinedTestId || modalTestId}>
        <div css={[bodyStyles, bodyScrollStyles]} data-testid={testId}>
          {children}
        </div>
      </ScrollContainer>
    </TouchScrollable>
  );
};

export default ModalBody;
