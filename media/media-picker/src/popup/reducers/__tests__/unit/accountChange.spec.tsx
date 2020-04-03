import accountChange from '../../accountChange';

describe('accountChange()', () => {
  const stateBase = {
    a: 12,
    b: 'abc',
  };

  const state = {
    ...stateBase,
    view: {
      hasError: true,
      isUploading: 'some-upload-status',
      items: 'some-items',
    },
    giphy: {
      imageResults: ['already-existing-result-1', 'already-existing-result-2'],
    },
  };

  it('should return original state for unknown action', () => {
    const oldState: any = { ...state };
    const newState = accountChange(oldState, { type: 'UNKNOWN' });

    expect(oldState).toEqual(state);
    expect(newState).toEqual(state);
  });
});
