import React from 'react';
import Button from '@atlaskit/button/standard-button';

import accessibleSites from '../src/mocks/accessibleSites';
import { catherineHirons } from '../src/mocks/users';

import { IntlProvider } from 'react-intl';

import {
  FocusedTaskCloseAccount,
  DeleteUserOverviewScreen,
  DeleteUserContentPreviewScreen,
} from '../src';

const submitButton = (
  <Button appearance="primary" onClick={() => null}>
    Delete account
  </Button>
);

const preferenceSelection = () => {
  // do nothing
};

export default function Example() {
  return (
    <React.Fragment>
      <h1>See code</h1>
      <IntlProvider locale="en">
        <FocusedTaskCloseAccount
          onClose={() => {}}
          isOpen={false}
          screens={[
            <DeleteUserOverviewScreen
              accessibleSites={accessibleSites}
              isCurrentUser
              user={catherineHirons}
            />,
            <DeleteUserContentPreviewScreen
              user={catherineHirons}
              isCurrentUser
              preferenceSelection={preferenceSelection}
            />,
          ]}
          submitButton={submitButton}
          learnMoreLink={''}
        />
      </IntlProvider>
    </React.Fragment>
  );
}
