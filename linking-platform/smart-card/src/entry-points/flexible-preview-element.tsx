/**
 * Public API — exported externally. Do not add props without external support intent.
 */
import React from 'react';

import Preview from '../view/FlexibleCard/components/elements/preview-element';

type PreviewElementProps = {
	url?: React.ComponentProps<typeof Preview>['overrideUrl'];
};

export const PreviewElement = (props?: PreviewElementProps): React.JSX.Element => {
	return <Preview overrideUrl={props?.url} />;
};
