/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { mainToolbarFirstChildStyle, mainToolbarSecondChildStyle } from './MainToolbar';

interface ChildWrapperProps {
	twoLineEditorToolbar: boolean;
	children: React.ReactNode;
	role?: string;
	'aria-label'?: string;
	'data-testid'?: string;
}

// Pre-computed static styles for first- and second-child wrappers.
// These contain no runtime logic and are safe for static-emotion mode.

const firstChildStaticBase = css({
	display: 'flex',
	flexGrow: 1,
});

// we can't avoid some kind of function call here, so we need to disable the rule
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const firstChildStaticTwoLine = css({
	'@media (max-width: 868px)': {
		flex: '1 1 100%',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: 'var(--ak-editor-fullpage-toolbar-height)',
		justifyContent: 'flex-end',
		minWidth: 'fit-content',
	},
});

const secondChildStaticBase = css({
	minWidth: 'fit-content',
});

// we can't avoid some kind of function call here, so we need to disable the rule
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const secondChildStaticTwoLine = css({
	'@media (max-width: 868px)': {
		display: 'flex',
		flexGrow: 1,
		flex: '1 1 100%',
		margin: 'auto',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: 'var(--ak-editor-fullpage-toolbar-height)',
		minWidth: 0,
	},
});

// ---------------- First child wrapper ----------------
const FirstChildWrapperStatic = ({
	twoLineEditorToolbar,
	children,
	role,
	'aria-label': ariaLabel,
	'data-testid': testId,
}: ChildWrapperProps) => (
	<div
		css={[firstChildStaticBase, twoLineEditorToolbar && firstChildStaticTwoLine]}
		role={role}
		aria-label={ariaLabel}
		data-testid={testId}
	>
		{children}
	</div>
);

const FirstChildWrapperDynamic = ({
	twoLineEditorToolbar,
	children,
	role,
	'aria-label': ariaLabel,
	'data-testid': testId,
}: ChildWrapperProps) => (
	<div
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/consistent-css-prop-usage
		css={mainToolbarFirstChildStyle(twoLineEditorToolbar)}
		role={role}
		aria-label={ariaLabel}
		data-testid={testId}
	>
		{children}
	</div>
);

export const MainToolbarForFirstChildWrapper = componentWithCondition(
	() => expValEquals('platform_editor_core_static_emotion_non_central', 'isEnabled', true),
	FirstChildWrapperStatic,
	FirstChildWrapperDynamic,
);

// ---------------- Second child wrapper ----------------
const SecondChildWrapperStatic = ({
	twoLineEditorToolbar,
	children,
	role,
	'aria-label': ariaLabel,
	'data-testid': testId,
}: ChildWrapperProps) => (
	<div
		css={[secondChildStaticBase, twoLineEditorToolbar && secondChildStaticTwoLine]}
		role={role}
		aria-label={ariaLabel}
		data-testid={testId}
	>
		{children}
	</div>
);

const SecondChildWrapperDynamic = ({
	twoLineEditorToolbar,
	children,
	role,
	'aria-label': ariaLabel,
	'data-testid': testId,
}: ChildWrapperProps) => (
	<div
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/consistent-css-prop-usage
		css={mainToolbarSecondChildStyle(twoLineEditorToolbar)}
		role={role}
		aria-label={ariaLabel}
		data-testid={testId}
	>
		{children}
	</div>
);

export const MainToolbarForSecondChildWrapper = componentWithCondition(
	() => expValEquals('platform_editor_core_static_emotion_non_central', 'isEnabled', true),
	SecondChildWrapperStatic,
	SecondChildWrapperDynamic,
);
