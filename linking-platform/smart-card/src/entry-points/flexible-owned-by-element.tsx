/**
 * Public API — exported externally. Do not add props without external support intent.
 */
import React from 'react';

import OwnedBy from '../view/FlexibleCard/components/elements/owned-by-element';

type OwnedByElementProps = Pick<
	React.ComponentProps<typeof OwnedBy>,
	'hideFormat' | 'color' | 'onRender' | 'textPrefix' | 'fontSize'
>;

export const OwnedByElement = (props?: OwnedByElementProps): React.JSX.Element => {
	return (
		<OwnedBy
			hideFormat={props?.hideFormat}
			color={props?.color}
			onRender={props?.onRender}
			textPrefix={props?.textPrefix}
			fontSize={props?.fontSize}
		/>
	);
};
