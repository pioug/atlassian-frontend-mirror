import { useContext } from 'react';

import { ScrollContext } from '../context';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default function useScroll() {
  const shouldScrollInViewport = useContext(ScrollContext);
  if (shouldScrollInViewport == null) {
    throw Error(
      '@atlaskit/modal-dialog: Scroll context unavailable – this component needs to be a child of ModalDialog.',
    );
  }

  return shouldScrollInViewport;
}
