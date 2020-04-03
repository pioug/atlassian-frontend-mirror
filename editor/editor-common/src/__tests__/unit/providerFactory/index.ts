import { ProviderFactory } from '../../../provider-factory';
import { ProviderType } from '../../../provider-factory/types';

describe('ProviderFactory', () => {
  const provider = Promise.resolve('Hello');
  const providerName1 = 'emojiProvider';
  const providerName2 = 'mentionProvider';
  const handler1 = jest.fn();
  const handler2 = jest.fn();
  const handler3 = jest.fn();

  describe('setProvider', () => {
    let providerFactory: ProviderFactory;

    beforeEach(() => {
      providerFactory = new ProviderFactory();
    });

    afterEach(() => {
      providerFactory.destroy();
    });

    it('should update map with new provider', () => {
      const spy = jest.spyOn((providerFactory as any).providers, 'set');
      providerFactory.setProvider(
        providerName1,
        (provider as unknown) as ProviderType<typeof providerName1>,
      );

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(providerName1, provider);
      spy.mockRestore();
    });

    it('should remove provider from map if undefined', () => {
      // set it initially
      providerFactory.setProvider(
        providerName1,
        (provider as unknown) as ProviderType<typeof providerName1>,
      );

      const spySet = jest.spyOn((providerFactory as any).providers, 'set');
      const spyDelete = jest.spyOn(
        (providerFactory as any).providers,
        'delete',
      );
      providerFactory.setProvider(providerName1, undefined);

      expect(spySet).not.toHaveBeenCalled();
      expect(spyDelete).toHaveBeenCalled();
      expect(spyDelete).toHaveBeenCalledWith(providerName1);
      spySet.mockRestore();
      spyDelete.mockRestore();
    });

    it('should trigger notifyUpdated', () => {
      const spy = jest.spyOn<ProviderFactory, any>(
        providerFactory,
        'notifyUpdated',
      );
      providerFactory.setProvider(
        providerName1,
        (provider as unknown) as ProviderType<typeof providerName1>,
      );
      providerFactory.setProvider(providerName1, undefined);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(providerName1, provider);
      expect(spy).toHaveBeenLastCalledWith(providerName1, undefined);
      spy.mockRestore();
    });

    describe('when provider is unchanged', () => {
      beforeEach(() => {
        providerFactory.setProvider(
          providerName1,
          (provider as unknown) as ProviderType<typeof providerName1>,
        );
      });

      it('should not update map with provider', () => {
        const spy = jest.spyOn((providerFactory as any).providers, 'set');
        providerFactory.setProvider(
          providerName1,
          (provider as unknown) as ProviderType<typeof providerName1>,
        );

        expect(spy).not.toHaveBeenCalled();
      });

      it('should not trigger notifyUpdated', () => {
        const spy = jest.spyOn<ProviderFactory, any>(
          providerFactory,
          'notifyUpdated',
        );
        providerFactory.setProvider(
          providerName1,
          (provider as unknown) as ProviderType<typeof providerName1>,
        );

        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('when provider is undefined and new value is also undefined', () => {
      beforeEach(() => {
        providerFactory.setProvider(providerName1, undefined);
      });

      it('should not update map with provider', () => {
        const spy = jest.spyOn((providerFactory as any).providers, 'set');
        providerFactory.setProvider(providerName1, undefined);

        expect(spy).not.toHaveBeenCalled();
      });

      it('should not trigger notifyUpdated', () => {
        const spy = jest.spyOn<ProviderFactory, any>(
          providerFactory,
          'notifyUpdated',
        );
        providerFactory.setProvider(providerName1, undefined);

        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe('removeProvider', () => {
    let providerFactory: ProviderFactory;

    beforeEach(() => {
      providerFactory = new ProviderFactory();
    });

    it('should remove provider from map', () => {
      const spyDelete = jest.spyOn(
        (providerFactory as any).providers,
        'delete',
      );
      providerFactory.removeProvider(providerName1);

      expect(spyDelete).toHaveBeenCalled();
      expect(spyDelete).toHaveBeenCalledWith(providerName1);
      spyDelete.mockRestore();
    });

    it('should trigger notifyUpdated', () => {
      const spy = jest.spyOn<ProviderFactory, any>(
        providerFactory,
        'notifyUpdated',
      );
      providerFactory.removeProvider(providerName1);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(providerName1);
      spy.mockRestore();
    });
  });

  describe('subscribe', () => {
    let providerFactory: ProviderFactory;

    beforeEach(() => {
      providerFactory = new ProviderFactory();
    });

    afterEach(() => {
      handler1.mockReset();
    });

    it('should update map with new handler', () => {
      const spy = jest.spyOn((providerFactory as any).subscribers, 'set');
      providerFactory.subscribe(providerName1, handler1);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(providerName1, [handler1]);
      spy.mockRestore();
    });

    it('should trigger handler', () => {
      providerFactory.setProvider(
        providerName1,
        (provider as unknown) as ProviderType<typeof providerName1>,
      );
      providerFactory.subscribe(providerName1, handler1);

      expect(handler1).toHaveBeenCalled();
      expect(handler1).toHaveBeenCalledWith(providerName1, provider);
    });
  });

  describe('unsubscribe', () => {
    let providerFactory: ProviderFactory;

    beforeEach(() => {
      providerFactory = new ProviderFactory();
      providerFactory.subscribe(providerName1, handler2);
    });

    it('should remove handler from subscriber map', () => {
      const spy = jest.spyOn((providerFactory as any).subscribers, 'set');
      providerFactory.unsubscribe(providerName1, handler1);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(providerName1, [handler2]);
      spy.mockRestore();
    });

    it('should remove provider subscription if there are no handlers left', () => {
      const spy = jest.spyOn((providerFactory as any).subscribers, 'delete');
      providerFactory.unsubscribe(providerName1, handler2);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(providerName1);
      spy.mockRestore();
    });
  });

  describe('notifyUpdated', () => {
    let providerFactory: ProviderFactory;

    beforeEach(() => {
      providerFactory = new ProviderFactory();
      providerFactory.subscribe(providerName1, handler1);
      providerFactory.subscribe(providerName1, handler2);
      providerFactory.subscribe(providerName2, handler3);
    });

    afterEach(() => {
      handler1.mockReset();
      handler2.mockReset();
      handler3.mockReset();
    });

    it('should call all handlers for provider', () => {
      (providerFactory as any).notifyUpdated(providerName1, provider);
      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
      expect(handler3).not.toHaveBeenCalled();
      expect(handler1).toHaveBeenCalledWith(providerName1, provider);
      expect(handler2).toHaveBeenCalledWith(providerName1, provider);
    });
  });

  describe('destroy', () => {
    it('should clear all handlers and providers', () => {
      const providerFactory = new ProviderFactory();
      providerFactory.setProvider(
        providerName1,
        (provider as unknown) as ProviderType<typeof providerName1>,
      );
      providerFactory.subscribe(providerName1, handler1);

      expect(providerFactory.isEmpty()).toBe(false);
      providerFactory.destroy();
      expect(providerFactory.isEmpty()).toBe(true);
    });
  });
});
