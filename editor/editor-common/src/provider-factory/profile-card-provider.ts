import { type ProfileCardAction, type ProfileClient } from '@atlaskit/profilecard';

export interface ProfilecardProvider {
	cloudId: string;
	getActions: (id: string, text: string, accessLevel?: string) => ProfileCardAction[];
	resourceClient: ProfileClient;
}
