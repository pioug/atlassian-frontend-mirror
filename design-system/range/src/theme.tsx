import { B200, B300, B400, N30, N40, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const transitionDuration = '0.2s';

export const input: {
    height: number;
} = {
	height: 40,
};

export const thumb: {
    readonly size: 16;
    readonly borderWidth: 2;
    readonly background: {
        readonly default: "var(--ds-background-neutral-bold)";
        readonly hovered: "var(--ds-background-neutral-bold-hovered)";
        readonly pressed: "var(--ds-background-neutral-bold-pressed)";
    };
    readonly borderColor: {
        readonly default: "transparent";
        readonly focused: "var(--ds-border-focused)";
    };
    readonly boxShadow: {
        readonly default: "var(--ds-UNSAFE-transparent)";
        readonly disabled: "var(--ds-shadow-raised)";
    };
} = {
	size: 16,
	borderWidth: 2,
	background: {
		default: token('color.background.neutral.bold', B400),
		hovered: token('color.background.neutral.bold.hovered', B300),
		pressed: token('color.background.neutral.bold.pressed', B200),
	},
	borderColor: {
		default: 'transparent',
		focused: token('color.border.focused', B200),
	},
	boxShadow: {
		default: token('utility.UNSAFE.transparent', `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`),
		disabled: token('elevation.shadow.raised', `0 0 1px ${N60A}`),
	},
} as const;

export const track: {
    readonly height: 4;
    /**
     * borderRadius >= height / 2 to create a pill shape.
     * Using '50%' creates an ellipse.
     */
    readonly borderRadius: 2;
    readonly background: {
        readonly default: "var(--ds-background-neutral)";
        readonly hovered: "var(--ds-background-neutral-hovered)";
    };
    readonly foreground: {
        readonly default: "var(--ds-background-neutral-bold)";
        readonly hovered: "var(--ds-background-neutral-bold-hovered)";
    };
} = {
	height: 4,
	/**
	 * borderRadius >= height / 2 to create a pill shape.
	 * Using '50%' creates an ellipse.
	 */
	borderRadius: 2,
	background: {
		default: token('color.background.neutral', N30),
		hovered: token('color.background.neutral.hovered', N40),
	},
	foreground: {
		default: token('color.background.neutral.bold', B400),
		hovered: token('color.background.neutral.bold.hovered', B300),
	},
} as const;
