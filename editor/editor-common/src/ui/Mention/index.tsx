/* eslint-disable @repo/internal/react/no-class-components */
import React, { PureComponent } from 'react';

import type { MentionUserType } from '@atlaskit/adf-schema';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { ProviderFactory, WithProviders } from '../../provider-factory';
import type { Providers } from '../../provider-factory';
import type { ProfilecardProvider } from '../../provider-factory/profile-card-provider';
import type { MentionEventHandlers } from '../EventHandlers';

import { MentionWithProviders } from './mention-with-providers';

type ProviderName = 'mentionProvider' | 'profilecardProvider';

const MENTION_PROVIDERS: ProviderName[] = ['mentionProvider', 'profilecardProvider'];

export interface MentionProps {
	accessLevel?: string;
	eventHandlers?: MentionEventHandlers;
	id: string;
	localId?: string;
	providers?: ProviderFactory;
	text: string;
	userType?: MentionUserType;
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

	componentWillUnmount(): void {
		if (!this.props.providers) {
			// new ProviderFactory is created if no `providers` has been set
			// in this case when component is unmounted it's safe to destroy this providerFactory
			this.providerFactory.destroy();
		}
	}

	private renderWithProvider = (providers: Providers) => {
		const { accessLevel, eventHandlers, id, text, localId, userType } = this.props;
		const { mentionProvider, profilecardProvider } = providers;

		return (
			<MentionWithProviders
				id={id}
				text={text}
				accessLevel={accessLevel}
				localId={localId}
				userType={userType}
				eventHandlers={eventHandlers}
				mentionProvider={mentionProvider}
				profilecardProvider={profilecardProvider}
			/>
		);
	};

	render(): React.JSX.Element {
		const providers = expValEquals('platform_editor_perf_lint_cleanup', 'isEnabled', true)
			? MENTION_PROVIDERS
			: (['mentionProvider', 'profilecardProvider'] satisfies ProviderName[]);
		return (
			<WithProviders
				providers={providers}
				providerFactory={this.providerFactory}
				renderNode={this.renderWithProvider}
			/>
		);
	}
}
