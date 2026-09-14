// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling

import { type OptionData } from '../src/types';
import { exampleOptions } from './index';

export const filterUsers = (searchText: string): OptionData[] =>
	exampleOptions.filter((user) => user.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
