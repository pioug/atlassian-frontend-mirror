// Clean Common Props
// ==============================

import type { CommonPropsAndClassName, GroupBase } from '../types';

export const cleanCommonProps: <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
	AdditionalProps,
>(
	props: Partial<CommonPropsAndClassName<Option, IsMulti, Group>> & AdditionalProps,
) => Omit<AdditionalProps, keyof CommonPropsAndClassName<Option, IsMulti, Group>> = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
	AdditionalProps,
>(
	props: Partial<CommonPropsAndClassName<Option, IsMulti, Group>> & AdditionalProps,
): Omit<AdditionalProps, keyof CommonPropsAndClassName<Option, IsMulti, Group>> => {
	//className
	const {
		className, // not listed in commonProps documentation, needs to be removed to allow Emotion to generate classNames
		clearValue,
		cx,
		xcss,
		getStyles,
		getClassNames,
		getValue,
		hasValue,
		isMulti,
		isRtl,
		options, // not listed in commonProps documentation
		selectOption,
		selectProps,
		setValue,
		...innerProps
	} = props;
	return { ...innerProps };
};
