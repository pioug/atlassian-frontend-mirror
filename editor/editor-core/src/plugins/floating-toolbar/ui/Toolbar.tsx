/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { Node } from '@atlaskit/editor-prosemirror/model';

import ButtonGroup from '@atlaskit/button/button-group';
import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { hexToEditorBackgroundPaletteColor } from '@atlaskit/editor-palette';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import { DN70 } from '@atlaskit/theme/colors';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { FloatingToolbarItem } from '../types';
import { compareArrays, shallowEqual } from '../utils';
import { showConfirmDialog } from '../pm-plugins/toolbar-data/commands';
import {
  FloatingToolbarButton as Button,
  Announcer,
} from '@atlaskit/editor-common/ui';

import Dropdown from './Dropdown';
import type { SelectOption } from './Select';
import Select from './Select';
import Separator from './Separator';
import Input from './Input';
import { ExtensionsPlaceholder } from './ExtensionsPlaceholder';
import ColorPickerButton from '../../../ui/ColorPickerButton';
import { backgroundPaletteTooltipMessages } from '../../../ui/ColorPalette';
import type { PaletteColor } from '@atlaskit/editor-common/ui-color';
import { EmojiPickerButton } from './EmojiPickerButton';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import messages from './messages';
import type { ThemeProps } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import { clearHoverSelection } from '@atlaskit/editor-plugin-table/commands';

import ScrollButtons from './ScrollButtons';
import { ToolbarArrowKeyNavigationProvider } from '@atlaskit/editor-common/ui-menu';
import {
  checkShouldForceFocusAndApply,
  forceFocusSelector,
} from '../pm-plugins/force-focus';
import type {
  FeatureFlags,
  PluginInjectionAPIWithDependencies,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { contextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';

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
  scrollable?: boolean;
  featureFlags: FeatureFlags;
  api:
    | PluginInjectionAPIWithDependencies<
        [typeof decorationsPlugin, OptionalPlugin<typeof contextPanelPlugin>]
      >
    | undefined;
}

const ToolbarItems = React.memo(
  ({
    items,
    dispatchCommand,
    popupsMountPoint,
    popupsBoundariesElement,
    editorView,
    dispatchAnalyticsEvent,
    popupsScrollableElement,
    scrollable,
    providerFactory,
    extensionsProvider,
    node,
    setDisableScroll,
    mountRef,
    featureFlags,
    api,
  }: Props & {
    setDisableScroll?: (disable: boolean) => void;
    mountRef: React.RefObject<HTMLDivElement>;
    mounted: boolean;
  }) => {
    const emojiAndColourPickerMountPoint = scrollable
      ? popupsMountPoint ||
        editorView?.dom.closest('.fabric-editor-popup-scroll-parent') ||
        editorView?.dom.closest('.ak-editor-content-area') ||
        undefined
      : popupsMountPoint;

    const { useSomewhatSemanticTextColorNames } = featureFlags || {
      useSomewhatSemanticTextColorNames: false,
    };

    return (
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
                    if (item.focusEditoronEnter && !editorView?.hasFocus()) {
                      editorView?.focus();
                    }
                  }
                };

                return (
                  <Button
                    className={item.className}
                    key={idx}
                    title={item.title}
                    href={item.href}
                    icon={
                      item.icon ? <ButtonIcon label={item.title} /> : undefined
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
                    onSubmit={(value) => dispatchCommand(item.onSubmit(value))}
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
                    dropdownWidth={item.dropdownWidth}
                    showSelected={item.showSelected}
                    buttonTestId={item.testId}
                    editorView={editorView}
                    setDisableParentScroll={
                      scrollable ? setDisableScroll : undefined
                    }
                    dropdownListId={item?.id && `${item.id}-dropdownList`}
                  />
                );

              case 'select':
                if (item.selectType === 'list') {
                  const ariaLabel = item.title || item.placeholder;
                  return (
                    <Select
                      key={idx}
                      dispatchCommand={dispatchCommand}
                      options={item.options}
                      hideExpandIcon={item.hideExpandIcon}
                      mountPoint={scrollable ? mountRef.current! : undefined}
                      boundariesElement={popupsBoundariesElement}
                      scrollableElement={popupsScrollableElement}
                      defaultValue={item.defaultValue}
                      placeholder={item.placeholder}
                      onChange={(selected) =>
                        dispatchCommand(item.onChange(selected as SelectOption))
                      }
                      ariaLabel={ariaLabel}
                      filterOption={item.filterOption}
                      setDisableParentScroll={
                        scrollable ? setDisableScroll : undefined
                      }
                      classNamePrefix={'floating-toolbar-select'}
                    />
                  );
                }
                if (item.selectType === 'color') {
                  return (
                    <ColorPickerButton
                      skipFocusButtonAfterPick
                      key={idx}
                      title={item.title}
                      onChange={(selected) => {
                        dispatchCommand(item.onChange(selected));
                      }}
                      colorPalette={item.options as PaletteColor[]}
                      currentColor={
                        item.defaultValue ? item.defaultValue.value : undefined
                      }
                      placement="Panels"
                      mountPoint={emojiAndColourPickerMountPoint}
                      setDisableParentScroll={
                        scrollable ? setDisableScroll : undefined
                      }
                      // Currently in floating toolbar, color picker is only
                      //  used in panel and table cell background color.
                      // Both uses same color palette.
                      // That's why hard-coding hexToEditorBackgroundPaletteColor
                      //  and paletteColorTooltipMessages.
                      // When we need to support different color palette
                      //  in floating toolbar, we need to set hexToPaletteColor
                      //  and paletteColorTooltipMessages in item options.
                      hexToPaletteColor={hexToEditorBackgroundPaletteColor}
                      paletteColorTooltipMessages={
                        backgroundPaletteTooltipMessages
                      }
                      // We did not want to create new FF or update
                      //  useSomewhatSemanticTextColorNames name
                      //  because it is temporary and require extra work.
                      // So even though it says text color names,
                      //  we are going to use for all color pickers
                      //  such as text, background and table charts.
                      showSomewhatSemanticTooltips={
                        useSomewhatSemanticTextColorNames
                      }
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
                      mountPoint={emojiAndColourPickerMountPoint}
                      setDisableParentScroll={
                        scrollable ? setDisableScroll : undefined
                      }
                    />
                  );
                }
                return null;

              case 'extensions-placeholder':
                if (!editorView || !extensionsProvider) {
                  return null;
                }
                const { extendFloatingToolbar } = featureFlags || {};
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
                    applyChangeToContextPanel={
                      api?.dependencies.contextPanel?.actions.applyChange
                    }
                  />
                );
              case 'separator':
                return <Separator key={idx} />;
            }
          })}
      </ButtonGroup>
    );
  },
  (prevProps, nextProps) => {
    if (!nextProps.node) {
      return false;
    }
    // only rerender toolbar items if the node is different
    // otherwise it causes an issue where multiple popups stays open
    return !(
      prevProps.node.type !== nextProps.node.type ||
      prevProps.node.attrs.localId !== nextProps.node.attrs.localId ||
      !areSameItems(prevProps.items, nextProps.items) ||
      !prevProps.mounted !== !nextProps.mounted
    );
  },
);

