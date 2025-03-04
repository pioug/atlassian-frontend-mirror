import { createIntl } from 'react-intl-next';

import { status } from '@atlaskit/adf-schema';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

const isSSR = Boolean(process.env.REACT_SSR);
let intl: ReturnType<typeof createIntl> | undefined;

// copied from packages/elements/status/src/components/Status.tsx
const colorToLozengeAppearanceMap: Record<string, string> = {
	neutral: 'default',
	purple: 'new',
	blue: 'inprogress',
	red: 'removed',
	yellow: 'moved',
	green: 'success',
};

const lozengeAppearanceToBgColorMap: Record<string, Record<string, string>> = {
	bold: {
		default: '#DDDEE1',
		inprogress: '#8FB8F6',
		moved: '#F9C84E',
		new: '#D8A0F7',
		removed: '#FD9891',
		success: '#B3DF72',
	},
	subtle: {
		default: token('color.background.neutral.subtle'),
		inprogress: token('color.background.neutral.subtle'),
		moved: token('color.background.neutral.subtle'),
		new: token('color.background.neutral.subtle'),
		removed: token('color.background.neutral.subtle'),
		success: token('color.background.neutral.subtle'),
	},
};

const borderStyleMap: Record<string, Record<string, string>> = {
	subtle: {
		default: `1px solid #B7B9BE`,
		inprogress: `1px solid #669DF1`,
		moved: `1px solid #FCA700`,
		new: `1px solid #C97CF4`,
		removed: `1px solid #F87168`,
		success: `1px solid #94C748`,
	},
};
const backgroundColorsOld: Record<'bold' | 'subtle', Record<string, string>> = {
	bold: {
		default: token('color.background.neutral.bold'),
		inprogress: token('color.background.information.bold'),
		moved: token('color.background.warning.bold'),
		new: token('color.background.discovery.bold'),
		removed: token('color.background.danger.bold'),
		success: token('color.background.success.bold'),
	},
	subtle: {
		default: token('color.background.neutral'),
		inprogress: token('color.background.information'),
		moved: token('color.background.warning'),
		new: token('color.background.discovery'),
		removed: token('color.background.danger'),
		success: token('color.background.success'),
	},
};

const textColorsOld: Record<'bold' | 'subtle', Record<string, string>> = {
	bold: {
		default: token('color.text.inverse'),
		inprogress: token('color.text.inverse'),
		moved: token('color.text.warning.inverse'),
		new: token('color.text.inverse'),
		removed: token('color.text.inverse'),
		success: token('color.text.inverse'),
	},
	subtle: {
		default: token('color.text.subtle'),
		inprogress: token('color.text.information'),
		moved: token('color.text.warning'),
		new: token('color.text.discovery'),
		removed: token('color.text.danger'),
		success: token('color.text.success'),
	},
};

const DEFAULT_APPEARANCE = 'default';

// eg. Version/4.0 Chrome/95.0.4638.50
const isAndroidChromium =
	typeof window !== 'undefined' && /Version\/.* Chrome\/.*/u.test(window.navigator.userAgent);

/**
 * Wrapper for ADF status node spec to augment toDOM implementation
 * with fallback UI for lazy node view rendering / window virtualization
 * @returns
 */
export const statusNodeSpec = () => {
	if (isSSR || editorExperiment("platform_editor_inline_node_virtualization", "off")) {
		return status;
	}

	return {
		...status,
		toDOM: (node: PMNode): DOMOutputSpec => {
			const { text, color, style } = node.attrs;
			intl = intl || createIntl({ locale: document.documentElement.lang || 'en-US' });
			const isComponentVisualRefresh = fg('platform-component-visual-refresh');

			const editorNodeWrapperAttrs = {
				'data-testid': 'statusContainerView',
				style: convertToInlineCss(text ? { opacity: 1 } : { opacity: 0.5 }),
			};

			// packages/elements/status/src/components/Status.tsx
			const appearance = colorToLozengeAppearanceMap[color as string] || DEFAULT_APPEARANCE;
			const statusElementAttrs = {
				style: convertToInlineCss(
					isAndroidChromium
						? {
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
								display: 'inline-block !important',
								verticalAlign: 'middle',
							}
						: {},
				),
				class: 'status-lozenge-span',
				'aria-busy': 'true',
				'data-node-type': 'status',
				'data-color': color,
				'data-style': style,
			};

			// packages/design-system/lozenge/src/Lozenge/index.tsx
			const appearanceStyle = isComponentVisualRefresh ? 'bold' : 'subtle';
			const appearanceType =
				appearance in lozengeAppearanceToBgColorMap[appearanceStyle] ? appearance : 'default';

			const lozengeWrapperAttrs = {
				style: convertToInlineCss({
					maxWidth: `calc(200px - ${token('space.100', '8px')})`,
					// container
					display: 'inline-flex',
					boxSizing: 'border-box',
					position: 'static',
					blockSize: 'min-content',
					borderRadius: '3px',
					overflow: 'hidden',
					paddingInline: token('space.050'),
					// background
					backgroundColor:
						style?.backgroundColor ??
						lozengeAppearanceToBgColorMap[appearanceStyle][appearanceType],
					// border
					...(appearanceStyle === 'subtle'
						? fg('visual-refresh_drop_5')
							? {
									outline: borderStyleMap[appearanceStyle][appearanceType],
									outlineOffset: -1,
								}
							: { border: borderStyleMap[appearanceStyle][appearanceType] }
						: {}),
				}),
			};

			const lozengeTextAttrs = {
				style: convertToInlineCss({
					color: appearanceStyle === 'subtle' ? token('color.text') : '#292A2E',
					maxWidth: '100%',
					font: token('font.body.small'),
					fontWeight: token('font.weight.bold'),
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					textTransform: token(
						'utility.UNSAFE.textTransformUppercase',
					) as React.CSSProperties['textTransform'],
					whiteSpace: 'nowrap',
				}),
			};

			if (isComponentVisualRefresh) {
				return [
					'span',
					editorNodeWrapperAttrs,
					[
						'span',
						statusElementAttrs,
						['span', lozengeWrapperAttrs, ['span', lozengeTextAttrs, text]],
					],
				];
			} else {
				// packages/design-system/lozenge/src/Lozenge/index.tsx
				const appearanceTypeOld =
					appearance in backgroundColorsOld[appearanceStyle] ? appearance : 'default';
				const legacyLozengeBoxAttrs = {
					style: convertToInlineCss({
						backgroundColor: backgroundColorsOld[appearanceStyle][appearanceTypeOld],
						maxWidth: '100%',
						paddingInline: token('space.050'),
						display: 'inline-flex',
						borderRadius: token('border.radius'),
						blockSize: 'min-content',
						position: 'static',
						overflow: 'hidden',
						boxSizing: 'border-box',
						appearance: 'none',
						border: 'none',
					}),
				};

				const legacyLozengeTextAttrs = {
					style: convertToInlineCss({
						font: token('font.body.small'),
						fontFamily: token('font.family.body'),
						fontWeight: token('font.weight.bold'),
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						textTransform: token(
							'utility.UNSAFE.textTransformUppercase',
						) as React.CSSProperties['textTransform'],
						whiteSpace: 'nowrap',
						color: style?.color ?? textColorsOld[appearanceStyle][appearanceTypeOld],
						maxWidth: '100%',
					}),
				};

				return [
					'span',
					editorNodeWrapperAttrs,
					[
						'span',
						statusElementAttrs,
						['span', legacyLozengeBoxAttrs, ['span', legacyLozengeTextAttrs, text]],
					],
				];
			}
		},
	};
};
