/* eslint-disable @repo/internal/react/no-class-components */

import React, { PureComponent } from 'react';

import { expVal } from '@atlaskit/platform-feature-experiments/exp-val';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';

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
const GENERIC_MENTION_IDS = ['HipChat', 'all', 'here'];
const isAgentMentionUserType = (userType: MentionNodeDataUserType | undefined): boolean =>
	userType === 'APP' || userType === 'AGENT';

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
		const cohort = expVal<string>(
			'convo_ai_entity_hover_cards_non_hello_exp',
			'hover_card_cohort',
			'control',
		);
		const isAvatarEnabled =
			(hasProvider || canReportMissingProvider) &&
			userType !== 'SPECIAL' &&
			!GENERIC_MENTION_IDS.includes(id) &&
			(cohort === 'person' ||
				cohort === 'all' ||
				isExperimentEnabled('platform_editor_mention_node_avatar') ||
				isExperimentEnabled('platform_editor_mention_node_graphql_provider') ||
				(isAgentMentionUserType(userType) &&
					isExperimentEnabled('platform_editor_drop3_hexagon_agent_avatar')));

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
