import React, { useCallback, useId, useState } from 'react';

import Button, { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import RetryIcon from '@atlaskit/icon/core/retry';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import { Inline, Stack } from '@atlaskit/primitives/compiled';
import Text from '@atlaskit/primitives/text';
import Range from '@atlaskit/range';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockEnd: token('space.300'),
		paddingInlineStart: token('space.300'),
		marginInline: 'auto',
		marginBlockStart: token('space.200'),
		maxWidth: '50%',
	},
});

const DEFAULT_LOADING_TIMEOUT = 1500;
const MAX_LOADING_TIMEOUT = 5000;
const STEP_LOADING_TIMEOUT = 100;

const ButtonLoadingWithTimeoutExample = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [loadingTimeout, setLoadingTimeout] = useState(DEFAULT_LOADING_TIMEOUT);

	const rangeId = useId();

	const handleClick = useCallback(() => {
		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false);
		}, loadingTimeout);
	}, [loadingTimeout]);

	const handleRefresh = useCallback(() => {
		setIsRefreshing(true);

		setTimeout(() => {
			setIsRefreshing(false);
		}, loadingTimeout);
	}, [loadingTimeout]);

	const handleSave = useCallback(() => {
		setIsSaving(true);

		setTimeout(() => {
			setIsSaving(false);
		}, loadingTimeout);
	}, [loadingTimeout]);

	return (
		<Stack space="space.300" xcss={styles.root}>
			<Stack space="space.100">
				<label htmlFor={rangeId}>
					Loading timeout: <Text weight="bold">{loadingTimeout}ms</Text>
				</label>
				<Range
					id={rangeId}
					min={0}
					max={MAX_LOADING_TIMEOUT}
					step={STEP_LOADING_TIMEOUT}
					value={loadingTimeout}
					onChange={(value) => setLoadingTimeout(value)}
				/>
			</Stack>
			<Inline alignInline="center" space="space.200">
				<Button isLoading={isLoading} onClick={handleClick} appearance="primary">
					Submit
				</Button>
				<IconButton
					icon={RetryIcon}
					label="Refresh"
					isLoading={isRefreshing}
					onClick={handleRefresh}
				/>
				<DropdownMenu
					shouldRenderToParent
					trigger={({ triggerRef, ...props }) => (
						<IconButton
							{...props}
							icon={ShowMoreHorizontalIcon}
							label="More"
							ref={triggerRef}
							isLoading={isSaving}
						/>
					)}
				>
					<DropdownItemGroup>
						<DropdownItem onClick={handleSave}>Save</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>
			</Inline>
		</Stack>
	);
};

export default ButtonLoadingWithTimeoutExample;
