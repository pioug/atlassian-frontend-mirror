import UFOSegment from '@atlaskit/react-ufo/ufo-segment';

import DefaultInteractionID from '../../interaction-id-context/defaultInteractionId';
import { getInteractionId } from '../../interaction-id-context/getInteractionId';
import { subscribeToInteractionIdChanges } from '../../interaction-id-context/subscribeToInteractionIdChanges';
import SegmentImplementation from '../segment';

// Explicitly exercise the legacy surfaces: existing consumers must keep the same identities.
describe('React UFO entry-point compatibility', () => {
	it('exposes the existing segment implementation without wrapping or copying it', () => {
		expect(UFOSegment).toBe(SegmentImplementation);
		expect(UFOSegment).toBe(jest.requireActual('../index').default);
	});

	it('keeps the legacy and direct interaction ID bindings on one observable singleton', () => {
		const legacy = jest.requireActual('../../interaction-id-context');
		expect(legacy.DefaultInteractionID).toBe(DefaultInteractionID);
		const previous = DefaultInteractionID.current;
		const listener = jest.fn();
		const unsubscribe = subscribeToInteractionIdChanges(listener);
		try {
			legacy.DefaultInteractionID.current = 'entry-point-identity';
			expect(getInteractionId()).toBe(DefaultInteractionID);
			expect(getInteractionId().current).toBe('entry-point-identity');
			expect(listener).toHaveBeenCalledWith('entry-point-identity');
		} finally {
			unsubscribe();
			DefaultInteractionID.current = previous;
		}
	});
});
