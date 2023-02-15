import React from 'react';

import Portal from '../../src';

const PortalDefaultExample = () => {
  return (
    <h1>
      <Portal>
        <b>I am a child of h1 element in the code but in the DOM I am not.</b>
      </Portal>
      Heading text
    </h1>
  );
};

export default PortalDefaultExample;
