import fileClick from '../../fileClick';
import { PopupConfig } from '../../../../types';

describe('fileClick()', () => {
  const stateBase = {
    a: 12,
    b: 'abc',
  };

  const state = {
    ...stateBase,
    config: {},
    selectedItems: [
      { id: 'selected-item-1' },
      { id: 'selected-item-2' },
      { id: 'selected-item-3' },
    ],
  };

  it('should return original state for unknown action', () => {
    const oldState: any = { ...state };
    const newState = fileClick(oldState, { type: 'UNKNOWN' });

    expect(oldState).toEqual(state);
    expect(newState).toEqual(state);
  });

  it('should add file to list of selected items if it does NOT already exist in the array', () => {
    const oldState: any = { ...state };

    const clickedFile: any = { id: 'clicked-file' };
    const fileClickAction: any = { type: 'FILE_CLICK', file: clickedFile };

    const newState = fileClick(oldState, fileClickAction);
    expect(oldState).toEqual(state);
    expect(newState.selectedItems).toEqual([
      ...oldState.selectedItems,
      clickedFile,
    ]);
  });

  it('should remove file from list of selected items if it DOES already exist in the array', () => {
    const oldState: any = { ...state };

    const clickedFile: any = { id: 'selected-item-2' };
    const fileClickAction: any = { type: 'FILE_CLICK', file: clickedFile };

    const newState = fileClick(oldState, fileClickAction);
    expect(oldState).toEqual(state);
    expect(newState.selectedItems).toEqual([
      { id: 'selected-item-1' },
      { id: 'selected-item-3' },
    ]);
  });

  it('should remove previously selected file when singleSelect is set to true', () => {
    const oldState: any = {
      ...state,
      config: {
        singleSelect: true,
      } as Partial<PopupConfig>,
    };
    const oldStateCopy = { ...oldState };

    const clickedFile: any = { id: 'clicked-file' };
    const fileClickAction: any = { type: 'FILE_CLICK', file: clickedFile };

    const newState = fileClick(oldState, fileClickAction);
    expect(oldState).toEqual(oldStateCopy);
    expect(newState.selectedItems).toEqual([clickedFile]);
  });
});
