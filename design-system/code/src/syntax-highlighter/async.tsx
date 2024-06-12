import React from 'react';

import highlight from './lib/highlight';
import { type AstGenerator, type SyntaxHighlighter } from './types';

type AstPromise = Promise<AstGenerator> | null;
type GeneratorOptions = {
	loader: () => Promise<AstGenerator>;
};

// Uses the loader method of async bundling
// Instantiates highligher as a singleton, loading refractor only once per page (refractor/prism are singleton modules)
const generator = (options: GeneratorOptions): typeof SyntaxHighlighter => {
	const { loader } = options;

	// eslint-disable-next-line @repo/internal/react/no-class-components
	class AsyncHighlighter extends React.PureComponent {
		static astGenerator: AstGenerator = null;
		static highlightInstance = highlight;
		static astGeneratorPromise: AstPromise;

		// Useful in tests
		static preload() {
			return AsyncHighlighter.loadAstGenerator();
		}

		static loadAstGenerator(): AstPromise {
			AsyncHighlighter.astGeneratorPromise = loader().then((astGenerator: AstGenerator) => {
				AsyncHighlighter.astGenerator = astGenerator;
				return astGenerator;
			});

			return AsyncHighlighter.astGeneratorPromise;
		}

		componentDidMount() {
			if (!AsyncHighlighter.astGeneratorPromise) {
				AsyncHighlighter.loadAstGenerator();
			}

			if (!AsyncHighlighter.astGenerator && AsyncHighlighter.astGeneratorPromise) {
				AsyncHighlighter.astGeneratorPromise.then(() => {
					this.forceUpdate();
				});
			}
		}

		render() {
			return (
				<AsyncHighlighter.highlightInstance
					{...this.props}
					astGenerator={AsyncHighlighter.astGenerator}
				/>
			);
		}
	}

	return AsyncHighlighter;
};

export default generator({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_refractor-import" */
			'refractor'
		).then((module) => {
			// Webpack 3 returns module.exports as default as module, but webpack 4 returns module.exports as module.default
			return module.default || module;
		}),
});
