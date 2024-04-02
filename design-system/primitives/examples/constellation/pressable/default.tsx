import React, { useCallback } from 'react';

import Pressable from '@atlaskit/primitives/pressable';

export default function Default() {
  const handleClick = useCallback(() => {
    alert('Clicked');
  }, []);

  return <Pressable onClick={handleClick}>Pressable</Pressable>;
}
