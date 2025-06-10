/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';
import {
	SplitButton as AKSplitButton,
	IconButton,
	type IconButtonProps,
} from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { type OnOpenChangeArgs } from '@atlaskit/dropdown-menu/types';
import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down';
import { fg } from '@atlaskit/platform-feature-flags';
import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { messages } from '../i18n';
import { type DialogPlacement, type Integration } from '../types';

import { shareIntegrationButtonEvent } from './analytics/analytics';
import IntegrationButton from './IntegrationButton';

// span
const dropDownIntegrationButtonWrapperStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	['button:hover']: {
		background: 'transparent',
	},
});

type SplitButtonProps = {
	shareButton: React.ReactNode;
	handleOpenSplitButton: () => void;
	handleCloseSplitButton: () => void;
	isUsingSplitButton: boolean;
	shareIntegrations: Array<Integration>;
	onIntegrationClick: (integration: Integration) => void;
	triggerButtonAppearance?: IconButtonProps['appearance'];
	dialogZIndex?: number;
	dialogPlacement?: DialogPlacement;
	createAndFireEvent: (payload: AnalyticsEventPayload) => void;
};

type SplitButtonDropdownProps = Pick<
	SplitButtonProps,
	| 'triggerButtonAppearance'
	| 'isUsingSplitButton'
	| 'handleOpenSplitButton'
	| 'handleCloseSplitButton'
	| 'shareIntegrations'
	| 'createAndFireEvent'
	| 'onIntegrationClick'
>;

const integrationButtonText = (integrationName: string) => (
	<FormattedMessage {...messages.shareToIntegrationButtonText} values={{ integrationName }} />
);

const IntegrationButtonWrapper = ({ children }: { children: React.ReactNode }) =>
	// The css has no discernible effect on the button, so it is not included in the migration
	fg('share-compiled-migration') ? (
		<span>{children}</span>
	) : (
		<span css={dropDownIntegrationButtonWrapperStyles}>{children}</span>
	);

const SplitButtonDropdown: React.FC<SplitButtonDropdownProps> = (props) => {
	const {
		triggerButtonAppearance,
		isUsingSplitButton,
		handleOpenSplitButton,
		handleCloseSplitButton,
		shareIntegrations,
		onIntegrationClick,
		createAndFireEvent,
	} = props;

	const onOpenChange = useCallback(
		({ isOpen }: OnOpenChangeArgs) => {
			if (isOpen) {
				handleOpenSplitButton();
			} else {
				handleCloseSplitButton();
			}
		},
		[handleOpenSplitButton, handleCloseSplitButton],
	);

	const onIntegrationButtonClick = useCallback(
		(integration: Integration) => {
			onIntegrationClick(integration);
			createAndFireEvent(shareIntegrationButtonEvent(integration.type));
		},
		[createAndFireEvent, onIntegrationClick],
	);

	return (
		<DropdownMenu<HTMLButtonElement>
			testId="split-button-dropdown"
			trigger={({ triggerRef, ...providedProps }) => (
				<IconButton
					label=""
					{...providedProps}
					ref={triggerRef}
					icon={ChevronDownIcon}
					appearance={triggerButtonAppearance}
				/>
			)}
			placement="bottom-end"
			isOpen={isUsingSplitButton}
			onOpenChange={onOpenChange}
			shouldRenderToParent={fg('should-render-to-parent-should-be-true-people-and-')}
		>
			<DropdownItemGroup>
				{shareIntegrations.map((integration: Integration) => (
					<DropdownItem
						key={integration.type}
						testId={`split-button-dropdownitem-${integration.type}`}
					>
						<IntegrationButtonWrapper>
							<IntegrationButton
								textColor={token('color.text', N800)}
								appearance="subtle"
								onClick={() => onIntegrationButtonClick(integration)}
								shouldFitContainer={true}
								text={integrationButtonText(integration.type)}
								IntegrationIcon={integration.Icon}
							/>
						</IntegrationButtonWrapper>
					</DropdownItem>
				))}
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

SplitButtonDropdown.displayName = 'SplitButtonDropdown';

export default function SplitButton({
	shareButton,
	handleOpenSplitButton,
	handleCloseSplitButton,
	isUsingSplitButton,
	shareIntegrations,
	onIntegrationClick,
	triggerButtonAppearance,
	createAndFireEvent,
}: SplitButtonProps): JSX.Element {
	return (
		<AKSplitButton
			data-testid="split-button"
			appearance={triggerButtonAppearance as 'primary' | 'default'}
		>
			{shareButton}
			<SplitButtonDropdown
				shareIntegrations={shareIntegrations}
				triggerButtonAppearance={triggerButtonAppearance}
				isUsingSplitButton={isUsingSplitButton}
				handleOpenSplitButton={handleOpenSplitButton}
				handleCloseSplitButton={handleCloseSplitButton}
				onIntegrationClick={onIntegrationClick}
				createAndFireEvent={createAndFireEvent}
			/>
		</AKSplitButton>
	);
}
