import React from 'react';

import { mount, ReactWrapper } from 'enzyme';

import { DropdownItemCheckbox, DropdownItemRadio } from '../../../index';
import { Behaviors } from '../../../types';
import { selectionCacheContext } from '../../../util/contextNamespace';
import DropdownItemFocusManager from '../../context/DropdownItemFocusManager';
import DropdownItemSelectionManager from '../../context/DropdownItemSelectionManager';

describe('dropdown menu - DropdownItemSelectionManager', () => {
  jest.useFakeTimers();
  const prepareEnvironment = (
    behavior: Behaviors,
    ItemComponent: typeof DropdownItemCheckbox | typeof DropdownItemRadio,
    isItemSelected: boolean,
  ) => {
    const changeSpy = jest.fn();
    const fakeCache = {
      isItemSelected: () => isItemSelected,
      itemsInGroup: () =>
        isItemSelected ? [{ id: '0', groupId: 'my-group' }] : [],
      itemSelectionsChanged: changeSpy,
    };
    const wrapper = mount(
      <DropdownItemSelectionManager groupId="my-group" behavior={behavior}>
        <DropdownItemFocusManager>
          <ItemComponent id="0">Item zero</ItemComponent>
          <ItemComponent id="1">Item one</ItemComponent>
        </DropdownItemFocusManager>
      </DropdownItemSelectionManager>,
      { context: { [selectionCacheContext]: fakeCache } },
    );
    return { changeSpy, wrapper };
  };

  const clickItem = (wrapper: ReactWrapper, idx: number) => {
    wrapper.find('WithItemFocus(Item)').at(idx).simulate('click');
    jest.runOnlyPendingTimers();
  };

  describe('checkbox', () => {
    test('should store the selected checkbox item values on click', () => {
      const { changeSpy, wrapper } = prepareEnvironment(
        'checkbox',
        DropdownItemCheckbox,
        false,
      );

      clickItem(wrapper, 0);
      expect(changeSpy).toHaveBeenCalledWith('my-group', [
        { groupId: 'my-group', id: '0' },
      ]);
    });

    test('should stop storing a selected checkbox item value when clicked twice', () => {
      const { changeSpy, wrapper } = prepareEnvironment(
        'checkbox',
        DropdownItemCheckbox,
        true,
      );

      clickItem(wrapper, 0);
      expect(changeSpy).toHaveBeenCalledWith('my-group', []);
    });
  });

  describe('radio', () => {
    test('should store the most recently selected radio item value', () => {
      const { changeSpy, wrapper } = prepareEnvironment(
        'radio',
        DropdownItemRadio,
        false,
      );

      clickItem(wrapper, 1);
      expect(changeSpy).toHaveBeenCalledWith('my-group', [
        { groupId: 'my-group', id: '1' },
      ]);
    });

    test('should continue storing a selected radio item value when clicked twice', () => {
      const { changeSpy, wrapper } = prepareEnvironment(
        'radio',
        DropdownItemRadio,
        true,
      );
      clickItem(wrapper, 0);
      expect(changeSpy).toHaveBeenCalledWith('my-group', [
        { groupId: 'my-group', id: '0' },
      ]);
    });
  });
});
