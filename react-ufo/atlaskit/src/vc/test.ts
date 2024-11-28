import { VCObserver } from './vc-observer';

import { getVCObserver } from './index';

describe('getVCObserver', () => {
	it('is a singleton', () => {
		const vcObserver = getVCObserver();
		const anotherVCObserver = getVCObserver();
		const manuallyInstantiatedVCObserver = new VCObserver({});
		// leveraging triple equal check for objects, i.e. by comparing memory references
		expect(vcObserver === anotherVCObserver).toBe(true);
		expect(vcObserver !== manuallyInstantiatedVCObserver).toBe(true);
	});
});
