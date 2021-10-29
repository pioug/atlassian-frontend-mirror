import { PROFILER_KEY, RenderCountProfiler } from '../../profiler/render-count';

describe('RenderCountProfiler', () => {
  let profiler: RenderCountProfiler;

  beforeEach(() => {
    profiler = RenderCountProfiler.getInstance({ store: window });
  });

  afterEach(() => {
    profiler.remove();
  });

  describe('static getInstance', () => {
    it('should always return the same (cached) instantiated profiler instance', () => {
      const instanceRef = RenderCountProfiler.getInstance({
        store: { hi: 'hi' },
      });
      expect(profiler).toBe(instanceRef);
    });
  });

  describe('enable, isEnabled', () => {
    it('should set enabled to true', () => {
      expect(profiler.isEnabled()).toEqual(false);
      profiler.enable();
      expect(profiler.isEnabled()).toEqual(true);
    });
  });

  describe('remove', () => {
    it('should delete data from existing store without modifying other properties', () => {
      (window as any).someKey = 'someProperty';
      profiler.enable();
      let data = profiler.getData(PROFILER_KEY);
      expect(data).toEqual(expect.any(Object));
      profiler.remove();
      data = profiler.getData(PROFILER_KEY);
      expect(data).toEqual(undefined);
      expect((window as any).someKey).toEqual('someProperty');
    });
  });

  describe('setRenderCount', () => {
    it('should set render count for component instance', () => {
      profiler.enable();
      const componentId = 'editor';
      const instanceId = 'abc123';
      profiler.setRenderCount({ componentId, renderCount: 3, instanceId });
      const count = profiler.getRenderCount({ componentId });
      expect(count).toEqual(3);
    });
  });

  describe('getInstanceRenderCounters', () => {
    it('should return an array of instance counters (including id and counts)', () => {
      profiler.enable();

      const componentId = 'editor';
      const firstInstanceId = 'abc123';
      const secondInstanceId = 'def456';

      profiler.setRenderCount({
        componentId,
        renderCount: 3,
        instanceId: firstInstanceId,
      });
      profiler.setRenderCount({
        componentId,
        renderCount: 8,
        instanceId: secondInstanceId,
      });

      const counters = profiler.getInstanceRenderCounters({ componentId });

      expect(counters?.[0].instanceId).toEqual(firstInstanceId);
      expect(counters?.[0].count).toEqual(3);

      expect(counters?.[1].instanceId).toEqual(secondInstanceId);
      expect(counters?.[1].count).toEqual(8);
    });
  });

  describe('getRenderCount', () => {
    it('should return a 0 render count for a componentId that doesnt exist', () => {
      profiler.enable();
      const componentId = 'nonExistentComponent';
      const count = profiler.getRenderCount({ componentId });
      expect(count).toEqual(0);
    });

    it('should return the total render count for a component with one component instance', () => {
      profiler.enable();
      const componentId = 'editor';
      const firstInstanceId = 'abc123';
      profiler.setRenderCount({
        componentId,
        renderCount: 9,
        instanceId: firstInstanceId,
      });
      const count = profiler.getRenderCount({ componentId });
      expect(count).toEqual(9);
    });

    it('should return the total render count for a component with multiple component instances', () => {
      profiler.enable();
      const componentId = 'editor';
      const firstInstanceId = 'abc123';
      const secondInstanceId = 'def456';
      profiler.setRenderCount({
        componentId,
        renderCount: 4,
        instanceId: firstInstanceId,
      });
      profiler.setRenderCount({
        componentId,
        renderCount: 9,
        instanceId: secondInstanceId,
      });
      const count = profiler.getRenderCount({ componentId });
      expect(count).toEqual(13);
    });
  });

  describe('getData', () => {
    it('should return profiler data object', () => {
      profiler.enable();
      profiler.setRenderCount({
        componentId: 'some-component-id',
        renderCount: 3,
        instanceId: 'some-instance-id',
      });
      const data = profiler.getData(PROFILER_KEY);
      expect(data).toEqual({
        enabled: true,
        components: {
          'some-component-id': {
            'some-instance-id': {
              count: 3,
            },
          },
        },
      });
    });
  });
});
