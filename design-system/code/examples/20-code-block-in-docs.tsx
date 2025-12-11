import React from 'react';

import { code } from '@atlaskit/docs';

export default (): React.JSX.Element => {
	const exampleCode = code`highlight=5-7
  import React from 'react';
  
  () => (
    <div>
      hello there
      <span>buds</span>
    </div>
  )`;
	return (
		<>
			<h2>Code block in docs</h2>
			{exampleCode}
		</>
	);
};
