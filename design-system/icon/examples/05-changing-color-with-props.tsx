/** @jsx jsx */
import { useState } from 'react';
import { css, jsx } from '@emotion/react';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button/new';
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
      css={containerStyles}
      style={{
        backgroundColor: isColorFlipped
          ? 'white'
          : token('color.background.brand.bold'),
      }}
    >
      <p
        css={[textStyles]}
        style={{
          backgroundColor: isColorFlipped ? 'inherit' : 'white',
        }}
      >
        Icon colors can be set via the primaryColor and secondaryColor props.
      </p>
      {exampleIcons.map(([Icon, label]) => (
        <Tooltip content={label} key={label}>
          <Icon
            primaryColor={
              isColorFlipped ? token('color.text.subtlest') : 'white'
            }
            size="xlarge"
            label={label}
          />
        </Tooltip>
      ))}
      <p
        css={textStyles}
        style={{ backgroundColor: isColorFlipped ? 'inherit' : 'white' }}
      >
        <Button
          appearance="subtle"
          onClick={() => setIsColorFlipped(!isColorFlipped)}
        >
          Change colour
        </Button>
      </p>
    </div>
  );
};
