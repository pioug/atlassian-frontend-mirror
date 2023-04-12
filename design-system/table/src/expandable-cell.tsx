/** @jsx jsx */
import { memo, useCallback } from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button';

import useExpand from './hooks/use-expand';
import * as Primitives from './ui';

/**
 * __Expandable cell__
 *
 * A cell with an expand button that controls the expanded state
 * of the `<ExpandableRow>`.
 */
const ExpandableCell = memo(() => {
  const { isExpanded, toggleExpanded } = useExpand();

  const handleClick = useCallback(() => {
    toggleExpanded();
  }, [toggleExpanded]);

  return (
    <Primitives.ExpandableCell as="td">
      <Button
        spacing="compact"
        appearance="subtle"
        iconAfter={<Primitives.ExpandIcon isExpanded={isExpanded} />}
        onClick={handleClick}
        aria-pressed={isExpanded}
        aria-label="Expand row"
      />
    </Primitives.ExpandableCell>
  );
});

export default ExpandableCell;
