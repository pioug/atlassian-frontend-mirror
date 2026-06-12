type PrettierParser = 'babel' | 'json';
type SqlFormatter = typeof import('sql-formatter')['format'];

type FormatCode = (content: string) => Promise<string> | string;
type FormatCodeLanguage = 'javascript' | 'json' | 'jsx' | 'sql';
type FormatPrettierCode = (content: string, parser: PrettierParser) => Promise<string>;
type LoadFormatter = () => Promise<FormatCode>;

let prettierFormatterPromise: Promise<FormatPrettierCode> | undefined;
let sqlFormatterPromise: Promise<SqlFormatter> | undefined;

const stripFinalLineEnding = (content: string): string => {
	if (content.endsWith('\r\n')) {
		return content.slice(0, -2);
	}

	if (content.endsWith('\n')) {
		return content.slice(0, -1);
	}

	return content;
};

const loadPrettierFormatter = (): Promise<FormatPrettierCode> => {
	if (!prettierFormatterPromise) {
		prettierFormatterPromise = Promise.all([
			import(
				/* webpackChunkName: "@atlaskit-internal_editor-code-format-provider-prettier" */ 'prettier/standalone'
			),
			import(
				/* webpackChunkName: "@atlaskit-internal_editor-code-format-provider-prettier-babel" */ 'prettier/plugins/babel'
			),
			import(
				/* webpackChunkName: "@atlaskit-internal_editor-code-format-provider-prettier-estree" */ 'prettier/plugins/estree'
			),
		])
			.then(([prettier, babelPlugin, estreePlugin]) => {
				return (content: string, parser: PrettierParser) =>
					prettier
						.format(content, {
							parser,
							plugins: [babelPlugin.default, estreePlugin.default],
						})
						.then(stripFinalLineEnding);
			})
			.catch((error) => {
				prettierFormatterPromise = undefined;
				throw error;
			});
	}

	return prettierFormatterPromise;
};

const loadSqlFormatter = (): Promise<SqlFormatter> => {
	if (!sqlFormatterPromise) {
		sqlFormatterPromise = import(
			/* webpackChunkName: "@atlaskit-internal_editor-code-format-provider-sql-formatter" */ 'sql-formatter'
		)
			.then((formatter) => formatter.format)
			.catch((error) => {
				sqlFormatterPromise = undefined;
				throw error;
			});
	}

	return sqlFormatterPromise;
};

const loadPrettierLanguageFormatter =
	(parser: PrettierParser): LoadFormatter =>
	async () => {
		const format = await loadPrettierFormatter();
		return (content) => format(content, parser);
	};

const loadSqlLanguageFormatter: LoadFormatter = async () => {
	const format = await loadSqlFormatter();
	return (content) => format(content, { language: 'sql' });
};

const languageFormatters: Record<FormatCodeLanguage, LoadFormatter> = {
	javascript: loadPrettierLanguageFormatter('babel'),
	json: loadPrettierLanguageFormatter('json'),
	jsx: loadPrettierLanguageFormatter('babel'),
	sql: loadSqlLanguageFormatter,
};

export const isSupportedLanguage = (
	language: string | null | undefined,
): language is FormatCodeLanguage =>
	typeof language === 'string' && language in languageFormatters;

export const loadFormatter = (language: FormatCodeLanguage): Promise<FormatCode> =>
	languageFormatters[language]();
