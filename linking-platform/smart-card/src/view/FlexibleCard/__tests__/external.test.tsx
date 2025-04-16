import { toActionProps } from '../external';

describe('toActionProps', () => {
	it('returns default action props for action components', () => {
		const props = toActionProps();
		expect(props).toEqual({ appearance: 'default', icon: undefined });
	});

	it('returns action props for action components', () => {
		const props = toActionProps({ appearance: 'subtle' });
		expect(props).toEqual({ appearance: 'subtle', icon: undefined });
	});
});
