import React from 'react';

export const Modal = ({ onClose }: { onClose: () => void }) => {
	return (
		<div data-testid="modal">
			<button data-testid="btn-close" onClick={onClose} type="button">
				Close
			</button>
		</div>
	);
};

export const ErrorModal = (_props: { onClose: () => void }) => {
	throw new Error('Error on render.');
};
