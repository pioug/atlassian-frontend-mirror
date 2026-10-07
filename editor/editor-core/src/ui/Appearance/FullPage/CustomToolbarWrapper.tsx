/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

export interface ChildWrapperProps {
	'aria-label'?: string;
	children: React.ReactNode;
	'data-testid'?: string;
	role?: string;
	twoLineEditorToolbar: boolean;
}

const firstChildStyles = cssMap({
	base: {
		display: 'flex',
		flexGrow: 1,
	},
	twoLine: {
		'@media (max-width: 868px)': {
			flex: '1 1 100%',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			height: 'var(--ak-editor-fullpage-toolbar-height)',
			justifyContent: 'flex-end',
			minWidth: 'fit-content',
		},
	},
});

const secondChildStyles = cssMap({
	base: {
		minWidth: 'fit-content',
	},
	twoLine: {
		'@media (max-width: 868px)': {
			display: 'flex',
			flex: '1 1 100%',
			flexGrow: 1,
			margin: 'auto',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			height: 'var(--ak-editor-fullpage-toolbar-height)',
			minWidth: 0,
		},
	},
});

// ---------------- First child wrapper ----------------
export const MainToolbarForFirstChildWrapper = ({
	twoLineEditorToolbar,
	children,
	role,
	'aria-label': ariaLabel,
	'data-testid': testId,
}: ChildWrapperProps): React.JSX.Element => (
	<div
		css={[firstChildStyles.base, twoLineEditorToolbar && firstChildStyles.twoLine]}
		role={role}
		aria-label={ariaLabel}
		data-testid={testId}
	>
		{children}
	</div>
);

// ---------------- Second child wrapper ----------------
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const MainToolbarForSecondChildWrapper = ({
	twoLineEditorToolbar,
	children,
	role,
	'aria-label': ariaLabel,
	'data-testid': testId,
}: ChildWrapperProps): React.JSX.Element => (
	<div
		css={[secondChildStyles.base, twoLineEditorToolbar && secondChildStyles.twoLine]}
		role={role}
		aria-label={ariaLabel}
		data-testid={testId}
	>
		{children}
	</div>
);
