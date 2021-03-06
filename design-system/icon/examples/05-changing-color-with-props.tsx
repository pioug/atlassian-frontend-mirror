/** @jsx jsx */
import { useState } from 'react';
import { B500, N300 } from '@atlaskit/theme/colors';
import { css, jsx } from '@emotion/core';
import Tooltip from '@atlaskit/tooltip';
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

const exampleIcons = [
  [BookIcon, 'BookIcon'],
  [ArrowUpIcon, 'ArrowUpIcon'],
  [ArrowDownIcon, 'ArrowDownIcon'],
  [ArrowLeftIcon, 'ArrowLeftIcon'],
  [ArrowRightIcon, 'ArrowRightIcon'],
] as const;

export default () => {
  const [isColorFlipped, setIsColorFlipped] = useState(false);

  return (
    <div
      css={[containerStyles, isColorFlipped ? backgroundWhite : backgroundBlue]}
    >
      <p css={[textStyles, isColorFlipped ? colorInherit : colorWhite]}>
        Icon colors can be set via the primaryColor and secondaryColor props.
      </p>
      {exampleIcons.map(([Icon, label]) => (
        <Tooltip content={label} key={label}>
          <Icon
            primaryColor={isColorFlipped ? N300 : 'white'}
            size="xlarge"
            label={label}
          />
        </Tooltip>
      ))}
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
