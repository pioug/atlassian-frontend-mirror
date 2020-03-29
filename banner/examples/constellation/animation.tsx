import React, { useState } from 'react';
import Button from '@atlaskit/button';
import Banner from '../../src';
import { gridSize } from '../../../theme/src/constants';

type Props = {
  isOpenAtMount: boolean;
};

function CanToggle({ isOpenAtMount }: Props) {
  const [isOpen, setIsOpen] = useState(isOpenAtMount);
  return (
    <div style={{ marginBottom: gridSize() * 2 }}>
      <Button appearance="primary" onClick={() => setIsOpen(value => !value)}>
        Click to {isOpen ? 'close' : 'open'} ↓
      </Button>
      <Banner isOpen={isOpen} appearance="announcement">
        {isOpenAtMount ? 'Started open' : 'Started closed'}
      </Banner>
    </div>
  );
}

export default function AnimationDemo() {
  return (
    <React.Fragment>
      <CanToggle isOpenAtMount />
      <CanToggle isOpenAtMount={false} />
    </React.Fragment>
  );
}
