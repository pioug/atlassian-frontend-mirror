/* eslint-disable @repo/internal/react/no-unsafe-spread-props */
import React, { type ReactNode } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { type AriaSelection } from '../accessibility';
import Compiled from '../compiled/components/live-region';
import Emotion from '../emotion/components/live-region';
import { type CommonProps, type GroupBase, type Options } from '../types';

// ==============================
// Root Container
// ==============================

interface LiveRegionProps<Option, IsMulti extends boolean, Group extends GroupBase<Option>>
	extends CommonProps<Option, IsMulti, Group> {
	children: ReactNode;
	innerProps: { className?: string };
	// Select state variables
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	ariaSelection: AriaSelection<Option, IsMulti>;
	focusedOption: Option | null;
	focusedValue: Option | null;
	selectValue: Options<Option>;
	focusableOptions: Options<Option>;
	isFocused: boolean;
	id: string;
	isAppleDevice: boolean;
}

const LiveRegion = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: LiveRegionProps<Option, IsMulti, Group>,
) => (fg('compiled-react-select') ? <Compiled {...props} /> : <Emotion {...props} />);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default LiveRegion;
