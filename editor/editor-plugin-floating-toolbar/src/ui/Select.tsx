import React, { useRef } from 'react';

import type { SelectOption } from '@atlaskit/editor-common/types';
import type { ValueType } from '@atlaskit/select';
import Select from '@atlaskit/select';

export interface Props {
	ariaLabel?: string;
	boundariesElement?: HTMLElement;
	classNamePrefix?: string;
	defaultValue?: SelectOption | null;
	dispatchCommand: (command: Function) => void;
	filterOption?: ((option: SelectOption, rawInput: string) => boolean) | null;
	hideExpandIcon?: boolean;
	mountPoint?: HTMLElement;
	onChange?: (change: ValueType<SelectOption>) => void;
	options: SelectOption[];
	placeholder?: string;
	scrollableElement?: HTMLElement;
	setDisableParentScroll?: (disable: boolean) => void;
	width?: number;
}

export default function Search(props: Props): React.JSX.Element {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const selectRef = useRef<any>(null);

	const { width = 200 } = props;
	const style = React.useMemo(
		() => ({
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			container: (base: any) => ({ ...base, width }),
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			menuPortal: (base: any) => {
				// ED:16095: We add two possible getter paths for safely reaching into the underlying
				// react-select element. We first try a getter that conforms with react-select v5 APIs,
				// Failing that, we try a getter consistent with react-select v4 APIs. (We
				// handle both as consumers may control the time of the actual dependency version
				// cutover).
				const controlWrapper =
					selectRef?.current?.select?.controlRef?.parentNode ||
					selectRef?.current?.select?.select?.controlRef?.parentNode;

				const menuPortalStyles =
					controlWrapper && props.setDisableParentScroll
						? {
								// since the portal is now outside, we need to position it as before
								// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
								top: controlWrapper.offsetTop,
								// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
								left: controlWrapper.offsetLeft,
								height: controlWrapper.offsetHeight,
								width,
							}
						: {};
				return {
					...base,
					...menuPortalStyles,
				};
			},
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[width],
	);

	const onMenuOpen = () => {
		if (props.setDisableParentScroll) {
			props.setDisableParentScroll(true);
		}
	};

	const onMenuClose = () => {
		if (props.setDisableParentScroll) {
			props.setDisableParentScroll(false);
		}
	};

	return (
		<Select<SelectOption>
			ref={selectRef}
			options={props.options}
			value={props.defaultValue}
			onChange={props.onChange}
			placeholder={props.placeholder}
			spacing="compact"
			menuPlacement="auto"
			filterOption={props.filterOption}
			styles={style}
			menuPortalTarget={props.mountPoint}
			onMenuOpen={onMenuOpen}
			onMenuClose={onMenuClose}
			label={props.ariaLabel}
			classNamePrefix={props.classNamePrefix}
		/>
	);
}
