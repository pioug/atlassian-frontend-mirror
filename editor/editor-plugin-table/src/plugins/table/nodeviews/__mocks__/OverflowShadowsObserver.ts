import { OverridableMock } from './OverridableMock';

export class OverflowShadowsObserver extends OverridableMock {
  firstCell: HTMLElement | null = null;
  lastCell: HTMLElement | null = null;
  constructor(...inputs: any[]) {
    super(...inputs);
  }

  observeCells = this.getMock('observeCells');
  updateStickyShadows = this.getMock('updateStickyShadows');
  dispose = this.getMock('dispose');
}
