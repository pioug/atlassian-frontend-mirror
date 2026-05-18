import React from 'react';

import { components } from '@atlaskit/react-select';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { type ControlProps, type OptionType } from '../types';
/**
 * __Dummy control__
 * Overrides the default DummyControl component in Select.
 */
export const DummyControl = (props: ControlProps<OptionType, boolean>): JSX.Element => (
	<VisuallyHidden>
		{/* eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props */}
		<components.Control {...(props as any)} />
	</VisuallyHidden>
);
