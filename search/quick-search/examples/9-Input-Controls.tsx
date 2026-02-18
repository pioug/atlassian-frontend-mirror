import React from 'react';

import QuickSearch from '../src/components/QuickSearch';

const _default: () => React.JSX.Element = () => (
	<QuickSearch isLoading={false} inputControls={<button>Test Button</button>} children={null} />
);
export default _default;
