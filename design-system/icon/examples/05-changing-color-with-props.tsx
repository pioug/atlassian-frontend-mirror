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

const containerStyles = (isColorFlipped: boolean) => css`
  align-items: center;
  background-color: ${isColorFlipped ? 'white' : B500};
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  justify-content: center;
  transition: color 0.2s, background-color 0.2s;
`;

const textStyles = (isColorFlipped: boolean) => css`
  flex-basis: 100%;
  text-align: center;
  color: ${isColorFlipped ? 'inherit' : 'white'};
`;

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
    <div css={containerStyles(isColorFlipped)}>
      <p css={textStyles(isColorFlipped)}>
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
      <p css={textStyles(isColorFlipped)}>
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
