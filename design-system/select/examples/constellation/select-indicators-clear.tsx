import React, { CSSProperties, FunctionComponent } from 'react';

import { Label } from '@atlaskit/form';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { cities } from '../common/data';
import Select from '../../src';
import { OptionType, ClearIndicatorProps } from '../../src/types';

const clearIndicatorStyles = xcss({
  paddingInline: 'space.050',
});

const CustomClearText: FunctionComponent = () => <>clear all</>;

const ClearIndicator = (props: ClearIndicatorProps<OptionType, true>) => {
  const {
    children = <CustomClearText />,
    getStyles,
    innerProps: { ref, ...restInnerProps },
  } = props;
  return (
    <div
      {...restInnerProps}
      ref={ref}
      style={getStyles('clearIndicator', props) as CSSProperties}
    >
      <Box xcss={clearIndicatorStyles}>{children}</Box>
    </div>
  );
};

const ClearIndicatorStyles = (
  base: any,
  state: ClearIndicatorProps<OptionType>,
) => ({
  ...base,
  cursor: 'pointer',
  color: state.isFocused
    ? token('color.text.brand', 'blue')
    : token('color.text', 'black'),
});

export default () => (
  <>
    <Label htmlFor="indicators-clear">What city do you live in?</Label>
    <Select
      inputId="indicators-clear"
      closeMenuOnSelect={false}
      components={{ ClearIndicator }}
      styles={{ clearIndicator: ClearIndicatorStyles }}
      defaultValue={[cities[4], cities[5]]}
      isMulti
      options={cities}
    />
  </>
);
