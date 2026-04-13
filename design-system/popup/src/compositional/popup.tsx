import React, { useState } from 'react';

import { useId } from '@atlaskit/ds-lib/use-id';
import { Manager } from '@atlaskit/popper';

import { IdContext } from './id-context';
import { EnsureIsInsidePopupContext } from './is-inside-popup-context';
import { IsOpenContext } from './is-open-context';
import { RoleContext } from './role-context';
import { SetTriggerRefContext } from './set-trigger-ref-context';
import { TriggerRefContext } from './trigger-ref-context';

export type PopupProps = {
	children: React.ReactNode;
	isOpen?: boolean;
	id?: string;
	role?: 'dialog';
};

/**
 * __Popup__
 *
 * Popup is a composable component that provides the context for the trigger and content components.
 *
 * Usage example:
 * ```jsx
 * <Popup>
 *   <PopupTrigger>
 *     {(props) => (
 *       <button type="button" {...props}>Click me</button>
 *      )}
 *   </PopupTrigger>
 *   <PopupContent>
 *     {(props) => <div>Hello world</div>}
 *   </PopupContent>
 * </Popup>
 * ```
 */
export const Popup = ({
	children,
	id: providedId,
	isOpen = false,
	role,
}: PopupProps): React.JSX.Element => {
	const [triggerRef, setTriggerRef] = useState<HTMLElement | null>(null);

	const generatedId = useId();
	const id = providedId || generatedId;

	return (
		<RoleContext.Provider value={role}>
			<EnsureIsInsidePopupContext.Provider value={true}>
				<IdContext.Provider value={id}>
					<TriggerRefContext.Provider value={triggerRef}>
						<SetTriggerRefContext.Provider value={setTriggerRef}>
							<IsOpenContext.Provider value={isOpen}>
								<Manager>{children}</Manager>
							</IsOpenContext.Provider>
						</SetTriggerRefContext.Provider>
					</TriggerRefContext.Provider>
				</IdContext.Provider>
			</EnsureIsInsidePopupContext.Provider>
		</RoleContext.Provider>
	);
};
