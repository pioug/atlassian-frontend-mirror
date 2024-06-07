import { CardAction } from '../../../view/Card/types';
import { combineActionOptions } from '../combine-action-options';

describe('combineActionOptions', () => {
	it('returns actionOptions if defined', () => {
		const actionOptions = { hide: true };

		const combined = combineActionOptions(actionOptions, true, true);

		expect(combined).toEqual({ ...actionOptions });
	});

	it('hides server actions if no action options or showActions are provided and showServerActions is false', () => {
		const combined = combineActionOptions(undefined, false, undefined);

		expect(combined).toEqual({
			hide: false,
			exclude: [CardAction.FollowAction, CardAction.ChangeStatusAction],
		});
	});

	it('hides client actions if no action options or serverActions are provided and showActions is false', () => {
		const combined = combineActionOptions(undefined, undefined, false);

		expect(combined).toEqual({
			hide: false,
			exclude: [CardAction.DownloadAction, CardAction.PreviewAction, CardAction.ViewAction],
		});
	});

	it('hides all actions if no action options are provided and showActions and showServerActions are false', () => {
		const combined = combineActionOptions(undefined, false, false);

		expect(combined).toEqual({ hide: true });
	});

	it('hides only server actions if no actionOptions are provided and show showActions is true', () => {
		const combined = combineActionOptions(undefined, false, true);

		expect(combined).toEqual({
			hide: false,
			exclude: [CardAction.FollowAction, CardAction.ChangeStatusAction],
		});
	});

	it('hides only client actions if no actionOptions are provided and show showServerActions is true', () => {
		const combined = combineActionOptions(undefined, true, false);

		expect(combined).toEqual({
			hide: false,
			exclude: [CardAction.DownloadAction, CardAction.PreviewAction, CardAction.ViewAction],
		});
	});

	it('shows all actions if no actionOptions are provided and showActions and showServerActions are true', () => {
		const combined = combineActionOptions(undefined, true, true);

		expect(combined).toEqual({ hide: false });
	});

	it('shows all actions if no parameters are provided', () => {
		const combined = combineActionOptions();

		expect(combined).toEqual({ hide: false, exclude: [] });
	});

	it('hides all actions on mobile platform', () => {
		const combined = combineActionOptions(undefined, true, true, 'mobile');

		expect(combined).toEqual({ hide: true });
	});
});
