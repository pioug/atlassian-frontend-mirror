import React from 'react';

const Hook = (props: { callback: Function }) => {
	props.callback();
	return null;
};

export const renderHook = (callback: Function): React.JSX.Element => {
	return <Hook callback={callback} />;
};
