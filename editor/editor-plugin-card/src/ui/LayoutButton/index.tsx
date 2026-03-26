/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo } from 'react';
import type { ComponentType, FC } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, jsx } from '@emotion/react';
import type { WithIntlProps, WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { NamedPluginStatesFromInjectionAPI } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import { getNextBreakoutMode, getTitle } from '@atlaskit/editor-common/utils';
import GrowHorizontalIcon from '@atlaskit/icon/core/grow-horizontal';
import ShrinkHorizontalIcon from '@atlaskit/icon/core/shrink-horizontal';
import { DATASOURCE_DEFAULT_LAYOUT } from '@atlaskit/linking-common';
import { token } from '@atlaskit/tokens';

import type { cardPlugin } from '../../cardPlugin';
import { setCardLayout } from '../../pm-plugins/actions';
import { isDatasourceNode } from '../../pm-plugins/utils';

import type { DatasourceTableLayout, LayoutButtonProps, LayoutButtonWrapperProps } from './types';
import { getDatasource, isDatasourceTableLayout } from './utils';

const toolbarButtonWrapperStyles = css({
	background: `${token('color.background.neutral')}`,
	color: `${token('color.icon')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':hover': {
		background: `${token('color.background.neutral.hovered')}`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		color: `${token('color.icon')} !important`,
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
}: LayoutButtonProps): jsx.JSX.Element | null => {
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

const LayoutButtonWrapper = ({
	editorView,
	mountPoint,
	scrollableElement,
	boundariesElement,
	intl,
	api,
}: LayoutButtonWrapperProps & WrappedComponentProps) => {
	const { node, pos } = getDatasource(editorView);
	const { layout = node?.attrs?.layout || undefined, datasourceTableRef } =
		useSharedPluginStateWithSelector(api, ['card'], selector);
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

const _default_1: FC<WithIntlProps<LayoutButtonWrapperProps & WrappedComponentProps>> & {
	WrappedComponent: ComponentType<LayoutButtonWrapperProps & WrappedComponentProps>;
} = injectIntl(LayoutButtonWrapper);
export default _default_1;
