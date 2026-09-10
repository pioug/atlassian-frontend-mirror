// @ts-ignore
import replaceImports from 'codesandboxer/dist/replaceImports';

const cssResetRegexString = /((?:import|export)\s*['"\`])(..\/src\/index.less)(['"\`]\s*)/;
const srcEntryPointRegexString =
	/((?:import|export)[^'"\`]*['"\`])((\.\.\/){1,}src\/)([^/]*['"\`]\s*)/;

/**
 * Replaces source code imports with package names
 * @param content - The source code content to process
 * @param name - The package name to replace with
 * @returns The processed source code with replaced imports
 */
export function replaceSrc(content: string, name: string): string {
	let replacedCode = content;
	if (name === '@atlaskit/css-reset') {
		replacedCode = replacedCode.replace(cssResetRegexString, `$1${name}$3`);
	}

	if (name) {
		// Replace ../src/<entry-point> with ${name}/<entry-point>
		replacedCode = replacedCode.replace(srcEntryPointRegexString, `$1${name}/$4`);

		replacedCode = replaceImports(replacedCode, [
			['../src', name],
			['../../src', name],
		]);
	}
	return replacedCode;
}
