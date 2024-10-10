/* eslint-disable @repo/internal/react/no-class-components */
import React, { PureComponent } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { ProviderFactory, type Providers, WithProviders } from '../../provider-factory';
import { type ProfilecardProvider } from '../../provider-factory/profile-card-provider';
import { type MentionEventHandlers } from '../EventHandlers';

import { MentionWithProviders, MentionWithProvidersOld } from './mention-with-providers';

export interface MentionProps {
	id: string;
	providers?: ProviderFactory;
	eventHandlers?: MentionEventHandlers;
	text: string;
	accessLevel?: string;
	localId?: string;
}

export interface MentionState {
	profilecardProvider: ProfilecardProvider | null;
}

export default class Mention extends PureComponent<MentionProps, {}> {
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

		if (fg('platform_editor_react18_mention_with_provider')) {
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
		}
		return (
			<MentionWithProvidersOld
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

	render() {
		return (
			<WithProviders
				providers={['mentionProvider', 'profilecardProvider']}
				providerFactory={this.providerFactory}
				renderNode={this.renderWithProvider}
			/>
		);
	}
}
