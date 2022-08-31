import React from 'react';
import Modal from '../../../common/Modal';
import { EmbedModalSize } from '../../types';
import { WithSizeExperimentProps } from './types';

const withSizeExperiment = <Props, Component>(
  Component: React.ComponentType<Props>,
): React.FC<
  Props & React.ComponentProps<typeof Modal> & WithSizeExperimentProps
> => (props) => {
  const { featureFlags = {} } = props;
  const { embedModalSize: size } = featureFlags;

  // Experiment
  if (size === EmbedModalSize.Large || size === EmbedModalSize.Small) {
    return <Component {...props} size={size} />;
  }

  // Control
  return <Modal {...props} />;
};

export default withSizeExperiment;
