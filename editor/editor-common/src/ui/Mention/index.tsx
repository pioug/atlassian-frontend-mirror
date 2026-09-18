/* eslint-disable @repo/internal/react/no-class-components */

import React, { PureComponent } from 'react';

import type { UserType as MentionUserType } from '@atlaskit/adf-schema/mention';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { ProviderFactory, WithProviders } from '../../provider-factory';
import type { Providers } from '../../provider-factory';
import type { ProfilecardProvider } from '../../provider-factory/profile-card-provider';
import type { MentionEventHandlers } from '../EventHandlers';
import type { MentionNodeDataProvider } from './mention-node-data-provider';
import { MentionWithAvatarProviders, MentionWithProviders } from './mention-with-providers';

type ProviderName = 'mentionProvider' | 'profilecardProvider';

const MENTION_PROVIDERS: ProviderName[] = ['mentionProvider', 'profilecardProvider'];
const GENERIC_MENTION_IDS = ['HipChat', 'all', 'here'];

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
		const isAvatarEnabled =
			Boolean(mentionNodeDataProvider) &&
			userType !== 'SPECIAL' &&
			!GENERIC_MENTION_IDS.includes(id) &&
			isExperimentEnabled('platform_editor_mention_node_avatar');

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
