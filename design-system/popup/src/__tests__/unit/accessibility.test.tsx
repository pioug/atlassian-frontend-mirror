import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';
import Button from '@atlaskit/button';

import Popup from '../../index';

it('Popup should not fail an aXe audit', async () => {
  const { container } = render(
    <Popup
      isOpen={true}
      content={() => <div>Content</div>}
      trigger={(triggerProps) => (
        <Button {...triggerProps} appearance="primary">
          Close
        </Button>
      )}
    />,
  );
  await axe(container);
});
