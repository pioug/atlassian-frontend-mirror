import React, { memo, useState } from 'react';

import { IconButton } from '@atlaskit/button/new';
import { useId } from '@atlaskit/ds-lib/use-id';
import Heading from '@atlaskit/heading';
import ChevronDoubleLeftIcon from '@atlaskit/icon/utility/chevron-double-left';
import ChevronDoubleRightIcon from '@atlaskit/icon/utility/chevron-double-right';
import ChevronLeftIcon from '@atlaskit/icon/utility/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/utility/chevron-right';
import { Box, Inline } from '@atlaskit/primitives/compiled';

import { type TabIndex } from '../../types';

interface HeaderProps {
	monthLongTitle: string;
	year: number;
	nextMonthLabel?: string;
	nextYearLabel?: string;
	nextMonthHeading: string;
	nextYearHeading: string;
	previousMonthLabel?: string;
	previousYearLabel?: string;
	previousMonthHeading: string;
	previousYearHeading: string;
	handleClickNextMonth: (e: React.MouseEvent<HTMLElement>) => void;
	handleClickNextYear: (e: React.MouseEvent<HTMLElement>) => void;
	handleClickPrevMonth: (e: React.MouseEvent<HTMLElement>) => void;
	handleClickPrevYear: (e: React.MouseEvent<HTMLElement>) => void;
	headerId: string;
	tabIndex?: TabIndex;
	testId?: string;
}

const Header = memo<HeaderProps>(function Header({
	monthLongTitle,
	year,
	previousMonthLabel = 'Previous month',
	previousYearLabel = 'Previous year',
	previousMonthHeading,
	previousYearHeading,
	nextMonthLabel = 'Next month',
	nextYearLabel = 'Next year',
	nextMonthHeading,
	nextYearHeading,
	handleClickPrevMonth,
	handleClickPrevYear,
	handleClickNextMonth,
	handleClickNextYear,
	headerId,
	tabIndex,
	testId,
}) {
	const announceId = useId();

	// All of this is because `aria-atomic` is not fully supported for different
	// assistive technologies. We want the value of the current month and year to
	// be announced, but *only* if that value has been interacted with since
	// being mounted. This allows us to conditionally apply the `aria-live`
	// attribute.  Without this, the `aria-live` property is set on mount and
	// overrides the default input's readout in downstream consumers (e.g.
	// datetime picker).
	const [hasInteractedWithMonthOrYear, setHasInteractedWithMonthOrYear] = useState<boolean>(false);

	const handlePrevMonthInteraction = (e: React.MouseEvent<HTMLElement>) => {
		if (!hasInteractedWithMonthOrYear) {
			setHasInteractedWithMonthOrYear(true);
		}
		handleClickPrevMonth(e);
	};

	const handlePrevYearInteraction = (e: React.MouseEvent<HTMLElement>) => {
		if (!hasInteractedWithMonthOrYear) {
			setHasInteractedWithMonthOrYear(true);
		}
		handleClickPrevYear(e);
	};

	const handleNextMonthInteraction = (e: React.MouseEvent<HTMLElement>) => {
		if (!hasInteractedWithMonthOrYear) {
			setHasInteractedWithMonthOrYear(true);
		}
		handleClickNextMonth(e);
	};

	const handleNextYearInteraction = (e: React.MouseEvent<HTMLElement>) => {
		if (!hasInteractedWithMonthOrYear) {
			setHasInteractedWithMonthOrYear(true);
		}
		handleClickNextYear(e);
	};

	return (
		<Box paddingInline="space.100">
			<Inline space="space.0" alignBlock="center" spread="space-between">
				<Inline space="space.100" alignBlock="start">
					<IconButton
						appearance="subtle"
						spacing="compact"
						tabIndex={tabIndex}
						onClick={handlePrevYearInteraction}
						testId={testId && `${testId}--previous-year`}
						icon={ChevronDoubleLeftIcon}
						label={`${previousYearLabel}, ${previousYearHeading}`}
					/>
					<IconButton
						appearance="subtle"
						spacing="compact"
						tabIndex={tabIndex}
						onClick={handlePrevMonthInteraction}
						testId={testId && `${testId}--previous-month`}
						icon={ChevronLeftIcon}
						label={`${previousMonthLabel}, ${previousMonthHeading}`}
					/>
				</Inline>
				{/* This is required to ensure that the new month/year is announced when the previous/next month buttons are activated */}
				<Box
					aria-live={hasInteractedWithMonthOrYear ? 'polite' : undefined}
					id={announceId}
					testId={testId && `${testId}--current-month-year--container`}
				>
					<Heading
						size="xsmall"
						as="h2"
						id={headerId}
						testId={testId && `${testId}--current-month-year`}
					>
						{`${monthLongTitle} ${year}`}
					</Heading>
				</Box>
				<Inline space="space.100" alignBlock="end">
					<IconButton
						appearance="subtle"
						spacing="compact"
						tabIndex={tabIndex}
						onClick={handleNextMonthInteraction}
						testId={testId && `${testId}--next-month`}
						icon={ChevronRightIcon}
						label={`${nextMonthLabel}, ${nextMonthHeading}`}
					/>
					<IconButton
						appearance="subtle"
						spacing="compact"
						tabIndex={tabIndex}
						onClick={handleNextYearInteraction}
						testId={testId && `${testId}--next-year`}
						icon={ChevronDoubleRightIcon}
						label={`${nextYearLabel}, ${nextYearHeading}`}
					/>
				</Inline>
			</Inline>
		</Box>
	);
});

Header.displayName = 'Header';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Header;
