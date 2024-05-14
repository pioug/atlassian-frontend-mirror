import React, { useCallback } from 'react';

import Pressable from '@atlaskit/primitives/pressable';

export default function Default() {
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  return <Pressable onClick={handleClick}>Pressable</Pressable>;
}
