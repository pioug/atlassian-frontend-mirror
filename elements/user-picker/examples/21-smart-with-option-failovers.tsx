import React, { FunctionComponent } from 'react';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import SmartUserPicker from '../src/components/smart-user-picker/components';
import { setSmartUserPickerEnv } from '../src/components/smart-user-picker/config';
import onConfluenceError, {
  UserAndGroupSearchQueryGroup,
  UserAndGroupSearchQueryUser,
} from '../src/components/smart-user-picker/helpers/ConfluenceSearchClient';
import { createMockClient } from 'mock-apollo-client';
import { UserAndGroupSearchQuery } from '../src/components/smart-user-picker/helpers/UserAndGroupSearchQuery.graphql';

const mockUsers: UserAndGroupSearchQueryUser[] = [
  {
    accountId: 'aaid-oli',
    displayName: 'Oliver Oldfield-Hodge',
    profilePicture: {
      path:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADi0lEQVR42h2S20/TdxiH+x9w65iL826LmyClLZSCtLT0BL+2QM9QKlYqVA5dOVYOBVIRmFJADgodIozRAU7mcIaZQUCDWzQmuxlsLsE5s5j9Ec9+evPefPM+3+fzyStx+qpx136Bxekj1BSmPz5IvkZPudPLxUthSiq8GCx2Sux+/IE6bOU2GpojuM41IJQ5kAzGLxNq6aa7txPfhXpao12k7iS4WBfEXR1Eb3EwN3ONoeFBDIITk7kEV2UAZ1UdhUUGJNtby4QiUf74/TGzs+OYbC4q7BVozTY850Ii5Dz7W4t8s3iTUrsPtU6PwerF4qpBoytB0tneRLijh3trSZ7vbyDY3UgV+WRKc8nKVpGXr2EzNcXu1irWChc6gwlzhR+b9wKFWiMSq60MT02I5aVpnu5+h8NbTW5uHidPnOTYsQ/5IP04xz/6mMRQlLWlCVFbh87kxOYJiF2JEZwuF4I7QLnbR1dvN9Xng6zdTLIyNk40WPsekp5+Amm2HMFqI7+wCI2+TIzqJb9INOiKhmlsu4zGYKW3P4ZQ7mR+6ApTPV0kuyMoPv+UtLQ05LIsEle7UZ1Voym2YLZ6MJoFJKuiVrCpVSytDLO9ikKRPtrWgteoZ6K1nhsdDUQEHQatAYdYrkyhpEBtxlRaTkmpBUlllZcyXxCN0Ybg9KPSCEy1tDPc0MDtnjBLsWb6aqop0ArkKFVkZsnJK9Ci1RuR5RQgUevNNLd3Y7LaKXX4kRfoCTk9NNstTEQCrMQjxBprkauKkcoUnM6UolAWUFRsJEuWhyRDHGZHDUqNEbWpHKlSS5VYaLTGQ9hl5pZosTLaT6HOQsYZGZ+cykCRq0KwWJDnnkXy2ZkcSt216MXjaOybJDp+l6GFPYZj/UT8TuKNAe4mZ5jb+JWOkSWslfXkqNSoi7TI3gFOiYDa1jjLu2+YeHDEleXnTG6+omfyPmMjU0xenybx9TaL4vvso9fMb79laecVVoeHLLkY4bRUybXlPWK3f2Ew9Ruj9/5iYOEpHTc26Zr5iZHUM25tvWR+51+SP79l7PuXTN0/YGB6nWyFaCC4g1xffUbbxAM6px+Jy/sMrx+ysP2asY1D7mwfkXryhpmtf94DEht/Ep99yOyPBxhsVUh6xr+lb36HS/1J6mJJvlw/YEgEvPtp7cnfzD085PHBf6T2jkisvqC5b4aBmR8YX39B69Wv+B9uvEx3HiYAJgAAAABJRU5ErkJggg==',
    },
    type: 'user',
  },
  {
    accountId: 'aaid-addo',
    displayName: 'Addo Wondo',
    profilePicture: {
      path:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADJklEQVR42iWTSXMbVRSF9ReIJUutuVtuDd1ST1KrNVuDJVuSJSVykG2CrVRwiKmKF4FyKFgQqqBMdlnAhqIge1bwCz+uzeJWvX5933nn3HNeKKMrVN0C6l4CvZigXEmTL6bIGXH0soJWipE3E5TsJNmCQrvrUg10zFqSfCVOKJGJkCvGsb0M3Z5KM1Dxahmy+Rh6KYHrJzGdJBVPqh6n5KVxggx2LcGeESOkJMPoRgrDTUujQslSKNqKHNjDdiqUDJWiGadYieI2ExgCVLRSZPRdOq0SoVQuSloTqsLCqSmYVoxCSUXNqqQUhbQSYzf8CMuN4jWi1DsahpOi7KVEVkIA9qRJE2pmBlc2K14UPZ9mGlh8/PYlf7+74ebxkKyqkNJ2RNYufpAUELmwkRIALfH/YRmkbeceqOk5lQ9frfn3l1v++fmWP99eMW75AhAhnnmELnLUYkQYRAmZtipoKoNhDcfJU5CJG3mN7fGY5/MDtkcDtosJ/aCG7YtDRgRbpJhBjEwhTKg3MJgvAwFwGB3VmM48tvM2P12d8ePzp/z19poftk+5OV3Q62bwu0kpGXpVIW+LC5MDk+WJz3rZoNcpCoDDi5M2v77+jA/XG96dL/j9zed8d7nA9O6HKJI9ca4SoVD5hFCjqXH5bMhy6jEeuQQNjWGvwN3LJXeXa/745jXvr9Y8mzceXHKbYrW/I5nYpVKNEJod2pzKjb1unqCuU6+pApJmM/b47c05H7+/5u7VmsG+Tqev4bckE05Y8hDGDRRC80mV40mZZl3ldOWKDJNBL8/FLGDWMDhulvl06NNsqfht8d4S6k5EYrwjcxAGX1zssxjb9FtZTp6YdEc2ty+ecCc2Xhw1mAnAdt7hXFyxfItyVRwQKblyFM0UF1bTOodjg147R6PTFlpDRoMx72/O+PpszGbkc70eMRkcUG1N8FoDmkObxkijVBMXNquAUd+XnwfySIbY9T5WrUerNeTLszWvTlfMx4dY1X0BH+HUB9IngI97LDcuocNRII+oLWFqSbKaGFLm/doKKJR9iuX6w9p025Tvy+vId1McaDNdWfwH94Cln0rh+KYAAAAASUVORK5CYII=',
    },
    type: 'user',
  },
];
const mockGroups: UserAndGroupSearchQueryGroup[] = [
  {
    id: 'aaid-group-oli',
    name: "Oli's Special Group",
  },
  {
    id: 'aaid-addo',
    name: "Addo's Group",
  },
];

const Example: FunctionComponent = () => {
  let mockClient = createMockClient();
  mockClient.setRequestHandler(
    UserAndGroupSearchQuery,
    async ({ query }: { query: string }) => {
      await new Promise(res => setTimeout(res, 1000));
      return {
        data: {
          userGroupSearch: {
            users: mockUsers.filter(
              user =>
                user.displayName &&
                user.displayName.toLowerCase().indexOf(query) === -1,
            ),
            groups: mockGroups.filter(
              group =>
                group.name && group.name.toLowerCase().indexOf(query) === -1,
            ),
          },
        },
      };
    },
  );

  return (
    <div>
      <ExampleWrapper>
        {({ options, onInputChange }) => (
          <SmartUserPicker
            fieldId="example"
            productKey="confluence"
            siteId={'invalidsiteid'}
            onChange={console.log}
            onInputChange={onInputChange}
            isMulti
            includeGroups={true}
            onError={(error, request) =>
              onConfluenceError(error, request, mockClient)
            }
          />
        )}
      </ExampleWrapper>
    </div>
  );
};

setSmartUserPickerEnv('local');

export default Example;