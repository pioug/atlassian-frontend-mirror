/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useRef, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import Textfield from '@atlaskit/textfield/text-field';
import { token } from '@atlaskit/tokens';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import {
	type TAnchoredPlacementOptions,
	type TPlacementAlign,
} from '@atlaskit/top-layer/resolve-placement';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

/**
 * Styles for the mock table, anchor cell, and overlapping editor.
 */
const styles = cssMap({
	page: {
		paddingBlock: token('space.400'),
		paddingInline: token('space.400'),
		color: token('color.text'),
	},
	scroll: {
		overflow: 'auto',
		maxInlineSize: '800px',
		blockSize: '280px',
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
	},
	table: { borderCollapse: 'collapse', inlineSize: '100%', tableLayout: 'fixed' },
	cell: {
		blockSize: '48px',
		paddingBlock: token('space.0'),
		paddingInline: token('space.0'),
		borderBlockEndWidth: token('border.width'),
		borderBlockEndStyle: 'solid',
		borderBlockEndColor: token('color.border'),
		textAlign: 'start',
	},
	text: { paddingInline: token('space.100') },
	anchor: { inlineSize: '100%', blockSize: '48px' },
	trigger: {
		inlineSize: '100%',
		blockSize: '100%',
		border: 'none',
		paddingInline: token('space.100'),
		backgroundColor: token('color.background.neutral.subtle'),
		color: token('color.text'),
		textAlign: 'start',
		cursor: 'pointer',
		'&:hover': { backgroundColor: token('color.background.neutral.subtle.hovered') },
		'&:focus-visible': {
			outline: `2px solid ${token('color.border.focused')}`,
			outlineOffset: token('space.negative.025'),
		},
	},
	content: { boxSizing: 'border-box' },
	field: { blockSize: '48px', display: 'flex', alignItems: 'center' },
	padding: {
		paddingBlock: token('space.100'),
		paddingInline: token('space.100'),
	},
	wide: { inlineSize: '320px' },
	actions: { display: 'flex', gap: token('space.100'), marginBlockStart: token('space.100') },
	validation: { color: token('color.text.danger'), marginBlockStart: token('space.100') },
	fixedAnchor: {
		position: 'fixed',
		inlineSize: '260px',
	},
	nearEdge: {
		insetBlockEnd: token('space.100'),
		insetInlineEnd: token('space.100'),
	},
	nearStart: {
		insetBlockStart: token('space.100'),
		insetInlineStart: token('space.100'),
	},
});

/**
 * Offsets the editor padding so its content still lines up with the anchor.
 */
function getPaddingOffset({ align }: { align: TPlacementAlign }): string | number {
	if (align === 'start') {
		return token('space.negative.100');
	}
	if (align === 'end') {
		return token('space.100');
	}
	return 0;
}

/**
 * Shows an inline editor that opens over a table cell.
 */
