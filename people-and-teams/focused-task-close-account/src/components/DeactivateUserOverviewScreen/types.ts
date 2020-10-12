import { User } from '../../types';

export interface DeactivateUserOverviewScreenProps {
  accessibleSites: string[];
  isCurrentUser: boolean;
  user: User;
}
