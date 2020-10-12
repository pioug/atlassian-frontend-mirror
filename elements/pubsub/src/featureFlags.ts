export enum FeatureFlag {}

const defaultFlags = {};

export class FeatureFlags {
  private flags: { [key: string]: boolean };

  constructor(flags?: { [key: string]: boolean }) {
    this.flags = { ...defaultFlags, ...flags };
  }

  isEnabled(key: FeatureFlag): boolean {
    return this.flags[key] === true;
  }
}
