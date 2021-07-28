/** @jsx jsx */
import { useState } from 'react';
import { css, jsx } from '@emotion/core';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';

import { Size } from '../src/types';

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

const iconRowStyles = css({
  display: 'flex',
  marginTop: 8,
  justifyContent: 'flex-start',
  flexDirection: 'row',
});

const iconWrapperStyles = css({
  margin: 4,
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

const IconSizeExample = () => {
  const [size, setSize] = useState<Size>('medium');

  return (
    <div>
      <ButtonGroup>
        {sizes.map((sizeOpt) => (
          <div style={{ marginRight: 4 }} key={sizeOpt}>
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
          // eslint-disable-next-line react/no-array-index-key
          <span css={iconWrapperStyles} key={i}>
            <Icon label={`Icon ${i}`} size={size} />
          </span>
        ))}
      </div>
    </div>
  );
};

export default IconSizeExample;
