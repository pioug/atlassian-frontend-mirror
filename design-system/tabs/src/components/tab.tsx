/** @jsx jsx */
import { jsx } from '@emotion/react';

import { UNSAFE_Text as Text } from '@atlaskit/ds-explorations';
import FocusRing from '@atlaskit/focus-ring';

import { useTab } from '../hooks';
import { TabAttributesType, TabProps } from '../types';

/**
 * __Tab__
 *
 * Tab represents an indivudal Tab displayed in a TabList.
 *
 * - [Examples](https://atlassian.design/components/tabs/examples)
 * - [Code](https://atlassian.design/components/tabs/code)
 * - [Usage](https://atlassian.design/components/tabs/usage)
 */
export default function Tab({ children, testId }: TabProps) {
  const {
    onClick,
    id,
    'aria-controls': ariaControls,
    'aria-posinset': ariaPosinset,
    'aria-selected': ariaSelected,
    'aria-setsize': ariaSetsize,
    onMouseDown,
    onKeyDown,
    role,
    tabIndex,
  }: TabAttributesType = useTab();

  return (
    <FocusRing isInset>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        data-testid={testId}
        onClick={onClick}
        id={id}
        aria-controls={ariaControls}
        aria-posinset={ariaPosinset}
        aria-selected={ariaSelected}
        aria-setsize={ariaSetsize}
        onMouseDown={onMouseDown}
        onKeyDown={onKeyDown}
        role={role}
        tabIndex={tabIndex}
      >
        <Text shouldTruncate UNSAFE_style={{ color: 'inherit' }}>
          {children}
        </Text>
      </div>
    </FocusRing>
  );
}
