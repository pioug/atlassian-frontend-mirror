import AsyncReactSelect from '@atlaskit/react-select/async';

import createSelect from './create-select';

const AsyncSelect: <
	Option extends unknown = import('./types').OptionType,
	IsMulti extends boolean = false,
>(
	props: (
		| import('./types').SelectProps<Option, IsMulti>
		| import('./types').AsyncSelectProps<Option, IsMulti>
		| import('./types').CreatableSelectProps<Option, IsMulti>
	) & {
		ref?: import('react').Ref<import('./types').AtlaskitSelectRefType>;
	},
) => JSX.Element = createSelect(AsyncReactSelect);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default AsyncSelect;
