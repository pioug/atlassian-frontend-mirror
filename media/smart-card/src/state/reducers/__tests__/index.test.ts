import { cardAction } from '../../actions/helpers';
import {
  ACTION_PENDING,
  ACTION_RESOLVING,
  ACTION_ERROR,
  ACTION_RESOLVED,
} from '../../actions/constants';
import { CardActionParams, CardAction } from '../../actions/types';
import { JsonLd } from '../../../client/types';
import { CardStore } from '../../types';
import { cardReducer } from '..';
import { Reducer } from 'react';

describe('Smart Card: Reducers', () => {
  let url: string;
  let store: CardStore;
  let reducer: Reducer<CardStore, CardAction<JsonLd>>;
  let mockActionParams: CardActionParams;
  let mockDateNow: jest.Mock;

  beforeEach(() => {
    url = '/some/url';
    store = {
      [url]: {
        status: 'pending',
        lastUpdatedAt: 121,
      },
    };
    reducer = cardReducer;
    mockDateNow = jest.fn();
    mockActionParams = {
      url,
    };
    Date.now = mockDateNow;
  });

  describe('ACTION_PENDING', () => {
    it('successfully updates URL state to pending', () => {
      delete store[url];
      mockDateNow.mockImplementationOnce(() => 123);
      store = reducer(store, cardAction(ACTION_PENDING, mockActionParams));
      expect(store).toHaveProperty('/some/url', {
        status: 'pending',
        lastUpdatedAt: 123,
      });
    });
  });

  describe('ACTION_RESOLVING', () => {
    it('successfully updates URL state to resolving', () => {
      store = reducer(store, cardAction(ACTION_RESOLVING, mockActionParams));
      expect(store).toHaveProperty('/some/url', {
        status: 'resolving',
        lastUpdatedAt: 121,
      });
    });
  });

  describe('ACTION_ERROR', () => {
    it('successfully updates URL state to errored', () => {
      store = reducer(store, cardAction(ACTION_ERROR, mockActionParams));
      expect(store).toHaveProperty('/some/url', {
        status: 'errored',
        lastUpdatedAt: 121,
      });
    });
  });

  describe('ACTION_RESOLVING', () => {
    it('successfully updates URL state to resolving (happy path)', () => {
      mockDateNow.mockImplementationOnce(() => 123);
      const mockPayload: JsonLd = {
        meta: {
          visibility: 'public',
          access: 'granted',
          definitionId: 'elgoog',
          auth: [],
        },
        data: {
          name: '/some/url',
        },
      };
      store = reducer(
        store,
        cardAction(ACTION_RESOLVED, mockActionParams, mockPayload),
      );
      expect(store).toHaveProperty('/some/url', {
        status: 'resolved',
        details: mockPayload,
        lastUpdatedAt: 123,
      });
    });
  });

  describe('ACTION_RESOLVED', () => {
    it('successfully updates URL state to resolved (happy path)', () => {
      mockDateNow.mockImplementationOnce(() => 123);
      const mockPayload: JsonLd = {
        meta: {
          visibility: 'public',
          access: 'granted',
          definitionId: 'elgoog',
          auth: [],
        },
        data: {
          name: '/some/url',
        },
      };
      store = reducer(
        store,
        cardAction(ACTION_RESOLVED, mockActionParams, mockPayload),
      );
      expect(store).toHaveProperty('/some/url', {
        status: 'resolved',
        details: mockPayload,
        lastUpdatedAt: 123,
      });
    });

    it('successfully keeps URL state with empty payload', () => {
      mockDateNow.mockImplementationOnce(() => 123);
      store = reducer(
        store,
        cardAction(ACTION_RESOLVED, mockActionParams, undefined),
      );
      expect(store).toHaveProperty('/some/url', {
        status: 'resolved',
        lastUpdatedAt: 123,
      });
    });
  });
});
