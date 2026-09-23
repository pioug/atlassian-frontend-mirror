import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';

import type { EditorCardPluginEvents } from './analytics/create-events-queue';
import type { CardPluginEvent } from './analytics/types';
import { EVENT, EVENT_SUBJECT } from './analytics/types';
import { appearanceForLink, getUrl } from './analytics/utils';

const PreAuthValuePropositionModal = lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_smart-card-pre-auth-value-proposition-modal" */ '@atlaskit/smart-card/pre-auth-value-proposition-modal'
	).then((module) => ({ default: module.PreAuthValuePropositionModal })),
);

type PreAuthValuePropositionModalListenerProps = {
	cardPluginEvents: EditorCardPluginEvents<CardPluginEvent>;
};

const getNewSmartLinkUrl = (event: CardPluginEvent): string | undefined => {
	if (
		event.subject !== EVENT_SUBJECT.LINK ||
		event.data.isUndo ||
		event.data.isRedo ||
		appearanceForLink(event.data.node) === 'url'
	) {
		return;
	}

	if (
		event.event === EVENT.CREATED ||
		(event.event === EVENT.UPDATED && event.data.previousDisplay === 'url')
	) {
		return getUrl(event.data.node);
	}
};

const ModalListener = ({
	cardPluginEvents,
}: PreAuthValuePropositionModalListenerProps): React.JSX.Element | null => {
	const [url, setUrl] = useState<string>();

	useEffect(
		() =>
			cardPluginEvents.subscribe((event) => {
				const newSmartLinkUrl = getNewSmartLinkUrl(event);
				if (newSmartLinkUrl) {
					setUrl((currentUrl) => currentUrl ?? newSmartLinkUrl);
				}
			}),
		[cardPluginEvents],
	);

	const onFinished = useCallback(() => setUrl(undefined), []);

	return url ? (
		<Suspense fallback={null}>
			<PreAuthValuePropositionModal key={url} url={url} onFinished={onFinished} />
		</Suspense>
	) : null;
};

export const PreAuthValuePropositionModalListener: React.MemoExoticComponent<
	(props: PreAuthValuePropositionModalListenerProps) => React.JSX.Element | null
> = React.memo(ModalListener);
