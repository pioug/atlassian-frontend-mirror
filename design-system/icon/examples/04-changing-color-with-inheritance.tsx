/** @jsx jsx */
import { useState } from 'react';
import { N0, N800, B500 } from '@atlaskit/theme/colors';
import { css, jsx } from '@emotion/core';
import Button from '@atlaskit/button/standard-button';
import { token } from '@atlaskit/tokens';

import BookIcon from '../glyph/book';
import ArrowUpIcon from '../glyph/arrow-up';
import ArrowDownIcon from '../glyph/arrow-down';
import ArrowLeftIcon from '../glyph/arrow-left';
import ArrowRightIcon from '../glyph/arrow-right';

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
      css={containerStyles}
      style={{
        backgroundColor: isColorFlipped
          ? 'white'
          : token('color.background.boldBrand.resting', B500),
        color: isColorFlipped
          ? token('color.text.highEmphasis', N800)
          : token('color.text.onBold', N0),
      }}
    >
      <p css={textStyles} style={{ backgroundColor: 'inherit' }}>
        Icons inherit color from their parent by default.
      </p>
      <BookIcon size="xlarge" label="book" />
      <ArrowUpIcon size="xlarge" label="arrowup" />
      <ArrowDownIcon size="xlarge" label="arrowdown" />
      <ArrowLeftIcon size="xlarge" label="arrowleft" />
      <ArrowRightIcon size="xlarge" label="arrowright" />
      <p
        css={textStyles}
        style={{ backgroundColor: isColorFlipped ? 'inherit' : 'white' }}
      >
        <Button
          appearance="subtle-link"
          onClick={() => setIsColorFlipped(!isColorFlipped)}
        >
          Change colour
        </Button>
      </p>
    </div>
  );
};

export default ChangingColorWithInheritance;
