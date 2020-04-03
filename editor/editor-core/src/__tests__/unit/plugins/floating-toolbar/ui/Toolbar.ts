import {
  Item,
  isSameItem,
  areSameItems,
} from '../../../../../plugins/floating-toolbar/ui/Toolbar';

// Helpers
const createNoOpCommand = () => () => {};
const createButton = (title: string, selected: boolean = false): Item => ({
  type: 'button',
  title,
  selected,
  onClick: createNoOpCommand(),
});

const button = createButton('Test button');

const dropDownOption1 = {
  title: 'Subitem 1',
  onClick: createNoOpCommand(),
};

const dropdown: Item = {
  type: 'dropdown',
  title: 'Test dropdown',
  options: [dropDownOption1],
};

const selectOption1 = {
  label: 'Subitem 1',
  value: 'subitem-1',
  onClick: createNoOpCommand(),
};

const select: Item = {
  type: 'select',
  defaultValue: { label: 'Item 1', value: 'item-1' },
  options: [selectOption1],
  onChange: _ => createNoOpCommand(),
};

describe('isSameItem', () => {
  describe('button', () => {
    it('should not compare onClick property', () => {
      const button2 = { ...button, onClick: createNoOpCommand() };
      expect(isSameItem(button, button2)).toBeTruthy();
    });

    it('should not compare other properties', () => {
      const button2 = { ...button, title: 'A new button' };
      expect(isSameItem(button, button2)).toBeFalsy();
    });

    it('should compare type', () => {
      expect(isSameItem(button, select)).toBeFalsy();
    });
  });

  describe('dropdown', () => {
    it('should shallow compare options', () => {
      const dropdown2 = {
        ...dropdown,
        options: [{ title: 'Subitem 1', onClick: createNoOpCommand() }],
      };
      expect(isSameItem(dropdown, dropdown2)).toBeTruthy();
    });

    it('should compare type', () => {
      expect(isSameItem(dropdown, select)).toBeFalsy();
    });
  });

  describe('select', () => {
    it('should shallow compare default value', () => {
      const select2 = {
        ...select,
        defaultValue: { label: 'Item 1', value: 'item-1' },
      };
      expect(isSameItem(select, select2)).toBeTruthy();

      const select3 = {
        ...select,
        defaultValue: { label: 'Item 2', value: 'item-2' },
      };
      expect(isSameItem(select, select3)).toBeFalsy();
    });

    it('should shallow compare options', () => {
      const select2 = {
        ...select,
        options: [
          {
            label: 'Subitem 1',
            value: 'subitem-1',
            onClick: createNoOpCommand(),
          },
        ],
      };
      expect(isSameItem(select, select2)).toBeTruthy();
    });
  });
});

describe('areSameItems', () => {
  it('should be able to differentiate two different arrays', () => {
    const toolbarItems1: Array<Item> = [
      createButton('Align left'),
      createButton('Align center', true),
      createButton('Align right'),
      { type: 'separator' },
      createButton('Wrap left'),
      createButton('Wrap right'),
    ];
    const toolbarItems2: Array<Item> = [
      createButton('Align left'),
      createButton('Align center'),
      createButton('Align right', true),
      { type: 'separator' },
      createButton('Wrap left'),
      createButton('Wrap right'),
    ];
    expect(areSameItems(toolbarItems1, toolbarItems2)).toBeFalsy();
  });
});
