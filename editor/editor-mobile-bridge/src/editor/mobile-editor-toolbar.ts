import { toNativeBridge } from './web-to-native/index';
import { EditorView } from 'prosemirror-view';
import {
  FloatingToolbarConfig,
  FloatingToolbarItem,
  Command,
  FloatingToolbarButton,
  FloatingToolbarDropdown,
  FloatingToolbarSelect,
  DropdownOptionT,
  SelectOption,
} from '@atlaskit/editor-core';
import { NodeType } from 'prosemirror-model';

export type MobileEditorToolbarItem = FloatingToolbarItem<Command> & {
  key?: string;
  iconName?: string;
};

export default class MobileEditorToolbarActions {
  private previousItemsJson?: string | null;
  private floatingToolbarItems?: Array<FloatingToolbarItem<Command>> | null;

  /**
   * Checks the available capabilities and translates them into a mobile specific DSL,
   * and relays that DSL to the mobile native side.
   *
   * Mobile specific DSL contains a key for each item, and this key is used to perform an action. i.e. button click.
   * With this unique key, we find the corresponding floating toolbar item and perform the appropriate action.
   *
   * Icon is a bit tricky at the moment. This method uses icon's display name as identifier. Icon is a react
   * component in the floating toolbar. Mobile side should be using this display name to map the icon. This is not
   * resillient to the future changes, but should be OK for short term.
   *
   * If the editing capabilities are not available, notifies the native side as well with that information.
   *
   * @param floatingToolbarConfig is the component that contains editing capabilities
   */
  notifyNativeBridgeForEditCapabilitiesChanges(
    floatingToolbarConfig?: FloatingToolbarConfig,
  ): void {
    if (floatingToolbarConfig && Array.isArray(floatingToolbarConfig.items)) {
      const nodeType = floatingToolbarConfig.nodeType;
      let nodeTypeName = this.getNodeTypeName(nodeType);
      const items = this.translateToMobileDSL(floatingToolbarConfig.items);
      this.floatingToolbarItems = items;

      const itemsJson = JSON.stringify(items, null);

      // If the content is same, there is no need to invoke the native side again.
      // Floating toolbar is re-rendered if there is a content change. i.e. typing a character
      // We don't need to invoke mobile native side for this change.
      if (this.previousItemsJson === itemsJson) {
        return;
      }
      this.previousItemsJson = itemsJson;

      toNativeBridge.onNodeSelected(nodeTypeName, itemsJson);
    } else {
      if (this.floatingToolbarItems) {
        this.previousItemsJson = null;
        this.floatingToolbarItems = null;
        toNativeBridge.onNodeDeselected();
      }
    }
  }

  private getNodeTypeName(nodeType: NodeType[] | NodeType): string {
    if (Array.isArray(nodeType)) {
      return nodeType[0].name;
    }
    return nodeType.name;
  }

  /**
   * icon is used to map the corresponding image in the native side.
   *
   * key is the new field. This is used to provide a unique identifier for each item.
   * key is an important value, because it is used to find the corresponding floating toolbar item when
   * performing an action.
   * @param items is a list of floating toolbar items
   */
  private translateToMobileDSL(items: Array<FloatingToolbarItem<Command>>) {
    return items.map((item: FloatingToolbarItem<Command>, index: number) => {
      let newItem: MobileEditorToolbarItem;
      switch (item.type) {
        case 'button':
          newItem = this.translateToolbarButton(item, index);
          break;
        case 'select':
          newItem = this.translateToolbarSelect(item, index);
          break;
        case 'dropdown':
          newItem = this.translateToolbarDropdown(item, index);
          break;
        default:
          newItem = { ...item };
          newItem.key = this.generateKey(index);
          break;
      }
      return newItem;
    });
  }

  private translateToolbarButton(
    item: FloatingToolbarButton<Command>,
    index: number,
  ): MobileEditorToolbarItem {
    const newItem: MobileEditorToolbarItem = { ...item };
    newItem.key = this.generateKey(index);
    if (item.icon && item.icon.displayName) {
      newItem.iconName = item.icon.displayName;
    }
    return newItem;
  }

  private translateToolbarDropdown(
    item: FloatingToolbarDropdown<Command>,
    index: number,
  ): MobileEditorToolbarItem {
    const newItem: MobileEditorToolbarItem = { ...item };
    newItem.key = this.generateKey(index);
    if (Array.isArray(item.options)) {
      newItem.options = item.options.map(
        (option: DropdownOptionT<Command>, optionIndex: number) => {
          return {
            ...option,
            key: this.generateKey(index, optionIndex),
          };
        },
      );
    }
    return newItem;
  }

  private translateToolbarSelect(
    item: FloatingToolbarSelect<Command>,
    index: number,
  ): MobileEditorToolbarItem {
    const newItem: MobileEditorToolbarItem = { ...item };
    newItem.key = this.generateKey(index);
    newItem.options = item.options.map(
      (option: SelectOption, optionIndex: number) => {
        return {
          ...option,
          key: this.generateKey(index, optionIndex),
        };
      },
    );
    return newItem;
  }

  /**
   * Generates a unique key to identify each item. Node type name is prepended to make it more reliable.
   */
  private generateKey(...indices: number[]): string {
    return indices.join('.');
  }

  /**
   * Finds the corresponding floating toolbar item for the given key and performs the appropriate action.
   * Key is a string with numeric values. A delimiter is used to differentiate options items for dropdown and select.
   * i.e. 1.2 represents parent is the second item in the toolbar config, and corresponding item is the 3rd option.
   * Note that the list is zero based, although it is an implementation detail. It does not matter.
   *
   * @param key is the identifier to determine which floating toolbar item to find and perform the action.
   * @param editorView is the current editor instance
   */
  performEditAction(key: string, editorView?: EditorView): void {
    if (!editorView || !this.floatingToolbarItems) {
      return;
    }

    const items = this.floatingToolbarItems;
    const [parentIndex, optionIndex] = key
      .split('.')
      .map(key => Number.parseInt(key, 10));
    const parentItem = items[parentIndex];

    switch (parentItem?.type) {
      case 'dropdown':
        this.performDropdownItemClick(parentItem, optionIndex, editorView);
        break;
      case 'button':
        this.performButtonClick(parentItem, editorView);
        break;
      case 'select':
        this.performSelectChange(parentItem, optionIndex, editorView);
        break;
    }
  }

  private performButtonClick(
    item: FloatingToolbarButton<Command>,
    editorView: EditorView,
  ) {
    item.onClick(editorView.state, editorView.dispatch);
  }

  private performSelectChange(
    select: FloatingToolbarSelect<Command>,
    optionIndex: number,
    editorView: EditorView,
  ) {
    const childItem = select.options[optionIndex];
    select.onChange(childItem)(editorView.state, editorView.dispatch);
  }

  private performDropdownItemClick(
    dropdown: FloatingToolbarDropdown<Command>,
    optionIndex: number,
    editorView: EditorView,
  ) {
    if (Array.isArray(dropdown.options)) {
      const childItem = dropdown.options[optionIndex];
      childItem.onClick(editorView.state, editorView.dispatch);
    }
  }
}
