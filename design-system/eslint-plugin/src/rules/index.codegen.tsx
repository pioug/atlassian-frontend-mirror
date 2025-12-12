/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::02be73e0813b6f22038f0f3f2ad6865d>>
 * @codegenCommand yarn workspace @atlaskit/eslint-plugin-design-system codegen
 */
import type { Rule } from 'eslint';

import consistentCssPropUsage from './consistent-css-prop-usage';
import enforceInlineStylesInSelect from './enforce-inline-styles-in-select';
import ensureDesignTokenUsage from './ensure-design-token-usage';
import ensureDesignTokenUsagePreview from './ensure-design-token-usage-preview';
import ensureIconColor from './ensure-icon-color';
import ensureProperXcssUsage from './ensure-proper-xcss-usage';
import iconLabel from './icon-label';
import lozengeIsBoldAndLozengeBadgeAppearanceMigration from './lozenge-isBold-and-lozenge-badge-appearance-migration';
import noBannedImports from './no-banned-imports';
import noBooleanAutofocusOnModalDialog from './no-boolean-autofocus-on-modal-dialog';
import noCssTaggedTemplateExpression from './no-css-tagged-template-expression';
import noCustomIcons from './no-custom-icons';
import noDarkThemeVrTests from './no-dark-theme-vr-tests';
import noDeprecatedApis from './no-deprecated-apis';
import noDeprecatedDesignTokenUsage from './no-deprecated-design-token-usage';
import noDeprecatedImports from './no-deprecated-imports';
import noDirectUseOfWebPlatformDragAndDrop from './no-direct-use-of-web-platform-drag-and-drop';
import noEmotionPrimitives from './no-emotion-primitives';
import noEmptyStyledExpression from './no-empty-styled-expression';
import noExportedCss from './no-exported-css';
import noExportedKeyframes from './no-exported-keyframes';
import noHtmlAnchor from './no-html-anchor';
import noHtmlButton from './no-html-button';
import noHtmlCheckbox from './no-html-checkbox';
import noHtmlCode from './no-html-code';
import noHtmlHeading from './no-html-heading';
import noHtmlImage from './no-html-image';
import noHtmlRadio from './no-html-radio';
import noHtmlRange from './no-html-range';
import noHtmlSelect from './no-html-select';
import noHtmlTextInput from './no-html-text-input';
import noHtmlTextarea from './no-html-textarea';
import noInvalidCssMap from './no-invalid-css-map';
import noKeyframesTaggedTemplateExpression from './no-keyframes-tagged-template-expression';
import noLegacyIcons from './no-legacy-icons';
import noMargin from './no-margin';
import noNestedStyles from './no-nested-styles';
import noPhysicalProperties from './no-physical-properties';
import noSeparatorWithListElements from './no-separator-with-list-elements';
import noStyledTaggedTemplateExpression from './no-styled-tagged-template-expression';
import noToMatchSnapshot from './no-to-match-snapshot';
import noUnsafeDesignTokenUsage from './no-unsafe-design-token-usage';
import noUnsafeInlineSnapshot from './no-unsafe-inline-snapshot';
import noUnsafeStyleOverrides from './no-unsafe-style-overrides';
import noUnsupportedDragAndDropLibraries from './no-unsupported-drag-and-drop-libraries';
import noUnusedCssMap from './no-unused-css-map';
import noUtilityIcons from './no-utility-icons';
import preferPrimitives from './prefer-primitives';
import useButtonGroupLabel from './use-button-group-label';
import useCharacterCounterField from './use-character-counter-field';
import useCorrectField from './use-correct-field';
import useCxFunctionInXcss from './use-cx-function-in-xcss';
import useDatetimePickerCalendarButton from './use-datetime-picker-calendar-button';
import useDrawerLabel from './use-drawer-label';
import useFieldMessageWrapper from './use-field-message-wrapper';
import useHeading from './use-heading';
import useHeadingLevelInSpotlightCard from './use-heading-level-in-spotlight-card';
import useHrefInLinkItem from './use-href-in-link-item';
import useLatestXcssSyntax from './use-latest-xcss-syntax';
import useLatestXcssSyntaxTypography from './use-latest-xcss-syntax-typography';
import useMenuSectionTitle from './use-menu-section-title';
import useModalDialogCloseButton from './use-modal-dialog-close-button';
import useOnboardingSpotlightLabel from './use-onboarding-spotlight-label';
import usePopupLabel from './use-popup-label';
import usePrimitives from './use-primitives';
import usePrimitivesText from './use-primitives-text';
import useShouldRenderToParent from './use-should-render-to-parent';
import useSpotlightPackage from './use-spotlight-package';
import useTagGroupLabel from './use-tag-group-label';
import useTokensShape from './use-tokens-shape';
import useTokensSpace from './use-tokens-space';
import useTokensTypography from './use-tokens-typography';
import useVisuallyHidden from './use-visually-hidden';

