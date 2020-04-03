import { ProfileCardAction, ProfileClient } from '@atlaskit/profilecard';

export interface ProfilecardProvider {
  cloudId: string;
  resourceClient: ProfileClient;
  getActions: (
    id: string,
    text: string,
    accessLevel?: string,
  ) => ProfileCardAction[];
}
