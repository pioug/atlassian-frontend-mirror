/**
 * Type tests: `setInitialFocusRef` is only in the render-prop args when `role` is
 * `'dialog'` or `'alertdialog'`. The typecheck runs these. Each `@ts-expect-error` line
 * must fail to compile.
 */
import React, { type ComponentProps } from 'react';

import { PopupContent } from '../../compositional/popup-content';
import { Popup } from '../../popup';
import {
	type ContentProps,
	type DialogContentProps,
	type DialogPopupProps,
	type PopupProps,
	type TInitialFocusRole,
	type TriggerProps,
} from '../../types';

const trigger = ({ ref }: TriggerProps) => <button type="button" ref={ref} />;

declare const stringRole: string;
declare const isKeyboard: boolean;
declare const dialogRole: TInitialFocusRole;

export const classicCases = (): React.ReactNode[] => [
	// dialog and alertdialog get the setter.
	<Popup
		isOpen
		role="dialog"
		label="Dialog"
		trigger={trigger}
		content={({ setInitialFocusRef }) => <input ref={setInitialFocusRef} />}
	/>,
	<Popup
		isOpen
		role="alertdialog"
		label="Alert dialog"
		shouldFitContainer
		trigger={trigger}
		content={({ setInitialFocusRef }) => <button type="button" ref={setInitialFocusRef} />}
	/>,
	<Popup
		isOpen
		role={dialogRole}
		label="Narrowed role"
		trigger={trigger}
		content={({ setInitialFocusRef }) => <input ref={setInitialFocusRef} />}
	/>,
	// No role.
	<Popup
		isOpen
		trigger={trigger}
		// @ts-expect-error no role: no setter
		content={({ setInitialFocusRef }) => <input ref={setInitialFocusRef} />}
	/>,
	// A `string` role.
	<Popup
		isOpen
		role={stringRole}
		trigger={trigger}
		// @ts-expect-error a `string` role: no setter
		content={({ setInitialFocusRef }) => <input ref={setInitialFocusRef} />}
	/>,
	// A role gated on a flag (`'dialog' | undefined`) gets the setter.
	<Popup
		isOpen
		role={isKeyboard ? 'dialog' : undefined}
		label={isKeyboard ? 'Gated dialog' : undefined}
		trigger={trigger}
		content={({ setInitialFocusRef }) => <input ref={setInitialFocusRef} />}
	/>,
	// An explicit `role={undefined}` gets the setter (the bridge, until flag cleanup). Legacy
	// menus on the legacy path use it.
	<Popup
		isOpen
		role={undefined}
		trigger={trigger}
		content={({ setInitialFocusRef }) => <input ref={setInitialFocusRef} />}
	/>,
	// A role that can be another role.
	<Popup
		isOpen
		role={isKeyboard ? 'dialog' : 'menu'}
		trigger={trigger}
		// @ts-expect-error a conditional role: no setter
		content={({ setInitialFocusRef }) => <input ref={setInitialFocusRef} />}
	/>,
	// menu and listbox: the pattern sets the focus target.
	<Popup
		isOpen
		role="menu"
		trigger={trigger}
		// @ts-expect-error menu: no setter
		content={({ setInitialFocusRef }) => <input ref={setInitialFocusRef} />}
	/>,
	<Popup
		isOpen
		role="listbox"
		trigger={trigger}
		// @ts-expect-error listbox: no setter
		content={({ setInitialFocusRef }) => <input ref={setInitialFocusRef} />}
	/>,
	// Other roles and no role still compile when the content does not read the setter.
	<Popup isOpen role="menu" trigger={trigger} content={({ isOpen }) => String(isOpen)} />,
	<Popup isOpen role={stringRole} trigger={trigger} content={({ onClose }) => String(!!onClose)} />,
	<Popup isOpen trigger={trigger} content={({ update }) => String(!!update)} />,
];

const NeedsSetter = ({ setInitialFocusRef }: DialogContentProps) => (
	<input ref={setInitialFocusRef} />
);
const AnyContent = ({ isOpen }: ContentProps) => <span>{String(isOpen)}</span>;

