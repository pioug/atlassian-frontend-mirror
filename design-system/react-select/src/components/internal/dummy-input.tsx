/* eslint-disable @repo/internal/react/no-unsafe-spread-props */
import React, { type Ref } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import Compiled from '../../compiled/components/internal/dummy-input';
import Emotion from '../../emotion/components/internal/dummy-input';

export default function DummyInput(
	props: JSX.IntrinsicElements['input'] & {
		readonly innerRef: Ref<HTMLInputElement>;
	},
) {
	return fg('compiled-react-select') ? <Compiled {...props} /> : <Emotion {...props} />;
}
