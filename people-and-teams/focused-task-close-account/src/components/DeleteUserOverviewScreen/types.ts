import { User } from '../../types';

export interface DeleteUserOverviewScreenProps {
  accessibleSites: string[];
  isCurrentUser: boolean;
  user: User;
  deactivateUserHandler?: () => void;
  isUserDeactivated: boolean;
}
