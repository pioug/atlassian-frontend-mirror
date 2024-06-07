import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const MessageContainer = styled.div<{
	isSearch: boolean;
}>((props) => ({
	paddingLeft: props.isSearch ? token('space.100', '8px') : token('space.0', '0px'),
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const MessageList = styled.ul({
	margin: 0,
	paddingLeft: token('space.300', '24px'),
});
