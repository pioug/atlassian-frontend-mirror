/**
 * Public API — exported externally. Do not add props without external support intent.
 */
import React from 'react';

import ReactCount from '../view/FlexibleCard/components/elements/react-count-element';

type ReactCountElementProps = Pick<React.ComponentProps<typeof ReactCount>, 'color' | 'onRender'>;

export const ReactCountElement = (props?: ReactCountElementProps): React.JSX.Element => {
	return <ReactCount color={props?.color} onRender={props?.onRender} />;
};
