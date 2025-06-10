import React from 'react';

import { AtlassianNavigation, SignIn } from '@atlaskit/atlassian-navigation';

const DefaultSignIn = () => <SignIn href="#" tooltip="Sign in" />;

const SignInExample = () => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		renderSignIn={DefaultSignIn}
		primaryItems={[]}
	/>
);

export default SignInExample;
