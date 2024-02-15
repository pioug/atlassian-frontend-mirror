/** @jsx jsx */
import { FC, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';

import { ProgressIndicator } from '../../src';

const containerStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Example: FC<{}> = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [values] = useState(['first', 'second', 'third']);

  const handlePrev = () => {
    setSelectedIndex((prevState) => prevState - 1);
  };

  const handleNext = () => {
    setSelectedIndex((prevState) => prevState + 1);
  };

  const handleSelect = ({
    event,
    index: selectedIndex,
  }: {
    event: React.MouseEvent<HTMLButtonElement>;
    index: number;
  }): void => {
    setSelectedIndex(selectedIndex);
  };

  return (
    <div css={containerStyles}>
      <Button isDisabled={selectedIndex === 0} onClick={handlePrev}>
        Prev
      </Button>
      <ProgressIndicator
        onSelect={handleSelect}
        selectedIndex={selectedIndex}
        values={values}
      />
      <Button
        isDisabled={selectedIndex === values.length - 1}
        onClick={handleNext}
      >
        Next
      </Button>
    </div>
  );
};

export default Example;
