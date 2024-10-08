/* eslint-disable @repo/internal/react/require-jsdoc */
import {
	createAndFireEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import ReactSelect from '@atlaskit/react-select';

import createSelect from './createSelect';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export const SelectWithoutAnalytics = createSelect(ReactSelect);
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
