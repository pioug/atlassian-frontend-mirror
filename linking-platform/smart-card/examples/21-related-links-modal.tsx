import React, { useState } from 'react';
import { IntlProvider } from 'react-intl-next';
import Button from '@atlaskit/button';
import { token } from '@atlaskit/tokens';
import { Client, Provider } from '../src';
import RelatedLinksBaseModal from '../src/view/RelatedLinksModal/components/RelatedLinksBaseModal';
import RelatedLinksResolvedView from '../src/view/RelatedLinksModal/views/resolved';

export default () => {
  const [showModal, setShowModal] = useState(true);

  const incomingLinks: string[] = [
    'https://www.youtube.com/watch?v=jmvngQzy_3M',
    'https://pug.jira-dev.com/wiki/spaces/~986526081/pages/452399595559/This+is+an+example+of+a+page+with+an+emoji',
    'https://pug.jira-dev.com/wiki/spaces/~986526081/pages/452399595559/This+is+an+example+of+a+page+with+an+emoji',
    'https://www.youtube.com/watch?v=uhHyh55n5l0',
    'https://pug.jira-dev.com/wiki/spaces/~986526081',
  ];
  const outgoingLinks: string[] = [];

  return (
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
    <div style={{ padding: token('space.250', '20px') }}>
      <IntlProvider locale={'en'}>
        <Provider client={new Client('stg')}>
          <Button
            testId="related-links-modal-show"
            appearance="primary"
            onClick={() => setShowModal(true)}
          >
            Open
          </Button>
          <RelatedLinksBaseModal
            onClose={() => {
              setShowModal(false);
            }}
            showModal={showModal}
          >
            <RelatedLinksResolvedView
              incomingLinks={incomingLinks}
              outgoingLinks={outgoingLinks}
            />
          </RelatedLinksBaseModal>
        </Provider>
      </IntlProvider>
    </div>
  );
};
