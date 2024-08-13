import React, { useCallback, useEffect, useRef, useState } from 'react';

import Popup from '@atlaskit/popup';
import { layers } from '@atlaskit/theme/constants';

import { PopupTrigger } from './PopupTrigger';
import { type ProfileCardTriggerProps } from './types';

const DELAY_MS_SHOW = 800;
const DELAY_MS_HIDE = 200;

function ProfileCardTrigger<T>({
	trigger,
	ariaLabelledBy,
	children,
	renderProfileCard,
	fetchProfile,
	disabledAriaAttributes,
	...popupProps
}: ProfileCardTriggerProps) {
	const showDelay = trigger === 'click' ? 0 : DELAY_MS_SHOW;
	const hideDelay = trigger === 'click' ? 0 : DELAY_MS_HIDE;

	const showTimer = useRef<number>(0);
	const hideTimer = useRef<number>(0);
	const [visible, setVisible] = useState<boolean>(false);

	useEffect(() => {
		return () => {
			clearTimeout(showTimer.current);
			clearTimeout(hideTimer.current);
		};
	}, []);

	const hideProfilecard = useCallback(() => {
		clearTimeout(showTimer.current);
		clearTimeout(hideTimer.current);
		hideTimer.current = window.setTimeout(() => {
			setVisible(false);
		}, hideDelay);
	}, [hideDelay]);

	const showProfilecard = useCallback(() => {
		clearTimeout(hideTimer.current);
		clearTimeout(showTimer.current);
		showTimer.current = window.setTimeout(() => {
			if (!visible) {
				void fetchProfile?.();
				setVisible(true);
			}
		}, showDelay);
	}, [showDelay, visible, fetchProfile]);

	const onMouseEnter = useCallback(() => {
		showProfilecard();
	}, [showProfilecard]);

	return (
		<Popup
			{...popupProps}
			isOpen={!!visible}
			onClose={hideProfilecard}
			shouldUseCaptureOnOutsideClick
			autoFocus={popupProps.autoFocus ?? trigger === 'click'}
			zIndex={layers.modal()}
			shouldFitContainer={false}
			trigger={(triggerProps) => {
				const { 'aria-expanded': _, 'aria-haspopup': __, ...restInnerProps } = triggerProps;
				return (
					<PopupTrigger
						{...(disabledAriaAttributes ? restInnerProps : triggerProps)}
						forwardRef={triggerProps.ref}
						hideProfilecard={hideProfilecard}
						showProfilecard={showProfilecard}
						children={children}
						ariaLabelledBy={ariaLabelledBy}
						trigger={trigger}
					/>
				);
			}}
			content={() => (
				<div onMouseEnter={onMouseEnter} onMouseLeave={hideProfilecard} onFocus={showProfilecard}>
					{renderProfileCard()}
				</div>
			)}
		/>
	);
}

export default ProfileCardTrigger;
