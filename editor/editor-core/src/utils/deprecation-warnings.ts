export interface DeprecationWarning<Props> {
	condition?: (props: Props) => boolean;
	description?: string;
	property: string;
	type?: string;
}

function deprecationWarnings<Props extends object>(
	className: string,
	props: Props,
	deprecations: Array<DeprecationWarning<Props>>,
): void {
	if (process.env.NODE_ENV === 'production') {
		return;
	}
	for (const deprecation of deprecations) {
		const {
			property,
			type = 'enabled by default',
			description = '',
			condition = () => true,
		} = deprecation;

		if (props.hasOwnProperty(property)) {
			if (condition(props)) {
				// eslint-disable-next-line no-console
				console.warn(
					`${property} property for ${className} is deprecated. ${description} [Will be ${type} in the next major editor-core version]`,
				);
			}
		}
	}
}

export default deprecationWarnings;
