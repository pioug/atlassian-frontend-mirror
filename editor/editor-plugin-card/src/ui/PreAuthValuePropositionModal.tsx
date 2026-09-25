import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { CardPlugin } from '../cardPluginType';
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
	api?: ExtractInjectionAPI<CardPlugin>;
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
	api,
	cardPluginEvents,
}: PreAuthValuePropositionModalListenerProps): React.JSX.Element | null => {
	const [url, setUrl] = useState<string>();
	const [isOpen, setIsOpen] = useState(false);

	// While the pre-auth modal is visible, use 'overlayOpen' to suppress the floating toolbar.
	// Jira portals editor popups above its issue dialog, so the toolbar would otherwise appear
	// above the modal blanket. Keep it available while link eligibility is still being checked.
	// On close or unmount, restore the previous intent unless another interaction has changed it.
	useEffect(() => {
		if (!isOpen || !api?.userIntent) {
			return;
		}

		const previousIntent =
			api.userIntent.sharedState.currentState()?.currentUserIntent ?? 'default';
		api.core.actions.execute(api.userIntent.commands.setCurrentUserIntent('overlayOpen'));

		return () => {
			if (api.userIntent?.sharedState.currentState()?.currentUserIntent === 'overlayOpen') {
				api.core.actions.execute(api.userIntent.commands.setCurrentUserIntent(previousIntent));
			}
		};
	}, [api, isOpen]);

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

	const onFinished = useCallback(() => {
		setIsOpen(false);
		setUrl(undefined);
	}, []);

	return url ? (
		<Suspense fallback={null}>
			<PreAuthValuePropositionModal
				key={url}
				url={url}
				onFinished={onFinished}
				onOpenChange={setIsOpen}
			/>
		</Suspense>
	) : null;
};

export const PreAuthValuePropositionModalListener: React.MemoExoticComponent<
	(props: PreAuthValuePropositionModalListenerProps) => React.JSX.Element | null
> = React.memo(ModalListener);
