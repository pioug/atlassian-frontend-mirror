import React, { useState, useMemo } from 'react';

import { IntlProvider } from 'react-intl';

import Select from '@atlaskit/select/default';
import type { DefaultValue, OptionIdentifier } from '@atlaskit/user-picker/types';

import { groups } from '../example-helpers/groups';
import '../example-helpers/mock-ufo';
import { teams } from '../example-helpers/teams';
import { useEndpointMocks } from '../example-helpers/use-endpoint-mocks';
import { users } from '../example-helpers/users';
import SmartUserPicker from '../src/components';

type ProductOption = {
	label: string;
	value: string;
};

const products: ProductOption[] = [
	{ label: 'Jira', value: 'jira' },
	{ label: 'Confluence', value: 'confluence' },
	{ label: 'People', value: 'people' },
	{ label: 'Bitbucket', value: 'bitbucket' },
];

const defaultValues: DefaultValue = [
	...users.map((user) => ({ id: user.accountId, type: 'user' })),
	...groups.map((group) => ({ id: group.id, type: 'group' })),
	...teams.map((team) => ({ id: team.id, type: 'team' })),
] as DefaultValue;

const productsMap = products
	.map((p) => ({ [p.value]: p }))
	.reduce((acc, val) => ({ ...acc, ...val }), {});

const Example = (): React.JSX.Element | null => {
	const { ready } = useEndpointMocks();
	const [product, setProduct] = useState<string>('people');
	const memoziedDefaultValues = useMemo(() => defaultValues, []);

	// Wait for fetch mocks to have loaded so that user/team resolvers get the correct response
	return ready ? (
		<div>
			<Select
				width="medium"
				onChange={(selectedValue) => {
					if (selectedValue) {
						setProduct(selectedValue.value);
					}
				}}
				value={productsMap[product]}
				options={products}
				placeholder="Choose a Product"
			/>
			<IntlProvider locale="en">
				<SmartUserPicker
					key={product} // force rerender on product change
					fieldId="example"
					productKey={product}
					siteId="fake-tenant-id"
					onChange={console.log}
					isMulti
					defaultValue={memoziedDefaultValues}
				/>
				<SmartUserPicker
					fieldId="example"
					productKey={product}
					siteId="fake-tenant-id"
					onChange={console.log}
					defaultValue={(memoziedDefaultValues as OptionIdentifier[])[0]}
				/>
			</IntlProvider>
		</div>
	) : null;
};

export default Example;
