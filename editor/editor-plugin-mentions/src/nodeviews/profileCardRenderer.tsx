import React from 'react';

import { bind } from 'bind-event-listener';
import uuid from 'uuid/v4';

import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';

import type { MentionsPlugin } from '../mentionsPluginType';
import { type MentionPluginOptions } from '../types';
import { ProfileCardComponent } from '../ui/ProfileCardComponent';

export const profileCardRenderer = ({
	dom,
	options,
	portalProviderAPI,
	node,
	api,
}: {
	dom: Node;
	options?: MentionPluginOptions;
	portalProviderAPI: PortalProviderAPI;
	node: PMNode;
	api: ExtractInjectionAPI<MentionsPlugin> | undefined;
}) => {
	let renderingProfileCard = false;
	const key = uuid();
	let cleanupSelection: (() => void) | undefined;

	const removeProfileCard = () => {
		portalProviderAPI.remove(key);
		renderingProfileCard = false;
		cleanupSelection?.();
	};

	const listenerCleanup = bind(dom, {
		type: 'click',
		listener: () => {
			if (dom instanceof HTMLElement && options?.profilecardProvider && !renderingProfileCard) {
				renderingProfileCard = true;
				portalProviderAPI.render(
					() => (
						<ProfileCardComponent
							activeMention={node}
							profilecardProvider={options?.profilecardProvider}
							dom={dom}
							closeComponent={removeProfileCard}
						/>
					),
					dom,
					key,
				);
				// If we change the selection we should also remove the profile card. The "deselectNode"
				// should usually catch this, but it's possible (ie. on triple click) for this not to be called
				// which means the profile card gets stuck open until you click + change selection
				cleanupSelection = api?.selection?.sharedState.onChange(({ nextSharedState }) => {
					const selection = nextSharedState?.selection;
					if (selection instanceof NodeSelection ? selection.node === node : false) {
						return;
					}
					removeProfileCard?.();
				});
			}
		},
	});

	return {
		destroyProfileCard: () => {
			listenerCleanup();
			removeProfileCard?.();
		},
		removeProfileCard,
	};
};
