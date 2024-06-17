/** @jsx jsx */
import { memo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { IconButton } from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import ArrowleftIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ArrowrightIcon from '@atlaskit/icon/glyph/chevron-right-large';
import { Box, Inline } from '@atlaskit/primitives';

import useUniqueId from '../../internal/hooks/use-unique-id';
import { type TabIndex } from '../../types';

interface HeaderProps {
	monthLongTitle: string;
	year: number;
	previousMonthLabel?: string;
	previousHeading: string;
	nextMonthLabel?: string;
	nextHeading: string;
	handleClickNext: (e: React.MouseEvent<HTMLElement>) => void;
	handleClickPrev: (e: React.MouseEvent<HTMLElement>) => void;
	headerId: string;
	tabIndex?: TabIndex;
	testId?: string;
}

const Header = memo<HeaderProps>(function Header({
	monthLongTitle,
	year,
	previousMonthLabel = 'Previous month',
	previousHeading,
	nextMonthLabel = 'Next month',
	nextHeading,
	handleClickPrev,
	handleClickNext,
	headerId,
	tabIndex,
	testId,
}) {
	const announceId = useUniqueId('month-year-announce');

	// All of this is because `aria-atomic` is not fully supported for different
	// assistive technologies. We want the value of the current month and year to
	// be announced, but *only* if that value has been interacted with since
	// being mounted. This allows us to conditionally apply the `aria-live`
	// attribute.  Without this, the `aria-live` property is set on mount and
	// overrides the default input's readout in downstream consumers (e.g.
	// datetime picker).
	const [hasInteractedWithMonth, setHasInteractedWithMonth] = useState<boolean>(false);

	const handlePrevMonthInteraction = (e: React.MouseEvent<HTMLElement>) => {
		if (!hasInteractedWithMonth) {
			setHasInteractedWithMonth(true);
		}
		handleClickPrev(e);
	};

	const handleNextMonthInteraction = (e: React.MouseEvent<HTMLElement>) => {
		if (!hasInteractedWithMonth) {
			setHasInteractedWithMonth(true);
		}
		handleClickNext(e);
	};

	return (
		<Box paddingInline="space.100">
			<Inline space="space.0" alignBlock="center" spread="space-between">
				<IconButton
					appearance="subtle"
					spacing="compact"
					tabIndex={tabIndex}
					onClick={handlePrevMonthInteraction}
					testId={testId && `${testId}--previous-month`}
					icon={ArrowleftIcon}
					label={`${previousMonthLabel}, ${previousHeading}`}
				/>
				{/* This is required to ensure that the new month/year is announced when the previous/next month buttons are activated */}
				<Box
					aria-live={hasInteractedWithMonth ? 'polite' : undefined}
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
				<IconButton
					appearance="subtle"
					spacing="compact"
					tabIndex={tabIndex}
					onClick={handleNextMonthInteraction}
					testId={testId && `${testId}--next-month`}
					icon={ArrowrightIcon}
					label={`${nextMonthLabel}, ${nextHeading}`}
				/>
			</Inline>
		</Box>
	);
});

Header.displayName = 'Header';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Header;
