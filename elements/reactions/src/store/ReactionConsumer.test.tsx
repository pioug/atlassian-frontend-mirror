import React from 'react';
import { shallow } from 'enzyme';
import { ReactionStatus } from '../types';
import { ReactionConsumer } from './ReactionConsumer';

describe('ReactionConsumer', () => {
  const children = jest.fn();
  const mapStateToPropsMock = jest.fn();
  const mapActionsToPropsMock = jest.fn();
  const value = {
    reactions: {},
    flash: {},
  };
  const mappedActions = {
    onSelection: jest.fn(),
  };

  const mappedState = {
    someValue: 1,
  };

  const store = {
    getReactions: jest.fn(),
    toggleReaction: jest.fn(),
    addReaction: jest.fn(),
    getDetailedReaction: jest.fn(),
    getState: jest.fn(),
    onChange: jest.fn(),
    removeOnChangeListener: jest.fn(),
  };

  beforeAll(() => {
    mapActionsToPropsMock.mockReturnValue(mappedActions);
    mapStateToPropsMock.mockReturnValue(mappedState);
    store.getState.mockReturnValue(value);
  });

  beforeEach(() => {
    children.mockClear();
    mapStateToPropsMock.mockClear();
    mapActionsToPropsMock.mockClear();
    store.getState.mockClear();
    store.onChange.mockClear();
    shallow(
      <ReactionConsumer
        store={store}
        mapStateToProps={mapStateToPropsMock}
        mapActionsToProps={mapActionsToPropsMock}
      >
        {children}
      </ReactionConsumer>,
    );
  });

  it('should map state', () => {
    expect(mapStateToPropsMock).toHaveBeenCalledTimes(1);
    expect(mapStateToPropsMock).toHaveBeenCalledWith(value);
    expect(children).toHaveBeenCalledWith(expect.objectContaining(mappedState));
  });

  it('should map actions', () => {
    expect(mapActionsToPropsMock).toHaveBeenCalledTimes(1);
    expect(mapActionsToPropsMock).toHaveBeenCalledWith(store);
    expect(children).toHaveBeenCalledWith(
      expect.objectContaining(mappedActions),
    );
  });

  it('should map actions only once to avoid rerenders', () => {
    expect(mapStateToPropsMock).toHaveBeenCalledTimes(1);
    expect(mapStateToPropsMock).toHaveBeenCalledWith(value);

    expect(mapActionsToPropsMock).toHaveBeenCalledTimes(1);
    expect(mapActionsToPropsMock).toHaveBeenCalledWith(store);

    expect(children).toHaveBeenCalledWith({ ...mappedState, ...mappedActions });

    const newValue = {
      reactions: {
        ['someari|otherari']: {
          status: ReactionStatus.loading,
        },
      },
      flash: {},
    };

    const newMapped = {
      status: ReactionStatus.loading,
      reactions: [],
    };

    mapStateToPropsMock.mockReturnValueOnce(newMapped);
    store.getState.mockReturnValue(newValue);

    store.onChange.mock.calls[0][0](newValue);

    expect(mapStateToPropsMock).toHaveBeenCalledTimes(2);
    expect(mapStateToPropsMock).toHaveBeenCalledWith(newValue);
    expect(mapActionsToPropsMock).toHaveBeenCalledTimes(1);

    expect(children).toHaveBeenCalledWith({ ...newMapped, ...mappedActions });
  });
});
