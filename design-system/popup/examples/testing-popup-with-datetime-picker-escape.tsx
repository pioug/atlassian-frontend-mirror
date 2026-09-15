import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker';
import { Label } from '@atlaskit/form/label/default';
import Link from '@atlaskit/link/link';
import { Popup } from '@atlaskit/popup/popup';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';

const contentStyles = cssMap({
	root: {
		minWidth: '360px',
	},
});

/**
 * Example: Popup with a nested datetime picker.
 * Documents DSP-25859. This is not a fix.
 * Expected: open popup, open datetime picker, press Escape. The datetime picker
 * closes, focus returns to the datetime trigger, and the popup stays open.
 */
export default function TestingPopupWithDatetimePickerEscape(): React.JSX.Element {
	const [isPopupOpen, setIsPopupOpen] = useState(false);

	return (
		<Box padding="space.500">
			<Stack space="space.200">
				<Text as="p">
					This example documents a bug and is not a fix.{' '}
					<Link href="https://product-fabric.atlassian.net/browse/DSP-25859">DSP-25859</Link>
				</Text>
				<Text as="p">
					Open the popup, then open the datetime picker. Press Escape. The datetime picker should
					close and focus should return to the datetime trigger; the popup should stay open.
				</Text>
				<Popup
					isOpen={isPopupOpen}
					onClose={() => setIsPopupOpen(false)}
					shouldRenderToParent
					placement="bottom-start"
					role="dialog"
					label="Popup with nested datetime picker"
					content={() => (
						<Box padding="space.200" testId="popup-content" xcss={contentStyles.root}>
							<Stack space="space.200">
								<Label htmlFor="datetime-picker-inside-popup">Appointment date and time</Label>
								<DateTimePicker
									id="datetime-picker-inside-popup"
									testId="datetime-picker-inside-popup"
									clearControlLabel="Clear appointment date and time"
									datePickerProps={{
										shouldShowCalendarButton: true,
										label: 'Appointment date',
										openCalendarLabel: 'open calendar',
									}}
									timePickerProps={{ label: 'Appointment time' }}
								/>
							</Stack>
						</Box>
					)}
					trigger={(triggerProps) => (
						<Button
							{...triggerProps}
							testId="popup-trigger"
							appearance="default"
							isSelected={isPopupOpen}
							onClick={() => setIsPopupOpen(!isPopupOpen)}
						>
							Open popup
						</Button>
					)}
				/>
			</Stack>
		</Box>
	);
}
