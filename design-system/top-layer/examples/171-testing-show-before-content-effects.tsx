/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	Fragment,
	type ReactNode,
	type RefObject,
	StrictMode,
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import { createPortal, flushSync } from 'react-dom';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';
import { Dialog } from '@atlaskit/top-layer/dialog-content';
import { Popover } from '@atlaskit/top-layer/popover/popover';

const styles = cssMap({
	controls: {
		display: 'flex',
		flexWrap: 'wrap',
		gap: token('space.100'),
		paddingBlock: token('space.100'),
	},
	// Fixed and centered on the viewport, so the layers overlap wherever the browser puts their hosts.
	box: {
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
		backgroundColor: token('elevation.surface'),
		color: token('color.text'),
		font: token('font.body'),
	},
	singleBox: {
		inlineSize: '360px',
		blockSize: '360px',
	},
	parentBox: {
		inlineSize: '440px',
		blockSize: '320px',
		backgroundColor: token('color.background.accent.blue.subtler'),
	},
	nestedBox: {
		inlineSize: '240px',
		blockSize: '160px',
		backgroundColor: token('color.background.accent.green.subtler'),
	},
	measured: {
		inlineSize: '120px',
		blockSize: '24px',
		backgroundColor: token('color.background.accent.gray.subtler'),
	},
});

/**
 * Focus calls that the content makes in the commit that opens the layer.
 */
type TFocusCall =
	| 'none'
	| 'autofocus-input'
	| 'autofocus-button'
	| 'autofocus-textarea'
	| 'autofocus-select'
	| 'ref-callback'
	| 'layout-effect';

type TLayerKind = 'popover-dialog' | 'popover-menu' | 'popover-no-role' | 'dialog';

/**
 * `is-open-prop`: the layer stays rendered, and `isOpen` changes. `conditional`: the layer
 * mounts with `isOpen` set to `true`, and unmounts on close.
 */
type TMountStyle = 'is-open-prop' | 'conditional';

type TPopoverMode = 'auto' | 'manual';

type TSettings = {
	layerKind: TLayerKind;
	focusCall: TFocusCall;
	mode: TPopoverMode;
	mountStyle: TMountStyle;
	hasInitialFocusRef: boolean;
	hasAutofocusAttribute: boolean;
	isInitialAutoFocusDisabled: boolean;
	isStrictMode: boolean;
	shouldAnimate: boolean;
};

const focusCalls: readonly TFocusCall[] = [
	'none',
	'autofocus-input',
	'autofocus-button',
	'autofocus-textarea',
	'autofocus-select',
	'ref-callback',
	'layout-effect',
];
const layerKinds: readonly TLayerKind[] = [
	'popover-dialog',
	'popover-menu',
	'popover-no-role',
	'dialog',
];
const mountStyles: readonly TMountStyle[] = ['is-open-prop', 'conditional'];
const popoverModes: readonly TPopoverMode[] = ['auto', 'manual'];

const defaultSettings: TSettings = {
	layerKind: 'popover-dialog',
	focusCall: 'none',
	mode: 'auto',
	mountStyle: 'is-open-prop',
	hasInitialFocusRef: false,
	hasAutofocusAttribute: false,
	isInitialAutoFocusDisabled: false,
	isStrictMode: false,
	shouldAnimate: false,
};

