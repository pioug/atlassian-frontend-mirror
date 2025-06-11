/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { linkToolbarMessages, cardMessages as messages } from '@atlaskit/editor-common/messages';
import {
	FloatingToolbarButton as Button,
	FloatingToolbarSeparator as Separator,
} from '@atlaskit/editor-common/ui';
import {
	ArrowKeyNavigationType,
	DropdownContainer as UiDropdown,
} from '@atlaskit/editor-common/ui-menu';
import ChevronDownIcon from '@atlaskit/icon/core/migration/chevron-down';
import type { DatasourceAdf } from '@atlaskit/link-datasource';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import { ButtonItem } from '@atlaskit/menu';
import { fg } from '@atlaskit/platform-feature-flags';
import { Flex } from '@atlaskit/primitives/compiled';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import { focusEditorView, isDatasourceConfigEditable } from '../../pm-plugins/utils';
import { editDatasource } from '../editDatasourceAction';
import { useFetchDatasourceDataInfo } from '../useFetchDatasourceDataInfo';
import { useFetchDatasourceInfo } from '../useFetchDatasourceInfo';

import EditToolbarButtonPresentation from './EditToolbarButtonPresentation';
import type {
	EditDatasourceToolbarButtonProps,
	EditDatasourceToolbarButtonWithDatasourceIdProps,
	EditDatasourceToolbarButtonWithUrlProps,
} from './types';

const dropdownExpandContainer = css({
	margin: `0px ${token('space.negative.050', '-4px')}`,
});

type EditVariant = 'none' | 'edit-link' | 'edit-datasource' | 'edit-dropdown';

const EditToolbarButtonWithCardContext = (props: EditDatasourceToolbarButtonProps) => {
	const {
		cardContext,
		currentAppearance,
		editorAnalyticsApi,
		editorView,
		intl,
		onLinkEditClick,
		url,
	} = props;
	const { extensionKey, ...response } = useFetchDatasourceInfo({
		isRegularCardNode: true,
		url,
		cardContext,
	});
	const datasourceId = response.datasourceId ?? props.datasourceId;

	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef();

	const toggleOpen = () => setIsOpen((open) => !open);

	const onClose = () => setIsOpen(false);

	const onEditLink = useCallback(() => {
		if (editorView) {
			onLinkEditClick(editorView.state, editorView.dispatch);
			focusEditorView(editorView);
		}
	}, [editorView, onLinkEditClick]);

	const editVariant = useMemo<EditVariant>(() => {
		const hasUrl = url !== null && url !== undefined;
		if (!datasourceId || !isDatasourceConfigEditable(datasourceId)) {
			if (hasUrl) {
				return 'edit-link';
			}
			return 'none';
		}
		if (hasUrl) {
			const urlState = cardContext?.store?.getState()[url];
			if (urlState?.error?.kind === 'fatal') {
				return 'edit-link';
			}
			return 'edit-dropdown';
		} else {
			return 'edit-datasource';
		}
	}, [cardContext?.store, datasourceId, url]);

	const onEditDatasource = useCallback(() => {
		if (editorView && datasourceId) {
			editDatasource(
				datasourceId,
				editorAnalyticsApi,
				currentAppearance,
				extensionKey,
			)(editorView.state, editorView.dispatch);
			focusEditorView(editorView);
		}
	}, [currentAppearance, datasourceId, editorAnalyticsApi, editorView, extensionKey]);

	switch (editVariant) {
		case 'edit-link': {
			return (
				<Flex gap="space.050">
					<Button testId="edit-link" onClick={onEditLink}>
						<FormattedMessage
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...linkToolbarMessages.editLink}
						/>
					</Button>
					{(!editorExperiment('platform_editor_controls', 'variant1') ||
						!fg('platform_editor_controls_patch_6')) && <Separator />}
				</Flex>
			);
		}
		case 'edit-datasource': {
			return (
				<Flex gap="space.050">
					<Button
						testId="edit-datasource"
						tooltipContent={intl.formatMessage(linkToolbarMessages.editDatasourceStandaloneTooltip)}
						onClick={onEditDatasource}
					>
						<FormattedMessage
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...linkToolbarMessages.editDatasourceStandalone}
						/>
					</Button>
					{(!editorExperiment('platform_editor_controls', 'variant1') ||
						!fg('platform_editor_controls_patch_6')) && <Separator />}
				</Flex>
			);
		}
		case 'edit-dropdown': {
			const trigger = (
				<Flex gap="space.050">
					<Button
						testId="edit-dropdown-trigger"
						iconAfter={
							<span css={dropdownExpandContainer}>
								<ChevronDownIcon
									label={intl.formatMessage(messages.editDropdownTriggerTitle)}
									size="small"
								/>
							</span>
						}
						onClick={toggleOpen}
						selected={isOpen}
						disabled={false}
						ariaHasPopup
					>
						<FormattedMessage
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...messages.editDropdownTriggerTitle}
						/>
					</Button>
					{(!editorExperiment('platform_editor_controls', 'variant1') ||
						!fg('platform_editor_controls_patch_6')) && <Separator />}
				</Flex>
			);

			return (
				<Flex ref={containerRef}>
					<UiDropdown
						mountTo={containerRef.current}
						isOpen={isOpen}
						handleClickOutside={onClose}
						handleEscapeKeydown={onClose}
						trigger={trigger}
						scrollableElement={containerRef.current}
						arrowKeyNavigationProviderOptions={{
							type: ArrowKeyNavigationType.MENU,
						}}
					>
						<ButtonItem key="edit.link" onClick={onEditLink} testId="edit-dropdown-edit-link-item">
							<FormattedMessage
								// Ignored via go/ees005
								// eslint-disable-next-line react/jsx-props-no-spreading
								{...messages.editDropdownEditLinkTitle}
							/>
						</ButtonItem>
						<ButtonItem
							key="edit.datasource"
							onClick={onEditDatasource}
							testId="edit-dropdown-edit-datasource-item"
						>
							<FormattedMessage
								// Ignored via go/ees005
								// eslint-disable-next-line react/jsx-props-no-spreading
								{...messages.editDropdownEditDatasourceTitle}
							/>
						</ButtonItem>
					</UiDropdown>
				</Flex>
			);
		}
		case 'none':
		default:
			return null;
	}
};

