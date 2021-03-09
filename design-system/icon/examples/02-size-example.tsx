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

const iconRow = css`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 8px;
`;

const iconWrapper = css`
  margin: 4px;
`;

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
    <div id="size-example">
      <ButtonGroup>
        {sizes.map(sizeOpt => (
          <div style={{ marginRight: 4 }} key={sizeOpt}>
            <Button
              isSelected={sizeOpt === size}
              onClick={() => setSize(sizeOpt)}
            >
              {sizeOpt}
            </Button>
          </div>
        ))}
      </ButtonGroup>
      <div css={iconRow}>
        {demoIcons.map((Icon, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <span css={iconWrapper} key={i}>
            <Icon label={`Icon ${i}`} size={size} />
          </span>
        ))}
      </div>
    </div>
  );
};

export default IconSizeExample;
