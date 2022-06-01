import React from 'react';

import ExampleImg from '../../examples-util/nucleus.png';
import Avatar from '../../src';

const AvatarMediumExample = () => {
  return (
    <div>
      <Avatar
        size="medium"
        src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
        name="Scott Farquhar"
      />
      <Avatar
        size="medium"
        appearance="square"
        src={ExampleImg}
        name="Nucleus"
      />
    </div>
  );
};

export default AvatarMediumExample;
