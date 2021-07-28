import React from 'react';

import VisuallyHidden from '../src';

export default () => {
  return (
    <div data-testid="visually-hidden" style={{ border: '1px solid black' }}>
      There is text hidden between the brackets [
      <VisuallyHidden>Can't see me!</VisuallyHidden>]
    </div>
  );
};
