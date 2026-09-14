import React from 'react';

export const getKeys = (e: React.MouseEvent): ('meta' | 'alt' | 'shift' | 'ctrl')[] => {
	return (['alt', 'ctrl', 'meta', 'shift'] as const).filter((key) => e[`${key}Key`] === true);
};
