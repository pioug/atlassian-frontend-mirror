import React, { ReactNode, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { Box, Inline } from '@atlaskit/primitives';

import { ProgressIndicator } from '../src';

const SpreadInlineLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Inline space="space.100" spread="space-between" alignBlock="center">
      {children}
    </Inline>
  );
};

interface ExampleProps {
  selectedIndex: number;
  values: string[];
}

const Example = ({ values = ['one', 'two', 'three'] }: ExampleProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelect = ({
    index: selectedIndex,
  }: {
    event: React.MouseEvent<HTMLButtonElement>;
    index: number;
  }): void => {
    setSelectedIndex(selectedIndex);
  };

  const handlePrev = () => {
    setSelectedIndex((prevState) => prevState - 1);
  };

  const handleNext = () => {
    setSelectedIndex((prevState) => prevState + 1);
  };

  return (
    <Box paddingInline="space.200" paddingBlock="space.200">
      <SpreadInlineLayout>
        <Button isDisabled={selectedIndex === 0} onClick={handlePrev}>
          Prev
        </Button>
        <ProgressIndicator
          onSelect={handleSelect}
          selectedIndex={selectedIndex}
          values={values}
          size="default"
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
