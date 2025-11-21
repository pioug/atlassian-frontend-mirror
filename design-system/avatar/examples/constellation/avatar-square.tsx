import React from 'react';

import Avatar from '@atlaskit/avatar';

import ExampleImg from '../../examples-util/nucleus.png';

const AvatarSquareExample = (): React.JSX.Element => {
	return <Avatar appearance="square" size="medium" src={ExampleImg} name="Nucleus" />;
};

export default AvatarSquareExample;
