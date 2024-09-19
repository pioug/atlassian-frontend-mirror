import React, { useEffect } from 'react';

import PopupPlacementExample from './10-popup';

const KeydownTriggeredPopup = () => {
	useEffect(() => {
		const triggerElement = document.querySelector('#popup-trigger');
		if (triggerElement instanceof HTMLElement) {
			triggerElement.focus();
			const event = new MouseEvent('click', { bubbles: true });
			triggerElement.dispatchEvent(event);
		}
	}, []);
	return <PopupPlacementExample />;
};
export default KeydownTriggeredPopup;
