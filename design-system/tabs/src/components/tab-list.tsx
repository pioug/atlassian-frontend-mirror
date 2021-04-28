/** @jsx jsx */
import {
  Children,
  createRef,
  KeyboardEvent,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';

import { jsx } from '@emotion/core';

import GlobalTheme from '@atlaskit/theme/components';
import { ThemeModes } from '@atlaskit/theme/types';

import { useTabList } from '../hooks';
import { TabContext } from '../internal/context';
import { getTabListStyles } from '../internal/styles';
import { onMouseDownBlur } from '../internal/utils';
import { TabListProps } from '../types';

type InnerProps = TabListProps & {
  mode: ThemeModes;
};

const TabListWithMode = (props: InnerProps) => {
  const { children, mode } = props;
  const { tabsId, selected, onChange } = useTabList();

  const ref = createRef<HTMLDivElement>();

  // Don't include any conditional children
  const childrenArray = Children.toArray(children).filter(Boolean);
  const length = childrenArray.length;

  const styles = useMemo(() => getTabListStyles(mode), [mode]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) {
        return;
      }

      // We use aria-posinset so we don't rely on the selected variable
      // If we used the selected variable this would regenerate each time
      // and create an unstable reference
      const selectedIndex =
        parseInt(e.currentTarget.getAttribute('aria-posinset') || '0') - 1;

      const modifier = e.key === 'ArrowRight' ? 1 : -1;
      const newSelected = selectedIndex + modifier;

      if (newSelected < 0 || newSelected >= length) {
        return;
      }

      const newSelectedNode:
        | HTMLElement
        | undefined
        | null = ref.current?.querySelector(`[id='${tabsId}-${newSelected}']`);

      if (newSelectedNode) {
        newSelectedNode.focus();
      }
      onChange(newSelected);
    },
    [length, onChange, tabsId, ref],
  );

  // Memoized so the function isn't recreated each time
  const getTabWithContext = useCallback(
    ({
      tab,
      isSelected,
      index,
    }: {
      tab: ReactNode;
      isSelected: boolean;
      index: number;
    }) => (
      <TabContext.Provider
        value={{
          onClick: () => onChange(index),
          onMouseDown: onMouseDownBlur,
          onKeyDown,
          'aria-setsize': length,
          role: 'tab',
          id: `${tabsId}-${index}`,
          'aria-posinset': index + 1,
          'aria-selected': isSelected,
          'aria-controls': `${tabsId}-${index}-tab`,
          tabIndex: isSelected ? 0 : -1,
        }}
        key={index}
      >
        {tab}
      </TabContext.Provider>
    ),
    [length, onKeyDown, onChange, tabsId],
  );

  return (
    <div role="tablist" css={styles} ref={ref}>
      {childrenArray.map((child, index) =>
        getTabWithContext({
          tab: child,
          index,
          isSelected: index === selected,
        }),
      )}
    </div>
  );
};

export const TabList = (props: TabListProps) => (
  <GlobalTheme.Consumer>
    {({ mode }: { mode: ThemeModes }) => (
      <TabListWithMode {...props} mode={mode} />
    )}
  </GlobalTheme.Consumer>
);

export default TabList;
