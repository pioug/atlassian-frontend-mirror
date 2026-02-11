import React, { useMemo } from 'react';

import { RadioOption } from './components/input-options';
import Select from './select';
import { type OptionType, type SelectProps } from './types';

const RadioSelect: React.MemoExoticComponent<({ components, ...props }: SelectProps<OptionType>) => React.JSX.Element> = React.memo(
	({ components, ...props }: SelectProps<OptionType>): React.JSX.Element => {
		const mergedComponents = useMemo(
			() => ({
				...components,
				Option: RadioOption,
			}),
			[components],
		);

		return <Select {...props} isMulti={false} components={mergedComponents} />;
	},
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default RadioSelect;
