import { type ClientConfig } from '../base-client';
import { DEFAULT_CONFIG } from '../constants';
import { BaseGraphQlClient } from '../graphql-client';
import { logException } from '../sentry/main';

import {
	AddTeamWatcherMutation,
	type AddTeamWatcherMutationResponse,
	type AddTeamWatcherMutationVariables,
} from './mutations/add-team-watcher.graphql';
import {
	CreateTagMutation,
	type CreateTagMutationResponse,
	type CreateTagMutationVariables,
} from './mutations/create-tag-mutation.graphql';
import {
	HelpPointerCreateMutation,
	type HelpPointerCreateMutationResponse,
	type HelpPointerCreateMutationVariables,
} from './mutations/help-pointer-create-mutation.graphql';
import {
	HelpPointerDeleteMutation,
	type HelpPointerDeleteMutationResponse,
	type HelpPointerDeleteMutationVariables,
} from './mutations/help-pointer-delete-mutation.graphql';
import {
	HelpPointerUpdateMutation,
	type HelpPointerUpdateMutationResponse,
	type HelpPointerUpdateMutationVariables,
} from './mutations/help-pointer-update-mutation.graphql';
import {
	KudosDeleteMutation,
	type KudosDeleteMutationResponse,
	type KudosDeleteMutationVariables,
} from './mutations/kudos-delete-mutation.graphql';
import {
	RemoveTeamWatcherMutation,
	type RemoveTeamWatcherMutationResponse,
	type RemoveTeamWatcherMutationVariables,
} from './mutations/remove-team-watcher.graphql';
import {
	TagListQuery,
	type TagListQueryResponse,
	type TagListQueryVariables,
} from './queries/tag-list-query.graphql';
import { getTeamCentralGraphqlUrl, getUnshardedTeamCentralGraphqlUrl } from './utils';

export class TeamCentralClient extends BaseGraphQlClient {
	constructor(baseUrl: string, config: ClientConfig) {
		super(getUnshardedTeamCentralGraphqlUrl(baseUrl), config);
	}

	// Team central url is a bit special, that it depends on cloudId.
	setBaseUrl(baseUrl: string) {
		const cloudId = this.getCloudId();
		this.setServiceUrl(
			cloudId && cloudId !== 'None'
				? getTeamCentralGraphqlUrl(baseUrl, cloudId)
				: getUnshardedTeamCentralGraphqlUrl(baseUrl),
		);
	}

	async addTeamWatcher(teamId: string, cloudId?: string): Promise<AddTeamWatcherMutationResponse> {
		const response = await this.makeGraphQLRequest<
			'addTeamWatcher',
			AddTeamWatcherMutationResponse,
			AddTeamWatcherMutationVariables
		>(
			{
				query: AddTeamWatcherMutation,
				variables: {
					teamId,
					cloudId,
				},
			},
			{
				operationName: 'addTeamWatcher',
			},
		);

		return response.addTeamWatcher;
	}

	async removeTeamWatcher(
		teamId: string,
		cloudId?: string,
	): Promise<RemoveTeamWatcherMutationResponse> {
		const response = await this.makeGraphQLRequest<
			'removeTeamWatcher',
			RemoveTeamWatcherMutationResponse,
			RemoveTeamWatcherMutationVariables
		>(
			{
				query: RemoveTeamWatcherMutation,
				variables: {
					teamId,
					cloudId,
				},
			},
			{
				operationName: 'removeTeamWatcher',
			},
		);

		return response.removeTeamWatcher;
	}

	async deleteKudos(id: string): Promise<KudosDeleteMutationResponse> {
		const response = await this.makeGraphQLRequest<
			'deleteKudos',
			KudosDeleteMutationResponse,
			KudosDeleteMutationVariables
		>(
			{
				query: KudosDeleteMutation,
				variables: {
					id,
				},
			},
			{
				operationName: 'DeleteKudos',
			},
		);

		return response.deleteKudos;
	}

	async queryTagList(variables: TagListQueryVariables): Promise<TagListQueryResponse> {
		const response = await this.makeGraphQLRequest<
			'tagSearchByCloudId',
			TagListQueryResponse,
			TagListQueryVariables
		>(
			{
				query: TagListQuery,
				variables,
			},
			{
				operationName: 'TagListByCloudId',
			},
		);

		return response.tagSearchByCloudId;
	}

	async createTag(variables: CreateTagMutationVariables): Promise<CreateTagMutationResponse> {
		const response = await this.makeGraphQLRequest<
			'createTagForCloudId',
			CreateTagMutationResponse,
			CreateTagMutationVariables
		>(
			{
				query: CreateTagMutation,
				variables,
			},
			{
				operationName: 'createTagForCloudId',
			},
		);

		return response.createTagForCloudId;
	}

	async createHelpPointer(
		variables: HelpPointerCreateMutationVariables,
	): Promise<HelpPointerCreateMutationResponse> {
		const response = await this.makeGraphQLRequest<
			'createHelpPointer',
			HelpPointerCreateMutationResponse,
			HelpPointerCreateMutationVariables
		>(
			{
				query: HelpPointerCreateMutation,
				variables,
			},
			{
				operationName: 'CreateHelpPointer',
			},
		);

		return response.createHelpPointer;
	}

	async updateHelpPointer(
		variables: HelpPointerUpdateMutationVariables,
	): Promise<HelpPointerUpdateMutationResponse> {
		const response = await this.makeGraphQLRequest<
			'updateHelpPointer',
			HelpPointerUpdateMutationResponse,
			HelpPointerUpdateMutationVariables
		>(
			{
				query: HelpPointerUpdateMutation,
				variables,
			},
			{
				operationName: 'UpdateHelpPointer',
			},
		);

		return response.updateHelpPointer;
	}

	async deleteHelpPointer(
		variables: HelpPointerDeleteMutationVariables,
	): Promise<HelpPointerDeleteMutationResponse> {
		const response = await this.makeGraphQLRequest<
			'deleteHelpPointer',
			HelpPointerDeleteMutationResponse,
			HelpPointerDeleteMutationVariables
		>(
			{
				query: HelpPointerDeleteMutation,
				variables,
			},
			{
				operationName: 'DeleteHelpPointer',
			},
		);

		return response.deleteHelpPointer;
	}
}

export default new TeamCentralClient(DEFAULT_CONFIG.stargateRoot, {
	logException,
});