export const namedContentCases = (): React.ReactNode[] => [
	<Popup isOpen role="dialog" label="Dialog" trigger={trigger} content={NeedsSetter} />,
	<Popup isOpen role="dialog" label="Dialog" trigger={trigger} content={AnyContent} />,
	<Popup isOpen role="note" trigger={trigger} content={AnyContent} />,
	// @ts-expect-error a content component that needs the setter cannot go on a no-role popup
	<Popup isOpen trigger={trigger} content={NeedsSetter} />,
];

// `ComponentProps<typeof Popup>` reads the last call signature (`PopupProps`), so wrappers compile.
type TWrapperProps = ComponentProps<typeof Popup>;
// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props -- a wrapper that forwards every prop is the case under test
const Wrapper = (props: TWrapperProps) => <Popup {...props} />;
// A distributive `Omit` keeps the `shouldFitContainer` union.
type TUnionOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
const DialogWrapper = (props: TUnionOmit<DialogPopupProps, 'role'>) => (
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props -- a wrapper that forwards every prop is the case under test
	<Popup {...props} role="dialog" />
);
const assertPopupProps = (props: PopupProps): TWrapperProps => props;

export const wrapperCases = (): React.ReactNode[] => [
	<Wrapper isOpen role="dialog" trigger={trigger} content={() => null} />,
	<Wrapper
		isOpen
		role="dialog"
		trigger={trigger}
		// @ts-expect-error a `ComponentProps<typeof Popup>` wrapper does not pass the setter on
		content={({ setInitialFocusRef }) => <input ref={setInitialFocusRef} />}
	/>,
	<DialogWrapper
		isOpen
		label="Dialog"
		trigger={trigger}
		content={({ setInitialFocusRef }) => <input ref={setInitialFocusRef} />}
	/>,
	String(!!assertPopupProps),
];

const ContentWrapper = (props: ComponentProps<typeof PopupContent>) => (
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props -- a wrapper that forwards every prop is the case under test
	<PopupContent {...props} />
);

export const composableCases = (): React.ReactNode[] => [
	<PopupContent role="dialog" label="Dialog">
		{({ setInitialFocusRef }) => <input ref={setInitialFocusRef} />}
	</PopupContent>,
	<PopupContent role="alertdialog" label="Alert dialog" shouldFitContainer>
		{({ setInitialFocusRef }) => <button type="button" ref={setInitialFocusRef} />}
	</PopupContent>,
	<PopupContent>
		{
			// @ts-expect-error no role: no setter
			({ setInitialFocusRef }) => <input ref={setInitialFocusRef} />
		}
	</PopupContent>,
	<PopupContent role={stringRole}>
		{
			// @ts-expect-error a `string` role: no setter
			({ setInitialFocusRef }) => <input ref={setInitialFocusRef} />
		}
	</PopupContent>,
	<PopupContent role={isKeyboard ? 'dialog' : undefined}>
		{({ setInitialFocusRef }) => <input ref={setInitialFocusRef} />}
	</PopupContent>,
	<PopupContent role={isKeyboard ? 'dialog' : 'menu'}>
		{
			// @ts-expect-error a conditional role: no setter
			({ setInitialFocusRef }) => <input ref={setInitialFocusRef} />
		}
	</PopupContent>,
	<PopupContent role="menu">
		{
			// @ts-expect-error menu: no setter
			({ setInitialFocusRef }) => <input ref={setInitialFocusRef} />
		}
	</PopupContent>,
	<PopupContent role="listbox">
		{
			// @ts-expect-error listbox: no setter
			({ setInitialFocusRef }) => <input ref={setInitialFocusRef} />
		}
	</PopupContent>,
	<PopupContent role="listbox">{({ isOpen }) => String(isOpen)}</PopupContent>,
	<ContentWrapper role="dialog">{() => null}</ContentWrapper>,
	<ContentWrapper role="dialog">
		{
			// @ts-expect-error a `ComponentProps<typeof PopupContent>` wrapper does not pass the setter on
			({ setInitialFocusRef }) => <input ref={setInitialFocusRef} />
		}
	</ContentWrapper>,
];

describe('setInitialFocusRef types', () => {
	it('is checked by the typecheck (see the @ts-expect-error cases in this file)', () => {
		expect(classicCases).toBeDefined();
		expect(namedContentCases).toBeDefined();
		expect(wrapperCases).toBeDefined();
		expect(composableCases).toBeDefined();
	});
});
