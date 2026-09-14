/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import TextArea from '@atlaskit/textarea/text-area';
import { token } from '@atlaskit/tokens';
import Toggle from '@atlaskit/toggle';

import {
	describeJsonSyntaxError,
	type JsonLine,
	type JsonSyntaxError,
	type SourceLine,
	toJsonLines,
	toSourceLines,
} from './utils/adf-validation/json-lines';
import { DEFAULT_ADF } from './utils/adf-validation/default-adf';
import { formatProblem, formatSyntaxProblem } from './utils/adf-validation/format-problem';
import { type LocatedError, pathToLabel, validateAdf } from './utils/adf-validation/validate-adf';

const styles = cssMap({
	page: {
		display: 'flex',
		flexDirection: 'column',
		// Stacked panes let the page scroll; side by side, each pane scrolls inside one viewport.
		height: 'auto',
		minHeight: '100vh',
		backgroundColor: token('elevation.surface'),
		color: token('color.text'),
		'@media (min-width: 48rem)': {
			height: '100vh',
		},
	},
	header: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
		paddingTop: token('space.150'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.200'),
		borderBlockEndWidth: token('border.width'),
		borderBlockEndStyle: 'solid',
		borderBlockEndColor: token('color.border'),
	},
	hint: {
		color: token('color.text.subtlest'),
		font: token('font.body.small'),
	},
	controls: {
		display: 'flex',
		flexWrap: 'wrap',
		alignItems: 'center',
		gap: token('space.100'),
	},
	controlLabel: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.050'),
		color: token('color.text.subtle'),
		font: token('font.body.small'),
	},
	body: {
		display: 'grid',
		gap: token('space.150'),
		flexGrow: 1,
		minHeight: '0',
		paddingTop: token('space.150'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
		// Narrowest: everything stacked in reading order.
		gridTemplateColumns: 'minmax(0, 1fr)',
		gridTemplateAreas: '"input" "annotated" "problems"',
		gridTemplateRows: 'auto auto auto',
		// From 48rem the input and the annotated copy sit side by side and problems spans under them,
		// since problems is the pane that still reads fine at full width.
		'@media (min-width: 48rem)': {
			gridTemplateColumns: 'minmax(240px, 1fr) minmax(340px, 1.4fr)',
			gridTemplateAreas: '"input annotated" "problems problems"',
			gridTemplateRows: 'minmax(0, 1.6fr) minmax(200px, 1fr)',
		},
		// From 64rem there is room for all three.
		'@media (min-width: 64rem)': {
			gridTemplateColumns: 'minmax(260px, 1fr) minmax(380px, 1.4fr) minmax(280px, 0.9fr)',
			gridTemplateAreas: '"input annotated problems"',
			gridTemplateRows: 'minmax(0, 1fr)',
		},
	},
	pane: {
		display: 'flex',
		flexDirection: 'column',
		minWidth: '0',
		gap: token('space.075'),
		// Stacked, a pane needs its own height to be usable; side by side the grid row sets it.
		minHeight: '320px',
		'@media (min-width: 48rem)': {
			minHeight: '0',
		},
	},
	inputPane: {
		gridArea: 'input',
	},
	annotatedPane: {
		gridArea: 'annotated',
	},
	problemsPane: {
		gridArea: 'problems',
	},
	paneHeader: {
		display: 'flex',
		alignItems: 'baseline',
		justifyContent: 'space-between',
		gap: token('space.100'),
		color: token('color.text.subtlest'),
		font: token('font.body.small'),
		textTransform: 'uppercase',
	},
	textAreaWrapper: {
		flexGrow: 1,
		minHeight: '0',
		display: 'flex',
		flexDirection: 'column',
	},
	scroller: {
		flexGrow: 1,
		minHeight: '0',
		overflow: 'auto',
		backgroundColor: token('elevation.surface.sunken'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('radius.small'),
		paddingTop: token('space.100'),
		paddingBottom: token('space.100'),
	},
	line: {
		display: 'flex',
		alignItems: 'flex-start',
		gap: token('space.100'),
		font: token('font.body.small'),
		fontFamily: token('font.family.code'),
		whiteSpace: 'pre',
		paddingRight: token('space.100'),
		borderInlineStartWidth: token('border.width.focused'),
		borderInlineStartStyle: 'solid',
		borderInlineStartColor: 'transparent',
	},
	lineWithinError: {
		backgroundColor: token('color.background.danger'),
	},
	lineError: {
		backgroundColor: token('color.background.danger.bold'),
		color: token('color.text.inverse'),
	},
	lineAncestor: {
		borderInlineStartColor: token('color.border.danger'),
	},
	lineSelected: {
		outlineWidth: token('border.width.focused'),
		outlineStyle: 'solid',
		outlineColor: token('color.border.focused'),
	},
	lineClickable: {
		cursor: 'pointer',
	},
	syntaxErrorToken: {
		backgroundColor: token('color.background.danger.bold'),
		color: token('color.text.inverse'),
		borderRadius: token('radius.small'),
	},
	lineNumber: {
		flexShrink: 0,
		width: '36px',
		textAlign: 'right',
		color: token('color.text.subtlest'),
		userSelect: 'none',
	},
	lineText: {
		whiteSpace: 'pre',
	},
	inlineAnnotation: {
		marginInlineStart: token('space.150'),
		paddingInlineStart: token('space.075'),
		paddingInlineEnd: token('space.075'),
		borderRadius: token('radius.small'),
		backgroundColor: token('color.background.danger.bold.hovered'),
		color: token('color.text.inverse'),
		whiteSpace: 'pre-wrap',
	},
	banner: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.050'),
		paddingTop: token('space.100'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.150'),
		borderRadius: token('radius.small'),
		font: token('font.body.small'),
	},
	bannerValid: {
		backgroundColor: token('color.background.success'),
		color: token('color.text.success'),
	},
	bannerInvalid: {
		backgroundColor: token('color.background.danger'),
		color: token('color.text.danger'),
	},
	errorList: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
		flexGrow: 1,
		minHeight: '0',
		overflow: 'auto',
	},
	errorItem: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'stretch',
		gap: token('space.050'),
		textAlign: 'left',
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
		backgroundColor: token('elevation.surface.raised'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('radius.small'),
		cursor: 'pointer',
	},
	errorItemHeader: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: token('space.100'),
	},
	errorItemBody: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'stretch',
		gap: token('space.050'),
		width: '100%',
		textAlign: 'left',
		cursor: 'pointer',
		backgroundColor: 'transparent',
		borderStyle: 'none',
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
		color: token('color.text'),
		font: token('font.body.small'),
	},
	errorItemSelected: {
		borderColor: token('color.border.danger'),
		backgroundColor: token('color.background.danger'),
	},
	errorCode: {
		font: token('font.body.small'),
		fontWeight: token('font.weight.bold'),
		color: token('color.text.danger'),
	},
	errorMessage: {
		font: token('font.body.small'),
		color: token('color.text'),
	},
	errorPath: {
		font: token('font.body.small'),
		fontFamily: token('font.family.code'),
		color: token('color.text.subtle'),
		wordBreak: 'break-all',
	},
	errorMeta: {
		font: token('font.body.small'),
		fontFamily: token('font.family.code'),
		color: token('color.text.subtlest'),
		wordBreak: 'break-all',
	},
	expectations: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.025'),
		marginBlockStart: token('space.050'),
		paddingBlockStart: token('space.050'),
		borderBlockStartWidth: token('border.width'),
		borderBlockStartStyle: 'solid',
		borderBlockStartColor: token('color.border'),
	},
	expectationsTitle: {
		font: token('font.body.small'),
		fontWeight: token('font.weight.bold'),
		color: token('color.text.success'),
		textTransform: 'uppercase',
	},
	empty: {
		color: token('color.text.subtlest'),
		font: token('font.body.small'),
	},
});

