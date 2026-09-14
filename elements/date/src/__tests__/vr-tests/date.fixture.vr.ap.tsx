import React from 'react';
import { Date } from '../../index';

export const DateWithDefaultColor = (): React.JSX.Element => {
	return <Date value={586137600000} />;
};

export const DateWithOnClick = (): React.JSX.Element => {
	const onClick = () => {};
	return <Date value={586137600000} onClick={onClick} />;
};

export const DateWithFormat = (): React.JSX.Element => {
	return <Date value={586137600000} format="MM/dd/yyyy" />;
};

export const DateWithRedColor = (): React.JSX.Element => {
	return <Date value={586137600000} color="red" />;
};

export const DateWithGreenColor = (): React.JSX.Element => {
	return <Date value={586137600000} color="green" />;
};

export const DateWithBlueColor = (): React.JSX.Element => {
	return <Date value={586137600000} color="blue" />;
};

export const DateWithPurpleColor = (): React.JSX.Element => {
	return <Date value={586137600000} color="purple" />;
};

export const DateWithGreyColor = (): React.JSX.Element => {
	return <Date value={586137600000} color="grey" />;
};
