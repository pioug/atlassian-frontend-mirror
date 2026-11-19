import React from 'react';

import type { IntlShape } from 'react-intl';

import type { PortalProviderAPI } from '@atlaskit/editor-common/common';
import { trackChangesMessages } from '@atlaskit/editor-common/messages/track-changes';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import VisuallyHidden from '@atlaskit/visually-hidden/visually-hidden';

export const mountDiffBoundary = (
	host: HTMLElement,
	intl: IntlShape,
	isInserted: boolean,
	isStart: boolean,
	portalProviderAPI: PortalProviderAPI,
): (() => void) => {
	const key = `diff-boundary-${crypto.randomUUID()}`;
	const message = isInserted
		? isStart
			? trackChangesMessages.diffInsertStart
			: trackChangesMessages.diffInsertEnd
		: isStart
			? trackChangesMessages.diffDeleteStart
			: trackChangesMessages.diffDeleteEnd;
	portalProviderAPI.render(
		() => <VisuallyHidden>{intl.formatMessage(message)}</VisuallyHidden>,
		host,
		key,
	);
	return () => portalProviderAPI.remove(key);
};

export const createDiffBoundaryWidget = (
	pos: number,
	intl: IntlShape,
	isInserted: boolean,
	isStart: boolean,
	portalProviderAPI: PortalProviderAPI,
	side: number = isStart ? -0.5 : -2,
): Decoration => {
	let unmount: (() => void) | undefined;
	return Decoration.widget(
		pos,
		(view) => {
			// ShowDiff has no cue API; ADS owns hidden content, while ProseMirror requires a DOM host.
			const host = view.dom.ownerDocument.createElement('span');
			unmount = mountDiffBoundary(host, intl, isInserted, isStart, portalProviderAPI);
			return host;
		},
		{
			// Deleted widgets precede the surviving text; its start cue must follow them.
			side,
			marks: [],
			ignoreSelection: true,
			destroy: () => unmount?.(),
		},
	);
};
