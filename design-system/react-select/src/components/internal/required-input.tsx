/* eslint-disable @repo/internal/react/no-unsafe-spread-props */
import React, { type FocusEventHandler, type FunctionComponent } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import Compiled from '../../compiled/components/internal/required-input';
import Emotion from '../../emotion/components/internal/required-input';

const RequiredInput: FunctionComponent<{
	readonly name?: string;
	readonly onFocus: FocusEventHandler<HTMLInputElement>;
}> = (props) => (fg('compiled-react-select') ? <Compiled {...props} /> : <Emotion {...props} />);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default RequiredInput;
