import React from 'react';

import ExitingPersistence, {
  type ExitingPersistenceProps,
} from '@atlaskit/motion/exiting-persistence';

/**
 * __Modal transition__
 *
 * A modal transition wraps a modal to provide a fluid transition upon opening and closing.
 *
 * - [Examples](https://atlassian.design/components/modal-dialog/examples)
 * - [Code](https://atlassian.design/components/modal-dialog/code)
 * - [Usage](https://atlassian.design/components/modal-dialog/usage)
 */
const ModalTransition = (props: Pick<ExitingPersistenceProps, 'children'>) => {
  return <ExitingPersistence appear>{props.children}</ExitingPersistence>;
};

export default ModalTransition;
