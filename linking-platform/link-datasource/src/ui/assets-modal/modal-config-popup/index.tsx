/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useId, useState } from 'react';

import { useIntl, FormattedMessage } from 'react-intl';

import IconButton from '@atlaskit/button/icon/button';
import Checkbox from '@atlaskit/checkbox/checkbox';
import { cssMap, jsx } from '@atlaskit/css';
import { Label } from '@atlaskit/form/label/default';
import CustomizeIcon from '@atlaskit/icon/core/customize';
import { Popup } from '@atlaskit/popup/popup';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import Select from '@atlaskit/select/default';
import type { ValueType } from '@atlaskit/select/types';
import { token } from '@atlaskit/tokens';

import { aboveModal } from '../../../common/zindex';
import { modalConfigPopupMessages } from './messages';

/**
 * Rendering a `<Select>` in a `<Modal>` results in the select options getting cut off by the bottom of the modal and
 * scrolling. This is a work-around for that, see https://atlassian.slack.com/archives/CFJ9DU39U/p1623179496484100
 */
export const selectInAModalStyleFixProps: {
	menuPortalTarget: HTMLElement;
	styles: {
		menuPortal: (base: any) => any;
	};
} = {
	styles: {
		menuPortal: (base: any): any => ({ ...base, zIndex: aboveModal }),
	},
	menuPortalTarget: document.body,
};

export const PAGE_SIZE_OPTIONS: readonly number[] = [10, 20, 50, 100];
export const DEFAULT_PAGE_SIZE = 20;

export type AssetsModalConfig = {
	/** Whether users can select attributes of referenced objects (nested attributes) as table columns */
	isNestedReferenceAttributeSelectionEnabled: boolean;
	/** Number of Assets objects displayed per table page */
	pageSize: number;
};

export type AssetsModalConfigPopupProps = {
	/** Initial values. Missing keys fall back to `DEFAULT_PAGE_SIZE` and `false` respectively. */
	initialConfig?: Partial<AssetsModalConfig>;
	/** Called with the full config every time either the select or the checkbox changes. */
	onChange: (config: AssetsModalConfig) => void;
	testId?: string;
};

type PageSizeOption = {
	label: string;
	value: number;
};

const styles = cssMap({
	trigger: {
		paddingLeft: token('space.400'),
		paddingRight: token('space.200'),
	},
	content: {
		width: '400px',
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
});

export const AssetsModalConfigPopup = ({
	initialConfig,
	onChange,
	testId = 'assets-datasource-modal--config-popup',
}: AssetsModalConfigPopupProps): JSX.Element => {
	const { formatMessage } = useIntl();
	const [isOpen, setIsOpen] = useState(false);
	const [config, setConfig] = useState<AssetsModalConfig>({
		pageSize: initialConfig?.pageSize ?? DEFAULT_PAGE_SIZE,
		isNestedReferenceAttributeSelectionEnabled:
			initialConfig?.isNestedReferenceAttributeSelectionEnabled ?? false,
	});
	const pageSizeSelectId = useId();

	const pageSizeOptions: PageSizeOption[] = PAGE_SIZE_OPTIONS.map((count) => ({
		label: formatMessage(modalConfigPopupMessages.objectsPerPage, { count }),
		value: count,
	}));

	const updateConfig = (partialConfig: Partial<AssetsModalConfig>) => {
		const nextConfig = { ...config, ...partialConfig };
		setConfig(nextConfig);
		onChange(nextConfig);
	};

	const handlePageSizeChange = (option: ValueType<PageSizeOption>) => {
		if (option) {
			updateConfig({ pageSize: option.value });
		}
	};

	const handleNestedReferenceAttributeSelectionChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		updateConfig({ isNestedReferenceAttributeSelectionEnabled: event.target.checked });
	};

	const selectedPageSizeOption = pageSizeOptions.find((option) => option.value === config.pageSize);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			placement="bottom-end"
			testId={testId}
			role="dialog"
			label={formatMessage(modalConfigPopupMessages.configureTable)}
			zIndex={aboveModal}
			trigger={(triggerProps) => (
				<Box xcss={styles.trigger}>
					<IconButton
						ref={triggerProps.ref}
						aria-controls={triggerProps['aria-controls']}
						aria-expanded={triggerProps['aria-expanded']}
						aria-haspopup={triggerProps['aria-haspopup']}
						icon={CustomizeIcon}
						isSelected={isOpen}
						isTooltipDisabled={false}
						label={formatMessage(modalConfigPopupMessages.configureTable)}
						onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
						testId={`${testId}--trigger`}
					/>
				</Box>
			)}
			content={() => (
				<Box xcss={styles.content}>
					<Stack space="space.200">
						{/* `alignInline="start"` stops the select stretching to the popup width so it sizes to its content */}
						<Stack space="space.050" alignInline="start">
							<Label htmlFor={pageSizeSelectId}>
								<FormattedMessage {...modalConfigPopupMessages.tablePagination} />
							</Label>
							{/*
							 * The menu is portalled to `document.body` so it renders over the popup instead of
							 * expanding inside it, which would otherwise force the popup content to scroll.
							 */}
							<Select<PageSizeOption>
								{...selectInAModalStyleFixProps}
								inputId={pageSizeSelectId}
								options={pageSizeOptions}
								value={selectedPageSizeOption}
								onChange={handlePageSizeChange}
								isSearchable={false}
								menuPlacement="bottom"
								testId={`${testId}--page-size-select`}
							/>
						</Stack>
						<Checkbox
							isChecked={config.isNestedReferenceAttributeSelectionEnabled}
							onChange={handleNestedReferenceAttributeSelectionChange}
							label={formatMessage(modalConfigPopupMessages.nestedReferenceAttributeSelection)}
							testId={`${testId}--nested-reference-attribute-selection`}
						/>
					</Stack>
				</Box>
			)}
		/>
	);
};
