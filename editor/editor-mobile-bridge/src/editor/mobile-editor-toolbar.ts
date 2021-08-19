import { toNativeBridge } from './web-to-native/index';
import { EditorView } from 'prosemirror-view';
import {
  Command,
  DropdownOptionT,
  FloatingToolbarButton,
  FloatingToolbarColorPicker,
  FloatingToolbarConfig,
  FloatingToolbarDatePicker,
  FloatingToolbarDropdown,
  FloatingToolbarEmojiPicker,
  FloatingToolbarInput,
  FloatingToolbarItem,
  FloatingToolbarListPicker,
  SelectOption,
} from '@atlaskit/editor-core';
import { Node, NodeType } from 'prosemirror-model';

export type MobileEditorToolbarItem = FloatingToolbarItem<Command> & {
  key?: string;
  iconName?: string;
};

export default class MobileEditorToolbarActions {
  private previousItemsJson?: string | null;
  private previousNode?: Node | null;
  private floatingToolbarItems?: Array<
    FloatingToolbarItem<Command> | undefined
  > | null;
  private editAllowList = new Set();

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
    floatingToolbarNode?: Node | null,
  ): void {
    const floatingToolbarConfigItems =
      typeof floatingToolbarConfig?.items === 'function' && floatingToolbarNode
        ? floatingToolbarConfig?.items(floatingToolbarNode)
        : floatingToolbarConfig?.items;

    if (floatingToolbarConfig && Array.isArray(floatingToolbarConfigItems)) {
      const nodeType = floatingToolbarConfig.nodeType;
      let nodeTypeName = this.getNodeTypeName(nodeType);
      const items = this.translateToMobileDSL(floatingToolbarConfigItems);
      this.floatingToolbarItems = items;
      const itemsJson = JSON.stringify(items, null);

      // If the content is same, there is no need to invoke the native side again.
      // Floating toolbar is re-rendered if there is a content change. i.e. typing a character
      // We don't need to invoke mobile native side for this change.
      if (
        this.previousItemsJson === itemsJson &&
        this.previousNode === floatingToolbarNode
      ) {
        return;
      }
      this.previousItemsJson = itemsJson;
      if (floatingToolbarNode !== undefined) {
        this.previousNode = floatingToolbarNode;
      }

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
   * @param rawItems is a list of floating toolbar items
   */
  private translateToMobileDSL(rawItems: Array<FloatingToolbarItem<Command>>) {
    let items = this.sanitizeCustomType(rawItems);
    let index = 0;
    let visibleItemFound = false;
    let newItems = items
      .map((item: FloatingToolbarItem<Command>) => {
        let newItem: MobileEditorToolbarItem | undefined;
        switch (item.type) {
          case 'button':
            newItem = this.translateToolbarButton(item, index);
            break;
          case 'select':
            if (item.selectType === 'list') {
              newItem = this.translateToolbarSelect(
                item as FloatingToolbarListPicker<Command>,
                index,
              );
            } else if (item.selectType === 'date') {
              newItem = this.translateDatePicker(
                item as FloatingToolbarDatePicker<Command>,
                index,
              );
            } else if (item.selectType === 'color') {
              newItem = this.translateColorPicker(
                item as FloatingToolbarColorPicker<Command>,
                index,
              );
            } else if (item.selectType === 'emoji') {
              newItem = this.translateEmojiPicker(
                item as FloatingToolbarEmojiPicker<Command>,
                index,
              );
            }
            break;
          case 'dropdown':
            newItem = this.translateToolbarDropdown(item, index);
            break;
          case 'separator':
            if (visibleItemFound) {
              newItem = { ...item };
              visibleItemFound = false;
            }
            break;
          case 'input':
            newItem = this.translateInput(item, index);
            break;
        }
        if (newItem) {
          index++;
          visibleItemFound = newItem.type !== `separator`;
        }
        return newItem;
      })
      .filter((item) => !!item);

    // Removes the trailing separators
    while (newItems[newItems.length - 1]?.type === 'separator') {
      newItems.pop();
    }
    return newItems;
  }

  private sanitizeCustomType(
    rawItems: Array<FloatingToolbarItem<Command>>,
  ): Array<FloatingToolbarItem<Command>> {
    const items = [...rawItems];
    items.forEach((item: FloatingToolbarItem<Command>, index: number) => {
      if (item.type === 'custom' && item.fallback) {
        items.splice(index, 1, ...item.fallback);
      }
    });
    return items;
  }

  /**
   * If the allowed list is empty, it will consider every item allowed.
   * Otherwise, it will check if it is in the allowed list.
   * If the item does not have id, it will be considered as not-allowed.
   */
  private isItemAllowed(id?: string): boolean {
    if (this.editAllowList.size === 0) {
      return true;
    }
    if (id) {
      return this.editAllowList.has(id);
    }
    return false;
  }

  private translateToolbarButton(
    item: FloatingToolbarButton<Command>,
    index: number,
  ): MobileEditorToolbarItem | undefined {
    if (!this.isItemAllowed(item.id)) {
      return;
    }
    const newItem: MobileEditorToolbarItem = {
      ...item,
      // Overriding this as it can cause circular references when we stringify it
      // above. This is because it is a ReactNode.
      tooltipContent: undefined,
    };
    newItem.key = this.generateKey(index);
    if (item.icon && item.icon.displayName) {
      newItem.iconName = item.icon.displayName;
    }
    return newItem;
  }

  private translateToolbarDropdown(
    item: FloatingToolbarDropdown<Command>,
    index: number,
  ): MobileEditorToolbarItem | undefined {
    if (!this.isItemAllowed(item.id)) {
      return;
    }
    const newItem: MobileEditorToolbarItem = { ...item };
    let optionCount = 0;
    if (Array.isArray(newItem.options)) {
      newItem.options = newItem.options
        .filter((option: DropdownOptionT<Command>) => {
          return this.isItemAllowed(option.id);
        })
        .map((option: DropdownOptionT<Command>, optionIndex: number) => {
          return {
            ...option,
            key: this.generateKey(index, optionIndex),
          };
        });
      optionCount = newItem.options.length;
    }
    if (optionCount !== 0) {
      newItem.key = this.generateKey(index);
      return newItem;
    }
    return;
  }

  private translateColorPicker(
    item: FloatingToolbarColorPicker<Command>,
    index: number,
  ): MobileEditorToolbarItem | undefined {
    if (!this.isItemAllowed(item.id)) {
      return;
    }
    const newItem: MobileEditorToolbarItem = { ...item };
    newItem.key = this.generateKey(index);
    newItem.options = newItem.options.map((option, optionIndex) => {
      return {
        ...option,
        key: this.generateKey(index, optionIndex),
        border: this.convertRGBAtoHex(option.border),
      };
    });
    if (newItem.defaultValue) {
      newItem.defaultValue.border = this.convertRGBAtoHex(
        newItem.defaultValue.border,
      );
    }
    return newItem;
  }

  private convertRGBAtoHex(rgba: string): string {
    // TODO: border might come as rgba, if that's the case, convert it to hex
    return rgba;
  }

  private translateEmojiPicker(
    item: FloatingToolbarEmojiPicker<Command>,
    index: number,
  ): MobileEditorToolbarItem | undefined {
    if (!this.isItemAllowed(item.id)) {
      return;
    }
    const newItem: MobileEditorToolbarItem = { ...item };
    newItem.key = this.generateKey(index);
    return newItem;
  }

  private translateDatePicker(
    item: FloatingToolbarDatePicker<Command>,
    index: number,
  ): MobileEditorToolbarItem | undefined {
    if (!this.isItemAllowed(item.id)) {
      return;
    }

    return {
      ...item,
      key: this.generateKey(index),
    };
  }

  private translateInput(
    item: FloatingToolbarInput<Command>,
    index: number,
  ): MobileEditorToolbarItem | undefined {
    if (!this.isItemAllowed(item.id)) {
      return;
    }
    return {
      ...item,
      key: this.generateKey(index),
    };
  }

  private translateToolbarSelect(
    item: FloatingToolbarListPicker<Command>,
    index: number,
  ): MobileEditorToolbarItem | undefined {
    if (!this.isItemAllowed(item.id)) {
      return;
    }
    const newItem: MobileEditorToolbarItem &
      FloatingToolbarListPicker<Command> = {
      ...item,
    };
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
   * @param value is the given input from the user. It could be any input in any format.
   */
  performEditAction(
    key: string,
    editorView: EditorView,
    value?: string | null,
  ): void {
    if (!editorView || !this.floatingToolbarItems) {
      return;
    }

    const items = this.floatingToolbarItems;
    const [parentIndex, optionIndex] = key
      .split('.')
      .map((key) => Number.parseInt(key, 10));
    const parentItem = items[parentIndex];

    switch (parentItem?.type) {
      case 'dropdown':
        this.performDropdownItemClick(parentItem, optionIndex, editorView);
        break;
      case 'button':
        this.performButtonClick(parentItem, editorView);
        break;
      case 'select':
        if (parentItem?.selectType === 'list') {
          this.performSelectChange(parentItem, optionIndex, editorView);
        } else if (parentItem?.selectType === 'date') {
          const datePicker = parentItem as FloatingToolbarDatePicker<Command>;
          this.performDatePickerChange(datePicker, value, editorView);
        } else if (parentItem?.selectType === 'color') {
          const colorPicker = parentItem as FloatingToolbarColorPicker<Command>;
          this.performColorPickerChange(colorPicker, optionIndex, editorView);
        } else if (parentItem?.selectType === 'emoji') {
          const emojiPicker = parentItem as FloatingToolbarEmojiPicker<Command>;
          this.performEmojiPicker(emojiPicker, value, editorView);
        }
        break;
      case 'input':
        if (typeof value === 'string') {
          this.performInputSubmit(parentItem, value, editorView);
        }
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
    select: FloatingToolbarListPicker<Command>,
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

  private performColorPickerChange(
    colorPicker: FloatingToolbarColorPicker<Command>,
    optionIndex: number,
    editorView: EditorView,
  ) {
    const optionItem = colorPicker.options[optionIndex];
    colorPicker.onChange(optionItem)(editorView.state, editorView.dispatch);
  }

  private performEmojiPicker(
    picker: FloatingToolbarEmojiPicker<Command>,
    value: string | null | undefined,
    editorView: EditorView,
  ) {
    if (value) {
      picker.onChange(value)(editorView.state, editorView.dispatch);
    }
  }

  private performDatePickerChange(
    datePicker: FloatingToolbarDatePicker<Command>,
    value: string | null | undefined,
    editorView: EditorView,
  ) {
    if (!value) {
      return;
    }

    const timestamp = parseInt(value);
    datePicker.onChange(timestamp)(editorView.state, editorView.dispatch);
  }

  private performInputSubmit(
    picker: FloatingToolbarInput<Command>,
    value: string,
    editorView: EditorView,
  ) {
    picker.onSubmit(value)(editorView.state, editorView.dispatch);
  }

  /**
   * When provided, given allowed list will be used to filter floating toolbar items.
   *
   * When it is empty, it will act as there is no filter, all items will be allowed.
   *
   * Each capability must be in the list.
   * - Button: Straightforward. Each button id must be in the list.
   * - Dropdown: The list must contain both dropdown id and each option ids.
   * If there is only dropdown id but no options, dropdown item will be filtered out.
   * - Select: An id for select type is enough.
   * @param allowList is the array of ids.
   */
  setEditAllowList(allowList: string[]) {
    this.editAllowList = new Set(allowList);
  }
}
