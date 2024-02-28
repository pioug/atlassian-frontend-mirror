/** @jsx jsx */
import { memo, useCallback } from 'react';

import { jsx } from '@emotion/react';

import { IconButton } from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';

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
      <IconButton
        spacing="compact"
        appearance="subtle"
        icon={isExpanded ? ChevronUpIcon : ChevronDownIcon}
        label="Expand row"
        UNSAFE_size="small"
        onClick={handleClick}
        aria-pressed={isExpanded}
      />
    </Primitives.ExpandableCell>
  );
});

export default ExpandableCell;
