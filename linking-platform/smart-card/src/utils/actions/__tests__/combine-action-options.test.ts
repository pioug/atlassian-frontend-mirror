import { CardAction } from '../../../view/Card/types';
import { combineActionOptions } from '../combine-action-options';

describe('combineActionOptions', () => {
	it('returns actionOptions if defined', () => {
		const actionOptions = { hide: true };

		const combined = combineActionOptions({
			actionOptions,
		});

		expect(combined).toEqual({ ...actionOptions });
	});

	it('hides preview action when hidePreviewButton is true', () => {
		const combined = combineActionOptions({
			hidePreviewButton: true,
		});

		expect(combined).toEqual({ hide: false, exclude: [CardAction.PreviewAction] });
	});

	it('shows all actions if no parameters are provided', () => {
		const combined = combineActionOptions({});

		expect(combined).toEqual({ hide: false, exclude: [] });
	});

	it('hides all actions on mobile platform', () => {
		const combined = combineActionOptions({
			platform: 'mobile',
		});

		expect(combined).toEqual({ hide: true });
	});
});
