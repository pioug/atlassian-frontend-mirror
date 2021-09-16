/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/core';

import { P100 } from '@atlaskit/theme/colors';

import SectionMessage, { SectionMessageAction } from '../src';

const CustomLinkStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  backgroundColor: `${P100} !important`,
});

const CustomLink = React.forwardRef(
  (props = {}, ref: React.Ref<HTMLButtonElement>) => (
    <button css={CustomLinkStyles} ref={ref} {...props} />
  ),
);

const Example = () => (
  <SectionMessage
    title="The Modern Prometheus"
    actions={[
      <SectionMessageAction
        href="https://en.wikipedia.org/wiki/Mary_Shelley"
        linkComponent={CustomLink}
      >
        Mary
      </SectionMessageAction>,
      <SectionMessageAction
        href="https://en.wikipedia.org/wiki/Villa_Diodati"
        linkComponent={CustomLink}
      >
        Villa Diodatti
      </SectionMessageAction>,
    ]}
  >
    <p>
      The main use for passing a custom link component is to pass in a
      react-router-link component.
    </p>
  </SectionMessage>
);

export default Example;
