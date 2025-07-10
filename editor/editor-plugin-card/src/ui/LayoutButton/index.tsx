/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import {
	type NamedPluginStatesFromInjectionAPI,
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import { getNextBreakoutMode, getTitle } from '@atlaskit/editor-common/utils';
import GrowHorizontalIcon from '@atlaskit/icon/core/migration/grow-horizontal--editor-expand';
import ShrinkHorizontalIcon from '@atlaskit/icon/core/migration/shrink-horizontal--editor-collapse';
import { DATASOURCE_DEFAULT_LAYOUT } from '@atlaskit/linking-common';
import { B300, N20A, N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type cardPlugin } from '../../cardPlugin';
import { setCardLayout } from '../../pm-plugins/actions';
import { isDatasourceNode } from '../../pm-plugins/utils';

import type { DatasourceTableLayout, LayoutButtonProps, LayoutButtonWrapperProps } from './types';
import { getDatasource, isDatasourceTableLayout } from './utils';

const toolbarButtonWrapperStyles = css({
	background: `${token('color.background.neutral', N20A)}`,
	color: `${token('color.icon', N300)}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':hover': {
		background: `${token('color.background.neutral.hovered', B300)}`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		color: `${token('color.icon', 'white')} !important`,
	},
});

export const LayoutButton = ({
	onLayoutChange,
	layout = DATASOURCE_DEFAULT_LAYOUT,
	intl: { formatMessage },
	mountPoint,
	boundariesElement,
	scrollableElement,
	targetElement,
	testId = 'datasource-table-layout-button',
}: LayoutButtonProps) => {
	const handleClick = useCallback(() => {
		onLayoutChange && onLayoutChange(getNextBreakoutMode(layout));
	}, [layout, onLayoutChange]);

	const title = useMemo(() => {
		return formatMessage(getTitle(layout));
	}, [formatMessage, layout]);

	if (!targetElement) {
		return null;
	}

	return (
		<Popup
			mountTo={mountPoint}
			boundariesElement={boundariesElement}
			scrollableElement={scrollableElement}
			target={targetElement}
			alignY="start"
			alignX="end"
			forcePlacement={true}
			stick={true}
			ariaLabel={title}
		>
			<ToolbarButton
				testId={testId}
				css={toolbarButtonWrapperStyles}
				title={title}
				onClick={handleClick}
				iconBefore={
					layout === 'full-width' ? (
						<ShrinkHorizontalIcon label={title} />
					) : (
						<GrowHorizontalIcon label={title} />
					)
				}
			/>
		</Popup>
	);
};

const selector = (
	states: NamedPluginStatesFromInjectionAPI<ExtractInjectionAPI<typeof cardPlugin>, 'card'>,
) => {
	return {
		layout: states.cardState?.layout,
		datasourceTableRef: states.cardState?.datasourceTableRef,
	};
};

const useSharedState = sharedPluginStateHookMigratorFactory(
	(pluginInjectionApi: ExtractInjectionAPI<typeof cardPlugin> | undefined) => {
		return useSharedPluginStateWithSelector(pluginInjectionApi, ['card'], selector);
	},
	(pluginInjectionApi: ExtractInjectionAPI<typeof cardPlugin> | undefined) => {
		const { cardState } = useSharedPluginState(pluginInjectionApi, ['card']);
		return {
			layout: cardState?.layout,
			datasourceTableRef: cardState?.datasourceTableRef,
		};
	},
);

const LayoutButtonWrapper = ({
	editorView,
	mountPoint,
	scrollableElement,
	boundariesElement,
	intl,
	api,
}: LayoutButtonWrapperProps & WrappedComponentProps) => {
	const { node, pos } = getDatasource(editorView);
	const { layout = node?.attrs?.layout || undefined, datasourceTableRef } = useSharedState(api);
	const isDatasource = isDatasourceNode(node);

	if (!isDatasource) {
		return null;
	}

	const onLayoutChange = (layout: DatasourceTableLayout) => {
		if (pos === undefined) {
			return;
		}

		const { state, dispatch } = editorView;
		// If the button does not re-render due to no card state change, node reference will be stale
		const datasourceNode = getDatasource(editorView).node ?? node;

		const tr = state.tr.setNodeMarkup(pos, undefined, {
			...datasourceNode?.attrs,
			layout,
		});

		tr.setMeta('scrollIntoView', false);

		dispatch(setCardLayout(layout)(tr));
	};

	return (
		<LayoutButton
			mountPoint={mountPoint}
			scrollableElement={scrollableElement}
			boundariesElement={boundariesElement}
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			targetElement={datasourceTableRef!}
			layout={isDatasourceTableLayout(layout) ? layout : undefined}
			onLayoutChange={onLayoutChange}
			intl={intl}
		/>
	);
};

export default injectIntl(LayoutButtonWrapper);
