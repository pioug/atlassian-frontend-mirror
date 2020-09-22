/** @jsx jsx */

import { forwardRef, ReactNode, Ref } from 'react';

import { jsx } from '@emotion/core';

import { containerStyles } from './styles';

type Alignment = 'start' | 'end';

interface Props {
  /** Whether the tags should be left-aligned or right-aligned. */
  alignment?: Alignment;
  /** Tags to render within the tag group. */
  children: ReactNode;
}

const TagGroup = forwardRef((props: Props, ref: Ref<any>) => {
  const { alignment = 'start', children } = props;
  return (
    <div ref={ref} css={containerStyles(alignment)}>
      {children}
    </div>
  );
});

export default TagGroup;
