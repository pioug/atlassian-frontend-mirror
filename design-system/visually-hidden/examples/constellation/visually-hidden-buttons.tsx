import React from 'react';

import Button, { ButtonGroup } from '@atlaskit/button';

import VisuallyHidden from '../../src';

import ToggleVisuallyHidden from './utils/toggle-visually-hidden';

const VisuallyHiddenButtonsExample = () => {
  return (
    <ToggleVisuallyHidden id="buttons-example">
      {isVisible => (
        <ButtonGroup>
          <Button>
            Read more
            {isVisible ? (
              ' about horses'
            ) : (
              <VisuallyHidden> about horses</VisuallyHidden>
            )}
          </Button>
          <Button>
            Read more
            {isVisible ? (
              ' about dogs'
            ) : (
              <VisuallyHidden> about dogs</VisuallyHidden>
            )}
          </Button>
          <Button>
            Read more
            {isVisible ? (
              ' about cats'
            ) : (
              <VisuallyHidden> about cats</VisuallyHidden>
            )}
          </Button>
        </ButtonGroup>
      )}
    </ToggleVisuallyHidden>
  );
};

export default VisuallyHiddenButtonsExample;
