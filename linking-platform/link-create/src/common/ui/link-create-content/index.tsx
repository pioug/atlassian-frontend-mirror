import React, { Fragment } from 'react';

import type { LinkCreatePlugin } from '../../types';

type LinkCreateContentProps = {
	plugins: LinkCreatePlugin[];
	entityKey: string;
};

export const LinkCreateContent = ({ plugins, entityKey }: LinkCreateContentProps) => {
	const chosenOne = plugins.find((plugin) => plugin.key === entityKey);

	if (!chosenOne) {
		throw new Error('Make sure you specified a valid entityKey');
	}

	return <Fragment>{chosenOne.form}</Fragment>;
};