type Analysis =
	| { kind: 'empty' }
	| { kind: 'parse-error'; lines: SourceLine[]; syntaxError: JsonSyntaxError }
	| {
			errors: LocatedError[];
			kind: 'validated';
			lines: JsonLine[];
			/** The parsed document, so a copied problem can quote the offending node. */
			parsed: unknown;
			valid: boolean;
	  };

/** Which pane the selection was made from, so only the other one is scrolled. */
type Selection = { index: number; source: 'json' | 'list' };

/** Keeps an unexpectedly large `meta` from swamping the annotated line it sits on. */
const formatMeta = (meta: object, limit = 120) => {
	const json = JSON.stringify(meta);
	return json.length > limit ? `${json.slice(0, limit)}…` : json;
};

/**
 * `''` is the root path, and every path starts with it, so it never contributes a prefix.
 */
const prefixOf = (pathKey: string) => (pathKey === '' ? undefined : `${pathKey}.`);

type LineDecoration = {
	/** This line opens a value that contains an error further down. */
	ancestorOfError: boolean;
	/** Errors reported against this exact line. */
	own: LocatedError[];
	/** This line is inside a value another line reported an error for. */
	withinError: boolean;
};

const decorate = (lines: JsonLine[], errors: LocatedError[]): LineDecoration[] =>
	lines.map((line) => {
		const own = errors.filter((error) => error.pathKey === line.pathKey);
		const linePrefix = prefixOf(line.pathKey);
		return {
			own,
			withinError:
				own.length === 0 &&
				errors.some((error) => {
					const errorPrefix = prefixOf(error.pathKey);
					return errorPrefix !== undefined && line.pathKey.startsWith(errorPrefix);
				}),
			ancestorOfError:
				own.length === 0 &&
				errors.some(
					(error) =>
						error.pathKey !== line.pathKey &&
						(linePrefix === undefined || error.pathKey.startsWith(linePrefix)),
				),
		};
	});

