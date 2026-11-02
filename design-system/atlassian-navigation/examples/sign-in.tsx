import React from 'react';

import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
import { SignIn } from '@atlaskit/atlassian-navigation/sign-in';

const DefaultSignIn = () => <SignIn href="#" tooltip="Sign in" />;

export default (): React.JSX.Element => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		renderSignIn={DefaultSignIn}
		primaryItems={[]}
	/>
);