const toolbarContainer = (
  theme: ThemeProps,
  scrollable?: boolean,
  hasSelect?: boolean,
  firstElementIsSelect?: boolean,
) => css`
  background-color: ${themed({
    light: token('elevation.surface.overlay', 'white'),
    dark: token('elevation.surface.overlay', DN70),
  })(theme)};
  border-radius: ${borderRadius()}px;
  box-shadow: ${token(
    'elevation.shadow.overlay',
    `0 0 1px rgba(9, 30, 66, 0.31), 0 4px 8px -2px rgba(9, 30, 66, 0.25)`,
  )};
  display: flex;
  line-height: 1;
  box-sizing: border-box;

  & > div > div {
    align-items: center;
  }
  ${scrollable
    ? css`
        ${hasSelect
          ? css`
              height: 40px;
            `
          : css`
              height: 32px;
            `}
        overflow: hidden;
      `
    : css`
        padding: ${token('space.050', '4px')} ${token('space.100', '8px')};
        ${firstElementIsSelect &&
        css`
          padding-left: ${token('space.050', '4px')};
        `}
      `}
`;

const toolbarOverflow = (
  scrollable?: boolean,
  scrollDisabled?: boolean,
  firstElementIsSelect?: boolean,
) => css`
  ${scrollable
    ? css`
        ${scrollDisabled
          ? css`
              overflow: hidden;
            `
          : css`
              overflow-x: auto;
              overflow-y: hidden;
            `}
        -webkit-overflow-scrolling: touch;
        padding: ${token('space.050', '4px')} 0 50px;
        > div {
          > div:first-child {
            ${firstElementIsSelect
              ? css`
                  margin-left: ${token('space.050', '4px')};
                `
              : css`
                  margin-left: ${token('space.100', '8px')};
                `}
          }
          > div:last-child {
            margin-right: ${token('space.100', '8px')};
          }
        }
      `
    : css`
        display: flex;
      `}
`;

function makeSameType<T>(_a: T, _b: any): _b is T {
  return true;
}

