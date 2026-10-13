import { createCloseEvent } from '../../dialog/create-close-event';
import { createPopoverCloseEvent } from '../../popover/create-close-event';

describe.each([
	{ name: 'dialog', createEvent: () => createCloseEvent({ reason: 'escape' }) },
	{ name: 'popover', createEvent: () => createPopoverCloseEvent({ reason: 'escape' }) },
])('$name Escape close event', ({ createEvent }) => {
	it('is recognized by consumers checking either key or code', () => {
		const event = createEvent();

		expect(event).toBeInstanceOf(KeyboardEvent);
		expect(event).toMatchObject({ type: 'keydown', key: 'Escape', code: 'Escape', bubbles: true });
	});
});

it('preserves the dialog overlay click event', () => {
	const event = createCloseEvent({ reason: 'overlay-click' });

	expect(event).toBeInstanceOf(MouseEvent);
	expect(event).toMatchObject({ type: 'click', bubbles: true, cancelable: true });
});

it('preserves the popover light-dismiss click event', () => {
	const event = createPopoverCloseEvent({ reason: 'light-dismiss' });

	expect(event).toBeInstanceOf(MouseEvent);
	expect(event).toMatchObject({ type: 'click', bubbles: true, cancelable: true });
});
