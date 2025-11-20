// eslint-disable-line no-console
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import {
	orientation_1,
	orientation_2,
	orientation_3,
	orientation_4,
	orientation_5,
	orientation_6,
	orientation_7,
	orientation_8,
} from '../example-helpers/exif-dataUri';
import { token } from '@atlaskit/tokens';
import { mediaImage } from './exif-orientations-vr';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const StyledContainer = styled.div({
	display: 'flex',
	maxWidth: '600px',
	margin: token('space.250', '20px'),
	alignItems: 'center',
});

export default (): React.JSX.Element => {
	return (
		<StyledContainer>
			<p>Hello world</p>
			{mediaImage(orientation_1, 1)}
			{mediaImage(orientation_2, 2)}
			<p>Hello world</p>
			{mediaImage(orientation_3, 3)}
			<p>Hello world</p>
			{mediaImage(orientation_4, 4)}
			{mediaImage(orientation_5, 5)}
			{mediaImage(orientation_6, 6)}
			{mediaImage(orientation_7, 7)}
			{mediaImage(orientation_8, 8)}
		</StyledContainer>
	);
};
