import React from 'react';
import { md, code, Example, AtlassianInternalWarning } from '@atlaskit/docs';

export default md`
  ${(<AtlassianInternalWarning />)}

  \`notification-log-client\` is a fetch client implementation for making API calls to notification-log service.

  This is intended to be used as a provider into other components, such as NotificationIndicator.

  ## Usage

  ${code`import { NotificationLogClient } from '@atlaskit/notification-log-client';

  const notificationLogClient = new NotificationLogClient(
    'http://base-url-to-notification-log-service',
    'cloudid-abcd-1234-5678',
  );

  const result = await notificationLogClient.countUnseenNotifications();
  console.log(result.count);`}

  ${(
    <Example
      Component={require('../examples/00-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic')}
    />
  )}
`;
