import React, { useState, useMemo } from 'react';
import { IntlProvider } from 'react-intl-next';
import Select from '@atlaskit/select';
import { type DefaultValue, type OptionIdentifier } from '@atlaskit/user-picker';

import SmartUserPicker from '../src';
import { useEndpointMocks } from '../example-helpers/mock-endpoints';
import '../example-helpers/mock-ufo';
import { users } from '../example-helpers/users';
import { groups } from '../example-helpers/groups';
import { teams } from '../example-helpers/teams';

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

const Example = () => {
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
