/* eslint-disable @repo/internal/react/no-class-components */
import React, { PureComponent } from 'react';

import { ProviderFactory, type Providers, WithProviders } from '../../provider-factory';
import { type ProfilecardProvider } from '../../provider-factory/profile-card-provider';
import { type MentionEventHandlers } from '../EventHandlers';

import { MentionWithProviders } from './mention-with-providers';

export interface MentionProps {
	accessLevel?: string;
	eventHandlers?: MentionEventHandlers;
	id: string;
	localId?: string;
	providers?: ProviderFactory;
	text: string;
}

export interface MentionState {
	profilecardProvider: ProfilecardProvider | null;
}

export default class Mention extends PureComponent<MentionProps, Object> {
	private providerFactory: ProviderFactory;

	constructor(props: MentionProps) {
		super(props);
		this.providerFactory = props.providers || new ProviderFactory();
	}

	componentWillUnmount() {
		if (!this.props.providers) {
			// new ProviderFactory is created if no `providers` has been set
			// in this case when component is unmounted it's safe to destroy this providerFactory
			this.providerFactory.destroy();
		}
	}

	private renderWithProvider = (providers: Providers) => {
		const { accessLevel, eventHandlers, id, text, localId } = this.props;
		const { mentionProvider, profilecardProvider } = providers;

		return (
			<MentionWithProviders
				id={id}
				text={text}
				accessLevel={accessLevel}
				localId={localId}
				eventHandlers={eventHandlers}
				mentionProvider={mentionProvider}
				profilecardProvider={profilecardProvider}
			/>
		);
	};

	render(): React.JSX.Element {
		return (
			<WithProviders
				providers={['mentionProvider', 'profilecardProvider']}
				providerFactory={this.providerFactory}
				renderNode={this.renderWithProvider}
			/>
		);
	}
}