const compareItemWithKeys = <T extends {}, U extends keyof T>(
  leftItem: T,
  rightItem: T,
  excludedKeys: Array<U> = [],
): boolean =>
  (Object.keys(leftItem) as Array<U>)
    .filter((key) => excludedKeys.indexOf(key) === -1)
    .every((key) =>
      leftItem[key] instanceof Object
        ? shallowEqual(leftItem[key]!, rightItem[key]!)
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
    case 'copy-button':
      return compareItemWithKeys(leftItem, rightItem as typeof leftItem, [
        'type',
        'items',
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
        // @ts-expect-error TS2345: Argument of type 'DropdownOptionT<Function>[]' is not assignable to parameter of type 'any[][]'
        !compareArrays(leftItem.options, rightItem.options, (left, right) =>
          // @ts-expect-error  TS2322: Type '"onClick"' is not assignable to type 'keyof any[]'
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

export interface State {
  scrollDisabled: boolean;
  mounted: boolean;
}

class Toolbar extends Component<Props & WrappedComponentProps, State> {
  private scrollContainerRef: React.RefObject<HTMLDivElement>;
  private mountRef: React.RefObject<HTMLDivElement>;
  private toolbarContainerRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props & WrappedComponentProps) {
    super(props);
    this.scrollContainerRef = React.createRef<HTMLDivElement>();
    this.mountRef = React.createRef<HTMLDivElement>();
    this.toolbarContainerRef = React.createRef<HTMLDivElement>();
    this.state = {
      scrollDisabled: false,
      mounted: false,
    };
  }
  // remove any decorations added by toolbar buttons i.e danger and selected styling
  // this prevents https://product-fabric.atlassian.net/browse/ED-10207
  private resetStyling({ table }: { table: boolean }) {
    if (this.props.editorView) {
      const { state, dispatch } = this.props.editorView;
      if (table) {
        return clearHoverSelection()(state, dispatch);
      }
      this.props.api?.dependencies.decorations.actions.removeDecoration(
        state,
        dispatch,
      );
    }
  }

  private setDisableScroll(disabled: boolean) {
    // wait before setting disabled state incase users jumping from one popup to another
    if (disabled) {
      requestAnimationFrame(() => {
        this.setState({ scrollDisabled: disabled });
      });
    } else {
      this.setState({ scrollDisabled: disabled });
    }
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentDidUpdate(prevProps: Props) {
    checkShouldForceFocusAndApply(this.props?.editorView);

    if (this.props.node !== prevProps.node) {
      this.resetStyling({
        table: prevProps?.node.type.name === 'table',
      });
    }
  }

  componentWillUnmount() {
    forceFocusSelector(null, this.props.editorView);
    this.resetStyling({
      table: this.props.node.type.name === 'table',
    });
  }

  private shouldHandleArrowKeys = (): boolean => {
    //To prevent the keydown handling of arrow keys for custom toolbar items with 'disableArrowNavigation' prop enabled,
    //Usually the button which has menus or popups
    return !this.props.items?.find(
      (item) => item.type === 'custom' && item.disableArrowNavigation,
    );
  };

  private handleEscape = (event: KeyboardEvent): void => {
    // If any menu is open inside the floating toolbar 'Esc' key should not
    // focus the editorview.
    // Event can't be stopped as they are not childnodes of floating toolbar

    const isDropdownOpen = !!document.querySelector(
      '[data-role="droplistContent"]',
    );
    const isSelectMenuOpen = !!document.querySelector(
      '.floating-toolbar-select__menu',
    );

    if (isDropdownOpen || isSelectMenuOpen) {
      return;
    }

    this.props.editorView?.focus();
    event.preventDefault();
    event.stopPropagation();
  };

  render() {
    const { items, className, node, intl, scrollable } = this.props;

    if (!items || !items.length) {
      return null;
    }

    // Select has left padding of 4px to the border, everything else 8px
    const firstElementIsSelect = items[0].type === 'select';
    const hasSelect = items.find(
      (item) => item.type === 'select' && item.selectType === 'list',
    );
    const isShortcutToFocusToolbar = (event: KeyboardEvent) => {
      //Alt + F10 to reach first element in this floating toolbar
      return event.altKey && (event.key === 'F10' || event.keyCode === 121);
    };

    return (
      <React.Fragment>
        <ToolbarArrowKeyNavigationProvider
          editorView={this.props.editorView}
          handleEscape={this.handleEscape}
          disableArrowKeyNavigation={!this.shouldHandleArrowKeys()}
          childComponentSelector={"[data-testid='editor-floating-toolbar']"}
          isShortcutToFocusToolbar={isShortcutToFocusToolbar}
          intl={intl}
        >
          <div
            ref={this.toolbarContainerRef}
            css={(theme: ThemeProps) => [
              toolbarContainer(
                { theme },
                scrollable,
                hasSelect !== undefined,
                firstElementIsSelect,
              ),
            ]}
            aria-label={intl.formatMessage(messages.floatingToolbarAriaLabel)}
            role="toolbar"
            data-testid="editor-floating-toolbar"
            className={className}
          >
            <Announcer
              text={intl.formatMessage(messages.floatingToolbarAnnouncer)}
              delay={250}
            />
            <div
              data-testid="floating-toolbar-items"
              ref={this.scrollContainerRef}
              css={toolbarOverflow(
                scrollable,
                this.state.scrollDisabled,
                firstElementIsSelect,
              )}
            >
              <ToolbarItems
                {...this.props}
                setDisableScroll={this.setDisableScroll.bind(this)}
                mountRef={this.mountRef}
                mounted={this.state.mounted}
                featureFlags={this.props.featureFlags}
              />
            </div>
            {scrollable && (
              <ScrollButtons
                intl={intl}
                scrollContainerRef={this.scrollContainerRef}
                node={node}
                disabled={this.state.scrollDisabled}
              />
            )}
          </div>
          <div ref={this.mountRef}></div>
        </ToolbarArrowKeyNavigationProvider>
      </React.Fragment>
    );
  }
}

export default injectIntl(Toolbar);
