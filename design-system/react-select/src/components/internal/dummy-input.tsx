/* eslint-disable @repo/internal/react/no-unsafe-spread-props */
import React, { type Ref } from 'react';

import Compiled from '../../compiled/components/internal/dummy-input';

export default function DummyInput(
	props: JSX.IntrinsicElements['input'] & {
		readonly innerRef: Ref<HTMLInputElement>;
	},
) {
	return <Compiled {...props} />;
}
