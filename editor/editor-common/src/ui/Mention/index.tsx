/* eslint-disable @repo/internal/react/no-class-components */

import React, { PureComponent } from 'react';

import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { isMentionAvatarEnabled } from '../../mention-avatar';
import { ProviderFactory, WithProviders } from '../../provider-factory';
import type { Providers } from '../../provider-factory';
import type { ProfilecardProvider } from '../../provider-factory/profile-card-provider';
import type { MentionEventHandlers } from '../EventHandlers';
import type {
	MentionNodeDataProvider,
	MentionNodeDataUserType,
} from './mention-node-data-provider';
import {
	MissingMentionAvatarProvider,
	MentionWithAvatarProviders,
	MentionWithProviders,
} from './mention-with-providers';

type ProviderName = 'mentionProvider' | 'profilecardProvider';

const MENTION_PROVIDERS: ProviderName[] = ['mentionProvider', 'profilecardProvider'];

export interface MentionProps {
	accessLevel?: string;
	disabledTooltip?: string;
	eventHandlers?: MentionEventHandlers;
	id: string;
	isDisabled?: boolean;
	localId?: string;
	mentionNodeDataProvider?: MentionNodeDataProvider;
	providers?: ProviderFactory;
	text: string;
	userType?: MentionNodeDataUserType;
}

export interface MentionState {
	profilecardProvider: ProfilecardProvider | null;
}

export default class Mention extends PureComponent<MentionProps, object> {
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
		const {
			accessLevel,
			eventHandlers,
			id,
			text,
			localId,
			userType,
			isDisabled,
			disabledTooltip,
			mentionNodeDataProvider,
		} = this.props;
		const { mentionProvider, profilecardProvider } = providers;
		const hasProvider = Boolean(mentionNodeDataProvider);
		const canReportMissingProvider =
			!hasProvider && fg('platform_editor_mention_avatar_observability');
		const isAvatarEnabled = isMentionAvatarEnabled({
			id,
			userType,
			hasProvider,
			canReportMissingProvider,
		});

		if (isAvatarEnabled && mentionNodeDataProvider) {
			return (
				<MentionWithAvatarProviders
					id={id}
					text={text}
					accessLevel={accessLevel}
					localId={localId}
					userType={userType}
					isDisabled={isDisabled}
					disabledTooltip={disabledTooltip}
					eventHandlers={eventHandlers}
					mentionProvider={mentionProvider}
					mentionNodeDataProvider={mentionNodeDataProvider}
					profilecardProvider={profilecardProvider}
				/>
			);
		}

		return (
			<>
				{canReportMissingProvider && isAvatarEnabled && (
					<MissingMentionAvatarProvider mentionKey={`${userType ?? 'DEFAULT'}:${id}`} />
				)}
				<MentionWithProviders
					id={id}
					text={text}
					accessLevel={accessLevel}
					localId={localId}
					userType={userType}
					isDisabled={isDisabled}
					disabledTooltip={disabledTooltip}
					eventHandlers={eventHandlers}
					mentionProvider={mentionProvider}
					profilecardProvider={profilecardProvider}
				/>
			</>
		);
	};

	render(): React.JSX.Element {
		const providers = isExperimentEnabled('platform_editor_perf_lint_cleanup')
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
