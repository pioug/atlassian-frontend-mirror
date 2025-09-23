/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useMemo } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { type MessageDescriptor, useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { type OptionType, PopupSelect, type ValueType } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import type { Site } from '../../../../common/types';

import { siteSelectorMessages } from './messages';

const styles = cssMap({
	dropdownContainerStyles: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.100'),
		minHeight: '40px', // to prevent vertical shifting when site selector pops in
	},
});

export interface SiteSelectorProps {
	availableSites: Site[] | undefined;
	label: MessageDescriptor;
	onSiteSelection: (selectedSite: Site) => void;
	selectedSite?: Site;
	testId: string;
}

export const SiteSelector = (props: SiteSelectorProps) => {
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
		<Box xcss={styles.dropdownContainerStyles}>
			<Heading size="medium" as="h1">
				{formatMessage(label)}
			</Heading>

			{availableSites && availableSites.length > 1 && (
				<span data-testid={`${testId}--trigger`}>
					<PopupSelect
						searchThreshold={10}
						maxMenuWidth={300}
						minMenuWidth={300}
						isLoading={!availableSites}
						testId={testId}
						onChange={onChange}
						value={selectedSiteOption}
						label={formatMessage(siteSelectorMessages.chooseSite)}
						options={availableSitesOptions}
						placeholder={formatMessage(siteSelectorMessages.chooseSite)}
						target={({ isOpen, ...triggerProps }) => (
							<Button
								{...triggerProps}
								isSelected={isOpen}
								iconAfter={() => <ChevronDownIcon label="" color="currentColor" size="small" />}
								testId={`${testId}__control`}
								autoFocus={fg('navx-1845-sllv-autofocus-first-interactive-element')}
							>
								{selectedSiteOption?.label || formatMessage(siteSelectorMessages.chooseSite)}
							</Button>
						)}
					/>
				</span>
			)}
		</Box>
	);
};
