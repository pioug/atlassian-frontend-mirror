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

const backgroundWhiteStyles = css({ backgroundColor: 'white' });
const backgroundBlueStyles = css({ backgroundColor: B500 });
const colorInheritStyles = css({ backgroundColor: 'inherit' });
const colorWhiteStyles = css({ backgroundColor: 'white' });

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
      css={[
        containerStyles,
        isColorFlipped ? backgroundWhiteStyles : backgroundBlueStyles,
      ]}
    >
      <p
        css={[
          textStyles,
          isColorFlipped ? colorInheritStyles : colorWhiteStyles,
        ]}
      >
        Icons inherit color from their parent by default.
      </p>
      <BookIcon size="xlarge" label="book" />
      <ArrowUpIcon size="xlarge" label="arrowup" />
      <ArrowDownIcon size="xlarge" label="arrowdown" />
      <ArrowLeftIcon size="xlarge" label="arrowleft" />
      <ArrowRightIcon size="xlarge" label="arrowright" />
      <p
        css={[
          textStyles,
          isColorFlipped ? colorInheritStyles : colorWhiteStyles,
        ]}
      >
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
