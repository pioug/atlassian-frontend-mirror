/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import PropsLayoutRenderer, { PropTable } from './props-table';

const propsStyles = css({
	marginBlockEnd: token('space.600'),
	marginBlockStart: token('space.200'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:last-child': {
		marginBlockEnd: token('space.0'),
	},
});

/**
 * This gets imported in two places:
 *   1. Top-level component pages
 *   2. Sub-level component pages
 *
 * By having a wrapper we can have a single source of truth for both locations.
 */
const Props = (props: any) => {
	return (
		<div css={propsStyles}>
			<PropsLayoutRenderer {...props} />
		</div>
	);
};

type PropDefinition = {
	name: string;
	required: boolean;
	description: string;
	type: string;
	typeValue?: string;
	defaultValue?: string;
	deprecated: boolean;
	isInternal?: boolean;
};

/**
 * Filter for props
 *
 * Backward compatibility:
 * When filter is undefined, a backward compatible filter is used.
 * The backward compatible filter allows component props and include the 'ref' prop.
 * We allow the 'ref' prop to be displayed as a component prop
 *
 * @typedef {Object} Filter - Filter when an object has the following optional properties in descending order of precedence:
 * @property {string[]} [only] - Only allow props with these names when defined
 * @property {string[]} [include] - Include props with these names when defined regardless of scope, otherwise filter based on scope
 * @property {'internal' | 'component' | 'all'} [scope] - Scope of props to allow based on where the prop is defined, either internal (React/HTML) or component. Default is `all`, when a filter is defined.
 *
 * @typedef {Function} Filter - Filter when a function is passed a prop and returns a boolean
 */
type PropFilter =
	| {
			only?: string[];
			include?: string[];
			scope?: 'internal' | 'component' | 'all';
	  }
	| ((prop: PropDefinition) => boolean);

/**
 * Helper function to converts a PropFilter to a prop array filter predicate
 */
function toPredicate(
	filter: PropFilter = { scope: 'component', include: ['ref'] },
): (prop: PropDefinition) => boolean {
	if (typeof filter === 'function') {
		return filter;
	}

	const { only, include, scope = 'all' } = filter;
	return (prop: PropDefinition) => {
		const { name, isInternal = !!prop.description && prop.description.includes('@internal') } =
			prop;
		if (Array.isArray(only)) {
			return only.includes(name);
		} else if (Array.isArray(include) && include.includes(name)) {
			return true;
		}
		switch (scope) {
			case 'all':
				return true;
			case 'internal':
				return isInternal;
			case 'component':
				return !isInternal;
			default:
				throw new Error(
					`Invalid scope: '${scope}', must be one of 'internal', 'component', or 'all'`,
				);
		}
	};
}

export const TSMorphProps = ({
	props,
	filter,
	componentDisplayName,
}: {
	props: PropDefinition[];
	filter?: PropFilter;
	componentDisplayName?: string;
}) => (
	<div css={propsStyles} data-testid="tsmorph-props--container">
		{/* TODO Add conditional rendering for different types */}
		{props
			?.filter(toPredicate(filter))
			.map(({ description, name, deprecated, required, type, defaultValue, typeValue }) => (
				<PropTable
					key={name}
					deprecated={deprecated}
					description={description}
					name={name}
					required={required}
					type={type}
					defaultValue={defaultValue}
					typeValue={typeValue}
					componentDisplayName={componentDisplayName}
				/>
			))}
	</div>
);
export default Props;
