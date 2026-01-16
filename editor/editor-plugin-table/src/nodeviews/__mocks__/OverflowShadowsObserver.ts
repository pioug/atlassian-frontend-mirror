import { OverridableMock } from './OverridableMock';

export class OverflowShadowsObserver extends OverridableMock {
	leftShadowSentinel: HTMLElement | null = null;
	rightShadowSentinel: HTMLElement | null = null;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(...inputs: any[]) {
		super(...inputs);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	observeShadowSentinels: any = this.getMock('observeShadowSentinels');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	updateStickyShadows: any = this.getMock('updateStickyShadows');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	dispose: any = this.getMock('dispose');
}
