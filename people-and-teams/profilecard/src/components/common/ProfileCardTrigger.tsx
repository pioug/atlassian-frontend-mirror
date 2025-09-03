import React, {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';

import { cssMap } from '@atlaskit/css';
import Popup from '@atlaskit/popup';
import { Box } from '@atlaskit/primitives/compiled';
import { layers } from '@atlaskit/theme/constants';

import { cardTriggered } from '../../util/analytics';
import { useProfileInfo } from '../../util/useProfileInfo';

import { LoadingState } from './LoadingState';
import { PopupTrigger } from './PopupTrigger';
import { ProfileCardWrapper } from './ProfileCardWrapper';
import { type ProfileCardTriggerProps } from './types';

const styles = cssMap({
	overflowHidden: {
		overflow: 'hidden',
	},
});

const DELAY_MS_SHOW = 800;
const DELAY_MS_HIDE = 200;

export interface ProfileCardHandle {
	hideProfilecard: () => void;
}

function ProfileCardTriggerInner<T>(
	{
		trigger,
		ariaLabelledBy,
		children,
		renderProfileCard,
		fetchProfile,
		disabledAriaAttributes,
		profileCardType,
		fireAnalytics,
		hideOverflow,
		...popupProps
	}: ProfileCardTriggerProps<T>,
	ref: React.Ref<ProfileCardHandle>,
) {
	const showDelay = trigger === 'click' ? 0 : DELAY_MS_SHOW;
	const hideDelay = trigger === 'click' ? 0 : DELAY_MS_HIDE;

	const showTimer = useRef<number>(0);
	const hideTimer = useRef<number>(0);
	const [visible, setVisible] = useState<boolean>(false);

	const { profileData, isLoading, error, getProfileData } = useProfileInfo<T>({
		fetchUserProfile: fetchProfile,
	});

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

	useImperativeHandle(
		ref,
		() => ({
			hideProfilecard,
		}),
		[hideProfilecard],
	);

	const showProfilecard = useCallback(async () => {
		clearTimeout(hideTimer.current);
		clearTimeout(showTimer.current);
		showTimer.current = window.setTimeout(() => {
			if (!visible) {
				getProfileData?.();
				setVisible(true);
				if (fireAnalytics) {
					fireAnalytics(cardTriggered(profileCardType, trigger));
				}
			}
		}, showDelay);
	}, [showDelay, visible, getProfileData, fireAnalytics, profileCardType, trigger]);

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
				const triggerElement = (
					<PopupTrigger<T>
						{...(disabledAriaAttributes ? restInnerProps : triggerProps)}
						ref={triggerProps.ref}
						hideProfilecard={hideProfilecard}
						showProfilecard={showProfilecard}
						children={children}
						ariaLabelledBy={ariaLabelledBy}
						trigger={trigger}
					/>
				);

				if (hideOverflow) {
					return <Box xcss={styles.overflowHidden}>{triggerElement}</Box>;
				}

				return triggerElement;
			}}
			content={() => (
				// eslint-disable-next-line jsx-a11y/no-static-element-interactions
				<div onMouseEnter={onMouseEnter} onMouseLeave={hideProfilecard} onFocus={showProfilecard}>
					{isLoading ? (
						<ProfileCardWrapper>
							<LoadingState fireAnalytics={fireAnalytics} profileType={profileCardType} />
						</ProfileCardWrapper>
					) : (
						renderProfileCard({ profileData, error })
					)}
				</div>
			)}
		/>
	);
}

const ProfileCardTrigger = forwardRef(ProfileCardTriggerInner) as <T>(
	props: ProfileCardTriggerProps<T> & { ref?: React.Ref<ProfileCardHandle> },
) => React.ReactElement;

export default ProfileCardTrigger;
