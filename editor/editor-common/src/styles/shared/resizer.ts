// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { akEditorDeleteIconColor } from '@atlaskit/editor-shared-styles';
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
