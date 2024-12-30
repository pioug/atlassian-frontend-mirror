/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import DropdownMenu, { type CustomTriggerProps } from '@atlaskit/dropdown-menu';
import type { ThemeAppearance } from '@atlaskit/lozenge';

import { useAnalyticsEvents } from '../../../../../../common/analytics/generated/use-analytics-events';
import extractLozengeActionItems from '../../../../../../extractors/action/extract-lozenge-action-items';
import useInvoke from '../../../../../../state/hooks/use-invoke';
import { isInvokeCustomError } from '../../../../../../state/hooks/use-invoke/utils';
import useResolve from '../../../../../../state/hooks/use-resolve';
import createStatusUpdateRequest from '../../../../../../utils/actions/create-status-update-request';
import { TrackQuickActionType } from '../../../../../../utils/analytics/analytics';
import { type MessageProps } from '../../../types';

import withErrorBoundary from './error-boundary';
import {
	permissionLoadErrorAnalyticsPayload,
	unknownLoadErrorAnalyticsPayload,
	unknownUpdateErrorAnalyticsPayload,
	validationUpdateErrorAnalyticsPayload,
} from './lozenge-action-analytics';
import LozengeActionError from './lozenge-action-error';
import { LozengeActionErrorMessages } from './lozenge-action-error/types';
import LozengeActionItemsGroup from './lozenge-action-items-group';
import LozengeActionTrigger from './lozenge-action-trigger';
import type { LozengeActionTriggerProps } from './lozenge-action-trigger/type';
import type { LozengeActionProps, LozengeItem } from './types';

const validateItems = (items: LozengeItem[] = [], text?: string): LozengeItem[] => {
	return items.filter((item) => item.text !== text);
};

const LozengeAction = ({
	action,
	appearance,
	testId = 'smart-element-lozenge-action',
	text,
	zIndex,
}: LozengeActionProps) => {
	const [selected, setSelected] = useState<Partial<LozengeActionTriggerProps>>({
		appearance,
		text,
	});
	const [isLoaded, setIsLoaded] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [items, setItems] = useState<LozengeItem[]>();
	const [errorMessage, setErrorMessage] = useState<string | MessageProps>();

	const reload = useResolve();
	const invoke = useInvoke();
	const { fireEvent } = useAnalyticsEvents();

	useEffect(() => {
		setSelected({ text, appearance });
	}, [text, appearance]);

	const { url, id: linkId, invokePreviewAction } = action?.update?.details || {};

	const handleOpenChange = useCallback(
		async (args: { isOpen: boolean }) => {
			setIsOpen(args.isOpen);
			if (args.isOpen) {
				fireEvent('ui.button.clicked.smartLinkStatusLozenge', {});
				fireEvent('track.smartLinkQuickAction.started', {
					smartLinkActionType: TrackQuickActionType.StatusUpdate,
				});

				if (!isLoaded && action?.read) {
					try {
						setIsLoading(true);
						const responseItems = await invoke(action.read, extractLozengeActionItems);
						const validItems =
							typeof text === 'string' ? validateItems(responseItems, text) : responseItems;

						setItems(validItems);
						setIsLoaded(true);

						if (validItems?.length === 0) {
							fireEvent('track.smartLinkQuickAction.failed', permissionLoadErrorAnalyticsPayload);
							setErrorMessage(LozengeActionErrorMessages.noData);
							setIsLoaded(false);
						}
					} catch (err) {
						setErrorMessage(LozengeActionErrorMessages.unknown);
						setIsLoaded(false);
						fireEvent('track.smartLinkQuickAction.failed', unknownLoadErrorAnalyticsPayload);
					} finally {
						setIsLoading(false);
					}
				}
			}

			if (!args.isOpen) {
				setErrorMessage(undefined);
			}
		},
		[action.read, invoke, isLoaded, text, fireEvent],
	);

	const trigger = useCallback(
		(props: CustomTriggerProps<HTMLButtonElement>) => (
			<LozengeActionTrigger
				{...props}
				appearance={selected.appearance}
				isOpen={isOpen}
				testId={testId}
				text={selected.text}
			/>
		),
		[selected.appearance, selected.text, isOpen, testId],
	);

	const handleItemClick = useCallback(
		async (id: string, text: string, appearance?: ThemeAppearance) => {
			try {
				fireEvent('ui.button.clicked.smartLinkStatusListItem', {});

				const updateAction = action?.update;
				if (updateAction && id) {
					setIsLoading(true);

					const request = createStatusUpdateRequest(updateAction, id);
					await invoke(request);

					setSelected({ appearance, text });
					setIsLoading(false);
					setIsLoaded(false);
					setIsOpen(false);
					setItems([]);

					fireEvent('track.smartLinkQuickAction.success', {
						smartLinkActionType: TrackQuickActionType.StatusUpdate,
					});

					if (url) {
						await reload(url, true, undefined, linkId);
					}
				}
			} catch (err: any) {
				setIsLoading(false);

				if (isInvokeCustomError(err)) {
					setErrorMessage(err.message);
					fireEvent('track.smartLinkQuickAction.failed', validationUpdateErrorAnalyticsPayload);
				} else {
					setErrorMessage(LozengeActionErrorMessages.updateFailed);
					fireEvent('track.smartLinkQuickAction.failed', unknownUpdateErrorAnalyticsPayload);
				}
			}
		},
		[action?.update, invoke, linkId, reload, url, fireEvent],
	);

	const dropdownItemGroup = useMemo(() => {
		if (errorMessage) {
			return (
				<LozengeActionError
					errorMessage={errorMessage}
					testId={testId}
					url={url}
					invokePreviewAction={invokePreviewAction}
				/>
			);
		}

		if (items && items.length > 0) {
			return <LozengeActionItemsGroup testId={testId} items={items} onClick={handleItemClick} />;
		}
	}, [errorMessage, handleItemClick, items, invokePreviewAction, testId, url]);

	return (
		<DropdownMenu
			isLoading={isLoading}
			isOpen={isOpen}
			onOpenChange={handleOpenChange}
			testId={testId}
			trigger={trigger}
			zIndex={zIndex}
		>
			{dropdownItemGroup}
		</DropdownMenu>
	);
};

export default withErrorBoundary(LozengeAction);
