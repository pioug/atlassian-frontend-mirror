import React from 'react';
import Modal, { ModalProps } from '../../../common/Modal';
import { EmbedModalProps } from '../../types';
import { MAX_MODAL_SIZE, MIN_MODAL_SIZE } from '../../constants';
import { WithSizeExperimentProps } from './types';

const withSizeExperiment = (
  Component: React.ComponentType<EmbedModalProps>,
): React.FC<(EmbedModalProps | ModalProps) & WithSizeExperimentProps> => (
  props,
) => {
  const { featureFlags = {}, closeLabel = 'Close Preview' } = props;
  const { embedModalSize } = featureFlags;

  // Experiment
  if (embedModalSize === 'large' || embedModalSize === 'small') {
    const size = embedModalSize === 'large' ? MAX_MODAL_SIZE : MIN_MODAL_SIZE;
    return <Component {...props} size={size} />;
  }

  // Control
  return <Modal {...props} closeLabel={closeLabel} />;
};

export default withSizeExperiment;
