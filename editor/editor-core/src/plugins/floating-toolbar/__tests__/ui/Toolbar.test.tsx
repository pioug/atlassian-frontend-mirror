import React from 'react';
import { mount } from 'enzyme';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  table,
  tdEmpty,
  thEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { flushPromises } from '../../../../__tests__/__helpers/utils';
import Toolbar, { areSameItems, isSameItem, Item } from '../../ui/Toolbar';

import { ADFEntity } from '@atlaskit/adf-utils';
import {
  createTestExtensionProvider,
  emptyExtensionProvider,
} from '../_helpers';
import { FloatingToolbarColorPicker } from '../../types';

describe('<Toolbar />', () => {
  const createEditor = createEditorFactory();
  const docNode = doc(
    table({ layout: 'full-width' })(
      tr(thEmpty, thEmpty, thEmpty),
      tr(tdEmpty, tdEmpty, tdEmpty),
    ),
  );
  const { editorView } = createEditor({
    doc: docNode,
    editorProps: {
      allowTables: true,
      allowExtension: {
        allowExtendFloatingToolbars: true,
      },
    },
  });

  const action = jest
    .fn()
    .mockImplementation(() =>
      Promise.resolve(
        ((editorView.state.doc.firstChild as unknown) as ADFEntity) ||
          undefined,
      ),
    );

  it('renders extension items if provided', async () => {
    let wrapper;
    if (editorView.state.doc.firstChild) {
      wrapper = mount(
        <Toolbar
          node={editorView.state.doc.firstChild}
          editorView={editorView}
          extensionsProvider={createTestExtensionProvider(action)}
          items={[
            {
              type: 'extensions-placeholder',
            },
          ]}
          dispatchAnalyticsEvent={jest.fn()}
          dispatchCommand={jest.fn()}
        />,
      );

      await flushPromises();

      wrapper.update();
    }

    expect(
      wrapper?.find('button[aria-label="Item with icon and label"]').length,
    ).toEqual(1);
    expect(
      wrapper?.find('[tooltipContent="Item with icon and label"]').length,
    ).toEqual(1);

    wrapper
      ?.find('button[aria-label="Item with icon and label"]')
      .simulate('click');
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('does not render when no extension items provided', async () => {
    let wrapper;
    if (editorView.state.doc.firstChild) {
      wrapper = mount(
        <Toolbar
          node={editorView.state.doc.firstChild}
          editorView={editorView}
          extensionsProvider={emptyExtensionProvider}
          items={[
            {
              type: 'extensions-placeholder',
            },
          ]}
          dispatchAnalyticsEvent={jest.fn()}
          dispatchCommand={jest.fn()}
        />,
      );
    }

    expect(wrapper?.find('button').length).toEqual(0);
    expect(wrapper?.find('ExtensionsPlaceholder').length).toEqual(1);
  });

  it('re-renders after node with different localId is selected', async () => {
    let wrapper;

    const docNode = doc(
      table({ layout: 'full-width', localId: 'table1' })(
        tr(thEmpty, thEmpty, thEmpty),
        tr(tdEmpty, tdEmpty, tdEmpty),
      ),
      table({ layout: 'full-width', localId: 'table2' })(
        tr(thEmpty, thEmpty, thEmpty),
        tr(tdEmpty, tdEmpty, tdEmpty),
      ),
    );

    const { editorView } = createEditor({
      doc: docNode,
      editorProps: {
        featureFlags: {
          'local-id-generation-on-tables': true,
        },
        allowTables: true,
        allowExtension: {
          allowExtendFloatingToolbars: true,
        },
      },
    });

    const action = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(
          ((editorView.state.doc.firstChild as unknown) as ADFEntity) ||
            undefined,
        ),
      );

    if (editorView.state.doc.firstChild) {
      wrapper = mount(
        <Toolbar
          node={editorView.state.doc.firstChild}
          editorView={editorView}
          extensionsProvider={createTestExtensionProvider(action)}
          items={[
            {
              type: 'extensions-placeholder',
            },
          ]}
          dispatchAnalyticsEvent={jest.fn()}
          dispatchCommand={jest.fn()}
        />,
      );

      await flushPromises();

      wrapper.update();
    }

    expect(
      wrapper?.find('button[aria-label="Item with icon and label"]').length,
    ).toEqual(1);
    expect(
      wrapper?.find('[tooltipContent="Item with icon and label"]').length,
    ).toEqual(1);

    // click button first time
    wrapper
      ?.find('button[aria-label="Item with icon and label"]')
      .simulate('click');
    expect(action).toHaveBeenCalledTimes(1);
    // first call to action, arg0 ADFEntity should match table1
    expect(action.mock.calls[0][0].attrs.localId).toEqual('table1');

    // update the node to table2
    wrapper?.setProps({
      node: editorView.state.doc.lastChild,
    });
    wrapper?.update();

    // click button second time
    wrapper
      ?.find('button[aria-label="Item with icon and label"]')
      .simulate('click');
    expect(action).toHaveBeenCalledTimes(2);
    // second call to action, arg0 ADFEntity should match table2
    expect(action.mock.calls[1][0].attrs.localId).toEqual('table2');
  });
});

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
  id: 'id',
  type: 'select',
  selectType: 'list',
  defaultValue: { label: 'Item 1', value: 'item-1' },
  options: [selectOption1],
  onChange: (_) => createNoOpCommand(),
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
  describe('color-picker', () => {
    const blueColorPicker = {
      type: 'select',
      selectType: 'color',
      defaultValue: {
        label: 'blue',
        value: '#4f95ff',
      },
    } as FloatingToolbarColorPicker<any>;
    const orangeColorPicker = {
      type: 'select',
      selectType: 'color',
      defaultValue: {
        label: 'orange',
        value: '#ffc74f',
      },
    } as FloatingToolbarColorPicker<any>;
    it('should detect different default values as diffirent items', () => {
      expect(isSameItem(blueColorPicker, orangeColorPicker)).toBeFalsy();
    });
    it('should detect the same default values as the same item', () => {
      expect(isSameItem(blueColorPicker, blueColorPicker)).toBeTruthy();
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
});
