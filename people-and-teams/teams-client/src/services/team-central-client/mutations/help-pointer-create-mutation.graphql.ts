import { print } from 'graphql';
import gql from 'graphql-tag';

export const HelpPointerCreateMutation: string = print(gql`
	mutation CreateHelpPointer(
		$cloudId: String!
		$description: String
		$icon: IconInput
		$tagUuids: [UUID]
		$link: String!
		$name: String!
		$teamId: String!
		$type: HelpPointerType!
	) {
		createHelpPointer(
			input: {
				cloudId: $cloudId
				description: $description
				icon: $icon
				tagUuids: $tagUuids
				link: $link
				name: $name
				teamId: $teamId
				type: $type
			}
		) {
			helpPointer {
				id
			}
		}
	}
`);

export type HelpPointerCreateMutationVariables = {
	cloudId: string;
	description?: string;
	icon?: {
		id?: string;
		color: string;
		shortName: string;
	};
	tagUuids?: Array<string | unknown>;
	link?: string;
	name?: string;
	teamId?: string;
	type?: string;
};

export type HelpPointerCreateMutationResponse = {
	helpPointer: {
		id: string;
	};
};
