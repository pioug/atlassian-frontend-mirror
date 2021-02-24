/** @jsx jsx */
import { useState } from 'react';
import { N300, B500 } from '@atlaskit/theme/colors';
import { css, jsx } from '@emotion/core';
import Button from '@atlaskit/button/standard-button';

import BookIcon from '../glyph/book';
import ArrowUpIcon from '../glyph/arrow-up';
import ArrowDownIcon from '../glyph/arrow-down';
import ArrowLeftIcon from '../glyph/arrow-left';
import ArrowRightIcon from '../glyph/arrow-right';

const containerStyles = (isColorFlipped: boolean) => css`
  align-items: center;
  color: ${isColorFlipped ? N300 : 'white'};
  background-color: ${isColorFlipped ? 'white' : B500};
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  justify-content: center;
`;

const paragraphStyles = (isColorFlipped: boolean) => css`
  flex-basis: 100%;
  text-align: center;
  color: ${isColorFlipped ? 'inherit' : 'white'};
`;

const ChangingColorWithInheritance = () => {
  const [isColorFlipped, setIsColorFlipped] = useState(false);

  return (
    <div css={containerStyles(isColorFlipped)}>
      <p css={paragraphStyles(isColorFlipped)}>
        Icons inherit color from their parent by default.
      </p>
      <BookIcon size="large" label="book" />
      <ArrowUpIcon size="large" label="arrowup" />
      <ArrowDownIcon size="large" label="arrowdown" />
      <ArrowLeftIcon size="large" label="arrowleft" />
      <ArrowRightIcon size="large" label="arrowright" />
      <p css={paragraphStyles(isColorFlipped)}>
        <Button
          appearance="subtle-link"
          onClick={() => setIsColorFlipped(old => !old)}
        >
          Change colour
        </Button>
      </p>
    </div>
  );
};

export default ChangingColorWithInheritance;
