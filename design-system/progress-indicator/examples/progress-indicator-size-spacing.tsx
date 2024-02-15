import React, { FC, useState } from 'react';

import Button from '@atlaskit/button/new';
import Text from '@atlaskit/ds-explorations/text';
import { Box, Inline, Stack } from '@atlaskit/primitives';

import { ProgressIndicator } from '../src';

const SpreadInlineLayout = ({ children }: { children: React.ReactNode }) => {
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

type Sizes = 'small' | 'default' | 'large';
type Spacing = 'comfortable' | 'cozy' | 'compact';

const sizes: Sizes[] = ['small', 'default', 'large'];
const spacings: Spacing[] = ['comfortable', 'cozy', 'compact'];

const Example: FC<ExampleProps> = ({ values = ['one', 'two', 'three'] }) => {
  const [selectedIndex, setSelectedIndes] = useState(0);

  const handlePrev = () => {
    setSelectedIndes((prevState) => prevState - 1);
  };

  const handleNext = () => {
    setSelectedIndes((prevState) => prevState + 1);
  };

  return (
    <Box paddingInline="space.200" paddingBlock="space.200">
      <SpreadInlineLayout>
        <Button isDisabled={selectedIndex === 0} onClick={handlePrev}>
          Prev
        </Button>
        <Inline space="space.300" testId="vr-hook">
          {sizes.map((size) => (
            <Stack key={size} space="space.200">
              <Text fontWeight="bold">{size}</Text>
              {spacings.map((space) => (
                <Stack key={space} space="space.100">
                  <Text>{space}</Text>
                  <ProgressIndicator
                    selectedIndex={selectedIndex}
                    values={values}
                    size={size}
                    spacing={space}
                  />
                </Stack>
              ))}
            </Stack>
          ))}
        </Inline>
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
