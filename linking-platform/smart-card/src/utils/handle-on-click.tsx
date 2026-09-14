import React from 'react';

export const handleOnClick: any =
	(handler: Function) =>
	(e: React.BaseSyntheticEvent): void => {
		e.preventDefault();
		e.stopPropagation();
		handler();
	};
