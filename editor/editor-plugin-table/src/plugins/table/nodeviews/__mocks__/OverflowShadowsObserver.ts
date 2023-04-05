import { OverridableMock } from './OverridableMock';

export class OverflowShadowsObserver extends OverridableMock {
  leftShadowSentinel: HTMLElement | null = null;
  rightShadowSentinel: HTMLElement | null = null;
  constructor(...inputs: any[]) {
    super(...inputs);
  }

  observeShadowSentinels = this.getMock('observeShadowSentinels');
  updateStickyShadows = this.getMock('updateStickyShadows');
  dispose = this.getMock('dispose');
}
