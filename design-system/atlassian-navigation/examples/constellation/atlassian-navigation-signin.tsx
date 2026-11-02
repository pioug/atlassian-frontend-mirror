import React from 'react';

import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
import { SignIn } from '@atlaskit/atlassian-navigation/sign-in';

const DefaultSignIn = () => <SignIn href="#" tooltip="Sign in" />;

const SignInExample = (): React.JSX.Element => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		renderSignIn={DefaultSignIn}
		primaryItems={[]}
	/>
);

export default SignInExample;
