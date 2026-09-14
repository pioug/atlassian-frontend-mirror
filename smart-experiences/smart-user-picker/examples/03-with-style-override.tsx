import React from 'react';

import { IntlProvider } from 'react-intl';

import type { StylesConfig } from '@atlaskit/select/types';

import '../example-helpers/mock-ufo';
import { useEndpointMocks } from '../example-helpers/use-endpoint-mocks';
import SmartUserPicker from '../src/components';

const Example = (): React.JSX.Element => {
	useEndpointMocks();

	const styles: StylesConfig = {
		control: (style) => ({
			...style,
			backgroundColor: '#7B8597',
			borderRadius: 8,
		}),
		input: (style) => ({
			...style,
			color: '#FAFBFC',
		}),
	};

	return (
		<IntlProvider locale="en">
			<SmartUserPicker
				fieldId="example"
				productKey="jira"
				siteId="fake-tenant-id"
				onChange={console.log.bind(console)}
				isMulti
				defaultValue={[
					{
						id: '655363:23cdc6cc-d81e-492d-8fe1-ec56fb8094a4',
						type: 'user',
					},
				]}
				styles={styles}
			/>
		</IntlProvider>
	);
};
export default Example;
