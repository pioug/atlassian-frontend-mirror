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

export const SelectWithoutAnalytics = createSelect(AsyncSelect);
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
