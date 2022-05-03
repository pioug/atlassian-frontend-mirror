/** @jsx jsx */
import { IntlProvider } from 'react-intl-next';
import { jsx } from '@emotion/core';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';

import { VRTestWrapper } from './utils/vr-test';
import {
  ActionItem,
  ActionName,
  Card,
  Client,
  Provider,
  SmartLinkPosition,
  TitleBlock,
} from '../src';
import { getCardState, getJsonLdResponse } from './utils/flexible-ui';
import { AsanaTask } from './../examples-helpers/_jsonLDExamples';
import FlexibleCard from '../src/view/FlexibleCard';

class CustomClient extends Client {
  fetchData(url: string) {
    const response = getJsonLdResponse(url, undefined, AsanaTask);
    return Promise.resolve(response);
  }
}

const actions: ActionItem[] = [
  {
    content: 'Open',
    hideContent: true,
    name: ActionName.CustomAction,
    icon: <ShortcutIcon label="open in new tab" />,
    iconPosition: 'before',
    onClick: () => console.log('Custom action!'),
    testId: 'action-item-custom',
  },
  {
    hideContent: true,
    name: ActionName.EditAction,
    onClick: () => console.log('Edit action!'),
  },
  {
    hideContent: true,
    name: ActionName.DeleteAction,
    onClick: () => console.log('Delete action!'),
  },
];

const renderForbiddenView = () => {
  const cardState = getCardState(
    undefined,
    {
      visibility: 'restricted',
      access: 'forbidden',
      auth: [
        {
          key: 'some-flow',
          displayName: 'Flow',
          url: 'https://outbound-auth/flow',
        },
      ],
    },
    'forbidden',
  );
  return (
    <FlexibleCard
      cardState={cardState}
      url={`https://${status}-url?s=something%20went%20wrong`}
      onAuthorize={() => {}}
    >
      <TitleBlock
        actions={actions}
        position={SmartLinkPosition.Center}
        testId="keyboard-2"
      />
    </FlexibleCard>
  );
};

export default () => (
  <VRTestWrapper title="Flexible UI: Accessibility">
    <IntlProvider locale="en">
      <Provider client={new CustomClient('staging')}>
        <h5>Keyboard navigation</h5>
        <Card
          appearance="inline"
          ui={{ clickableContainer: true }}
          url="https://link-url"
        >
          <TitleBlock
            actions={actions}
            position={SmartLinkPosition.Center}
            showActionOnHover={true}
            testId="keyboard-1"
          />
        </Card>
        <br />
        {renderForbiddenView()}
      </Provider>
    </IntlProvider>
  </VRTestWrapper>
);
