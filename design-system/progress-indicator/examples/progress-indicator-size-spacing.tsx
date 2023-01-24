import React, { FC, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import Box from '@atlaskit/ds-explorations/box';
import Inline from '@atlaskit/ds-explorations/inline';
import Stack from '@atlaskit/ds-explorations/stack';
import Text from '@atlaskit/ds-explorations/text';

import { ProgressIndicator } from '../src';

const SpreadInlineLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Inline gap="space.100" justifyContent="space-between" alignItems="center">
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
    <Box paddingInline="space.200" paddingBlock="space.200" display="block">
      <SpreadInlineLayout>
        <Button isDisabled={selectedIndex === 0} onClick={handlePrev}>
          Prev
        </Button>
        <Inline gap="space.300" testId="vr-hook">
          {sizes.map((size) => (
            <Stack key={size} gap="space.200">
              <Text fontWeight="bold">{size}</Text>
              {spacings.map((space) => (
                <Stack key={space} gap="space.100">
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
