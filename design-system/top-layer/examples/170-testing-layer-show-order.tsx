/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type ReactNode, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import noop from '@atlaskit/ds-lib/noop';
import { token } from '@atlaskit/tokens';
import { Dialog } from '@atlaskit/top-layer/dialog-content';
import { Popover } from '@atlaskit/top-layer/popover/popover';

const styles = cssMap({
	// Fixed and centered on the viewport, so the layers overlap wherever the browser puts their hosts.
	content: {
		position: 'fixed',
		insetBlockStart: '50%',
		insetInlineStart: '50%',
		translate: '-50% -50%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.100'),
		boxSizing: 'border-box',
		borderWidth: token('border.width.selected'),
		borderStyle: 'solid',
		borderColor: token('color.border.bold'),
		color: token('color.text'),
		font: token('font.body'),
	},
});

// Each level is smaller than its parent, so a covered layer is easy to see.
const levelStyles = cssMap({
	level0: {
		inlineSize: '440px',
		blockSize: '320px',
		backgroundColor: token('color.background.accent.blue.subtler'),
	},
	level1: {
		inlineSize: '320px',
		blockSize: '220px',
		backgroundColor: token('color.background.accent.green.subtler'),
	},
	level2: {
		inlineSize: '200px',
		blockSize: '120px',
		backgroundColor: token('color.background.accent.yellow.subtler'),
	},
});

/**
 * `popover` is a manual popover. `auto-popover` uses the default `auto` mode (as `Popup` and
 * `DropdownMenu` do): showing an `auto` popover or a modal dialog hides every open `auto` popover
 * that is not its ancestor.
 */
export type TLayerKind = 'dialog' | 'popover' | 'auto-popover';

export type TScenario =
	| 'dialog-dialog'
	| 'dialog-popover'
	| 'popover-popover'
	| 'popover-dialog'
	| 'dialog-popover-dialog'
	| 'popover-dialog-popover'
	| 'dialog-auto-popover'
	| 'auto-popover-auto-popover';

/**
 * Every layer is open in the same commit as its parent, nested in the React tree.
 *
 * These test the show order, a defensive fix for React's effect order. They are not a pattern to
 * copy: do not design nested layers to open in the same commit.
 */
export const scenarios: Readonly<Record<TScenario, readonly TLayerKind[]>> = {
	'dialog-dialog': ['dialog', 'dialog'],
	'dialog-popover': ['dialog', 'popover'],
	'popover-popover': ['popover', 'popover'],
	'popover-dialog': ['popover', 'dialog'],
	'dialog-popover-dialog': ['dialog', 'popover', 'dialog'],
	'popover-dialog-popover': ['popover', 'dialog', 'popover'],
	'dialog-auto-popover': ['dialog', 'auto-popover'],
	'auto-popover-auto-popover': ['auto-popover', 'auto-popover'],
};

function Layer({
	kinds,
	level,
	isOpen,
}: {
	kinds: readonly TLayerKind[];
	level: number;
	isOpen: boolean;
}): ReactNode {
	const kind = kinds[level];
	const label = `Layer ${level} (${kind})`;
	const content = (
		<div
			css={[
				styles.content,
				level === 0 && levelStyles.level0,
				level === 1 && levelStyles.level1,
				level === 2 && levelStyles.level2,
			]}
			data-testid={`layer-${level}`}
		>
			<span>{label}</span>
			<button type="button" data-testid={`button-${level}`}>
				Button {level}
			</button>
			{level + 1 < kinds.length && <Layer kinds={kinds} level={level + 1} isOpen={isOpen} />}
		</div>
	);

	if (kind === 'dialog') {
		return (
			<Dialog isOpen={isOpen} onClose={noop} label={label} testId={`host-${level}`}>
				{content}
			</Dialog>
		);
	}
	return (
		<Popover
			isOpen={isOpen}
			mode={kind === 'auto-popover' ? 'auto' : 'manual'}
			role="dialog"
			label={label}
			testId={`host-${level}`}
		>
			{content}
		</Popover>
	);
}

/**
 * Nested layers that all follow `isOpen`.
 */
export function LayerTree({
	kinds,
	isOpen,
}: {
	kinds: readonly TLayerKind[];
	isOpen: boolean;
}): ReactNode {
	return <Layer kinds={kinds} level={0} isOpen={isOpen} />;
}

type TState = { scenario: TScenario; isOpen: boolean } | null;

/**
 * `mount-<scenario>` renders the layers open at once (they mount open in one commit).
 * `prepare-<scenario>` renders them closed, then `open-all` opens them in one update.
 */
export default function TestingLayerShowOrder(): ReactNode {
	const [state, setState] = useState<TState>(null);
	const names = Object.keys(scenarios) as TScenario[];

	return (
		<Fragment>
			<button
				type="button"
				data-testid="open-all"
				onClick={() => setState((current) => current && { ...current, isOpen: true })}
			>
				Open all
			</button>
			{names.map((name) => (
				<div key={name}>
					<button
						type="button"
						data-testid={`mount-${name}`}
						onClick={() => setState({ scenario: name, isOpen: true })}
					>
						Mount {name}
					</button>
					<button
						type="button"
						data-testid={`prepare-${name}`}
						onClick={() => setState({ scenario: name, isOpen: false })}
					>
						Prepare {name}
					</button>
				</div>
			))}
			{state && <LayerTree kinds={scenarios[state.scenario]} isOpen={state.isOpen} />}
		</Fragment>
	);
}
