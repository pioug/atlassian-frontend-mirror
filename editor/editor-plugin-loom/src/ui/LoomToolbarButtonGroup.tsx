import React, { createContext, forwardRef, useContext, useMemo } from 'react';
import type { ForwardedRef, ReactNode } from 'react';

import { Show } from '@atlaskit/editor-toolbar/show';
import { ToolbarButtonGroup } from '@atlaskit/editor-toolbar/toolbar-button-group';

import type { ButtonComponentProps, LoomPluginOptions } from '../types';

type LoomToolbarButtonState = {
	buttonProps: ButtonComponentProps;
	buttonRef: ForwardedRef<HTMLElement>;
};

const GroupChildrenContext = createContext<ReactNode>(null);
const ButtonStateContext = createContext<LoomToolbarButtonState | undefined>(undefined);

export const useLoomToolbarButtonState = (): LoomToolbarButtonState | undefined =>
	useContext(ButtonStateContext);

const EligibleButtonGroup = forwardRef<HTMLElement, ButtonComponentProps>(
	function EligibleButtonGroup(
		{ isDisabled, onClickBeforeInit, selected, onBlur, onFocus },
		buttonRef,
	) {
		const children = useContext(GroupChildrenContext);
		const buttonState = useMemo(
			() => ({
				buttonProps: { isDisabled, onClickBeforeInit, selected, onBlur, onFocus },
				buttonRef,
			}),
			[isDisabled, onClickBeforeInit, selected, onBlur, onFocus, buttonRef],
		);

		return (
			<ButtonStateContext.Provider value={buttonState}>
				<Show above="lg">
					<ToolbarButtonGroup>{children}</ToolbarButtonGroup>
				</Show>
			</ButtonStateContext.Provider>
		);
	},
);

export const LoomToolbarButtonGroup = ({
	children,
	renderButton,
}: {
	children: ReactNode;
} & Pick<LoomPluginOptions, 'renderButton'>): React.JSX.Element => (
	<GroupChildrenContext.Provider value={children}>
		{renderButton ? renderButton(EligibleButtonGroup) : <EligibleButtonGroup />}
	</GroupChildrenContext.Provider>
);