function SelectSetting<TValue extends string>({
	testId,
	label,
	value,
	options,
	onChange,
}: {
	testId: string;
	label: string;
	value: TValue;
	options: readonly TValue[];
	onChange: (value: TValue) => void;
}): ReactNode {
	return (
		<label>
			{label}{' '}
			<select
				data-testid={testId}
				value={value}
				onChange={(event) => {
					const selected = options.find((option) => option === event.currentTarget.value);
					if (selected) {
						onChange(selected);
					}
				}}
			>
				{options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</label>
	);
}

function CheckboxSetting({
	testId,
	label,
	isChecked,
	onChange,
}: {
	testId: string;
	label: string;
	isChecked: boolean;
	onChange: (isChecked: boolean) => void;
}): ReactNode {
	return (
		<label>
			<input
				type="checkbox"
				data-testid={testId}
				checked={isChecked}
				onChange={(event) => onChange(event.currentTarget.checked)}
			/>{' '}
			{label}
		</label>
	);
}

function focusOnAttach(element: HTMLElement | null) {
	element?.focus();
}

type TItemRole = 'menuitem' | undefined;

function FocusOnLayoutEffect({ itemRole }: { itemRole: TItemRole }): ReactNode {
	const buttonRef = useRef<HTMLButtonElement>(null);
	useLayoutEffect(() => {
		buttonRef.current?.focus();
	}, []);
	return (
		<button type="button" role={itemRole} data-testid="target" ref={buttonRef}>
			Target
		</button>
	);
}

/**
 * The element that the content focuses, with the focus call under test. A menu can hold only menu
 * items, so use the button focus calls there.
 */
function FocusTarget({
	focusCall,
	itemRole,
}: {
	focusCall: TFocusCall;
	itemRole: TItemRole;
}): ReactNode {
	if (focusCall === 'autofocus-input') {
		return <input aria-label="Target" data-testid="target" autoFocus />;
	}
	if (focusCall === 'autofocus-button') {
		return (
			<button type="button" role={itemRole} data-testid="target" autoFocus>
				Target
			</button>
		);
	}
	if (focusCall === 'autofocus-textarea') {
		return <textarea aria-label="Target" data-testid="target" autoFocus />;
	}
	if (focusCall === 'autofocus-select') {
		return (
			<select aria-label="Target" data-testid="target" autoFocus>
				<option>Option</option>
			</select>
		);
	}
	if (focusCall === 'ref-callback') {
		return (
			<button type="button" role={itemRole} data-testid="target" ref={focusOnAttach}>
				Target
			</button>
		);
	}
	if (focusCall === 'layout-effect') {
		return <FocusOnLayoutEffect itemRole={itemRole} />;
	}
	return (
		<button type="button" role={itemRole} data-testid="target">
			Target
		</button>
	);
}

function getSize({ element }: { element: HTMLElement }): string {
	const { width, height } = element.getBoundingClientRect();
	return `${width}x${height}`;
}

/**
 * Records its size from a ref callback and from a layout effect, as content that measures at
 * mount does.
 */
function MeasureAtMount(): ReactNode {
	const elementRef = useRef<HTMLDivElement | null>(null);
	const measureOnAttach = useCallback((element: HTMLDivElement | null) => {
		elementRef.current = element;
		element?.setAttribute('data-ref-callback-size', getSize({ element }));
	}, []);
	useLayoutEffect(() => {
		const element = elementRef.current;
		element?.setAttribute('data-layout-effect-size', getSize({ element }));
	}, []);
	return <div css={styles.measured} data-testid="measured" ref={measureOnAttach} />;
}

// Sets the HTML `autofocus` attribute in a ref callback, as React does not render it for `autoFocus`.
function setAutofocusAttribute(element: HTMLButtonElement | null) {
	element?.setAttribute('autofocus', '');
}

function LayerContent({
	settings,
	initialFocusRef,
	onCloseClick,
	onReopenDuringExitClick,
}: {
	settings: TSettings;
	initialFocusRef: RefObject<HTMLButtonElement>;
	onCloseClick: () => void;
	onReopenDuringExitClick: () => void;
}): ReactNode {
	const itemRole = settings.layerKind === 'popover-menu' ? 'menuitem' : undefined;
	return (
		<div css={[styles.box, styles.singleBox]} data-testid="content">
			<button type="button" role={itemRole} data-testid="first">
				First
			</button>
			{settings.hasInitialFocusRef && (
				<button
					type="button"
					role={itemRole}
					data-testid="initial-focus-ref-target"
					ref={initialFocusRef}
				>
					Initial focus ref target
				</button>
			)}
			{settings.hasAutofocusAttribute && (
				<button
					type="button"
					role={itemRole}
					data-testid="autofocus-attribute"
					ref={setAutofocusAttribute}
				>
					Autofocus attribute
				</button>
			)}
			<FocusTarget focusCall={settings.focusCall} itemRole={itemRole} />
			<MeasureAtMount />
			<button
				type="button"
				role={itemRole}
				data-testid="reopen-during-exit"
				onClick={onReopenDuringExitClick}
			>
				Close and reopen
			</button>
			<button type="button" role={itemRole} data-testid="close" onClick={onCloseClick}>
				Close
			</button>
		</div>
	);
}

function Layer({
	settings,
	isOpen,
	onClose,
	onCloseClick,
	onReopenDuringExitClick,
}: {
	settings: TSettings;
	isOpen: boolean;
	onClose: () => void;
	onCloseClick: () => void;
	onReopenDuringExitClick: () => void;
}): ReactNode {
	const initialFocusRef = useRef<HTMLButtonElement>(null);
	const content = (
		<LayerContent
			settings={settings}
			initialFocusRef={initialFocusRef}
			onCloseClick={onCloseClick}
			onReopenDuringExitClick={onReopenDuringExitClick}
		/>
	);

	if (settings.layerKind === 'dialog') {
		return (
			<Dialog
				isOpen={isOpen}
				onClose={onClose}
				label="Layer"
				testId="layer"
				shouldAnimate={settings.shouldAnimate}
			>
				{content}
			</Dialog>
		);
	}
	if (settings.layerKind === 'popover-no-role') {
		return (
			<Popover
				isOpen={isOpen}
				onClose={onClose}
				mode={settings.mode}
				label="Layer"
				testId="layer"
				shouldAnimate={settings.shouldAnimate}
				UNSAFE__disableInitialAutoFocus={settings.isInitialAutoFocusDisabled}
			>
				{content}
			</Popover>
		);
	}
	return (
		<Popover
			isOpen={isOpen}
			onClose={onClose}
			mode={settings.mode}
			role={settings.layerKind === 'popover-menu' ? 'menu' : 'dialog'}
			label="Layer"
			testId="layer"
			shouldAnimate={settings.shouldAnimate}
			initialFocusRef={settings.hasInitialFocusRef ? initialFocusRef : undefined}
			UNSAFE__disableInitialAutoFocus={settings.isInitialAutoFocusDisabled}
		>
			{content}
		</Popover>
	);
}

/**
 * One layer. Set the options, then focus `trigger` and press Enter. `close-requests` counts the
 * calls to the layer's `onClose`.
 */
function SingleLayerFixture(): ReactNode {
	const [settings, setSettings] = useState<TSettings>(defaultSettings);
	const [isOpen, setIsOpen] = useState(false);
	const [closeRequestCount, setCloseRequestCount] = useState(0);

	const updateSettings = useCallback((update: Partial<TSettings>) => {
		setSettings((current) => ({ ...current, ...update }));
	}, []);
	const toggle = useCallback(() => setIsOpen((current) => !current), []);
	const onClose = useCallback(() => {
		setCloseRequestCount((current) => current + 1);
		setIsOpen(false);
	}, []);
	const onCloseClick = useCallback(() => setIsOpen(false), []);
	// Two commits in one task: the close starts the exit, and the open comes before it ends.
	const onReopenDuringExitClick = useCallback(() => {
		flushSync(() => setIsOpen(false));
		setIsOpen(true);
	}, []);

	const layer = (settings.mountStyle === 'is-open-prop' || isOpen) && (
		<Layer
			settings={settings}
			isOpen={isOpen}
			onClose={onClose}
			onCloseClick={onCloseClick}
			onReopenDuringExitClick={onReopenDuringExitClick}
		/>
	);

	return (
		<Fragment>
			<div css={styles.controls}>
				<SelectSetting
					testId="layer-kind"
					label="Layer"
					value={settings.layerKind}
					options={layerKinds}
					onChange={(layerKind) => updateSettings({ layerKind })}
				/>
				<SelectSetting
					testId="focus-call"
					label="Content focus call"
					value={settings.focusCall}
					options={focusCalls}
					onChange={(focusCall) => updateSettings({ focusCall })}
				/>
				<SelectSetting
					testId="mode"
					label="Popover mode"
					value={settings.mode}
					options={popoverModes}
					onChange={(mode) => updateSettings({ mode })}
				/>
				<SelectSetting
					testId="mount-style"
					label="Mount"
					value={settings.mountStyle}
					options={mountStyles}
					onChange={(mountStyle) => updateSettings({ mountStyle })}
				/>
				<CheckboxSetting
					testId="has-initial-focus-ref"
					label="initialFocusRef"
					isChecked={settings.hasInitialFocusRef}
					onChange={(hasInitialFocusRef) => updateSettings({ hasInitialFocusRef })}
				/>
				<CheckboxSetting
					testId="has-autofocus-attribute"
					label="autofocus attribute (ref callback)"
					isChecked={settings.hasAutofocusAttribute}
					onChange={(hasAutofocusAttribute) => updateSettings({ hasAutofocusAttribute })}
				/>
				<CheckboxSetting
					testId="is-initial-auto-focus-disabled"
					label="UNSAFE__disableInitialAutoFocus"
					isChecked={settings.isInitialAutoFocusDisabled}
					onChange={(isInitialAutoFocusDisabled) => updateSettings({ isInitialAutoFocusDisabled })}
				/>
				<CheckboxSetting
					testId="is-strict-mode"
					label="StrictMode"
					isChecked={settings.isStrictMode}
					onChange={(isStrictMode) => updateSettings({ isStrictMode })}
				/>
				<CheckboxSetting
					testId="should-animate"
					label="shouldAnimate"
					isChecked={settings.shouldAnimate}
					onChange={(shouldAnimate) => updateSettings({ shouldAnimate })}
				/>
			</div>
			<button type="button" data-testid="trigger" onClick={toggle}>
				Toggle layer
			</button>
			<output data-testid="close-requests">{closeRequestCount}</output>
			{settings.isStrictMode ? <StrictMode>{layer}</StrictMode> : layer}
		</Fragment>
	);
}

type TNestedScenario =
	| 'popover-popover'
	| 'dialog-popover'
	| 'popover-dialog'
	| 'dialog-dialog'
	| 'dialog-portalled-dialog';

type TBoxKind = 'popover' | 'dialog';

const nestedScenarioNames: readonly TNestedScenario[] = [
	'popover-popover',
	'dialog-popover',
	'popover-dialog',
	'dialog-dialog',
	'dialog-portalled-dialog',
];

const nestedScenarios: Readonly<Record<TNestedScenario, readonly [TBoxKind, TBoxKind]>> = {
	'popover-popover': ['popover', 'popover'],
	'dialog-popover': ['dialog', 'popover'],
	'popover-dialog': ['popover', 'dialog'],
	'dialog-dialog': ['dialog', 'dialog'],
	'dialog-portalled-dialog': ['dialog', 'dialog'],
};

type TLevel = 'parent' | 'nested';

function LayerBox({
	kind,
	level,
	isOpen,
	onClose,
	children,
}: {
	kind: TBoxKind;
	level: TLevel;
	isOpen: boolean;
	onClose: () => void;
	children?: ReactNode;
}): ReactNode {
	const label = `${level} ${kind}`;
	const content = (
		<div
			css={[styles.box, level === 'parent' ? styles.parentBox : styles.nestedBox]}
			data-testid={`${level}-content`}
		>
			<span>{label}</span>
			<button type="button" data-testid={`${level}-first`}>
				First ({level})
			</button>
			<button type="button" data-testid={`${level}-close`} onClick={onClose}>
				Close ({level})
			</button>
			{children}
		</div>
	);
	if (kind === 'dialog') {
		return (
			<Dialog isOpen={isOpen} onClose={onClose} label={label} testId={`${level}-layer`}>
				{content}
			</Dialog>
		);
	}
	return (
		<Popover
			isOpen={isOpen}
			onClose={onClose}
			role="dialog"
			label={label}
			testId={`${level}-layer`}
		>
			{content}
		</Popover>
	);
}

type TNestedState = { scenario: TNestedScenario; isNestedOpen: boolean } | null;

/**
 * `mount-nested-<scenario>` mounts a layer and a layer inside it, open in one commit. In
 * `dialog-portalled-dialog`, the nested layer is a child in the React tree, but a portal puts it
 * outside its parent in the DOM.
 *
 * These test a defensive fix, not a pattern to copy: do not design nested layers to open in the
 * same commit.
 */
function NestedFixture(): ReactNode {
	const [state, setState] = useState<TNestedState>(null);
	const closeParent = useCallback(() => setState(null), []);
	const closeNested = useCallback(
		() => setState((current) => current && { ...current, isNestedOpen: false }),
		[],
	);
	function renderLayers({
		scenario,
		isNestedOpen,
	}: {
		scenario: TNestedScenario;
		isNestedOpen: boolean;
	}) {
		const [parentKind, nestedKind] = nestedScenarios[scenario];
		const nested = (
			<LayerBox kind={nestedKind} level="nested" isOpen={isNestedOpen} onClose={closeNested} />
		);
		return (
			<LayerBox kind={parentKind} level="parent" isOpen onClose={closeParent}>
				{scenario === 'dialog-portalled-dialog' ? createPortal(nested, document.body) : nested}
			</LayerBox>
		);
	}

	return (
		<Fragment>
			<div css={styles.controls}>
				{nestedScenarioNames.map((name) => (
					<button
						key={name}
						type="button"
						data-testid={`mount-nested-${name}`}
						onClick={() => setState({ scenario: name, isNestedOpen: true })}
					>
						Mount {name}
					</button>
				))}
			</div>
			{state && renderLayers(state)}
		</Fragment>
	);
}

/**
 * A layer shows (`showPopover()`, `showModal()`) before its content effects run: `autoFocus`, ref
 * callbacks and layout effects. So a content `focus()` call works, and a measurement at mount sees
 * real sizes. See `notes/decisions/react-autofocus-and-focus-on-open.md`.
 */
export default function TestingShowBeforeContentEffects(): ReactNode {
	return (
		<Fragment>
			<SingleLayerFixture />
			<NestedFixture />
		</Fragment>
	);
}
