import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import Image from '@atlaskit/image';
import { type Icon } from '@atlaskit/linking-types';

interface IconProps extends Icon {
	testId?: string;
}

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const IconWrapper = styled.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'left',
});

export const ICON_TYPE_TEST_ID = 'link-datasource-render-type--icon';

const IconRenderType = ({ label, source, testId = ICON_TYPE_TEST_ID }: IconProps) => {
	return (
		<IconWrapper>
			<Image
				src={source}
				alt={label}
				data-testid={testId}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={{ minWidth: '20px', maxWidth: '20px' }} // having just width: '20px' shrinks it when table width is reduced
			/>
		</IconWrapper>
	);
};

export default IconRenderType;
