import { fireEvent } from '@testing-library/react';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
	dropTargetForExternal,
	monitorForExternal,
} from '@atlaskit/pragmatic-drag-and-drop/external/adapter';

import { disableDraggingToCrossOriginIFramesForExternal } from '../../../../internal/pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/external';
import { appendToBody, getElements, nativeDrag, reset, userEvent } from '../_pdnd-test-utils';

afterEach(reset);

it('should apply the fix when an external drag starts', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(
		appendToBody(iframe, element),
		disableDraggingToCrossOriginIFramesForExternal(),
	);

	nativeDrag.startExternal({ items: [{ type: 'text/plain', data: 'hello' }] });

	expect(iframe).toHaveStyle('pointer-events: none');

	cleanup();
});

it('should clear the fix when the drag ends (leave window)', async () => {
	const [iframe] = getElements('iframe');
	iframe.src = 'https://atlassian.design';
	const ordered: string[] = [];
	const cleanup = combine(
		appendToBody(iframe),
		monitorForExternal({
			onDragStart: () => ordered.push('monitor:start'),
			onDropTargetChange: () => ordered.push('monitor:change'),
			onDrop: () => ordered.push('monitor:drop'),
		}),
		disableDraggingToCrossOriginIFramesForExternal(),
	);

	nativeDrag.startExternal({ items: [{ type: 'text/plain', data: 'hello' }] });

	expect(iframe).toHaveStyle('pointer-events: none');
	expect(ordered).toEqual(['monitor:start']);
	ordered.length = 0;

	// will finish the drag
	await userEvent.leaveWindow();

	expect(iframe).not.toHaveStyle('pointer-events: none');
	expect(ordered).toEqual(['monitor:drop']);

	cleanup();
});

it('should clear the fix when the drag ends (drop)', async () => {
	const [iframe] = getElements('iframe');
	const [A] = getElements('div');
	const ordered: string[] = [];
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(
		appendToBody(iframe, A),
		monitorForExternal({
			onDragStart: () => ordered.push('monitor:start'),
			onDropTargetChange: () => ordered.push('monitor:change'),
			onDrop: () => ordered.push('monitor:drop'),
		}),
		dropTargetForExternal({
			element: A,
			onDragEnter: () => ordered.push('A:enter'),
			onDragLeave: () => ordered.push('A:leave'),
			onDrop: () => ordered.push('A:drop'),
		}),
		disableDraggingToCrossOriginIFramesForExternal(),
	);

	nativeDrag.startExternal({ items: [{ type: 'text/plain', data: 'hello' }] });

	expect(ordered).toEqual(['monitor:start']);
	ordered.length = 0;

	expect(iframe).toHaveStyle('pointer-events: none');

	// [] -> [A]
	fireEvent.dragEnter(A);

	expect(ordered).toEqual(['A:enter', 'monitor:change']);
	ordered.length = 0;

	nativeDrag.drop({ items: [{ type: 'text/plain', data: 'hello' }], target: A });

	expect(iframe).not.toHaveStyle('pointer-events: none');
	expect(ordered).toEqual(['A:drop', 'monitor:drop']);

	cleanup();
});
