/* eslint-disable @repo/internal/react/require-jsdoc */
import {
	createAndFireEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
} from '@atlaskit/analytics-next';

import type createSelect from './create-select';
import { SelectWithoutAnalytics } from './select-without-analytics';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

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

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export default Select;
