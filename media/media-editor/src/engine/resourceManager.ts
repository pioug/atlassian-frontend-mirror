export interface Resource {
  unload(): void;
}

export type ReleaseFunction = () => void;

export class ResourceManager {
  private releaseFunctions: Array<ReleaseFunction>;

  constructor() {
    this.releaseFunctions = [];
  }

  add(resource: Resource): void {
    this.releaseFunctions.push(() => {
      resource.unload();
    });
  }

  addCustom(releaseFunction: ReleaseFunction): void {
    this.releaseFunctions.push(releaseFunction);
  }

  releaseAll(): void {
    this.releaseFunctions.reverse();
    this.releaseFunctions.forEach((fn) => fn());
    this.releaseFunctions = [];
  }
}
