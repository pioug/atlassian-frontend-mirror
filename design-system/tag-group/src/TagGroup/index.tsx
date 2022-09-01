/** @jsx jsx */

import { forwardRef, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

type Alignment = 'start' | 'end';

interface TagGroupProps {
  /**
   * Whether the tags should be left-aligned or right-aligned.
   */
  alignment?: Alignment;
  /**
   * Tags to render within the tag group.
   */
  children: ReactNode;
}

const baseStyles = css({
  display: 'flex',
  width: '100%',
  flexWrap: 'wrap',
});

const justifyStartStyles = css({ justifyContent: 'flex-start' });
const justifyEndStyles = css({ justifyContent: 'flex-end' });

/**
 * __Tag group__
 *
 * A tag group controls the layout and alignment for a collection of tags.
 *
 * - [Examples](https://atlassian.design/components/tag-group/examples)
 * - [Code](https://atlassian.design/components/tag-group/code)
 * - [Usage](https://atlassian.design/components/tag-group/usage)
 */
const TagGroup = forwardRef<any, TagGroupProps>(
  ({ alignment = 'start', children }, ref) => {
    return (
      <div
        ref={ref}
        css={[
          baseStyles,
          alignment === 'start' && justifyStartStyles,
          alignment === 'end' && justifyEndStyles,
        ]}
      >
        {children}
      </div>
    );
  },
);

export default TagGroup;
