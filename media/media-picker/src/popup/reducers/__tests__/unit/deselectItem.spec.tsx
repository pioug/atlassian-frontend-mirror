import { DESELECT_ITEM } from '../../../actions';
import deselectItem from '../../deselectItem';

describe('deselectItem() reducer', () => {
  const firstId = 'first-id';
  const secondId = 'second-id';
  const thirdId = 'third-id';
  const anotherId = 'another-id';

  const firstItem = {
    id: firstId,
    details: 'first-details',
  };
  const secondItem = {
    id: secondId,
    details: 'second-details',
  };
  const thirdItem = {
    id: thirdId,
    details: 'third-details',
  };

  const stateBase = {
    a: 12,
    b: 'abc',
  };
  const state = {
    ...stateBase,
    selectedItems: [firstItem, secondItem, thirdItem],
  };

  it('should return original state for unknown action', () => {
    const oldState: any = { ...state };
    const newState = deselectItem(oldState, { type: 'UNKNOWN' });

    expect(oldState).toEqual(state);
    expect(newState).toEqual(state);
  });

  it('should not change selectedItems if it is empty', () => {
    const noSelectedItemsState = {
      ...stateBase,
      selectedItems: [] as any[],
    };

    const oldState: any = { ...noSelectedItemsState };
    const newState = deselectItem(oldState, {
      type: DESELECT_ITEM,
      id: firstId,
    });

    expect(oldState).toEqual(noSelectedItemsState);
    expect(newState).toEqual(noSelectedItemsState);
  });

  it('should not add selectedItems if it is not defined', () => {
    const noSelectedItemsState = {
      ...stateBase,
    };

    const oldState: any = { ...noSelectedItemsState };
    const newState = deselectItem(oldState, {
      type: DESELECT_ITEM,
      id: firstId,
    });

    expect(oldState).toEqual(noSelectedItemsState);
    expect(newState).toEqual(noSelectedItemsState);
  });

  it('should preserve selected items if their id is not specified', () => {
    const oldState: any = { ...state };
    const newState = deselectItem(oldState, {
      type: DESELECT_ITEM,
      id: anotherId,
    });

    expect(oldState).toEqual(state);
    expect(newState).toEqual(state);
  });

  it('should remove item from selected', () => {
    const oldState: any = { ...state };
    const newState = deselectItem(oldState, {
      type: DESELECT_ITEM,
      id: firstId,
    });

    expect(oldState).toEqual(state);
    expect(newState).toEqual({
      ...stateBase,
      selectedItems: [secondItem, thirdItem],
    });
  });
});
