import React from 'react';
import {
  Provider,
  Client,
  TitleBlock,
  SmartLinkDirection,
  SmartLinkPosition,
  ActionName,
} from '../../src';
import { CardSSR } from '../../src/ssr';
import { url, cardState } from '../utils/smart-card-ssr-state';
import { CardProviderStoreOpts } from '@atlaskit/link-provider';

const storeOptions: CardProviderStoreOpts = {
  initialState: {
    [url]: cardState,
  },
};

export default () => (
  <Provider storeOptions={storeOptions} client={new Client('stg')}>
    <CardSSR appearance="block" url={url}>
      <TitleBlock
        direction={SmartLinkDirection.Horizontal}
        maxLines={1}
        position={SmartLinkPosition.Center}
        text={'this is a test'}
        anchorTarget={'_blank'}
        hideTitleTooltip
        actions={[
          {
            name: ActionName.DeleteAction,
            onClick: () => {},
            iconPosition: 'before',
            content: 'Delete',
            hideContent: true,
            hideIcon: false,
            testId: 'deleteAction',
          },
        ]}
        showActionOnHover
      />
    </CardSSR>
  </Provider>
);
