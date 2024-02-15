import prettier from 'prettier';

const prettierConfig: prettier.Options = {
  semi: true,
  printWidth: 80,
  useTabs: false,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  proseWrap: 'always',
  parser: 'typescript',
};

export function sortObjectKeys(obj: Record<string, any>): Record<string, any> {
  const sortedKeys = Object.keys(obj).sort();
  const sortedObj: Record<string, any> = {};

  for (const key of sortedKeys) {
    sortedObj[key] = obj[key];
  }

  return sortedObj;
}

export function formatCode(code: string): string {
  return prettier.format(code, prettierConfig);
}
