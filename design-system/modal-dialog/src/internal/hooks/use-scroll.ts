import { useContext } from 'react';

import { ScrollContext } from '../context';

export default function useScroll() {
  const shouldScrollInViewport = useContext(ScrollContext);
  if (shouldScrollInViewport == null) {
    throw Error(
      '@atlaskit/modal-dialog: Scroll context unavailable – this component needs to be a child of ModalDialog.',
    );
  }

  return shouldScrollInViewport;
}
