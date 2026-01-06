import React from 'react';

import Image from '@atlaskit/image';

const Examples = (): React.JSX.Element => (
	<>
		<Image src="https://picsum.photos/300/150" alt="Wide view" width={300} height={150} />
		<Image src="https://picsum.photos/100/100" alt="User profile" width={100} height={100} />
	</>
);
export default Examples;
