/** @jsx jsx */
import { useState } from 'react';
import { css, jsx } from '@emotion/react';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';

import { type Size } from '../src/types';

import ActivityIcon from '../glyph/activity';
import AddCircleIcon from '../glyph/add-circle';
import AddItemIcon from '../glyph/add-item';
import AddIcon from '../glyph/add';
import AddonIcon from '../glyph/addon';
import AppSwitcherIcon from '../glyph/menu';
import ArrowDownIcon from '../glyph/arrow-down';
import ArrowLeftCircleIcon from '../glyph/arrow-left-circle';
import ArrowLeftIcon from '../glyph/arrow-left';
import ArrowRightIcon from '../glyph/arrow-right';
import ArrowUpIcon from '../glyph/arrow-up';
import { token } from '@atlaskit/tokens';

const iconRowStyles = css({
  display: 'flex',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  marginBlockStart: token('space.100', '8px'),
});

const iconWrapperStyles = css({
  margin: token('space.050', '4px'),
});

const demoIcons = [
  ActivityIcon,
  AddCircleIcon,
  AddItemIcon,
  AddIcon,
  AddonIcon,
  AppSwitcherIcon,
  ArrowDownIcon,
  ArrowLeftCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
];

const sizes: Size[] = ['small', 'medium', 'large', 'xlarge'];

const IconSizeExample = ({ defaultSize = 'medium' }: { defaultSize: Size }) => {
  const [size, setSize] = useState<Size>(defaultSize);

  return (
    <div>
      <ButtonGroup label="Choose icon size">
        {sizes.map((sizeOpt) => (
          <div style={{ marginRight: token('space.050', '4px') }} key={sizeOpt}>
            <Button
              testId={sizeOpt}
              isSelected={sizeOpt === size}
              onClick={() => setSize(sizeOpt)}
            >
              {sizeOpt}
            </Button>
          </div>
        ))}
      </ButtonGroup>
      <div id="size-example" css={iconRowStyles}>
        {demoIcons.map((Icon, i) => (
          <span css={iconWrapperStyles} key={i}>
            <Icon label={`Icon ${i}`} size={size} />
          </span>
        ))}
      </div>
    </div>
  );
};

export const IconSizeSmall = () => <IconSizeExample defaultSize="small" />;
export const IconSizeMedium = () => <IconSizeExample defaultSize="medium" />;
export const IconSizeLarge = () => <IconSizeExample defaultSize="large" />;
export const IconSizeXLarge = () => <IconSizeExample defaultSize="xlarge" />;

export default IconSizeExample;
