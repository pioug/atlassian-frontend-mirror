import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';

import { disableDraggingToCrossOriginIFramesForExternal } from '../../../../internal/pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/external';
import { appendToBody, getElements, nativeDrag, reset, userEvent } from '../_pdnd-test-utils';

afterEach(reset);

it('should apply the fix while there are multiple registrations', () => {
	const [iframe] = getElements('iframe');
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(
		appendToBody(iframe),
		disableDraggingToCrossOriginIFramesForExternal(),
		disableDraggingToCrossOriginIFramesForExternal(),
		disableDraggingToCrossOriginIFramesForExternal(),
	);

	expect(iframe).not.toHaveStyle('pointer-events: none');

	nativeDrag.startExternal({ items: [{ type: 'text/plain', data: 'hello' }] });

	expect(iframe).toHaveStyle('pointer-events: none');

	cleanup();
});

it('should no longer apply the fix when there are no more registrations', async () => {
	const [iframe] = getElements('iframe');
	iframe.src = 'https://atlassian.design';
	const unregister1 = disableDraggingToCrossOriginIFramesForExternal();
	const unregister2 = disableDraggingToCrossOriginIFramesForExternal();
	const cleanup = appendToBody(iframe);

	nativeDrag.startExternal({ items: [{ type: 'text/plain', data: 'hello' }] });

	expect(iframe).toHaveStyle('pointer-events: none');

	userEvent.leaveWindow();

	expect(iframe).not.toHaveStyle('pointer-events: none');

	// Unregistering first - fix should still be applied
	unregister1();

	nativeDrag.startExternal({ items: [{ type: 'text/plain', data: 'hello' }] });

	expect(iframe).toHaveStyle('pointer-events: none');

	userEvent.leaveWindow();

	expect(iframe).not.toHaveStyle('pointer-events: none');

	// Removing last registration - expecting fix no longer applied

	unregister2();

	nativeDrag.startExternal({ items: [{ type: 'text/plain', data: 'hello' }] });

	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});

it('should not disable the fix if the cleanup function is called a drag is occurring', async () => {
	const [iframe] = getElements('iframe');
	iframe.src = 'https://atlassian.design';
	const unregister = disableDraggingToCrossOriginIFramesForExternal();
	const cleanup = appendToBody(iframe);

	nativeDrag.startExternal({ items: [{ type: 'text/plain', data: 'hello' }] });

	expect(iframe).toHaveStyle('pointer-events: none');

	unregister();

	// fix is still applied
	expect(iframe).toHaveStyle('pointer-events: none');

	cleanup();

	// fix removed when drag finishes
	userEvent.leaveWindow();

	expect(iframe).not.toHaveStyle('pointer-events: none');
});
