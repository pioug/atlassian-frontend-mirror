import { print } from 'graphql';
import gql from 'graphql-tag';

export const CreateTagMutation = print(gql`
	mutation createTagForCloudId($name: String!, $cloudId: String!) {
		createTagForCloudId(input: { name: $name, cloudId: $cloudId }) {
			tag {
				id
				uuid
				name
			}
		}
	}
`);

export type CreateTagMutationVariables = {
	name: string;
	cloudId: string;
};

export type CreateTagMutationResponse = {
	tag: {
		id: string;
		uuid: string;
		name: string;
	};
};
