/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { type MessageDescriptor, useIntl } from 'react-intl-next';

import { Box, xcss } from '@atlaskit/primitives';
import Select, { type OptionType, type ValueType } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import type { Site } from '../../../../common/types';
import { siteSelectorIndex } from '../../../../common/zindex';

import { siteSelectorMessages } from './messages';

const dropdownContainerStyles = xcss({
	display: 'flex',
	alignItems: 'center',
	gap: 'space.100',
	minHeight: '40px', // to prevent vertical shifting when site selector pops in
});

export interface SiteSelectorProps {
	availableSites: Site[] | undefined;
	onSiteSelection: (selectedSite: Site) => void;
	label: MessageDescriptor;
	selectedSite?: Site;
	testId: string;
}

const selectStyles = css({
	font: token('font.body'),
	fontWeight: token('font.weight.medium', '500'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: siteSelectorIndex,
});

export const SiteSelectorOld = (props: SiteSelectorProps) => {
	const { availableSites, onSiteSelection, selectedSite, label, testId } = props;

	const { formatMessage } = useIntl();

	const onChange = (newValue: ValueType<OptionType>) => {
		const selectedSite = availableSites?.find((site) => site.cloudId === newValue?.value);

		if (selectedSite) {
			onSiteSelection(selectedSite);
		}
	};

	const availableSitesOptions = useMemo(
		() =>
			availableSites?.map((site) => ({
				label: site.displayName,
				value: site.cloudId,
			})),
		[availableSites],
	);

	const selectedSiteOption = selectedSite && {
		label: selectedSite.displayName,
		value: selectedSite.cloudId,
	};

	return (
		<Box xcss={dropdownContainerStyles}>
			{formatMessage(label)}
			{availableSites && availableSites.length > 1 && (
				<span data-testid={`${testId}--trigger`}>
					<Select
						css={selectStyles}
						classNamePrefix={testId}
						isLoading={!availableSites}
						onChange={onChange}
						options={availableSitesOptions}
						placeholder={formatMessage(siteSelectorMessages.chooseSite)}
						styles={{
							// prevents the popup menu with available sites from being too narrow
							// if the selected site is much shorter than the other options
							menu: ({ width, ...css }) => ({
								...css,
								minWidth: '100%',
								width: 'max-content',
							}),
						}}
						testId={testId}
						value={selectedSiteOption}
						label={formatMessage(siteSelectorMessages.chooseSite)}
					/>
				</span>
			)}
		</Box>
	);
};