export default function InlineEditor({
	isWiderEditor = false,
	hasEditorPadding = true,
	inlineAlign = isWiderEditor ? 'end' : 'start',
	blockAlign = 'start',
	inlineOffset,
	blockOffset,
	nearEdge,
	direction = 'ltr',
	forceFallbackPositioning = false,
}: {
	isWiderEditor?: boolean;
	hasEditorPadding?: boolean;
	inlineAlign?: TPlacementAlign;
	blockAlign?: TPlacementAlign;
	inlineOffset?: string;
	blockOffset?: string;
	nearEdge?: 'start' | 'end';
	direction?: 'ltr' | 'rtl';
	forceFallbackPositioning?: boolean;
}): ReactNode {
	const title = 'Issue table inline editor';
	const placement: TAnchoredPlacementOptions = {
		axis: 'block',
		edge: `overlap-${blockAlign}`,
		align: inlineAlign,
		// Move the padded surface outwards so the input still starts at the cell.
		offset: {
			gap: blockOffset ?? (hasEditorPadding ? getPaddingOffset({ align: blockAlign }) : 0),
			crossAxisShift: {
				value: inlineOffset ?? (hasEditorPadding ? getPaddingOffset({ align: inlineAlign }) : 0),
			},
		},
	};
	const [isOpen, setIsOpen] = useState(false);
	const [hasValidation, setHasValidation] = useState(false);
	const [isWideAnchor, setIsWideAnchor] = useState(false);
	const [value, setValue] = useState('Customer feedback');
	const [draft, setDraft] = useState(value);
	const anchorRef = useRef<HTMLDivElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	useAnchoredPopover({
		anchorRef,
		popoverRef,
		placement,
		isOpen,
		inlineSize: isWiderEditor ? 'min-anchor' : 'match-anchor',
		forceFallbackPositioning,
	});

	function close() {
		setIsOpen(false);
	}
	function open() {
		setDraft(value);
		setHasValidation(false);
		setIsOpen(true);
	}

	const anchor = (
		<div
			ref={anchorRef}
			css={[
				styles.anchor,
				nearEdge && styles.fixedAnchor,
				nearEdge === 'end' && styles.nearEdge,
				nearEdge === 'start' && styles.nearStart,
			]}
			data-testid="overlap-anchor"
		>
			<button
				type="button"
				css={styles.trigger}
				onClick={open}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId })}
			>
				{value.trim() ? value : 'Edit field'}
			</button>
		</div>
	);

	return (
		<div css={styles.page} dir={direction}>
			<Heading as="h2" size="medium">
				{title}
			</Heading>
			<p>
				{forceFallbackPositioning
					? 'The JavaScript positioning fallback opens the editor below the cell.'
					: 'Open the editor over the full cell, then resize the column or scroll the table.'}
			</p>
			<div css={styles.scroll} data-testid="overlap-scroll-container">
				<table css={styles.table}>
					<caption>{title} example</caption>
					<colgroup>
						<col />
						<col style={{ width: isWideAnchor ? '360px' : '220px' }} />
						<col />
					</colgroup>
					<thead>
						<tr>
							<th css={styles.cell}>
								<span css={styles.text}>Work item</span>
							</th>
							<th css={styles.cell}>
								<span css={styles.text}>Field</span>
							</th>
							<th css={styles.cell}>
								<span css={styles.text}>Status</span>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td css={styles.cell}>
								<span css={styles.text}>APP-17 Improve onboarding</span>
							</td>
							<td css={styles.cell}>{anchor}</td>
							<td css={styles.cell}>
								<span css={styles.text}>In progress</span>
							</td>
						</tr>
						{Array.from({ length: 12 }, (_, index) => (
							<tr key={index}>
								<td css={styles.cell}>
									<span css={styles.text}>APP-{index + 20} Follow-up</span>
								</td>
								<td css={styles.cell}>
									<span css={styles.text}>Research notes</span>
								</td>
								<td css={styles.cell}>
									<span css={styles.text}>To do</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={close}
				role="dialog"
				label={title}
				testId="overlap-popover"
				placement={placement}
			>
				<PopoverSurface>
					<div
						css={[styles.content, hasEditorPadding && styles.padding, isWiderEditor && styles.wide]}
					>
						<div css={styles.field}>
							<Textfield
								aria-label="Edit field"
								value={draft}
								onChange={(event) => setDraft(event.currentTarget.value)}
							/>
						</div>
						<div css={styles.padding}>
							{hasValidation ? (
								<p css={styles.validation}>
									Enter a value that describes the work item. This message expands the editor.
								</p>
							) : null}
							<Button onClick={() => setHasValidation((previous) => !previous)}>
								Toggle validation
							</Button>
							<Button onClick={() => setIsWideAnchor((previous) => !previous)}>
								Resize column
							</Button>
							<div css={styles.actions}>
								<Button
									appearance="primary"
									onClick={() => {
										setValue(draft);
										close();
									}}
								>
									Save
								</Button>
								<Button onClick={close}>Cancel</Button>
							</div>
						</div>
					</div>
				</PopoverSurface>
			</Popover>
		</div>
	);
}
