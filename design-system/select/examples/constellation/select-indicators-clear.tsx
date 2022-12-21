import React, { CSSProperties, FunctionComponent } from 'react';
import { token } from '@atlaskit/tokens';
import { cities } from '../common/data';
import Select from '../../src';
import { OptionType, ClearIndicatorProps } from '../../src/types';

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
      <div style={{ padding: '0px 5px' }}>{children}</div>
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
  <Select
    closeMenuOnSelect={false}
    components={{ ClearIndicator }}
    styles={{ clearIndicator: ClearIndicatorStyles }}
    defaultValue={[cities[4], cities[5]]}
    isMulti
    options={cities}
  />
);
