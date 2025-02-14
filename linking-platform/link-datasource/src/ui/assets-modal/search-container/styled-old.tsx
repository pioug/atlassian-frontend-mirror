// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const FormRowContainer = styled.div<{ isNarrowGap?: boolean }>((props) => ({
	alignItems: 'center',
	display: 'flex',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	gap: props.isNarrowGap ? token('space.100', '8px') : token('space.200', '16px'),
	flexGrow: 1,
	width: '100%',
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const FormContainer = styled.form({
	display: 'grid',
	rowGap: token('space.200', '16px'),
	width: '100%',
});

// Override the top margin of fields
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const FieldContainer = styled.div({
	flex: 1,
	marginTop: token('space.negative.100', '-8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SchemaSelectContainer = styled.div({
	width: '100%',
	maxWidth: '386px',
});

`
mv click-summary-column-dropdown-to-see-its-items--default--bandicoots-compiled-migration-smartcard-false.png click-summary-column-dropdown-to-see-its-items--default--bandicoots-compiled-migration-link-datasource-false.png
mv click-summary-column-dropdown-to-see-its-items--default--bandicoots-compiled-migration-smartcard-true.png click-summary-column-dropdown-to-see-its-items--default--bandicoots-compiled-migration-link-datasource-true.png
mv double-lined-date-of-creation-header-text-is-truncated-with-ellipses--default--bandicoots-compiled-migration-smartcard-false.png double-lined-date-of-creation-header-text-is-truncated-with-ellipses--default--bandicoots-compiled-migration-link-datasource-false.png
mv double-lined-date-of-creation-header-text-is-truncated-with-ellipses--default--bandicoots-compiled-migration-smartcard-true.png double-lined-date-of-creation-header-text-is-truncated-with-ellipses--default--bandicoots-compiled-migration-link-datasource-true.png
mv hovering-over-bug-icon--default--bandicoots-compiled-migration-smartcard-false.png hovering-over-bug-icon--default--bandicoots-compiled-migration-link-datasource-false.png
mv hovering-over-bug-icon--default--bandicoots-compiled-migration-smartcard-true.png hovering-over-bug-icon--default--bandicoots-compiled-migration-link-datasource-true.png
mv hovering-over-date--default--bandicoots-compiled-migration-smartcard-false.png hovering-over-date--default--bandicoots-compiled-migration-link-datasource-false.png
mv hovering-over-date--default--bandicoots-compiled-migration-smartcard-true.png hovering-over-date--default--bandicoots-compiled-migration-link-datasource-true.png
mv hovering-over-label-another-third-labels--default--bandicoots-compiled-migration-smartcard-false.png hovering-over-label-another-third-labels--default--bandicoots-compiled-migration-link-datasource-false.png
mv hovering-over-label-another-third-labels--default--bandicoots-compiled-migration-smartcard-true.png hovering-over-label-another-third-labels--default--bandicoots-compiled-migration-link-datasource-true.png
mv hovering-over-labels-header--default--bandicoots-compiled-migration-smartcard-false.png hovering-over-labels-header--default--bandicoots-compiled-migration-link-datasource-false.png
mv hovering-over-labels-header--default--bandicoots-compiled-migration-smartcard-true.png hovering-over-labels-header--default--bandicoots-compiled-migration-link-datasource-true.png
mv hovering-over-people--default--bandicoots-compiled-migration-smartcard-false.png hovering-over-people--default--bandicoots-compiled-migration-link-datasource-false.png
mv hovering-over-people--default--bandicoots-compiled-migration-smartcard-true.png hovering-over-people--default--bandicoots-compiled-migration-link-datasource-true.png
mv hovering-over-people-header--default--bandicoots-compiled-migration-smartcard-false.png hovering-over-people-header--default--bandicoots-compiled-migration-link-datasource-false.png
mv hovering-over-people-header--default--bandicoots-compiled-migration-smartcard-true.png hovering-over-people-header--default--bandicoots-compiled-migration-link-datasource-true.png
mv hovering-over-status-header--default--bandicoots-compiled-migration-smartcard-false.png hovering-over-status-header--default--bandicoots-compiled-migration-link-datasource-false.png
mv hovering-over-status-header--default--bandicoots-compiled-migration-smartcard-true.png hovering-over-status-header--default--bandicoots-compiled-migration-link-datasource-true.png
mv hovering-over-summary--default--bandicoots-compiled-migration-smartcard-false.png hovering-over-summary--default--bandicoots-compiled-migration-link-datasource-false.png
mv hovering-over-summary--default--bandicoots-compiled-migration-smartcard-true.png hovering-over-summary--default--bandicoots-compiled-migration-link-datasource-true.png
mv hovering-over-to-do-status--default--bandicoots-compiled-migration-smartcard-false.png hovering-over-to-do-status--default--bandicoots-compiled-migration-link-datasource-false.png
mv hovering-over-to-do-status--default--bandicoots-compiled-migration-smartcard-true.png hovering-over-to-do-status--default--bandicoots-compiled-migration-link-datasource-true.png
mv hovering-over-unassigned-assignee--default--bandicoots-compiled-migration-smartcard-false.png hovering-over-unassigned-assignee--default--bandicoots-compiled-migration-link-datasource-false.png
mv hovering-over-unassigned-assignee--default--bandicoots-compiled-migration-smartcard-true.png hovering-over-unassigned-assignee--default--bandicoots-compiled-migration-link-datasource-true.png
mv toggle-wrapping-on-several-columns--default--bandicoots-compiled-migration-smartcard-false.png toggle-wrapping-on-several-columns--default--bandicoots-compiled-migration-link-datasource-false.png
mv toggle-wrapping-on-several-columns--default--bandicoots-compiled-migration-smartcard-true.png toggle-wrapping-on-several-columns--default--bandicoots-compiled-migration-link-datasource-true.png
`;
