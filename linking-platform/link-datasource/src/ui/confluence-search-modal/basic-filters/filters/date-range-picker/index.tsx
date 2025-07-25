import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { styled } from '@compiled/react';
import { FormattedMessage, useIntl } from 'react-intl-next';

import { DatePicker } from '@atlaskit/datetime-picker';
import ErrorIcon from '@atlaskit/icon/core/migration/status-error--error';
import { fg } from '@atlaskit/platform-feature-flags';
import Popup from '@atlaskit/popup';
import { N0, N20, N30, R400 } from '@atlaskit/theme/colors';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../../../analytics';
import {
	type DateRangeOption,
	type DateRangeType,
} from '../../../../common/modal/popup-select/types';

import { dateRangeMessages } from './messages';
import { PopupComponent } from './PopupComponent';
import { CustomDropdownItem } from './styled';
import { PopupTrigger } from './trigger';
import { getCurrentOptionLabel, getDropdownLabel, useInvalidDateRange } from './utils';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const DateRangeErrorMessage = styled.div({
	display: 'flex',
	marginTop: token('space.050', '2px'),
	gap: token('space.025'),
	paddingInlineStart: token('space.025'),
	font: token('font.body.UNSAFE_small'),
	color: token('color.text.danger', R400),
	alignItems: 'center',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const CustomDropdown = styled.div({
	width: '340px',
	backgroundColor: token('color.background.input', N0),
	borderRadius: token('border.radius.100', '4px'),
	boxShadow: token(
		'elevation.shadow.overlay',
		'0px 0px 1px 0px rgba(9, 30, 66, 0.31), 0px 3px 5px 0px rgba(9, 30, 66, 0.20)',
	),
	zIndex: layers.modal(),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const SelectDateRangeButton = styled.button({
	backgroundColor: token('color.background.accent.gray.subtler', N20),
	border: 'none',
	font: 'inherit',
	width: '70px',
	height: '40px',
	marginTop: token('space.150', '12px'),
	borderRadius: token('border.radius.100', '4px'),
	'&:hover': {
		backgroundColor: token('color.background.accent.gray.subtler', N30),
		cursor: 'pointer',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const CustomDateWrapper = styled.div({
	paddingTop: token('space.150', '12px'),
	paddingRight: token('space.150', '12px'),
	paddingBottom: token('space.150', '12px'),
	paddingLeft: token('space.150', '12px'),
	boxSizing: 'border-box',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const DatePickersWrapper = styled.div({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	width: '100%',
});

const dateRangeValues = [
	'anyTime',
	'today',
	'yesterday',
	'past7Days',
	'past30Days',
	'pastYear',
	'custom',
] as const;

type DateRangeValue = (typeof dateRangeValues)[number];
const defaultOptionValue: DateRangeValue = 'anyTime';

export type DateRangeSelection = Pick<DateRangeOption, 'value' | 'from' | 'to'>;

interface DateRangeProps {
	onSelectionChange: (options: DateRangeSelection) => void;
	selection?: DateRangeSelection;
	filterName?: string;
}

export const DateRangePicker = ({
	onSelectionChange,
	selection,
	filterName = 'datasource-date-range-picker',
}: DateRangeProps) => {
	const { value: selectedValue, from: fromDate, to: toDate } = selection || {};
	const todayDate = new Date().toISOString();

	const { locale, formatMessage, formatDate } = useIntl();
	const { fireEvent } = useDatasourceAnalyticsEvents();

	const [currentOption, setCurrentOption] = useState(selectedValue);
	const [customFromDate, setCustomFromDate] = useState(fromDate);
	const [customToDate, setCustomToDate] = useState(toDate);
	const [isPickerOpen, setIsPickerOpen] = useState<boolean | undefined>(undefined);

	const isCustomSelected = currentOption === 'custom';
	const analyticsPayload = useMemo(
		() => ({
			filterName,
			selectionCount: (currentOption ?? defaultOptionValue) === defaultOptionValue ? 0 : 1,
		}),
		[filterName, currentOption],
	);

	const invalidDateRange = useInvalidDateRange(customFromDate, customToDate);

	const handleClickUpdateDateRange = () => {
		onSelectionChange({
			value: 'custom',
			from: customFromDate,
			to: customToDate,
		});
		setIsPickerOpen(false);
	};

	const handleClickFilterOption = useCallback(
		(option: DateRangeType) => {
			if (option === currentOption) {
				setIsPickerOpen(false);
				return;
			}
			setCurrentOption(option);

			onSelectionChange({
				value: option,
			});

			if (option !== 'custom') {
				setIsPickerOpen(false);
			}
		},
		[onSelectionChange, currentOption],
	);

	const handlePickerToggle = () => {
		if (isPickerOpen) {
			setCustomToDate(toDate);
			setCustomFromDate(fromDate);
			setIsPickerOpen(false);
			return;
		}
		setIsPickerOpen(true);
		fireEvent('ui.dropdown.opened.basicSearchDropdown', analyticsPayload);
	};

	useEffect(() => {
		if (isPickerOpen === false) {
			fireEvent('ui.dropdown.closed.basicSearchDropdown', analyticsPayload);
		}
	}, [analyticsPayload, fireEvent, isPickerOpen]);

	const popupContent = () => {
		return (
			<CustomDropdown>
				{dateRangeValues.map((option) => (
					<CustomDropdownItem
						key={option}
						// want to show Anytime as selected if none of the other options are selected
						isSelected={selectedValue ? option === selectedValue : option === defaultOptionValue}
						onClick={() => handleClickFilterOption(option)}
					>
						{getDropdownLabel(option, formatMessage)}
					</CustomDropdownItem>
				))}
				{isPickerOpen && isCustomSelected && (
					<CustomDateWrapper>
						<DatePickersWrapper>
							<DatePicker
								shouldShowCalendarButton={fg('platform_linking_set_should_show_calender_button')}
								maxDate={todayDate}
								innerProps={{ style: { width: 140 } }}
								testId="date-from-picker"
								dateFormat="D MMM YYYY"
								onChange={setCustomFromDate}
								defaultValue={fromDate}
								placeholder={formatMessage(dateRangeMessages.dateRangeFrom)}
								isInvalid={Boolean(invalidDateRange)}
								locale={locale}
								selectProps={{
									styles: {
										placeholder: (base: any) => ({
											...base,
											width: 'max-content',
										}),
									},
								}}
							/>
							<FormattedMessage {...dateRangeMessages.dateRangeToLabel} />
							<DatePicker
								shouldShowCalendarButton={fg('platform_linking_set_should_show_calender_button')}
								maxDate={todayDate}
								innerProps={{ style: { width: 140 } }}
								testId="date-to-picker"
								dateFormat="D MMM YYYY"
								onChange={setCustomToDate}
								defaultValue={toDate}
								placeholder={formatMessage(dateRangeMessages.dateRangeTo)}
								isInvalid={Boolean(invalidDateRange)}
								locale={locale}
								selectProps={{
									styles: {
										placeholder: (base: any) => ({
											...base,
											width: 'max-content',
										}),
									},
								}}
							/>
						</DatePickersWrapper>
						{invalidDateRange && (
							<DateRangeErrorMessage>
								<ErrorIcon
									LEGACY_size="small"
									color={token('color.icon.danger', R400)}
									label={formatMessage(dateRangeMessages.dateRangeError)}
									LEGACY_margin={`0 ${token('space.negative.025')}`}
									size="small"
								/>
								{invalidDateRange}
							</DateRangeErrorMessage>
						)}
						<SelectDateRangeButton
							data-testId="custom-date-range-update-button"
							disabled={Boolean(invalidDateRange)}
							onClick={handleClickUpdateDateRange}
						>
							{formatMessage(dateRangeMessages.dateRangeUpdateButton)}
						</SelectDateRangeButton>
					</CustomDateWrapper>
				)}
			</CustomDropdown>
		);
	};

	return (
		<Popup
			isOpen={!!isPickerOpen}
			onClose={handlePickerToggle}
			// @ts-ignore: [PIT-1685] Fails in post-office due to backwards incompatibility issue with React 18
			popupComponent={PopupComponent}
			zIndex={layers.modal()}
			content={popupContent}
			placement="bottom-start"
			trigger={(triggerProps) => {
				const labelText = getCurrentOptionLabel(
					formatDate,
					formatMessage,
					selectedValue,
					toDate,
					fromDate,
				);

				const isSelected = !!selectedValue || !!isPickerOpen;

				return (
					<PopupTrigger
						triggerProps={triggerProps}
						isSelected={isSelected}
						labelPrefix={formatMessage(dateRangeMessages.dateRangeTitle)}
						selectedLabel={labelText}
						onClick={handlePickerToggle}
					/>
				);
			}}
		/>
	);
};
