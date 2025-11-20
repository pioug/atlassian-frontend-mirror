import React from 'react';

import { type Icon } from '@atlaskit/linking-types';

import { SharedIconComponent } from '../../shared-components/icon';

interface IconProps extends Icon {
	testId?: string;
}

export const ICON_TYPE_TEST_ID = 'link-datasource-render-type--icon';
export const ICON_TYPE_TEXT_TEST_ID = `${ICON_TYPE_TEST_ID}-text`;

const IconRenderType = ({
	label,
	text,
	source,
	testId = ICON_TYPE_TEST_ID,
}: IconProps): React.JSX.Element => {
	return <SharedIconComponent testId={testId} iconUrl={source} label={label} text={text} />;
};

export default IconRenderType;
