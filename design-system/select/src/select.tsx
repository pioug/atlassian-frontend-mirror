/* eslint-disable @repo/internal/react/require-jsdoc */
import {
	createAndFireEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import AsyncSelect from '@atlaskit/react-select/async';

import createSelect from './create-select';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export const SelectWithoutAnalytics: <Option extends unknown = import("./types").OptionType, IsMulti extends boolean = false>(props: (import("./types").SelectProps<Option, IsMulti> | import("./types").AsyncSelectProps<Option, IsMulti> | import("./types").CreatableSelectProps<Option, IsMulti>) & {
    ref?: import("react").Ref<import("./types").AtlaskitSelectRefType>;
}) => JSX.Element = createSelect(AsyncSelect);
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

const Select = withAnalyticsContext({
	componentName: 'select',
	packageName,
	packageVersion,
})(
	withAnalyticsEvents({
		onChange: createAndFireEventOnAtlaskit({
			action: 'changed',
			actionSubject: 'option',
			attributes: {
				componentName: 'select',
				packageName,
				packageVersion,
			},
		}),
	})(SelectWithoutAnalytics),
) as unknown as ReturnType<typeof createSelect>;

export default Select;
