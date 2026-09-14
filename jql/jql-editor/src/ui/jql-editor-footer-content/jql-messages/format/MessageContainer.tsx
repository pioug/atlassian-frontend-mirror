import React from 'react';

import { useEditorThemeContext } from '../../../../hooks/use-editor-theme/useEditorThemeContext';

import { MessageContainer as MessageContainerStyled } from './styled';

export const MessageContainer = ({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element => {
	const { isSearch } = useEditorThemeContext();

	return <MessageContainerStyled isSearch={isSearch}>{children}</MessageContainerStyled>;
};
