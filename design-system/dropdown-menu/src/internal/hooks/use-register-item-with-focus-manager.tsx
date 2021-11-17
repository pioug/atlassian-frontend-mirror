import { useContext, useEffect, useRef } from 'react';

import { FocusableElement } from '../../types';
import { FocusManagerContext } from '../components/focus-manager';

// This function is called whenever a MenuItem mounts.
// The refs stored in the context are used to programatically
// control focus on a user navigates using the keyboard.
function useRegisterItemWithFocusManager() {
  const { registerRef } = useContext(FocusManagerContext);
  const itemRef = useRef<FocusableElement>(null);

  useEffect(() => {
    if (itemRef.current !== null) {
      registerRef(itemRef.current);
    }
  }, [registerRef]);

  return itemRef;
}

export default useRegisterItemWithFocusManager;
