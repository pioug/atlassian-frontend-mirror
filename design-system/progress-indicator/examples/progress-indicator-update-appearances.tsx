import React, { ReactNode, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import Box from '@atlaskit/ds-explorations/box';
import Inline from '@atlaskit/primitives/inline';

import { ProgressIndicator } from '../src';
import { DotsAppearance } from '../src/components/types';

const SpreadInlineLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Inline space="space.100" spread="space-between" alignBlock="center">
      {children}
    </Inline>
  );
};

interface ExampleProps {
  selectedIndex: number;
  values: DotsAppearance[];
}

const Example = ({
  values = ['default', 'inverted', 'primary', 'help'],
}: ExampleProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handlePrev = () => {
    setSelectedIndex((prevState) => prevState - 1);
  };

  const handleNext = () => {
    setSelectedIndex((prevState) => prevState + 1);
  };

  return (
    <Box paddingInline="space.200" paddingBlock="space.200" display="block">
      <SpreadInlineLayout>
        <Button isDisabled={selectedIndex === 0} onClick={handlePrev}>
          Prev
        </Button>
        <ProgressIndicator
          selectedIndex={selectedIndex}
          values={values}
          appearance={values[selectedIndex]}
        />
        <Button
          isDisabled={selectedIndex === values.length - 1}
          onClick={handleNext}
        >
          Next
        </Button>
      </SpreadInlineLayout>
    </Box>
  );
};

export default Example;
