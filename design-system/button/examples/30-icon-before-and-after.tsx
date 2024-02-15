import React from 'react';

import capitalize from 'lodash/capitalize';

import AddIcon from '@atlaskit/icon/glyph/add';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import LightbulbIcon from '@atlaskit/icon/glyph/lightbulb';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { Stack } from '@atlaskit/primitives';

import { ButtonGroup } from '../src';
import Button from '../src/new';
import { type IconSize } from '../src/new-button/variants/types';
import spacing from '../src/utils/spacing';

const icons = [
  AddIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  GraphLineIcon,
  LightbulbIcon,
  MoreIcon,
];

const iconSizes: IconSize[] = ['small', 'large', 'xlarge'];

export default function ButtonsWithIconBeforeOrAfterExample() {
  return (
    <Stack space="space.200" alignInline="start">
      {spacing.map((s) => (
        <Stack space="space.100" key={s}>
          <h2>{capitalize(s)}</h2>
          <Stack space="space.100" alignInline="start">
            {icons.map((icon) => {
              const Icon = icon;

              return (
                <ButtonGroup key={icon.name}>
                  <Button iconBefore={Icon} spacing={s}>
                    Icon before
                  </Button>
                  <Button iconAfter={Icon} spacing={s}>
                    Icon after
                  </Button>
                  <Button iconBefore={Icon} iconAfter={Icon} spacing={s}>
                    Icon before
                  </Button>
                </ButtonGroup>
              );
            })}
          </Stack>
        </Stack>
      ))}
      <h2>Unsafe icon sizing</h2>
      {iconSizes.map((size) => (
        <ButtonGroup key={size}>
          <Button iconBefore={AddIcon} UNSAFE_iconBefore_size={size}>
            Icon before
          </Button>
          <Button iconAfter={AddIcon} UNSAFE_iconAfter_size={size}>
            Icon after
          </Button>
          <Button
            iconBefore={AddIcon}
            UNSAFE_iconBefore_size={size}
            iconAfter={AddIcon}
            UNSAFE_iconAfter_size={size}
          >
            Icon before and after
          </Button>
        </ButtonGroup>
      ))}
    </Stack>
  );
}
