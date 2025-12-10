import React, { useCallback, useState } from 'react';

import { cssMap } from '@atlaskit/css';
import { DatePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import { ButtonItem } from '@atlaskit/menu';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	containerStyles: { maxWidth: '175px' },
	customPopupStyles: {
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
});

export default (): React.JSX.Element => {
	const [activePopup, setActivePopup] = useState<string | null>(null);

	const onCustomItemClick = useCallback(() => {
		setActivePopup('custom_popup');
	}, []);

	const onGoBackClick = useCallback(() => {
		setActivePopup(null);
	}, []);

	return (
		<Box xcss={styles.containerStyles}>
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
						<Box xcss={styles.customPopupStyles}>
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
