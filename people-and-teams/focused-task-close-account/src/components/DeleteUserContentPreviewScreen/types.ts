import { User } from '../../types';

export interface DeleteUserContentPreviewScreenProps {
  isCurrentUser: boolean;
  user: User;
  preferenceSelection: (username: string) => void;
}

export interface DeleteUserContentPreviewScreenState {
  currentActive: number;
}
