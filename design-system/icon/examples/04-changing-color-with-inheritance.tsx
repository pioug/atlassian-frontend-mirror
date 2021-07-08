/** @jsx jsx */
import { useState } from 'react';
import { B500 } from '@atlaskit/theme/colors';
import { css, jsx } from '@emotion/core';
import Button from '@atlaskit/button/standard-button';

import BookIcon from '../glyph/book';
import ArrowUpIcon from '../glyph/arrow-up';
import ArrowDownIcon from '../glyph/arrow-down';
import ArrowLeftIcon from '../glyph/arrow-left';
import ArrowRightIcon from '../glyph/arrow-right';

const backgroundWhite = css({ backgroundColor: 'white' });
const backgroundBlue = css({ backgroundColor: B500 });
const colorInherit = css({ backgroundColor: 'inherit' });
const colorWhite = css({ backgroundColor: 'white' });

const containerStyles = css({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  transition: 'color 0.2s, background-color 0.2s',
});

const textStyles = css({
  flexBasis: '100%',
  textAlign: 'center',
});

const ChangingColorWithInheritance = () => {
  const [isColorFlipped, setIsColorFlipped] = useState(false);

  return (
    <div
      css={[containerStyles, isColorFlipped ? backgroundWhite : backgroundBlue]}
    >
      <p css={[textStyles, isColorFlipped ? colorInherit : colorWhite]}>
        Icons inherit color from their parent by default.
      </p>
      <BookIcon size="xlarge" label="book" />
      <ArrowUpIcon size="xlarge" label="arrowup" />
      <ArrowDownIcon size="xlarge" label="arrowdown" />
      <ArrowLeftIcon size="xlarge" label="arrowleft" />
      <ArrowRightIcon size="xlarge" label="arrowright" />
      <p css={[textStyles, isColorFlipped ? colorInherit : colorWhite]}>
        <Button
          appearance="subtle-link"
          onClick={() => setIsColorFlipped((old) => !old)}
        >
          Change colour
        </Button>
      </p>
    </div>
  );
};

export default ChangingColorWithInheritance;
