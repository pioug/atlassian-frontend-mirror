/* eslint-disable no-useless-escape */
import replaceImports from 'codesandboxer/dist/replaceImports';

const cssResetRegexString = /((?:import|export)\s*['"\`])(..\/src\/index.less)(['"\`]\s*)/;
const srcEntryPointRegexString = /((?:import|export)[^'"\`]*['"\`])((\.\.\/){1,}src\/)([^/]*['"\`]\s*)/;

export default function replaceSrc(content /*: string*/, name /*: string*/) {
  let replacedCode = content;
  if (name === '@atlaskit/css-reset') {
    replacedCode = replacedCode.replace(cssResetRegexString, `$1${name}$3`);
  }

  if (name) {
    // Replace ../src/<entry-point> with ${name}/<entry-point>
    replacedCode = replacedCode.replace(
      srcEntryPointRegexString,
      `$1${name}/$4`,
    );

    replacedCode = replaceImports(replacedCode, [
      ['../src', name],
      ['../../src', name],
    ]);
  }
  return replacedCode;
}
