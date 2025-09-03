// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import {
	akEditorDeleteIconColor,
	akEditorFullPageNarrowBreakout,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

/*
  Styles in this file are based on
  packages/editor/editor-core/src/plugins/media/styles.ts
*/
export const resizerItemClassName = 'resizer-item';
export const resizerHoverZoneClassName = 'resizer-hover-zone';
export const resizerExtendedZone = 'resizer-is-extended';

export const resizerHandleClassName = 'resizer-handle';
export const resizerHandleTrackClassName = `${resizerHandleClassName}-track`;
export const resizerHandleThumbClassName = `${resizerHandleClassName}-thumb`;
export const resizerDangerClassName = `${resizerHandleClassName}-danger`;

// akEditorSelectedNodeClassName from '@atlaskit/editor-shared-styles';
const akEditorSelectedNodeClassName = 'ak-editor-selected-node';

export const handleWrapperClass = 'resizer-handle-wrapper';

export const resizerHandleThumbWidth = 3;
export const resizerHandleZIndex = 1;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766, Seems perfectly safe to autofix, but comments would be lost…
export const resizerStyles: SerializedStyles = css`
	.${resizerItemClassName} {
		will-change: width;

		&:hover,
		&.display-handle {
			& > .${handleWrapperClass} > .${resizerHandleClassName} {
				visibility: visible;
				opacity: 1;
			}
		}

		&.is-resizing {
			& .${resizerHandleThumbClassName} {
				background: ${token('color.border.focused')};
			}
		}

		&.${resizerDangerClassName} {
			& .${resizerHandleThumbClassName} {
				transition: none;
				background: ${token('color.icon.danger', akEditorDeleteIconColor)};
			}
		}
	}

	.${resizerHandleClassName} {
		display: flex;
		visibility: hidden;
		opacity: 0;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 7px;
		transition:
			visibility 0.2s,
			opacity 0.2s;

		/*
      NOTE: The below style is targeted at the div element added by the tooltip. We don't have any means of injecting styles
      into the tooltip
    */
		& div[role='presentation'] {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-top: ${token('space.negative.200', '-16px')};
			white-space: normal;
		}

		/*
      Handle Positions
    */
		&.left {
			align-items: flex-start;
		}
		&.right {
			align-items: flex-end;
		}

		/*
      Handle Sizing
    */
		&.small {
			& .${resizerHandleThumbClassName} {
				height: 43px;
			}
		}
		&.medium {
			& .${resizerHandleThumbClassName} {
				height: 64px;
			}
		}
		&.large {
			& .${resizerHandleThumbClassName} {
				height: 96px;
			}
		}
		&.clamped {
			& .${resizerHandleThumbClassName} {
				height: clamp(43px, calc(100% - 32px), 96px);
			}
		}

		/*
      Handle Alignment
    */
		&.sticky {
			& .${resizerHandleThumbClassName} {
				position: sticky;
				top: ${token('space.150', '12px')};
				bottom: ${token('space.150', '12px')};
			}
		}

		&:hover {
			& .${resizerHandleThumbClassName} {
				background: ${token('color.border.focused')};
			}

			& .${resizerHandleTrackClassName} {
				visibility: visible;
				opacity: 0.5;
			}
		}
	}

	.${resizerHandleThumbClassName} {
		content: ' ';
		display: flex;
		width: 3px;
		margin: 0 ${token('space.025', '2px')};
		height: 64px;
		transition: background-color 0.2s;
		border-radius: 6px;
		border: 0;
		padding: 0;
		z-index: 2;
		outline: none;
		min-height: 24px;
		background: ${token('color.border')};

		&:hover {
			cursor: col-resize;
		}

		&:focus {
			background: ${token('color.border.selected', '#0C66E4')};

			&::after {
				content: '';
				position: absolute;
				top: ${token('space.negative.050', '-4px')};
				right: ${token('space.negative.050', '-4px')};
				bottom: ${token('space.negative.050', '-4px')};
				left: ${token('space.negative.050', '-4px')};
				border: 2px solid ${token('color.border.focused', '#388BFF')};
				border-radius: inherit;
				z-index: -1;
			}
		}
	}

	.${resizerHandleTrackClassName} {
		visibility: hidden;
		position: absolute;
		width: 7px;
		height: calc(100% - 40px);
		border-radius: 4px;
		opacity: 0;
		transition:
			background-color 0.2s,
			visibility 0.2s,
			opacity 0.2s;

		&.none {
			background: none;
		}

		&.shadow {
			background: ${token('color.background.selected')};
		}

		&.full-height {
			background: ${token('color.background.selected')};
			height: 100%;
			min-height: 36px;
		}
	}

	.${akEditorSelectedNodeClassName} {
		& .${resizerHandleThumbClassName} {
			background: ${token('color.border.focused')};
		}
	}

	.${resizerHoverZoneClassName} {
		position: relative;
		display: inline-block;
		width: 100%;

		&.${resizerExtendedZone} {
			padding: 0 ${token('space.150', '12px')};
			left: ${token('space.negative.150', '-12px')};
		}
	}

	/* This below style is here to make sure the image width is correct when nested in a table */
	table .${resizerHoverZoneClassName}, table .${resizerHoverZoneClassName}.${resizerExtendedZone} {
		padding: unset;
		left: unset;
	}
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const pragmaticResizerStylesForTooltip = () => {
	if (
		expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true) &&
		fg('platform_editor_breakout_resizing_hello_release')
	) {
		return css({
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.pm-breakout-resize-handle-rail-wrapper': {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',

				height: '100%',

				cursor: 'col-resize',

				borderRadius: 4,
				zIndex: 2,

				// Tootip element
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[role="presentation"]': {
					height: '100%',
					width: '100%',
				},

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.pm-breakout-resize-handle-rail-inside-tooltip': {
					height: '100%',
				},
			},
		});
	}
};

export const pragmaticStylesLayoutFirstNodeResizeHandleFix = () => {
	if (
		editorExperiment('advanced_layouts', true) &&
		expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true) &&
		fg('platform_editor_breakout_resizing_hello_release')
	) {
		return css({
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.fabric-editor-breakout-mark': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&:has([data-prosemirror-node-name="layoutSection"].first-node-in-document)': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'> .pm-breakout-resize-handle-container': {
						height: 'calc(100% - 8px)',
					},
				},
			},
		});
	}
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const pragmaticResizerStyles = () => {
	if (!expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true)) {
		return;
	}

	// styles needed to be duplicated
	if (fg('platform_editor_breakout_resizing_hello_release')) {
		return css({
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.fabric-editor-breakout-mark': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&:has([data-prosemirror-node-name="codeBlock"])': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'> .pm-breakout-resize-handle-container--left': {
						left: '-5px',
					},
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'> .pm-breakout-resize-handle-container--right': {
						right: '-5px',
					},
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'> .pm-breakout-resize-handle-container': {
						height: 'calc(100% - 12px)',
					},
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&:has([data-prosemirror-node-name="expand"]), &:has([data-prosemirror-node-name="layoutSection"])':
					{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
						'> .pm-breakout-resize-handle-container--left': {
							left: '-25px',
						},
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
						'> .pm-breakout-resize-handle-container--right': {
							right: '-25px',
						},
					},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&:has([data-prosemirror-node-name="expand"])': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'> .pm-breakout-resize-handle-container': {
						height: 'calc(100% - 4px)',
					},
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&:has([data-prosemirror-node-name="layoutSection"])': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'> .pm-breakout-resize-handle-container': {
						height: 'calc(100% - 8px)',
					},
				},

				// the first node in the document always has margin-top = 0
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&:has(.first-node-in-document)': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'> .pm-breakout-resize-handle-container': {
						height: '100%',
					},
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.pm-breakout-resize-handle-container': {
				position: 'relative',
				alignSelf: 'end',
				gridRow: 1,
				gridColumn: 1,
				height: '100%',
				width: 7,
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.pm-breakout-resize-handle-container--left': {
				justifySelf: 'start',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.pm-breakout-resize-handle-container--right': {
				justifySelf: 'end',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.pm-breakout-resize-handle-rail': {
				position: 'relative',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',

				height: '100%',

				cursor: 'col-resize',

				borderRadius: 4,
				transition: 'background-color 0.2s, visibility 0.2s, opacity 0.2s',
				zIndex: 2,

				opacity: 0,

				'&:hover': {
					background: token('color.background.selected'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'.pm-breakout-resize-handle-thumb': {
						background: token('color.border.focused'),
					},
				},
			},
			// same as 'hover' styles above
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.pm-breakout-resize-handle-container--active': {
				background: token('color.background.selected'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.pm-breakout-resize-handle-thumb': {
					background: token('color.border.focused'),
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.pm-breakout-resize-handle-hit-box': {
				position: 'absolute',
				top: 0,
				bottom: 0,
				left: -20,
				right: -20,
				zIndex: 0,
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.pm-breakout-resize-handle-thumb': {
				minWidth: resizerHandleThumbWidth,
				// copied from resizeStyles.clamped
				height: 'clamp(27px, calc(100% - 32px), 96px)',
				background: token('color.border'),
				borderRadius: 6,

				// sticky styles
				position: 'sticky',
				top: token('space.150', '12px'),
				bottom: token('space.150', '12px'),
			},
		});
	}

	return css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.fabric-editor-breakout-mark': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:has([data-prosemirror-node-name="codeBlock"])': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'> .pm-breakout-resize-handle-container--left': {
					left: '-12px',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'> .pm-breakout-resize-handle-container--right': {
					right: '-12px',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'> .pm-breakout-resize-handle-container': {
					height: 'calc(100% - 12px)',
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:has([data-prosemirror-node-name="expand"]), &:has([data-prosemirror-node-name="layoutSection"])':
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'> .pm-breakout-resize-handle-container--left': {
						left: '-32px',
					},
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'> .pm-breakout-resize-handle-container--right': {
						right: '-32px',
					},
				},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:has([data-prosemirror-node-name="expand"])': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'> .pm-breakout-resize-handle-container': {
					height: 'calc(100% - 4px)',
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:has([data-prosemirror-node-name="layoutSection"])': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'> .pm-breakout-resize-handle-container': {
					height: 'calc(100% - 8px)',
				},
			},

			// the first node in the document always has margin-top = 0
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:has(.first-node-in-document)': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'> .pm-breakout-resize-handle-container': {
					height: '100%',
				},
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.pm-breakout-resize-handle-container': {
			position: 'relative',
			alignSelf: 'end',
			gridRow: 1,
			gridColumn: 1,
			height: '100%',
			width: 7,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.pm-breakout-resize-handle-container--left': {
			justifySelf: 'start',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.pm-breakout-resize-handle-container--right': {
			justifySelf: 'end',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.pm-breakout-resize-handle-rail': {
			position: 'relative',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',

			height: '100%',

			cursor: 'col-resize',

			borderRadius: 4,
			transition: 'background-color 0.2s, visibility 0.2s, opacity 0.2s',
			zIndex: 2,

			opacity: 0,

			'&:hover': {
				background: token('color.background.selected'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.pm-breakout-resize-handle-thumb': {
					background: token('color.border.focused'),
				},
			},
		},
		// same as 'hover' styles above
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.pm-breakout-resize-handle-container--active': {
			background: token('color.background.selected'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.pm-breakout-resize-handle-thumb': {
				background: token('color.border.focused'),
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.pm-breakout-resize-handle-hit-box': {
			position: 'absolute',
			top: 0,
			bottom: 0,
			left: -20,
			right: -20,
			zIndex: 0,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.pm-breakout-resize-handle-thumb': {
			minWidth: resizerHandleThumbWidth,
			// copied from resizeStyles.clamped
			height: 'clamp(27px, calc(100% - 32px), 96px)',
			background: token('color.border'),
			borderRadius: 6,

			// sticky styles
			position: 'sticky',
			top: token('space.150', '12px'),
			bottom: token('space.150', '12px'),
		},
	});
};

export const pragmaticResizerStylesWithReducedEditorGutter = () => {
	if (
		expValEqualsNoExposure('platform_editor_preview_panel_responsiveness', 'isEnabled', true) &&
		(expValEqualsNoExposure('advanced_layouts', 'isEnabled', true) ||
			expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true))
	) {
		return css({
			/* container editor-area is defined in platform/packages/editor/editor-core/src/ui/Appearance/FullPage/StyledComponents.ts */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries, @atlaskit/ui-styling-standard/no-unsafe-values,  @atlaskit/ui-styling-standard/no-imported-style-values
			[`@container editor-area (max-width: ${akEditorFullPageNarrowBreakout}px)`]: {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.fabric-editor-breakout-mark': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
					'&:has([data-prosemirror-node-name="expand"]), &:has([data-prosemirror-node-name="layoutSection"])':
						{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
							'> .pm-breakout-resize-handle-container': {
								opacity: 0,
								visibility: 'hidden',
							},
						},

					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
					'&:has([data-prosemirror-node-name="layoutSection"])': {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
						[`.${resizerItemClassName}`]: {
							willChange: 'width',

							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
							'&:hover, &.display-handle': {
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
								[`& > .${handleWrapperClass} > .${resizerHandleClassName}`]: {
									visibility: 'hidden',
									opacity: 0,
								},
							},
						},
					},
				},
			},
		});
	}
};
