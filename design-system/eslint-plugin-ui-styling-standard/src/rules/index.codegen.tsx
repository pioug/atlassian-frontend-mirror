/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::34a66bfc786bfa49ea7d4ad66ffe81f7>>
 * @codegenCommand yarn workspace @atlaskit/eslint-plugin-ui-styling-standard codegen
 */
import type { Rule } from 'eslint';

import atlaskitTheme from './atlaskit-theme';
import convertPropsSyntax from './convert-props-syntax';
import enforceStyleProp from './enforce-style-prop';
import localCxXcss from './local-cx-xcss';
import noArrayArguments from './no-array-arguments';
import noClassnameProp from './no-classname-prop';
import noContainerQueries from './no-container-queries';
import noDynamicStyles from './no-dynamic-styles';
import noExportedStyles from './no-exported-styles';
import noGlobalStyles from './no-global-styles';
import noImportantStyles from './no-important-styles';
import noImportedStyleValues from './no-imported-style-values';
import noNestedSelectors from './no-nested-selectors';
import noStyled from './no-styled';
import noUnsafeSelectors from './no-unsafe-selectors';
import noUnsafeValues from './no-unsafe-values';
import useCompiled from './use-compiled';

export const rules: Record<string, Rule.RuleModule> = {
	'atlaskit-theme': atlaskitTheme,
	'convert-props-syntax': convertPropsSyntax,
	'enforce-style-prop': enforceStyleProp,
	'local-cx-xcss': localCxXcss,
	'no-array-arguments': noArrayArguments,
	'no-classname-prop': noClassnameProp,
	'no-container-queries': noContainerQueries,
	'no-dynamic-styles': noDynamicStyles,
	'no-exported-styles': noExportedStyles,
	'no-global-styles': noGlobalStyles,
	'no-important-styles': noImportantStyles,
	'no-imported-style-values': noImportedStyleValues,
	'no-nested-selectors': noNestedSelectors,
	'no-styled': noStyled,
	'no-unsafe-selectors': noUnsafeSelectors,
	'no-unsafe-values': noUnsafeValues,
	'use-compiled': useCompiled,
};