const EditToolbarButtonWithUrl = (props: EditDatasourceToolbarButtonWithUrlProps) => {
	const {
		cardContext,
		currentAppearance,
		datasourceId: datasourceIdFromAdf,
		editorAnalyticsApi,
		editorView,
		intl,
		onLinkEditClick,
		url,
	} = props;
	const { extensionKey, datasourceId: datasourceIdFromUrl } = useFetchDatasourceInfo({
		isRegularCardNode: true,
		url,
		cardContext,
	});

	const datasourceId = datasourceIdFromUrl ?? datasourceIdFromAdf;

	const editVariant = useMemo<EditVariant>(() => {
		if (!datasourceId || !isDatasourceConfigEditable(datasourceId)) {
			return 'edit-link';
		}
		const urlState = cardContext?.store?.getState()[url];
		if (urlState?.error?.kind === 'fatal') {
			return 'edit-link';
		}
		return 'edit-dropdown';
	}, [cardContext?.store, datasourceId, url]);

	return (
		<EditToolbarButtonPresentation
			datasourceId={datasourceId}
			currentAppearance={currentAppearance}
			editorAnalyticsApi={editorAnalyticsApi}
			editVariant={editVariant}
			editorView={editorView}
			extensionKey={extensionKey}
			onLinkEditClick={onLinkEditClick}
			intl={intl}
		/>
	);
};

const EditToolbarButtonWithDatasourceId = (
	props: EditDatasourceToolbarButtonWithDatasourceIdProps,
) => {
	const {
		currentAppearance,
		editorAnalyticsApi,
		editorView,
		intl,
		onLinkEditClick,
		datasourceId,
		node,
	} = props;
	const fetchData = useMemo(() => {
		try {
			const attrs = node.attrs as DatasourceAdf['attrs'];
			const parameters = attrs.datasource.parameters;
			const visibleColumnKeys = attrs.datasource.views[0]?.properties?.columns.map((c) => c.key);
			return { parameters, visibleColumnKeys };
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
		}
	}, [node.attrs]);

	const { extensionKey } = useFetchDatasourceDataInfo({
		datasourceId,
		parameters: fetchData?.parameters,
		visibleColumnKeys: fetchData?.visibleColumnKeys,
	});

	const editVariant = useMemo<EditVariant>(() => {
		if (!datasourceId || !isDatasourceConfigEditable(datasourceId)) {
			return 'none';
		}
		return 'edit-datasource';
	}, [datasourceId]);

	return (
		<EditToolbarButtonPresentation
			datasourceId={datasourceId}
			currentAppearance={currentAppearance}
			editorAnalyticsApi={editorAnalyticsApi}
			editVariant={editVariant}
			editorView={editorView}
			extensionKey={extensionKey}
			onLinkEditClick={onLinkEditClick}
			intl={intl}
		/>
	);
};

export const EditToolbarButton = (props: EditDatasourceToolbarButtonProps) => {
	const {
		currentAppearance,
		datasourceId,
		editorAnalyticsApi,
		editorView,
		intl,
		onLinkEditClick,
		url,
	} = props;
	const cardContext = useSmartLinkContext();

	if (props.url) {
		return (
			<EditToolbarButtonWithUrl
				datasourceId={datasourceId}
				url={props.url}
				intl={intl}
				editorAnalyticsApi={editorAnalyticsApi}
				editorView={editorView}
				cardContext={cardContext}
				onLinkEditClick={onLinkEditClick}
				currentAppearance={currentAppearance}
			/>
		);
	}
	if (props.datasourceId && props.node) {
		return (
			<EditToolbarButtonWithDatasourceId
				datasourceId={props.datasourceId}
				node={props.node}
				intl={intl}
				editorAnalyticsApi={editorAnalyticsApi}
				editorView={editorView}
				onLinkEditClick={onLinkEditClick}
				currentAppearance={currentAppearance}
			/>
		);
	}

	return (
		<EditToolbarButtonWithCardContext
			datasourceId={datasourceId}
			url={url}
			intl={intl}
			editorAnalyticsApi={editorAnalyticsApi}
			editorView={editorView}
			cardContext={cardContext}
			onLinkEditClick={onLinkEditClick}
			currentAppearance={currentAppearance}
		/>
	);
};
