import React from 'react';

import ExampleImg from '../../examples-util/nucleus.png';
import Avatar from '../../src';

const AvatarSmallExample = () => {
  return (
    <div>
      <Avatar
        size="small"
        src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
        name="Scott Farquhar"
      />
      <Avatar
        size="small"
        appearance="square"
        src={ExampleImg}
        name="Nucleus"
      />
    </div>
  );
};

export default AvatarSmallExample;
