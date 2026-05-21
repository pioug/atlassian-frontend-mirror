/**
 * Public API — exported externally. Do not add props without external support intent.
 */
import React from 'react';

import UnresolvedActionComponent from '../view/FlexibleCard/components/actions/unresolved-action';

export const UnresolvedAction = (props: { hasPadding?: boolean }): React.JSX.Element => (
	<UnresolvedActionComponent {...props} />
);
