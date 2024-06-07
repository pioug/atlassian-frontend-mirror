/**
 * Logical property	to physical property map
 * @example
 * ```
 * border-block-end	border-bottom
 * border-block-end-color	border-bottom-color
 * border-block-end-style	border-bottom-style
 * border-block-end-width	border-bottom-width
 * border-block-start	border-top
 * border-block-start-color	border-top-color
 * border-block-start-style	border-top-style
 * border-block-start-width	border-top-width
 * border-inline-end	border-right
 * border-inline-end-color	border-right-color
 * border-inline-end-style	border-right-style
 * border-inline-end-width	border-right-width
 * border-inline-start	border-left
 * border-inline-start-color	border-left-color
 * border-inline-start-style	border-left-style
 * border-inline-start-width	border-left-width
 * border-start-start-radius	border-top-left-radius
 * border-end-start-radius	border-bottom-left-radius
 * border-start-end-radius	border-top-right-radius
 * border-end-end-radius	border-bottom-right-radius
 * margin-block-end	margin-bottom
 * margin-block-start	margin-top
 * margin-inline-end	margin-right
 * margin-inline-start	margin-left
 * padding-block-end	padding-bottom
 * padding-block-start	padding-top
 * padding-inline-end	padding-right
 * padding-inline-start	padding-left
 * inset-inline-start	left
 * inset-inline-end	right
 * inset-block-start	top
 * inset-block-end	bottom
 * ```
 */
export const logicalPhysicalMap = {
	borderBlockEnd: 'borderBottom',
	borderBlockEndColor: 'borderBottomColor',
	borderBlockEndStyle: 'borderBottomStyle',
	borderBlockEndWidth: 'borderBottomWidth',
	borderBlockStart: 'borderTop',
	borderBlockStartColor: 'borderTopColor',
	borderBlockStartStyle: 'borderTopStyle',
	borderBlockStartWidth: 'borderTopWidth',
	borderInlineEnd: 'borderRight',
	borderInlineEndColor: 'borderRightColor',
	borderInlineEndStyle: 'borderRightStyle',
	borderInlineEndWidth: 'borderRightWidth',
	borderInlineStart: 'borderLeft',
	borderInlineStartColor: 'borderLeftColor',
	borderInlineStartStyle: 'borderLeftStyle',
	borderInlineStartWidth: 'borderLeftWidth',
	borderStartStartRadius: 'borderTopLeftRadius',
	borderEndStartRadius: 'borderBottomLeftRadius',
	borderStartEndRadius: 'borderTopRightRadius',
	borderEndEndRadius: 'borderBottomRightRadius',
	marginBlockEnd: 'marginBottom',
	marginBlockStart: 'marginTop',
	marginInlineEnd: 'marginRight',
	marginInlineStart: 'marginLeft',
	paddingBlockEnd: 'paddingBottom',
	paddingBlockStart: 'paddingTop',
	paddingInlineEnd: 'paddingRight',
	paddingInlineStart: 'paddingLeft',
	insetInlineStart: 'left',
	insetInlineEnd: 'right',
	insetBlockStart: 'top',
	insetBlockEnd: 'bottom',
} as const;

export const physicalLogicalMap = {
	borderBottom: 'borderBlockEnd',
	borderBottomColor: 'borderBlockEndColor',
	borderBottomStyle: 'borderBlockEndStyle',
	borderBottomWidth: 'borderBlockEndWidth',
	borderTop: 'borderBlockStart',
	borderTopColor: 'borderBlockStartColor',
	borderTopStyle: 'borderBlockStartStyle',
	borderTopWidth: 'borderBlockStartWidth',
	borderRight: 'borderInlineEnd',
	borderRightColor: 'borderInlineEndColor',
	borderRightStyle: 'borderInlineEndStyle',
	borderRightWidth: 'borderInlineEndWidth',
	borderLeft: 'borderInlineStart',
	borderLeftColor: 'borderInlineStartColor',
	borderLeftStyle: 'borderInlineStartStyle',
	borderLeftWidth: 'borderInlineStartWidth',
	borderTopLeftRadius: 'borderStartStartRadius',
	borderBottomLeftRadius: 'borderEndStartRadius',
	borderTopRightRadius: 'borderStartEndRadius',
	borderBottomRightRadius: 'borderEndEndRadius',
	marginBottom: 'marginBlockEnd',
	marginTop: 'marginBlockStart',
	marginRight: 'marginInlineEnd',
	marginLeft: 'marginInlineStart',
	paddingBottom: 'paddingBlockEnd',
	paddingTop: 'paddingBlockStart',
	paddingRight: 'paddingInlineEnd',
	paddingLeft: 'paddingInlineStart',
	left: 'insetInlineStart',
	right: 'insetInlineEnd',
	top: 'insetBlockStart',
	bottom: 'insetBlockEnd',
} as const;
