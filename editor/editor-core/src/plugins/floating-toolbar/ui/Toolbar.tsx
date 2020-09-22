import React from 'react';
import { Component } from 'react';
import styled from 'styled-components';
import { EditorView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';

import ButtonGroup from '@atlaskit/button/button-group';
import { ProviderFactory } from '@atlaskit/editor-common';
import { themed } from '@atlaskit/theme/components';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { DN70 } from '@atlaskit/theme/colors';

import { DispatchAnalyticsEvent } from '../../analytics';
import { FloatingToolbarItem } from '../types';
import { compareArrays, shallowEqual } from '../utils';
import Button from './Button';
import Dropdown from './Dropdown';
import Select, { SelectOption } from './Select';
import Separator from './Separator';
import Input from './Input';

const akGridSize = gridSize();

export type Item = FloatingToolbarItem<Function>;

export interface Props {
  items: Array<Item>;
  dispatchCommand: (command?: Function) => void;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  providerFactory?: ProviderFactory;
  className?: string;
  focusEditor?: () => void;
  editorView?: EditorView;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  target?: HTMLElement;
  node: Node;
}

const ToolbarContainer = styled.div`
  background-color: ${themed({ light: 'white', dark: DN70 })};
  border-radius: ${borderRadius()}px;
  box-shadow: 0 0 1px rgba(9, 30, 66, 0.31),
    0 4px 8px -2px rgba(9, 30, 66, 0.25);
  padding: ${akGridSize / 2}px ${akGridSize}px;
  display: flex;
  line-height: 1;
  box-sizing: border-box;
  ${(props: { hasCompactLeftPadding: boolean }) =>
    props.hasCompactLeftPadding ? `padding-left: ${akGridSize / 2}px` : ''};
  & > div {
    align-items: center;
  }
`;

function makeSameType<T>(_a: T, _b: any): _b is T {
  return true;
}

const compareItemWithKeys = <T, U extends keyof T>(
  leftItem: T,
  rightItem: T,
  excludedKeys: Array<U> = [],
): boolean =>
  (Object.keys(leftItem) as Array<U>)
    .filter(key => excludedKeys.indexOf(key) === -1)
    .every(key =>
      leftItem[key] instanceof Object
        ? shallowEqual(leftItem[key], rightItem[key])
        : leftItem[key] === rightItem[key],
    );

export const isSameItem = (leftItem: Item, rightItem: Item): boolean => {
  if (leftItem.type !== rightItem.type) {
    return false;
  }

  switch (leftItem.type) {
    case 'button':
      // Need to typecast `rightItem as typeof leftItem` otherwise we will
      // have to put the `type !==` inside each case.
      return compareItemWithKeys(leftItem, rightItem as typeof leftItem, [
        'type',
        'onClick',
        'onMouseEnter',
        'onMouseLeave',
      ]);
    case 'input':
      return compareItemWithKeys(leftItem, rightItem as typeof leftItem, [
        'type',
        'onSubmit',
        'onBlur',
      ]);
    case 'select':
      if (
        makeSameType(leftItem, rightItem) &&
        Array.isArray(leftItem.options) &&
        Array.isArray(rightItem.options) &&
        !compareArrays(leftItem.options, rightItem.options, (left, right) =>
          compareItemWithKeys(left, right),
        )
      ) {
        return false;
      }
      return compareItemWithKeys(leftItem, rightItem as typeof leftItem, [
        'type',
        'onChange',
        'options',
      ]);
    case 'dropdown':
      if (
        makeSameType(leftItem, rightItem) &&
        Array.isArray(leftItem.options) &&
        Array.isArray(rightItem.options) &&
        !compareArrays(leftItem.options, rightItem.options, (left, right) =>
          compareItemWithKeys(left, right, ['onClick']),
        )
      ) {
        return false;
      }
      return compareItemWithKeys(leftItem, rightItem as typeof leftItem, [
        'type',
        'options',
      ]);
    case 'custom':
      return false;
    case 'separator':
      return compareItemWithKeys(leftItem, rightItem as typeof leftItem);
  }
  return true;
};

export const areSameItems = (
  leftArr?: Array<Item>,
  rightArr?: Array<Item>,
): boolean => {
  if (leftArr === undefined && rightArr === undefined) {
    return true;
  }

  if (leftArr === undefined || rightArr === undefined) {
    return false;
  }

  if (leftArr.length !== rightArr.length) {
    return false;
  }

  return leftArr.every((item, index) => isSameItem(rightArr[index], item));
};

export default class Toolbar extends Component<Props> {
  render() {
    const {
      items,
      dispatchAnalyticsEvent,
      dispatchCommand,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      className,
      editorView,
    } = this.props;
    if (!items || !items.length) {
      return null;
    }

    // Select has left padding of 4px to the border, everything else 8px
    const firstElementIsSelect = items[0].type === 'select';

    return (
      <ToolbarContainer
        aria-label="Floating Toolbar"
        hasCompactLeftPadding={firstElementIsSelect}
        className={className}
      >
        <ButtonGroup>
          {items
            .filter(item => !item.hidden)
            .map((item, idx) => {
              switch (item.type) {
                case 'button':
                  const ButtonIcon = item.icon as React.ComponentClass<any>;
                  return (
                    <Button
                      className={item.className}
                      key={idx}
                      title={item.title}
                      href={item.href}
                      icon={
                        item.icon ? (
                          <ButtonIcon label={item.title} />
                        ) : undefined
                      }
                      appearance={item.appearance}
                      target={item.target}
                      onClick={() => dispatchCommand(item.onClick)}
                      onMouseEnter={() => dispatchCommand(item.onMouseEnter)}
                      onMouseLeave={() => dispatchCommand(item.onMouseLeave)}
                      selected={item.selected}
                      disabled={item.disabled}
                      tooltipContent={item.tooltipContent}
                      testId={item.testId}
                      hideTooltipOnClick={item.hideTooltipOnClick}
                    >
                      {item.showTitle && item.title}
                    </Button>
                  );

                case 'input':
                  return (
                    <Input
                      key={idx}
                      mountPoint={popupsMountPoint}
                      boundariesElement={popupsBoundariesElement}
                      defaultValue={item.defaultValue}
                      placeholder={item.placeholder}
                      onSubmit={value => dispatchCommand(item.onSubmit(value))}
                      onBlur={value => dispatchCommand(item.onBlur(value))}
                    />
                  );

                case 'custom': {
                  return item.render(editorView, idx, dispatchAnalyticsEvent);
                }

                case 'dropdown':
                  const DropdownIcon = item.icon;
                  return (
                    <Dropdown
                      key={idx}
                      title={item.title}
                      icon={DropdownIcon && <DropdownIcon label={item.title} />}
                      dispatchCommand={dispatchCommand}
                      options={item.options}
                      disabled={item.disabled}
                      tooltip={item.tooltip}
                      hideExpandIcon={item.hideExpandIcon}
                      mountPoint={popupsMountPoint}
                      boundariesElement={popupsBoundariesElement}
                      scrollableElement={popupsScrollableElement}
                    />
                  );

                case 'select':
                  return (
                    <Select
                      key={idx}
                      dispatchCommand={dispatchCommand}
                      options={item.options}
                      hideExpandIcon={item.hideExpandIcon}
                      mountPoint={popupsMountPoint}
                      boundariesElement={popupsBoundariesElement}
                      scrollableElement={popupsScrollableElement}
                      defaultValue={item.defaultValue}
                      placeholder={item.placeholder}
                      onChange={selected =>
                        dispatchCommand(item.onChange(selected as SelectOption))
                      }
                      filterOption={item.filterOption}
                    />
                  );

                case 'separator':
                  return <Separator key={idx} />;
              }
            })}
        </ButtonGroup>
      </ToolbarContainer>
    );
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      this.props.node.type !== nextProps.node.type ||
      !areSameItems(this.props.items, nextProps.items)
    );
  }
}
