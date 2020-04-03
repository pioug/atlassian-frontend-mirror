import { ResourceManager } from '../../resourceManager';

class SomeResource {
  loaded: boolean;

  constructor() {
    this.loaded = true;
  }

  unload(): void {
    if (!this.loaded) {
      throw new Error('The resource is already released');
    }

    this.loaded = false;
  }
}

describe('MediaEditor ResourceManager', () => {
  it('should successfully releaseAll if holds no resources', () => {
    const resourceManager = new ResourceManager();
    resourceManager.releaseAll();
    expect(() => resourceManager.releaseAll()).not.toThrow();
  });

  it('should successfully release resource', () => {
    const resourceManager = new ResourceManager();
    const resource = new SomeResource();

    resourceManager.add(resource);
    resourceManager.releaseAll();

    expect(resource.loaded).toBe(false);
  });

  it('should not release resource twice', () => {
    const resourceManager = new ResourceManager();
    const resource = new SomeResource();

    resourceManager.add(resource);
    resourceManager.releaseAll();
    resourceManager.releaseAll();

    expect(resource.loaded).toBe(false);
  });

  it('should successfully release with release function', () => {
    const resourceManager = new ResourceManager();
    let text = 'created';

    resourceManager.addCustom(() => {
      if (text !== 'created') {
        throw new Error('The resource is already released');
      }
      text = 'released';
    });
    resourceManager.releaseAll();

    expect(text).toBe('released');
  });

  it('should release in reverse order', () => {
    const resourceManager = new ResourceManager();

    let first = 0;
    let second = 0;
    let third = 0;

    let counter = 0; // We will control the release order with the counter
    resourceManager.addCustom(() => {
      third = ++counter;
    });
    resourceManager.addCustom(() => {
      second = ++counter;
    });
    resourceManager.addCustom(() => {
      first = ++counter;
    });
    resourceManager.releaseAll();

    expect(first).toBe(1);
    expect(second).toBe(2);
    expect(third).toBe(3);
  });
});
