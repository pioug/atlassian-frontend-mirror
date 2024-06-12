import { type FileInfo, type API, type Options } from 'jscodeshift';

export type Transform = (fileInfo: FileInfo, { jscodeshift }: API, options: Options) => string;

export type CliFlags = {
	/**
	 * The transform to run
	 */
	transform?: string;
	/**
	 * select which transform to run
	 */
	preset?: string;
	/**
	 * Comma separated list of packages to run transforms for, @scope/package[@version]. If version is supplied, will only run transforms above that version
	 */
	packages?: string;
	/**
	 * Parser to use for parsing the source files
	 */
	parser: 'babel' | 'babylon' | 'flow' | 'ts' | 'tsx';
	/**
	 * Transform files with these file extensions (comma separated list)
	 */
	extensions: string;
	/**
	 * Ignore files that match a provided glob expression
	 */
	ignorePattern: string;
	/**
	 * Determines changed packages since the specified git ref and runs all codemods for them. The ref can be any valid git ref, e.g. a commit hash, HEAD etc.
	 */
	sinceRef?: string;
	/**
	 * Return a 1 exit code when errors were found during execution of codemods
	 */
	failOnError?: boolean;
	/**
	 * Filters source paths to package directories that declare a dependency on the package being upgraded
	 */
	filterPaths?: boolean;
};

export type Flags = CliFlags & {
	logger: {
		log: (...args: any) => void;
		warn: (...args: any) => void;
	};
};

export type ParsedPkg = {
	name: string;
	version: string | null;
};

/** Converts required args to optional if they have a default
 * Example: export type UserFlags = Default<Flags, keyof typeof defaultFlags>;
 */
export type Default<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ValidateShape<T, Shape> = T extends Shape
	? Exclude<keyof T, keyof Shape> extends never
		? T
		: never
	: never;

export class ValidationError extends Error {}
export class NoTransformsExistError extends Error {}
