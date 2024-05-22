import React, { useState } from 'react';
import { IntlProvider } from 'react-intl-next';
import Button from '@atlaskit/button';
import { token } from '@atlaskit/tokens';
import RelatedLinksModal from "../src/view/RelatedLinksModal/components/RelatedLinksBaseModal";

export default () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <div style={{ padding: token('space.250', '20px') }}>
      <IntlProvider locale={'en'}>
        <Button
          testId="related-links-modal-show"
          appearance="primary"
          onClick={() => setShowModal(true)}
        >
          Open
        </Button>
        <RelatedLinksModal
          onClose={() => {
            setShowModal(false);
          }}
          showModal={showModal}
          children={undefined}
        />
      </IntlProvider>
    </div>
  );
};
