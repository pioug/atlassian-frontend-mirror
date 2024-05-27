import React, {
  useState,
  useMemo,
  useCallback,
  type PropsWithChildren,
} from 'react';
import { IntlProvider } from 'react-intl-next';
import { createMockClient } from 'mock-apollo-client';
import { type OptionData } from '@atlaskit/user-picker';

import SmartUserPicker, { type RecommendationRequest } from '../src';
import { users } from '../example-helpers/users';
import { groups } from '../example-helpers/groups';
import { UserAndGroupSearchQuery } from '../example-helpers/user-and-group-query';
import { getRecommendations } from '../example-helpers/get-recommendations';
import { useEndpointMocks } from '../example-helpers/mock-endpoints';
import '../example-helpers/mock-ufo';

const ExampleCheckbox = ({
  isChecked,
  setIsChecked,
  children,
}: PropsWithChildren<{
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
}>) => (
  <p>
    <label>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.currentTarget.checked)}
      />{' '}
      {children}
    </label>
  </p>
);

const Example = () => {
  const [ursRequestsSucceed, setUrsRequestsSucceed] = useState(false);
  const [fallbackRequestsSucceed, setFallbackRequestsSucceed] = useState(true);
  useEndpointMocks({ failRecommendations: !ursRequestsSucceed });

  const mockClient = useMemo(() => {
    const client = createMockClient();
    client.setRequestHandler(
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
    return client;
  }, []);

  const onError = useCallback(
    (error: any, request: RecommendationRequest) => {
      if (!fallbackRequestsSucceed) {
        throw new Error('Fallback request failed');
      }
      return getRecommendations<RecommendationRequest, OptionData>(
        error,
        request,
        mockClient,
      );
    },
    [mockClient, fallbackRequestsSucceed],
  );

  return (
    <IntlProvider locale="en">
      <p>
        This example shows how the Smart User Picker <code>onError</code> prop
        can be used to provide a fallback data source, to be called if the
        primary data source (User Recommendations Service) fails.
      </p>

      <ExampleCheckbox
        isChecked={ursRequestsSucceed}
        setIsChecked={setUrsRequestsSucceed}
      >
        User Recommendations Service requests succeed
      </ExampleCheckbox>

      <ExampleCheckbox
        isChecked={fallbackRequestsSucceed}
        setIsChecked={setFallbackRequestsSucceed}
      >
        Fallback requests succeed
      </ExampleCheckbox>

      <SmartUserPicker
        // key used to re-mount SmartUserPicker when data sources change
        key={`${ursRequestsSucceed}-${fallbackRequestsSucceed}`}
        fieldId="example"
        productKey="confluence"
        siteId="invalid-site-id"
        onChange={console.log.bind(console)}
        isMulti
        includeGroups={true}
        onError={onError}
      />
    </IntlProvider>
  );
};

export default Example;
