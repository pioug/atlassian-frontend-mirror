import React from 'react';

import ExitingPersistence, {
  ExitingPersistenceProps,
} from '@atlaskit/motion/exiting-persistence';

const ModalTransition = (props: Pick<ExitingPersistenceProps, 'children'>) => {
  return <ExitingPersistence appear>{props.children}</ExitingPersistence>;
};

export default ModalTransition;
