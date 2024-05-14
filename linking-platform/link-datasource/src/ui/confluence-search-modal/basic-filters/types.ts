import { SelectOption } from '../../common/modal/popup-select/types';

export interface UserInfo {
  accountId: string;
  id: string;
  name: string;
  picture: string;
}

export interface UserInfoAGGResponse {
  data?: {
    me: {
      user: UserInfo;
    };
  };
  errors?: Array<object>;
}

export interface UserHydrationAGGResponse {
  data?: {
    users: UserInfo[];
  };
  errors?: Array<object>;
}

export enum CLOLBasicFilters {
  editedOrCreatedBy = 'editedOrCreatedBy',
  lastModified = 'lastModified',
}

export type SelectedOptionsMap = {
  [key in CLOLBasicFilters]?: SelectOption[];
};
