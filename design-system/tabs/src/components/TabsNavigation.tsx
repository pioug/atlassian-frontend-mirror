/** @jsx jsx */
import { Component, KeyboardEvent } from 'react';

import { jsx } from '@emotion/core';

import GlobalTheme from '@atlaskit/theme/components';
import { GlobalThemeTokens } from '@atlaskit/theme/types';

import { navStyles, navWrapperStyles } from '../internal/styles';
import { TabData, TabsNavigationProps } from '../types';

import NavLine from './NavLine';

export default class TabsNavigation extends Component<TabsNavigationProps> {
  elementRefs: Array<HTMLElement> = [];

  UNSAFE_componentWillReceiveProps(newProps: TabsNavigationProps) {
    if (newProps.tabs !== this.props.tabs) {
      this.elementRefs = [];
    }
  }

  tabKeyDownHandler = (e: KeyboardEvent<HTMLElement>) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) {
      return;
    }

    const { selected, tabs } = this.props;
    const modifier = e.key === 'ArrowRight' ? 1 : -1;
    const newselectedIndex = tabs.indexOf(selected) + modifier;

    if (newselectedIndex < 0 || newselectedIndex >= tabs.length) {
      return;
    }

    this.onSelect(tabs[newselectedIndex], newselectedIndex);
    this.elementRefs[newselectedIndex].focus();
  };

  onSelect = (selected: TabData, selectedIndex: number) => {
    this.props.onSelect(selected, selectedIndex);
  };

  tabMouseDownHandler = (e: React.MouseEvent<HTMLElement>) =>
    e.preventDefault();

  render() {
    const { selected, component: Item, tabs } = this.props;

    return (
      <GlobalTheme.Consumer>
        {({ mode }: GlobalThemeTokens) => (
          <div css={navWrapperStyles}>
            <NavLine status="normal" mode={mode} />
            <div role="tablist" css={navStyles}>
              {tabs.map((tab, index) => {
                const isSelected = tab === selected;
                const elementProps = {
                  'aria-posinset': index + 1,
                  'aria-selected': isSelected,
                  'aria-setsize': tabs.length,
                  'data-testid': tab.testId,
                  onClick: () => this.onSelect(tab, index),
                  onKeyDown: this.tabKeyDownHandler,
                  onMouseDown: this.tabMouseDownHandler,
                  role: 'tab',
                  tabIndex: isSelected ? 0 : -1,
                };
                const innerRef = (ref: HTMLElement) => {
                  this.elementRefs[index] = ref;
                };

                const itemProps = {
                  elementProps,
                  innerRef,
                  data: tab,
                  isSelected,
                  mode: mode,
                };

                return <Item key={index} {...itemProps} />;
              })}
            </div>
          </div>
        )}
      </GlobalTheme.Consumer>
    );
  }
}
