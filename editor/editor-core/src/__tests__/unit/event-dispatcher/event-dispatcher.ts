import { name } from '../../../version.json';
import { EventDispatcher, createDispatch } from '../../../event-dispatcher';
import { PluginKey } from 'prosemirror-state';

describe(name, () => {
  describe('Event Dispatcher', () => {
    let eventDispatcher: EventDispatcher;
    beforeEach(() => {
      eventDispatcher = new EventDispatcher();
    });

    describe('EventDispatcher', () => {
      describe('#on', () => {
        it('should add event listener', () => {
          eventDispatcher.on('event', () => {});
          expect(
            Object.keys((eventDispatcher as any).listeners).length,
          ).toEqual(1);
          expect((eventDispatcher as any).listeners['event'].size).toEqual(1);
        });
      });

      describe('#off', () => {
        it('should remove event listener', () => {
          const listener = () => {};
          eventDispatcher.on('event', listener);
          eventDispatcher.off('event', listener);
          expect(
            Object.keys((eventDispatcher as any).listeners).length,
          ).toEqual(1);
          expect((eventDispatcher as any).listeners['event'].size).toEqual(0);
        });
      });

      describe('#emit', () => {
        it('should call listener once with provided data', () => {
          const listener = jest.fn();
          const data = { test: 1 };
          eventDispatcher.on('event', listener);
          eventDispatcher.emit('event', data);
          expect(listener).toHaveBeenCalledTimes(1);
          expect(listener).toHaveBeenLastCalledWith(data);
        });
      });
    });

    describe('#createDispatch', () => {
      it('should return a dispatch function', () => {
        expect(typeof createDispatch(eventDispatcher)).toEqual('function');
      });

      it('should call listener once with provided data', () => {
        const listener = jest.fn();
        const data = { test: 1 };
        eventDispatcher.on('event', listener);
        const dispatch = createDispatch(eventDispatcher);
        dispatch('event', data);
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenLastCalledWith(data);
      });

      it('should call listener once with provided data when event is a plugin key', () => {
        const listener = jest.fn();
        const data = { test: 1 };
        const pluginKey = new PluginKey('event');
        const dispatch = createDispatch(eventDispatcher);
        eventDispatcher.on((pluginKey as any).key, listener);
        dispatch(pluginKey, data);
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenLastCalledWith(data);
      });
    });
  });
});
