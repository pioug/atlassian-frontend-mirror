/**
 * Public API — exported externally. Do not add props without external support intent.
 */
import React from 'react';

import type { Prettify } from '@atlaskit/linking-common';

import State from '../view/FlexibleCard/components/elements/state-element';

type StateElementProps = Prettify<Pick<React.ComponentProps<typeof State>, 'maxWidth'>>;

export const StateElement = (props?: StateElementProps): React.JSX.Element => (
	<State maxWidth={props?.maxWidth} />
);
