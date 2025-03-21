/* eslint-disable @atlaskit/design-system/prefer-primitives, @atlaskit/design-system/consistent-css-prop-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';

import { N40 } from '@atlaskit/theme/colors';
import React, { useState } from 'react';
import { renderExtension } from './extension';
import type { Mark as PMMark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { RendererContext } from '../types';
import type { Serializer } from '../../serializer';
import type { ExtensionLayout } from '@atlaskit/adf-schema';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { WidthConsumer, sharedMultiBodiedExtensionStyles } from '@atlaskit/editor-common/ui';
import { RendererCssClassName } from '../../consts';
import { calcBreakoutWidth } from '@atlaskit/editor-common/utils';
import { token } from '@atlaskit/tokens';
import { useMultiBodiedExtensionActions } from './multiBodiedExtension/actions';
import { useMultiBodiedExtensionContext } from './multiBodiedExtension/context';
import { fg } from '@atlaskit/platform-feature-flags';

type Props = React.PropsWithChildren<{
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	serializer: Serializer<any>;
	extensionHandlers?: ExtensionHandlers;
	rendererContext: RendererContext;
	providers: ProviderFactory;
	extensionType: string;
	extensionKey: string;
	path?: PMNode[];
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	originalContent?: any;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	parameters?: any;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	content?: any;
	layout?: ExtensionLayout;
	localId?: string;
	marks?: PMMark[];
}>;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Ignored via go/DSP-18766
const navigationStylesOld = css`
	${sharedMultiBodiedExtensionStyles.mbeNavigation};
	margin-left: 0 !important;
	margin-right: 0 !important;
	.mbe-add-tab-button,
	.mbe-remove-tab {
		display: none;
	}
`;

// localized sharedMultiBodiedExtensionStyles.mbeNavigation in navigationCssExtendedNew
const navigationStylesNew = css({
	borderTopLeftRadius: token('border.radius', '3px'),
	borderTopRightRadius: token('border.radius', '3px'),
	userSelect: 'none',
	WebkitUserModify: 'read-only',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
	borderBottom: 'none !important',
	background: token('elevation.surface', 'white'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.remove-margins': {
		margin: token('space.negative.100', '-8px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.remove-border': {
		border: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
	marginLeft: '0 !important',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
	marginRight: '0 !important',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.mbe-add-tab-button, .mbe-remove-tab': {
		display: 'none',
	},
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
const containerStylesOld = css`
	${sharedMultiBodiedExtensionStyles.mbeExtensionContainer};
	.ak-renderer-extension {
		margin-top: 0 !important;
	}

	[data-layout='full-width'],
	[data-layout='wide'] {
		.multiBodiedExtension-navigation {
			border-right: 3px solid ${token('color.border', N40)} !important;
		}
	}
`;

// localized sharedMultiBodiedExtensionStyles.mbeExtensionContainer in containerStylesNew
// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
const containerStylesNew = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
	background: 'transparent !important',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'padding:': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		left: `${token('space.100', '8px')} !important`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		right: `${token('space.100', '8px')} !important`,
	},
	paddingBottom: token('space.100', '8px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.remove-padding': {
		paddingBottom: 0,
	},
	position: 'relative',
	verticalAlign: 'middle',
	cursor: 'pointer',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.multiBodiedExtension-handler-result': {
		marginLeft: token('space.100', '8px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	".multiBodiedExtension-content-dom-wrapper > [data-extension-frame='true'], .multiBodiedExtension--frames > [data-extension-frame='true']":
		{
			display: 'none',
			background: 'transparent',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.multiBodiedExtension-content-dom-wrapper, .multiBodiedExtension--frames': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		"[data-extension-frame='true'] > :not(style):first-child, [data-extension-frame='true'] > style:first-child + *":
			{
				marginTop: 0,
			},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-renderer-extension': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		marginTop: '0 !important',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-layout="full-width"], [data-layout="wide"]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.multiBodiedExtension-navigation': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			borderRight: `3px solid ${token('color.border', N40)} !important`,
		},
	},
});

const MultiBodiedExtensionChildrenContainer = ({ children }: React.PropsWithChildren) => {
	return (
		<article
			data-testid="multiBodiedExtension--frames"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={`multiBodiedExtension--frames`}
		>
			{children}
		</article>
	);
};

const MultiBodiedExtensionNavigation = ({ children }: React.PropsWithChildren) => {
	return (
		<nav
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="multiBodiedExtension-navigation"
			css={
				fg('platform_editor_emotion_refactor_renderer') ? navigationStylesNew : navigationStylesOld
			}
			data-testid="multiBodiedExtension-navigation"
		>
			{children}
		</nav>
	);
};

const MultiBodiedExtensionWrapper = ({
	width,
	path,
	layout,
	children,
}: React.PropsWithChildren<{
	width: number;
	path: PMNode[];
	layout: ExtensionLayout;
}>) => {
	const isTopLevel = path.length < 1;
	const centerAlignClass =
		isTopLevel && ['wide', 'full-width'].includes(layout)
			? RendererCssClassName.EXTENSION_CENTER_ALIGN
			: '';

	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={`${RendererCssClassName.EXTENSION} ${centerAlignClass} ${RendererCssClassName.EXTENSION_OVERFLOW_CONTAINER}`}
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				width: isTopLevel ? calcBreakoutWidth(layout, width) : '100%',
			}}
			data-layout={layout}
			data-testid="multiBodiedExtension--wrapper"
		>
			{children}
		</div>
	);
};

const MultiBodiedExtension = (props: Props) => {
	const {
		children,
		layout = 'default',
		path = [],
		parameters,
		extensionType,
		extensionKey,
		content,
		marks,
		localId,
	} = props;
	const [activeChildIndex, setActiveChildIndex] = useState<number>(0);
	const { loading, extensionContext } = useMultiBodiedExtensionContext({
		extensionType,
		extensionKey,
	});

	const actions = useMultiBodiedExtensionActions({
		updateActiveChild: setActiveChildIndex,
		children,
		childrenContainer: (
			<MultiBodiedExtensionChildrenContainer>{children}</MultiBodiedExtensionChildrenContainer>
		),
		allowBodiedOverride: extensionContext?.privateProps?.__allowBodiedOverride,
	});

	const renderContent = React.useCallback((): React.ReactNode => {
		if (loading || !extensionContext) {
			return null;
		}

		const { NodeRenderer, privateProps } = extensionContext;

		const fragmentLocalId = marks?.find((m) => m.type.name === 'fragment')?.attrs?.localId;

		const node = {
			type: 'multiBodiedExtension',
			extensionKey,
			extensionType,
			parameters,
			content,
			localId,
			fragmentLocalId,
		};

		const renderMultiBodiedExtension = () => {
			const MultiBodiedExtensionNodeRenderer = <NodeRenderer node={node} actions={actions} />;
			try {
				if (React.isValidElement(MultiBodiedExtensionNodeRenderer)) {
					// Return the content directly if it's a valid JSX.Element
					return renderExtension(MultiBodiedExtensionNodeRenderer, layout, {
						isTopLevel: path.length < 1,
					});
				}
			} catch (e) {
				/** We don't want this error to block renderer */
				/** We keep rendering the default content */
			}

			// Always return default content if anything goes wrong
			return renderExtension(children, layout, {
				isTopLevel: path.length < 1,
			});
		};

		if (privateProps.__allowBodiedOverride) {
			return renderMultiBodiedExtension();
		} else {
			return (
				<>
					<MultiBodiedExtensionNavigation>
						{renderMultiBodiedExtension()}
					</MultiBodiedExtensionNavigation>
					<MultiBodiedExtensionChildrenContainer>{children}</MultiBodiedExtensionChildrenContainer>
				</>
			);
		}
	}, [
		loading,
		extensionContext,
		layout,
		path,
		marks,
		extensionKey,
		extensionType,
		parameters,
		content,
		localId,
		actions,
		children,
	]);

	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
	const containerActiveFrameStyles = css`
		.multiBodiedExtension--frames
			> [data-extension-frame='true']:nth-of-type(${activeChildIndex + 1}) {
			display: block;
			margin-left: 0;
			margin-right: 0;
		}
	`;

	return (
		<section
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="multiBodiedExtension--container"
			css={[
				fg('platform_editor_emotion_refactor_renderer') ? containerStylesNew : containerStylesOld,
				containerActiveFrameStyles,
			]}
			data-testid="multiBodiedExtension--container"
			data-active-child-index={activeChildIndex}
			data-layout={layout}
		>
			<WidthConsumer>
				{({ width }) => (
					<MultiBodiedExtensionWrapper layout={layout} width={width} path={path}>
						{renderContent()}
					</MultiBodiedExtensionWrapper>
				)}
			</WidthConsumer>
		</section>
	);
};

export default MultiBodiedExtension;
