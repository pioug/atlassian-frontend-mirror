/**
 * Public API — exported externally. Do not add props without external support intent.
 */
import React from 'react';

import ModifiedOn from '../view/FlexibleCard/components/elements/modified-on-element';

type ModifiedOnElementProps = Pick<
	React.ComponentProps<typeof ModifiedOn>,
	'hideDatePrefix' | 'color' | 'onRender' | 'fontSize'
>;

export const ModifiedOnElement = (props?: ModifiedOnElementProps): React.JSX.Element => {
	return (
		<ModifiedOn
			hideDatePrefix={props?.hideDatePrefix}
			color={props?.color}
			onRender={props?.onRender}
			fontSize={props?.fontSize}
		/>
	);
};