export const rules: Record<string, Rule.RuleModule> = {
	'consistent-css-prop-usage': consistentCssPropUsage,
	'enforce-inline-styles-in-select': enforceInlineStylesInSelect,
	'ensure-design-token-usage': ensureDesignTokenUsage,
	'ensure-design-token-usage/preview': ensureDesignTokenUsagePreview,
	'ensure-icon-color': ensureIconColor,
	'ensure-proper-xcss-usage': ensureProperXcssUsage,
	'icon-label': iconLabel,
	'lozenge-isBold-and-lozenge-badge-appearance-migration':
		lozengeIsBoldAndLozengeBadgeAppearanceMigration,
	'no-banned-imports': noBannedImports,
	'no-boolean-autofocus-on-modal-dialog': noBooleanAutofocusOnModalDialog,
	'no-css-tagged-template-expression': noCssTaggedTemplateExpression,
	'no-custom-icons': noCustomIcons,
	'no-dark-theme-vr-tests': noDarkThemeVrTests,
	'no-deprecated-apis': noDeprecatedApis,
	'no-deprecated-design-token-usage': noDeprecatedDesignTokenUsage,
	'no-deprecated-imports': noDeprecatedImports,
	'no-direct-use-of-web-platform-drag-and-drop': noDirectUseOfWebPlatformDragAndDrop,
	'no-emotion-primitives': noEmotionPrimitives,
	'no-empty-styled-expression': noEmptyStyledExpression,
	'no-exported-css': noExportedCss,
	'no-exported-keyframes': noExportedKeyframes,
	'no-html-anchor': noHtmlAnchor,
	'no-html-button': noHtmlButton,
	'no-html-checkbox': noHtmlCheckbox,
	'no-html-code': noHtmlCode,
	'no-html-heading': noHtmlHeading,
	'no-html-image': noHtmlImage,
	'no-html-radio': noHtmlRadio,
	'no-html-range': noHtmlRange,
	'no-html-select': noHtmlSelect,
	'no-html-text-input': noHtmlTextInput,
	'no-html-textarea': noHtmlTextarea,
	'no-invalid-css-map': noInvalidCssMap,
	'no-keyframes-tagged-template-expression': noKeyframesTaggedTemplateExpression,
	'no-legacy-icons': noLegacyIcons,
	'no-margin': noMargin,
	'no-nested-styles': noNestedStyles,
	'no-physical-properties': noPhysicalProperties,
	'no-separator-with-list-elements': noSeparatorWithListElements,
	'no-styled-tagged-template-expression': noStyledTaggedTemplateExpression,
	'no-to-match-snapshot': noToMatchSnapshot,
	'no-unsafe-design-token-usage': noUnsafeDesignTokenUsage,
	'no-unsafe-inline-snapshot': noUnsafeInlineSnapshot,
	'no-unsafe-style-overrides': noUnsafeStyleOverrides,
	'no-unsupported-drag-and-drop-libraries': noUnsupportedDragAndDropLibraries,
	'no-unused-css-map': noUnusedCssMap,
	'no-utility-icons': noUtilityIcons,
	'prefer-primitives': preferPrimitives,
	'use-button-group-label': useButtonGroupLabel,
	'use-character-counter-field': useCharacterCounterField,
	'use-correct-field': useCorrectField,
	'use-cx-function-in-xcss': useCxFunctionInXcss,
	'use-datetime-picker-calendar-button': useDatetimePickerCalendarButton,
	'use-drawer-label': useDrawerLabel,
	'use-field-message-wrapper': useFieldMessageWrapper,
	'use-heading': useHeading,
	'use-heading-level-in-spotlight-card': useHeadingLevelInSpotlightCard,
	'use-href-in-link-item': useHrefInLinkItem,
	'use-latest-xcss-syntax': useLatestXcssSyntax,
	'use-latest-xcss-syntax-typography': useLatestXcssSyntaxTypography,
	'use-menu-section-title': useMenuSectionTitle,
	'use-modal-dialog-close-button': useModalDialogCloseButton,
	'use-onboarding-spotlight-label': useOnboardingSpotlightLabel,
	'use-popup-label': usePopupLabel,
	'use-primitives': usePrimitives,
	'use-primitives-text': usePrimitivesText,
	'use-should-render-to-parent': useShouldRenderToParent,
	'use-spotlight-package': useSpotlightPackage,
	'use-tag-group-label': useTagGroupLabel,
	'use-tokens-shape': useTokensShape,
	'use-tokens-space': useTokensSpace,
	'use-tokens-typography': useTokensTypography,
	'use-visually-hidden': useVisuallyHidden,
};
