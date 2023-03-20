# SyntaxHighlighter

Syntax highlighting component for React using [refractor](https://github.com/wooorm/refractor) and [prism](https://github.com/PrismJS/prism).

Originally based on the [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) library that was a previous dependency of `@atlaskit/code`, but we've heavily modified it to make it more purpose-built for our requirements.

There is potential in the future to provide alternate renderers for the AST that this library produces (via [refractor](https://github.com/wooorm/refractor)). For now we are only accounting for React contexts by piping it into a React renderer that gives CodeBlock what it wants.
