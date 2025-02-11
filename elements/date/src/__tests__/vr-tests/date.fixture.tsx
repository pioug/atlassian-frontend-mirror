import React from 'react';
import { Date } from '../../index';

export const DateWithDefaultColor = () => {
	return <Date value={586137600000} />;
};

export const DateWithOnClick = () => {
	const onClick = () => {};
	return <Date value={586137600000} onClick={onClick} />;
};

export const DateWithFormat = () => {
	return <Date value={586137600000} format="MM/dd/yyyy" />;
};

export const DateWithRedColor = () => {
	return <Date value={586137600000} color="red" />;
};

export const DateWithGreenColor = () => {
	return <Date value={586137600000} color="green" />;
};

export const DateWithBlueColor = () => {
	return <Date value={586137600000} color="blue" />;
};

export const DateWithPurpleColor = () => {
	return <Date value={586137600000} color="purple" />;
};

export const DateWithGreyColor = () => {
	return <Date value={586137600000} color="grey" />;
};
