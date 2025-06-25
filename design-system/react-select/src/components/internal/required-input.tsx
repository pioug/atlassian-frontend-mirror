/* eslint-disable @repo/internal/react/no-unsafe-spread-props */
import React, { type FocusEventHandler, type FunctionComponent } from 'react';

import Compiled from '../../compiled/components/internal/required-input';

const RequiredInput: FunctionComponent<{
	readonly name?: string;
	readonly onFocus: FocusEventHandler<HTMLInputElement>;
}> = (props) => <Compiled {...props} />;

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default RequiredInput;
