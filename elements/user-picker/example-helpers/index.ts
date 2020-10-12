import { userPickerData } from '@atlaskit/util-data-test';
import { OptionData } from '../src/types';

export const isTesting = () => typeof jest !== 'undefined';

// Exclude avatarUrl to workaround SSR issue with Avatar at this point in time
const ssrExampleOptions = userPickerData.map((u: any) => ({
  ...u,
  avatarUrl: undefined,
})) as OptionData[];

export const exampleOptions = isTesting()
  ? ssrExampleOptions
  : (userPickerData as OptionData[]);

export const unassigned = { id: 'unassign', name: 'Unassigned' };
export const assignToMe = { id: 'assign-me', name: 'Assign to me' };

export const filterUsers = (searchText: string): OptionData[] =>
  exampleOptions.filter(
    user => user.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1,
  );
