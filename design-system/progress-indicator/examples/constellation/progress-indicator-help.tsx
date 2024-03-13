/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';

import { ProgressIndicator } from '../../src';

const containerStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const HelpExample = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [values] = useState(['first', 'second', 'third']);

  const handlePrev = () => {
    setSelectedIndex((prevState) => prevState - 1);
  };

  const handleNext = () => {
    setSelectedIndex((prevState) => prevState + 1);
  };

  return (
    <div css={containerStyles}>
      <Button isDisabled={selectedIndex === 0} onClick={handlePrev}>
        Prev
      </Button>
      <ProgressIndicator
        appearance="help"
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

export default HelpExample;
