import React from 'react';
import { PureComponent } from 'react';

import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import { Mention } from '@atlaskit/editor-common/mention';

export interface Props {
	id: string;
	providers?: ProviderFactory;
	eventHandlers?: EventHandlers;
	text: string;
	accessLevel?: string;
	localId?: string;
}

export default class MentionItem extends PureComponent<Props, {}> {
	render() {
		const { eventHandlers, id, providers, text, accessLevel, localId } = this.props;

		return (
			<Mention
				id={id}
				text={text}
				accessLevel={accessLevel}
				providers={providers}
				localId={localId}
				eventHandlers={eventHandlers && eventHandlers.mention}
			/>
		);
	}
}
