import { userPickerData } from '@atlaskit/util-data-test/user-picker-data';

// Exclude avatarUrl to workaround SSR issue with Avatar at this point in time
const map =
  typeof jest !== 'undefined'
    ? (u: any) => ({ ...u, avatarUrl: undefined })
    : (id: any) => id;

export const options = userPickerData.map(map);
