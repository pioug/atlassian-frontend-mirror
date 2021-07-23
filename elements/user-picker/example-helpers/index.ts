import faker from 'faker';
import { userPickerData } from '@atlaskit/util-data-test/user-picker-data';
import { OptionData } from '../src/types';

export const isTesting = () => typeof jest !== 'undefined';

// userPickerData avatarUrls API has shut down. Replacing with faker until AK finds a platform solution
const userPickerDataWithAvatar = userPickerData.map((userOption: any) => ({
  ...userOption,
  avatarUrl: faker.random.image(),
}));

// Exclude avatarUrl to workaround SSR issue with Avatar at this point in time
const ssrExampleOptions = userPickerData.map((u: any) => ({
  ...u,
  avatarUrl: undefined,
})) as OptionData[];

export const exampleOptions = isTesting()
  ? ssrExampleOptions
  : (userPickerDataWithAvatar as OptionData[]);

export const unassigned = { id: 'unassign', name: 'Unassigned' };
export const assignToMe = { id: 'assign-me', name: 'Assign to me' };

export const filterUsers = (searchText: string): OptionData[] =>
  exampleOptions.filter(
    (user) => user.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1,
  );
