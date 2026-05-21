/**
 * Public API — exported externally. Do not add props without external support intent.
 */
import React from 'react';

import OwnedByGroup from '../view/FlexibleCard/components/elements/owned-by-group-element';

type OwnedByGroupElementProps = Pick<React.ComponentProps<typeof OwnedByGroup>, 'onRender'>;

export const OwnedByGroupElement = (props?: OwnedByGroupElementProps): React.JSX.Element => {
	return <OwnedByGroup onRender={props?.onRender} />;
};
