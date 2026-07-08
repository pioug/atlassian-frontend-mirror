import React from 'react';

import Skeleton from '@atlaskit/skeleton';
import { token } from '@atlaskit/tokens';

export default (): React.JSX.Element => (
	<Skeleton width="40px" height="40px" borderRadius={token('radius.full')} />
);
