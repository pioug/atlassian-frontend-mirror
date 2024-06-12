import React from 'react';

import Box from '@atlaskit/primitives/box';

import Calendar from '../src';

const log = (msg: string) => (e: any) => console.log(msg, e);

const disabledArray = ['2020-12-04'];
const defaultPreviouslySelected = ['2020-12-06'];
const defaultSelected = ['2020-12-08'];
const onBlur = () => log('Blur');
const onChange = () => log('Change');
const onFocus = () => log('Focus');
const onSelect = () => log('Select');

export default () => (
	// Necessary to pass the SSR hydration test
	<Box>
		<Calendar
			disabled={disabledArray}
			maxDate={'2020-12-25'}
			defaultPreviouslySelected={defaultPreviouslySelected}
			defaultSelected={defaultSelected}
			defaultMonth={12}
			defaultYear={2020}
			onBlur={onBlur}
			onChange={onChange}
			onFocus={onFocus}
			onSelect={onSelect}
			testId={'calendar'}
		/>
	</Box>
);
