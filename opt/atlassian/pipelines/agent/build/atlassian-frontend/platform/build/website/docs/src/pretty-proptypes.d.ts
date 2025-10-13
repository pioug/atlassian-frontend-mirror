// Added this hack for src/ts-morph-ui/props-table.tsx, which is the first TSX file that references pretty-proptypes
// in this package. There are JS files which reference pretty-proptypes, but they (obviously) don't need the type definitions.
declare module 'pretty-proptypes' {
	export const Prop: any;
	export const PropsTable: any;
	export const components: any;
	export const LayoutRenderer: any;
}
