import React, { useCallback, useState } from 'react';

import { DatePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import { ButtonItem } from '@atlaskit/menu';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';

const containerStyles = xcss({
	maxWidth: '175px',
});

const customPopupStyles = xcss({
	padding: 'space.100',
});

export default () => {
	setBooleanFeatureFlagResolver(() => true);

	const [activePopup, setActivePopup] = useState<string | null>(null);

	const onCustomItemClick = useCallback(() => {
		setActivePopup('custom_popup');
	}, []);

	const onGoBackClick = useCallback(() => {
		setActivePopup(null);
	}, []);

	return (
		<Box xcss={containerStyles}>
			<Heading size="medium">Components override</Heading>
			<Label id="date--label" htmlFor="date">
				DatePicker
			</Label>
			<DatePicker
				isOpen
				id="date"
				testId="datetime-picker"
				clearControlLabel="Clear select date (default)"
				shouldShowCalendarButton
				inputLabelId="default"
				openCalendarLabel="open calendar"
				menuInnerWrapper={({ children }: { children: React.ReactNode }) =>
					activePopup === 'custom_popup' ? (
						<Box xcss={customPopupStyles}>
							Custom component rendered
							<ButtonItem onClick={onGoBackClick}>Go Back</ButtonItem>
						</Box>
					) : (
						<>
							Custom header
							{children}
							<ButtonItem onClick={onCustomItemClick}>Custom item</ButtonItem>
						</>
					)
				}
			/>
		</Box>
	);
};
