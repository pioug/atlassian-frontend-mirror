import React from 'react';

import { AtlassianNavigation, SignIn } from '@atlaskit/atlassian-navigation';

const DefaultSignIn = () => <SignIn href="#" tooltip="Sign in" />;

export default (): React.JSX.Element => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		renderSignIn={DefaultSignIn}
		primaryItems={[]}
	/>
);
