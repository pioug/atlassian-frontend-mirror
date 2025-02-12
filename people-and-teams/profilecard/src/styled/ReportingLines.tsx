import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { cssMap, cx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	reportingLinesSection: {
		marginLeft: token('space.050'),
		marginTop: token('space.100'),
	},
	managerSection: {
		display: 'flex',
		alignItems: 'center',
		marginLeft: token('space.050'),
		marginTop: token('space.050'),
		marginBottom: token('space.050'),
		marginRight: token('space.050'),
	},
	managerName: {
		font: token('font.body.small'),
		marginLeft: token('space.100'),
	},
	offsetWrapper: {
		marginTop: token('space.050'),
		marginLeft: token('space.negative.050'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/use-primitives -- Ignored via go/DSP-18766
const ReportingLinesSectionLegacy = styled.div({
	// Minor left margin to align better with existing icon fields
	marginLeft: token('space.050', '4px'),
	marginTop: token('space.100', '8px'),
});

export const ReportingLinesSection = ({ children }: { children: React.ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.reportingLinesSection)}>{children}</Box>
	) : (
		<ReportingLinesSectionLegacy>{children}</ReportingLinesSectionLegacy>
	);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const ManagerSectionLegacy = styled.div({
	display: 'flex',
	alignItems: 'center',
	margin: `${token('space.050', '4px')} ${token('space.050', '4px')}`,
});

export const ManagerSection = ({ children }: { children: React.ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.managerSection)}>{children}</Box>
	) : (
		<ManagerSectionLegacy>{children}</ManagerSectionLegacy>
	);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const ManagerNameLegacy = styled.span({
	font: token('font.body.small'),
	marginLeft: token('space.100', '8px'),
});

export const ManagerName = ({ children }: { children: React.ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.managerName)}>{children}</Box>
	) : (
		<ManagerNameLegacy>{children}</ManagerNameLegacy>
	);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/use-primitives -- Ignored via go/DSP-18766
const OffsetWrapperLegacy = styled.div({
	marginTop: token('space.050', '4px'),
	// Offset left margin so the avatar aligns with the heading
	marginLeft: token('space.negative.050', '-4px'),
});

export const OffsetWrapper = ({ children }: { children: React.ReactNode }) =>
	fg('compiled-migration-profilecard') ? (
		<Box xcss={cx(styles.offsetWrapper)}>{children}</Box>
	) : (
		<OffsetWrapperLegacy>{children}</OffsetWrapperLegacy>
	);
