// eslint-disable-line no-console
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { MediaImage } from '../src';
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

const LONG = 80;
const SHORT = 60;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const StyledContainer = styled.div({
	display: 'flex',
	maxWidth: '600px',
	margin: token('space.250', '20px'),
	alignItems: 'center',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ItemWrapper = styled.div({
	boxSizing: 'border-box',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	margin: token('space.100', '8px'),
	position: 'relative',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	label: {
		zIndex: '1',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	img: {
		imageRendering: 'pixelated',
		border: token('space.025', '2px'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const OuterBorder = styled.div({
	position: 'absolute',
	backgroundColor: token('color.border', '#ccc'),
	left: token('space.negative.050', '-4px'),
	top: token('space.negative.050', '-4px'),
	width: `calc(100% + ${token('space.100', '8px')})`,
	height: `calc(100% + ${token('space.100', '8px')})`,
});

const mediaImage = (dataUri: string, orientation: number) => (
	<ItemWrapper
		style={{
			minWidth: orientation < 5 ? LONG : SHORT,
			minHeight: orientation >= 5 ? LONG : SHORT,
		}}
	>
		<OuterBorder />
		<MediaImage
			dataURI={dataUri}
			alt={`orientation ${orientation}`}
			crop={false}
			stretch={true}
			previewOrientation={orientation}
		/>
		<label>{`${orientation}.`}</label>
	</ItemWrapper>
);

const Example = () => {
	return (
		<StyledContainer>
			{mediaImage(orientation_1, 1)}
			{mediaImage(orientation_2, 2)}
			{mediaImage(orientation_3, 3)}
			{mediaImage(orientation_4, 4)}
			{mediaImage(orientation_5, 5)}
			{mediaImage(orientation_6, 6)}
			{mediaImage(orientation_7, 7)}
			{mediaImage(orientation_8, 8)}
		</StyledContainer>
	);
};

export default () => <Example />;
