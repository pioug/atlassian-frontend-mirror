/** @jsx jsx */
import styled from '@emotion/styled';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const FlexContainer = styled.div({
	display: 'flex',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ContentWrapper = styled.div({
	position: 'relative',
	minWidth: 0,
	flex: '1 1 auto',
	overflowX: 'hidden',
});
