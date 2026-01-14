import { print } from 'graphql';
import gql from 'graphql-tag';

export const HelpPointerUpdateMutation: string = print(gql`
	mutation UpdateHelpPointer(
		$id: ID!
		$description: String
		$teamId: String
		$newTeamName: String
		$icon: IconInput
		$tagUuids: [UUID]
		$link: String
		$name: String
		$type: HelpPointerType
	) {
		updateHelpPointer(
			input: {
				id: $id
				description: $description
				icon: $icon
				tagUuids: $tagUuids
				link: $link
				teamId: $teamId
				newTeamName: $newTeamName
				name: $name
				type: $type
			}
		) {
			helpPointer {
				id
			}
		}
	}
`);

export type HelpPointerUpdateMutationVariables = {
	id: string;
	description?: string;
	teamId?: string;
	newTeamName?: string;
	icon?: {
		id?: string;
		color: string;
		shortName: string;
	};
	tagUuids?: Array<string | unknown>;
	link?: string;
	name?: string;
	type?: string;
};

export type HelpPointerUpdateMutationResponse = {
	helpPointer: {
		id: string;
	};
};
