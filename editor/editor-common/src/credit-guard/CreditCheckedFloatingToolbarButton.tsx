import React, { useCallback } from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { token } from '@atlaskit/tokens';

import type { Command } from '../types/command';
import type { FloatingToolbarButton } from '../types/floating-toolbar';
import FloatingToolbarButtonComponent from '../ui/FloatingToolbar/Button';
import { CreditCheckedPopup, type CreditCheckedTriggerProps } from './CreditCheckedPopup';
import type { AICreditCheck, GetAICreditStatus } from './types';

/**
 * A confirm dialog needs the floating toolbar's own state, and a link would navigate before the
 * credit check, so neither can be credit checked.
 */
type UnsupportedButtonProps = 'confirmDialog' | 'href' | 'target';

export type CreditCheckableFloatingToolbarButton = Omit<
	FloatingToolbarButton<Command>,
	UnsupportedButtonProps
> & { [Prop in UnsupportedButtonProps]?: never };

export type CreditCheckedFloatingToolbarButtonProps = {
	areAnyNewToolbarFlagsEnabled: boolean;
	button: CreditCheckableFloatingToolbarButton;
	creditCheck: AICreditCheck;
	getAICreditStatus: GetAICreditStatus;
	view?: EditorView;
};

/**
 * A floating toolbar button that checks AI credits before running its action, and anchors the
 * product's credits popup to itself when credits are blocked. Matches the floating toolbar's own buttons.
 */
export const CreditCheckedFloatingToolbarButton = ({
	areAnyNewToolbarFlagsEnabled,
	button,
	creditCheck,
	getAICreditStatus,
	view,
}: CreditCheckedFloatingToolbarButtonProps): React.JSX.Element => {
	const runCommand = useCallback(
		(command?: Command) => {
			if (view && command) {
				command(view.state, view.dispatch, view);
			}
		},
		[view],
	);

	const { focusEditoronEnter, onClick } = button;
	const runAction = useCallback(() => {
		runCommand(onClick);
		if (focusEditoronEnter && !view?.hasFocus()) {
			view?.focus();
		}
	}, [runCommand, onClick, focusEditoronEnter, view]);

	const renderTrigger = useCallback(
		(triggerProps: CreditCheckedTriggerProps) => {
			const { disabled = false, showTitle, title } = button;
			const selected = Boolean(button.selected) || triggerProps.isSelected;
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const ButtonIcon = button.icon as React.ComponentClass<any> | undefined;
			const IconAfter = button.iconAfter;
			return (
				<FloatingToolbarButtonComponent
					ref={triggerProps.ref}
					id={triggerProps.id}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/no-unsafe-style-overrides -- Matches the floating toolbar's own buttons
					className={button.className}
					title={title}
					ariaLabel={button.ariaLabel}
					icon={
						ButtonIcon ? (
							<ButtonIcon
								color={
									disabled
										? token('color.icon.disabled')
										: selected
											? token('color.icon.selected')
											: 'currentColor'
								}
								spacing="spacious"
								label={undefined}
								aria-hidden={true}
							/>
						) : undefined
					}
					iconAfter={IconAfter ? <IconAfter label="" /> : undefined}
					appearance={button.appearance}
					onClick={triggerProps.onClick}
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Matches the floating toolbar's own buttons
					onMouseEnter={() => runCommand(button.onMouseEnter)}
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Matches the floating toolbar's own buttons
					onMouseLeave={() => runCommand(button.onMouseLeave)}
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Matches the floating toolbar's own buttons
					onFocus={() => runCommand(button.onFocus)}
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Matches the floating toolbar's own buttons
					onBlur={() => runCommand(button.onBlur)}
					onMount={button.onMount}
					onUnmount={button.onUnmount}
					selected={selected}
					disabled={disabled}
					tooltipContent={button.tooltipContent}
					hideTooltipOnClick={button.hideTooltipOnClick}
					hasNewContentOnTriggerClick={button.hasNewContentOnTriggerClick}
					ariaHasPopup={triggerProps['aria-haspopup']}
					areaControls={triggerProps['aria-controls']}
					tabIndex={button.tabIndex}
					isRadioButton={button.isRadioButton}
					pulse={button.pulse}
					testId={button.testId}
					interactionName={button.interactionName}
					areAnyNewToolbarFlagsEnabled={areAnyNewToolbarFlagsEnabled}
				>
					{showTitle && title}
				</FloatingToolbarButtonComponent>
			);
		},
		[areAnyNewToolbarFlagsEnabled, button, runCommand],
	);

	return (
		<CreditCheckedPopup
			creditCheck={creditCheck}
			getAICreditStatus={getAICreditStatus}
			onAllowed={runAction}
			placement="bottom-start"
			renderTrigger={renderTrigger}
		/>
	);
};
