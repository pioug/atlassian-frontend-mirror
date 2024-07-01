import RelatedLinksBaseModal from './components/RelatedLinksBaseModal';
import React from 'react';
import { RelatedLinksUnavailableView } from './views/unavailable';
import { type RelatedLinksModalProps } from './types';

const RelatedLinksModal = ({ onClose, showModal, ari }: RelatedLinksModalProps) => {
	return (
		<RelatedLinksBaseModal onClose={onClose} showModal={showModal}>
			{/*TODO: switch between views depending on related links response of url*/}
			<RelatedLinksUnavailableView />
		</RelatedLinksBaseModal>
	);
};

export default RelatedLinksModal;
