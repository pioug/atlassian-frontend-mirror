/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';

import ButtonGroup from '@atlaskit/button/button-group';
import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { themed } from '@atlaskit/theme/components';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { DN70 } from '@atlaskit/theme/colors';

import { getFeatureFlags } from '../../feature-flags-context';
import { DispatchAnalyticsEvent } from '../../analytics';
import { FloatingToolbarItem } from '../types';
import { compareArrays, shallowEqual } from '../utils';
import { showConfirmDialog } from '../pm-plugins/toolbar-data/commands';
import Button from './Button';
import Dropdown from './Dropdown';
import Select, { SelectOption } from './Select';
import Separator from './Separator';
import Input from './Input';
import { ExtensionsPlaceholder } from './ExtensionsPlaceholder';
import ColorPickerButton from '../../../ui/ColorPickerButton';
import { PaletteColor } from '../../../ui/ColorPalette/Palettes';
import { EmojiPickerButton } from './EmojiPickerButton';
import Announcer from '../../../utils/announcer/announcer';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';
import messages from './messages';
import { ThemeProps } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import { decorationStateKey, ACTIONS } from '../../base/pm-plugins/decoration';

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
  extensionsProvider?: ExtensionProvider;
}

const toolbarContainer = (theme: ThemeProps) => css`
  background-color: ${themed({
    light: token('elevation.surface.overlay', 'white'),
    dark: token('elevation.surface.overlay', DN70),
  })(theme)};
  border-radius: ${borderRadius()}px;
  box-shadow: ${token(
    'elevation.shadow.overlay',
    `0 0 1px rgba(9, 30, 66, 0.31), 0 4px 8px -2px rgba(9, 30, 66, 0.25)`,
  )};
  padding: ${akGridSize / 2}px ${akGridSize}px;
  display: flex;
  line-height: 1;
  box-sizing: border-box;

  & > div {
    align-items: center;
  }
`;

const toolbarContainerLeftPadding = css`
  padding-left: ${akGridSize / 2}px;
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
    .filter((key) => excludedKeys.indexOf(key) === -1)
    .every((key) =>
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
        !compareArrays(
          leftItem.options as any,
          rightItem.options as any,
          (left, right) => compareItemWithKeys(left, right),
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
    case 'extensions-placeholder':
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

class Toolbar extends Component<Props & WrappedComponentProps> {
  // remove any decorations added by toolbar buttons i.e danger and selected styling
  // this prevents https://product-fabric.atlassian.net/browse/ED-10207
  private resetStyling({ table }: { table: boolean }) {
    if (this.props.editorView) {
      const { state, dispatch } = this.props.editorView;
      // tables use their own decorations
      // TODO fix for tables https://product-fabric.atlassian.net/jira/servicedesk/projects/DTR/queues/issue/DTR-617
      if (table) {
        return null;
      }
      dispatch(
        state.tr.setMeta(decorationStateKey, {
          action: ACTIONS.DECORATION_REMOVE,
        }),
      );
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.node !== prevProps.node) {
      this.resetStyling({
        table: prevProps?.node.type.name === 'table',
      });
    }
  }

  componentWillUnmount() {
    this.resetStyling({
      table: this.props.node.type.name === 'table',
    });
  }

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
      node,
      extensionsProvider,
      providerFactory,
      intl,
    } = this.props;
    if (!items || !items.length) {
      return null;
    }

    // Select has left padding of 4px to the border, everything else 8px
    const firstElementIsSelect = items[0].type === 'select';

    return (
      <div
        css={(theme: ThemeProps) => {
          return [
            toolbarContainer({ theme }),
            firstElementIsSelect && toolbarContainerLeftPadding,
          ];
        }}
        aria-label={intl.formatMessage(messages.floatingToolbarAriaLabel)}
        className={className}
      >
        <Announcer
          text={intl.formatMessage(messages.floatingToolbarAnnouncer)}
          delay={250}
        />
        <ButtonGroup>
          {items
            .filter((item) => !item.hidden)
            .map((item, idx) => {
              switch (item.type) {
                case 'button':
                  const ButtonIcon = item.icon as React.ComponentClass<any>;

                  const onClickHandler = () => {
                    if (item.confirmDialog) {
                      dispatchCommand(showConfirmDialog(idx));
                    } else {
                      dispatchCommand(item.onClick);
                    }
                  };

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
                      onClick={onClickHandler}
                      onMouseEnter={() => dispatchCommand(item.onMouseEnter)}
                      onMouseLeave={() => dispatchCommand(item.onMouseLeave)}
                      onFocus={() => dispatchCommand(item.onFocus)}
                      onBlur={() => dispatchCommand(item.onBlur)}
                      selected={item.selected}
                      disabled={item.disabled}
                      tooltipContent={item.tooltipContent}
                      testId={item.testId}
                      hideTooltipOnClick={item.hideTooltipOnClick}
                      ariaHasPopup={item.ariaHasPopup}
                      tabIndex={item.tabIndex}
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
                      onSubmit={(value) =>
                        dispatchCommand(item.onSubmit(value))
                      }
                      onBlur={(value) => dispatchCommand(item.onBlur(value))}
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
                  if (item.selectType === 'list') {
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
                        onChange={(selected) =>
                          dispatchCommand(
                            item.onChange(selected as SelectOption),
                          )
                        }
                        filterOption={item.filterOption}
                      />
                    );
                  }
                  if (item.selectType === 'color') {
                    return (
                      <ColorPickerButton
                        key={idx}
                        title={item.title}
                        onChange={(selected) => {
                          dispatchCommand(item.onChange(selected));
                        }}
                        colorPalette={item.options as PaletteColor[]}
                        currentColor={
                          item.defaultValue
                            ? item.defaultValue.value
                            : undefined
                        }
                        placement="Panels"
                      />
                    );
                  }
                  if (item.selectType === 'emoji') {
                    return (
                      <EmojiPickerButton
                        key={idx}
                        editorView={editorView}
                        title={item.title}
                        providerFactory={providerFactory}
                        isSelected={item.selected}
                        onChange={(selected) =>
                          dispatchCommand(item.onChange(selected))
                        }
                      />
                    );
                  }
                  return null;

                case 'extensions-placeholder':
                  if (!editorView || !extensionsProvider) {
                    return null;
                  }
                  const { extendFloatingToolbar } =
                    getFeatureFlags(editorView.state) || {};
                  if (!extendFloatingToolbar) {
                    return null;
                  }

                  return (
                    <ExtensionsPlaceholder
                      key={idx}
                      node={node}
                      editorView={editorView}
                      extensionProvider={extensionsProvider}
                      separator={item.separator}
                    />
                  );
                case 'separator':
                  return <Separator key={idx} />;
              }
            })}
        </ButtonGroup>
      </div>
    );
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      this.props.node.type !== nextProps.node.type ||
      this.props.node.attrs.localId !== nextProps.node.attrs.localId ||
      !areSameItems(this.props.items, nextProps.items)
    );
  }
}

export default injectIntl(Toolbar);
