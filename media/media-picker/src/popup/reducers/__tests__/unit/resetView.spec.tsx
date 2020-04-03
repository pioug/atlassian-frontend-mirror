import resetView from '../../resetView';

describe('resetView reducer', () => {
  const action = { type: 'RESET_VIEW' };

  it('should not change the state for an unknown action', () => {
    const otherAction = { type: 'SOME_OTHER_TYPE' };

    const stateBase: any = { a: 12, b: 'line' };
    const oldState = { ...stateBase };
    const newState = resetView(oldState, otherAction);

    expect(newState).toEqual(stateBase);
  });

  it('should not change uploads if they were empty', () => {
    const oldState: any = {
      uploads: {},
    };

    const newState = resetView(oldState, action);

    expect(newState.uploads).toEqual({});
  });

  it('should set empty selectedItems and uploads', () => {
    const oldState: any = {
      uploads: {
        'ended-file-id': {
          file: {},
          index: 0,
          timeStarted: 0,
          progress: 1,
        },
      },
      selectedItems: ['first', 'second'],
    };

    const newState = resetView(oldState, action);

    expect(newState.selectedItems).toEqual([]);
    expect(newState.uploads).toEqual({});
  });

  it('should preserve the unrelated state fields', () => {
    const stateData = {
      a: 12,
      b: 'some-string',
    };
    const oldState: any = {
      ...stateData,
      uploads: {},
    };

    const newState = resetView(oldState, action);

    expect(newState).toEqual(expect.objectContaining(stateData));
  });
});
