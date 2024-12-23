import { OverridableMock } from './OverridableMock';

export class OverflowShadowsObserver extends OverridableMock {
	leftShadowSentinel: HTMLElement | null = null;
	rightShadowSentinel: HTMLElement | null = null;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(...inputs: any[]) {
		super(...inputs);
	}

	observeShadowSentinels = this.getMock('observeShadowSentinels');
	updateStickyShadows = this.getMock('updateStickyShadows');
	dispose = this.getMock('dispose');
}
