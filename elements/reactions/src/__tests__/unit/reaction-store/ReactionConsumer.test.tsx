import { shallow } from 'enzyme';
import React from 'react';
import { ReactionConsumer } from '../../../reaction-store/ReactionConsumer';
import { ReactionStatus } from '../../../types/ReactionStatus';

describe('ReactionConsumer', () => {
  const children = jest.fn();
  const stateMapper = jest.fn();
  const actionsMapper = jest.fn();
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
    actionsMapper.mockReturnValue(mappedActions);
    stateMapper.mockReturnValue(mappedState);
    store.getState.mockReturnValue(value);
  });

  beforeEach(() => {
    children.mockClear();
    stateMapper.mockClear();
    actionsMapper.mockClear();
    store.getState.mockClear();
    store.onChange.mockClear();
    shallow(
      <ReactionConsumer
        store={store}
        stateMapper={stateMapper}
        actionsMapper={actionsMapper}
      >
        {children}
      </ReactionConsumer>,
    );
  });

  it('should map state', () => {
    expect(stateMapper).toHaveBeenCalledTimes(1);
    expect(stateMapper).toHaveBeenCalledWith(value);
    expect(children).toHaveBeenCalledWith(expect.objectContaining(mappedState));
  });

  it('should map actions', () => {
    expect(actionsMapper).toHaveBeenCalledTimes(1);
    expect(actionsMapper).toHaveBeenCalledWith(store);
    expect(children).toHaveBeenCalledWith(
      expect.objectContaining(mappedActions),
    );
  });

  it('should map actions only once to avoid rerenders', () => {
    expect(stateMapper).toHaveBeenCalledTimes(1);
    expect(stateMapper).toHaveBeenCalledWith(value);

    expect(actionsMapper).toHaveBeenCalledTimes(1);
    expect(actionsMapper).toHaveBeenCalledWith(store);

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

    stateMapper.mockReturnValueOnce(newMapped);
    store.getState.mockReturnValue(newValue);

    store.onChange.mock.calls[0][0](newValue);

    expect(stateMapper).toHaveBeenCalledTimes(2);
    expect(stateMapper).toHaveBeenCalledWith(newValue);
    expect(actionsMapper).toHaveBeenCalledTimes(1);

    expect(children).toHaveBeenCalledWith({ ...newMapped, ...mappedActions });
  });
});
