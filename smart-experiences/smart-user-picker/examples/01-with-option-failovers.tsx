import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { createMockClient } from 'mock-apollo-client';

import SmartUserPicker from '../src';
import { users } from '../example-helpers/users';
import { groups } from '../example-helpers/groups';
import { UserAndGroupSearchQuery } from '../example-helpers/user-and-group-query';
import { getRecommendations } from '../example-helpers/get-recommendations';
import { useEndpointMocks } from '../example-helpers/mock-endpoints';
import '../example-helpers/mock-ufo';

const Example: React.FC = () => {
  useEndpointMocks({ failRecommendations: true });

  let mockClient = createMockClient();
  mockClient.setRequestHandler(
    UserAndGroupSearchQuery,
    async ({ query }: { query: string }) => {
      await new Promise((res) => setTimeout(res, 1000));
      return {
        data: {
          userGroupSearch: {
            users: users.filter(
              (user) =>
                user.displayName &&
                !user.displayName.toLowerCase().includes(query),
            ),
            groups: groups.filter(
              (group) =>
                group.name && !group.name.toLowerCase().includes(query),
            ),
          },
        },
      };
    },
  );

  return (
    <IntlProvider locale="en">
      <SmartUserPicker
        fieldId="example"
        productKey="confluence"
        siteId="invalid-site-id"
        onChange={console.log.bind(console)}
        isMulti
        includeGroups={true}
        onError={(error, request) =>
          getRecommendations(error, request, mockClient)
        }
      />
    </IntlProvider>
  );
};

export default Example;
