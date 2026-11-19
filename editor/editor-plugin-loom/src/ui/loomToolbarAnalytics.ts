import { bind } from 'bind-event-listener';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';

import type { LoomPlugin } from '../loomPluginType';

// An editor API survives toolbar remounts, resize and pin/unpin. Weak references avoid retaining editors.
let viewedEditors: WeakSet<object> | undefined;

type LoomToolbarEvent = {
	action: 'viewed' | 'clicked';
	actionSubject: 'button';
	actionSubjectId: 'recordVideo';
	attributes: { loomEntryPoint: 'editor-pinned-toolbar' };
	eventType: 'ui';
};

export const fireLoomToolbarEvent = (
	api: ExtractInjectionAPI<LoomPlugin> | undefined,
	action: LoomToolbarEvent['action'],
): void => {
	api?.analytics?.actions.fireAnalyticsEvent<LoomToolbarEvent, 'customEventType'>({
		action,
		actionSubject: 'button',
		actionSubjectId: 'recordVideo',
		eventType: 'ui',
		attributes: { loomEntryPoint: 'editor-pinned-toolbar' },
	});
};

export const observeLoomToolbarButton = (
	button: HTMLElement,
	editor: object,
	onViewed: () => void,
): (() => void) | undefined => {
	if (viewedEditors?.has(editor) || typeof IntersectionObserver === 'undefined') {
		return;
	}
	const editors = (viewedEditors ??= new WeakSet<object>());
	const ownerDocument = button.ownerDocument;
	let intersects = false;
	const notifyVisible = () => {
		if (intersects && ownerDocument.visibilityState === 'visible' && !editors.has(editor)) {
			editors.add(editor);
			onViewed();
		}
	};
	const observer = new IntersectionObserver(([entry]) => {
		// display:none container queries have no intersection, even though the button stays mounted.
		intersects =
			entry.isIntersecting && entry.intersectionRect.width > 0 && entry.intersectionRect.height > 0;
		notifyVisible();
	});
	observer.observe(button);
	const unbind = bind(ownerDocument, { type: 'visibilitychange', listener: notifyVisible });
	return () => {
		observer.disconnect();
		unbind();
	};
};