/**
 * Side by side ADF editor and annotated copy of the same JSON, marked up with the exact lines,
 * attributes and marks that fail ADF schema validation.
 */
export default function AdfSchemaValidator(): React.JSX.Element {
	const [source, setSource] = useState<string>(DEFAULT_ADF);
	const [allowPrivateAttributes, setAllowPrivateAttributes] = useState(false);
	const [stage0, setStage0] = useState(false);
	const [selection, setSelection] = useState<Selection | undefined>(undefined);
	const [copiedKey, setCopiedKey] = useState<string | undefined>(undefined);
	const lineRefs = useRef<Array<HTMLElement | null>>([]);
	const errorRefs = useRef<Array<HTMLElement | null>>([]);
	const copyResetTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	const copyProblem = useCallback((key: string, report: string) => {
		void navigator.clipboard?.writeText(report);
		setCopiedKey(key);
		clearTimeout(copyResetTimeout.current);
		copyResetTimeout.current = setTimeout(() => setCopiedKey(undefined), 1500);
	}, []);

	useEffect(() => () => clearTimeout(copyResetTimeout.current), []);

	const analysis = useMemo<Analysis>(() => {
		if (source.trim() === '') {
			return { kind: 'empty' };
		}
		let parsed: unknown;
		try {
			parsed = JSON.parse(source);
		} catch (error) {
			const syntaxError = describeJsonSyntaxError(source, error);
			return { kind: 'parse-error', syntaxError, lines: toSourceLines(source, syntaxError) };
		}
		const { valid, errors } = validateAdf(parsed, { allowPrivateAttributes, stage0 });
		return { kind: 'validated', lines: toJsonLines(parsed), parsed, valid, errors };
	}, [source, allowPrivateAttributes, stage0]);

	const decorations = useMemo(
		() => (analysis.kind === 'validated' ? decorate(analysis.lines, analysis.errors) : []),
		[analysis],
	);

	const onSourceChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setSource(event.target.value);
		setSelection(undefined);
	}, []);

	// Re-indents whatever parses, which is what makes pasted single-line ADF readable.
	const beautify = useCallback(() => {
		try {
			setSource(JSON.stringify(JSON.parse(source), null, 2));
			setSelection(undefined);
		} catch {
			// Nothing to format while the JSON is broken; the syntax error already says where.
		}
	}, [source]);

	// A syntax error can be far down a long document, so bring it into view.
	useEffect(() => {
		if (analysis.kind !== 'parse-error') {
			return;
		}
		lineRefs.current[analysis.syntaxError.line - 1]?.scrollIntoView({
			block: 'center',
			behavior: 'smooth',
		});
	}, [analysis]);

	// Reveal the counterpart of a selection in the pane it was not made from.
	useEffect(() => {
		if (!selection || analysis.kind !== 'validated') {
			return;
		}
		const error = analysis.errors[selection.index];
		if (!error) {
			return;
		}
		if (selection.source === 'list') {
			const index = analysis.lines.findIndex((line) => line.pathKey === error.pathKey);
			lineRefs.current[index]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
		} else {
			errorRefs.current[selection.index]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
		}
	}, [selection, analysis]);

	const errors = analysis.kind === 'validated' ? analysis.errors : [];
	const selectedError = selection !== undefined ? errors[selection.index] : undefined;

	return (
		<div css={styles.page}>
			<div css={styles.header}>
				<Heading size="small">ADF schema validation highlighter</Heading>
				<span css={styles.hint}>
					Paste or edit ADF on the left. The pane in the middle is the same document, annotated with
					every problem <code>@atlaskit/adf-utils/validator</code> reports, down to the exact
					attribute. Selecting a problem in either pane highlights it in both, and the problem lists
					what the schema would have accepted instead.
				</span>
				<div css={styles.controls}>
					<label css={styles.controlLabel} htmlFor="allow-private-attributes">
						<Toggle
							id="allow-private-attributes"
							isChecked={allowPrivateAttributes}
							onChange={() => setAllowPrivateAttributes((value) => !value)}
							size="regular"
						/>
						Allow private <code>__</code> attributes
					</label>
					<label css={styles.controlLabel} htmlFor="stage-0">
						<Toggle
							id="stage-0"
							isChecked={stage0}
							onChange={() => setStage0((value) => !value)}
							size="regular"
						/>
						Stage 0 schema
					</label>
				</div>
			</div>

			<div css={styles.body}>
				<div css={[styles.pane, styles.inputPane]}>
					<div css={styles.paneHeader}>
						<label htmlFor="adf-source">ADF JSON (editable)</label>
						<Button
							appearance="subtle"
							spacing="compact"
							isDisabled={analysis.kind !== 'validated'}
							onClick={beautify}
						>
							Beautify
						</Button>
					</div>
					<div css={styles.textAreaWrapper}>
						<TextArea
							id="adf-source"
							appearance="standard"
							isMonospaced
							value={source}
							onChange={onSourceChange}
							resize="none"
							spellCheck={false}
							maxHeight="100%"
							minimumRows={30}
						/>
					</div>
				</div>

				<div css={[styles.pane, styles.annotatedPane]}>
					<div css={styles.paneHeader}>
						<span>{analysis.kind === 'parse-error' ? 'Raw input' : 'Annotated copy'}</span>
						<span>
							{analysis.kind === 'validated'
								? `${analysis.errors.length} problem${analysis.errors.length === 1 ? '' : 's'}`
								: ''}
							{analysis.kind === 'parse-error' ? '1 syntax error' : ''}
						</span>
					</div>
					{analysis.kind === 'parse-error' && (
						<React.Fragment>
							<div css={[styles.banner, styles.bannerInvalid]}>
								Not valid JSON, so the schema was not checked. The rejected token is highlighted
								below.
							</div>
							<div css={styles.scroller}>
								{analysis.lines.map((line, index) => (
									<div
										key={line.number}
										ref={(element) => {
											lineRefs.current[index] = element;
										}}
										css={[styles.line, line.isError && styles.lineWithinError]}
									>
										<span css={styles.lineNumber}>{line.number}</span>
										<span css={styles.lineText}>
											{line.before}
											{line.isError && (
												<span css={styles.syntaxErrorToken}>
													{line.offending === '' ? '⌷' : line.offending}
												</span>
											)}
											{line.after}
										</span>
										{line.isError && (
											<span css={styles.inlineAnnotation}>
												◀ {analysis.syntaxError.message} (line {analysis.syntaxError.line}, column{' '}
												{analysis.syntaxError.column})
											</span>
										)}
									</div>
								))}
							</div>
						</React.Fragment>
					)}
					{analysis.kind === 'empty' && (
						<div css={styles.empty}>Paste some ADF to get started.</div>
					)}
					{analysis.kind === 'validated' && (
						<React.Fragment>
							<div
								css={[styles.banner, analysis.valid ? styles.bannerValid : styles.bannerInvalid]}
							>
								{analysis.valid
									? 'Valid against the ADF schema.'
									: 'Highlighted lines below are the ones that fail the schema.'}
							</div>
							<div css={styles.scroller}>
								{analysis.lines.map((line, index) => {
									const decoration = decorations[index];
									const isSelected =
										selectedError !== undefined && line.pathKey === selectedError.pathKey;
									// Lines carrying an error select it, so the problems list follows the JSON.
									const select =
										decoration.own.length > 0
											? () =>
													setSelection({
														index: errors.indexOf(decoration.own[0]),
														source: 'json',
													})
											: undefined;

									return (
										<div
											key={`${line.pathKey}:${line.isOpening ? 'open' : 'close'}`}
											ref={(element) => {
												lineRefs.current[index] = element;
											}}
											css={[
												styles.line,
												decoration.withinError && styles.lineWithinError,
												decoration.ancestorOfError && styles.lineAncestor,
												decoration.own.length > 0 && styles.lineError,
												isSelected && styles.lineSelected,
												select && styles.lineClickable,
											]}
											role={select ? 'button' : undefined}
											tabIndex={select ? 0 : undefined}
											onClick={select}
											onKeyDown={
												select
													? (event: React.KeyboardEvent) => {
															if (event.key === 'Enter' || event.key === ' ') {
																event.preventDefault();
																select();
															}
														}
													: undefined
											}
										>
											<span css={styles.lineNumber}>{index + 1}</span>
											<span css={styles.lineText}>{line.text}</span>
											{line.isOpening &&
												decoration.own.map((error) => (
													<span
														key={`${error.code}:${error.message}`}
														css={styles.inlineAnnotation}
													>
														◀ {error.code}: {error.message}
														{error.meta ? ` ${formatMeta(error.meta)}` : ''}
													</span>
												))}
										</div>
									);
								})}
							</div>
						</React.Fragment>
					)}
				</div>

				<div css={[styles.pane, styles.problemsPane]}>
					<div css={styles.paneHeader}>Problems</div>
					<div css={styles.errorList}>
						{analysis.kind === 'parse-error' && (
							<div css={[styles.errorItem, styles.errorItemSelected]}>
								<div css={styles.errorItemHeader}>
									<span css={styles.errorCode}>SYNTAX_ERROR · json</span>
									<Button
										appearance="subtle"
										spacing="compact"
										onClick={() =>
											copyProblem('syntax', formatSyntaxProblem(analysis.syntaxError, source))
										}
									>
										{copiedKey === 'syntax' ? 'Copied' : 'Copy'}
									</Button>
								</div>
								<button
									type="button"
									css={styles.errorItemBody}
									onClick={() =>
										lineRefs.current[analysis.syntaxError.line - 1]?.scrollIntoView({
											block: 'center',
											behavior: 'smooth',
										})
									}
								>
									<span css={styles.errorMessage}>{analysis.syntaxError.message}</span>
									<span css={styles.errorPath}>
										line {analysis.syntaxError.line}, column {analysis.syntaxError.column} (offset{' '}
										{analysis.syntaxError.offset})
									</span>
								</button>
							</div>
						)}
						{analysis.kind !== 'parse-error' && errors.length === 0 && (
							<div css={styles.empty}>Nothing to report.</div>
						)}
						{errors.map((error, index) => {
							// Problems are deduped on exactly these three, so this identifies one.
							const key = `${error.pathKey}-${error.code}-${error.message}`;
							return (
								<div
									key={key}
									ref={(element) => {
										errorRefs.current[index] = element;
									}}
									css={[styles.errorItem, error === selectedError && styles.errorItemSelected]}
								>
									<div css={styles.errorItemHeader}>
										<span css={styles.errorCode}>
											{error.code} · {error.target}
										</span>
										<Button
											appearance="subtle"
											spacing="compact"
											onClick={() =>
												copyProblem(
													key,
													formatProblem(
														error,
														analysis.kind === 'validated' ? analysis.parsed : undefined,
													),
												)
											}
										>
											{copiedKey === key ? 'Copied' : 'Copy'}
										</Button>
									</div>
									<button
										type="button"
										css={styles.errorItemBody}
										onClick={() => setSelection({ index, source: 'list' })}
									>
										<span css={styles.errorMessage}>{error.message}</span>
										<span css={styles.errorPath}>{pathToLabel(error.path)}</span>
										{error.meta && (
											<span css={styles.errorMeta}>found {formatMeta(error.meta)}</span>
										)}
										{error.expectations.length > 0 && (
											<span css={styles.expectations}>
												<span css={styles.expectationsTitle}>Schema accepts</span>
												{error.expectations.map((expectation) => (
													<span key={expectation} css={styles.errorMeta}>
														{expectation}
													</span>
												))}
											</span>
										)}
									</button>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
