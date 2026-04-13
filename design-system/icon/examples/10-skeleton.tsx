import React from 'react';

import { Skeleton } from '@atlaskit/icon';

export default (): React.JSX.Element => (
	<div>
		<p>Basic icons of different sizes</p>
		<Skeleton size="small" />
		<Skeleton size="medium" />
		<Skeleton size="large" />
		<Skeleton size="xlarge" />

		<p>Changing color via inheritance</p>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
		<div style={{ color: '#403294' }}>
			<Skeleton size="small" />
			<Skeleton size="medium" />
			<Skeleton size="large" />
			<Skeleton size="xlarge" />
		</div>

		<p>Changing color via props</p>
		<Skeleton color={'#006644'} size="small" />
		<Skeleton color={'#0065FF'} size="medium" />
		<Skeleton color={'#BF2600'} size="large" />
		<Skeleton color={'#6B778C'} size="xlarge" />

		<p>With a strong weight</p>
		<Skeleton weight="strong" color={'#BF2600'} size="small" />
		<Skeleton weight="strong" color={'#FFAB00'} size="medium" />
		<Skeleton weight="strong" color={'#0747A6'} size="large" />
		<Skeleton weight="strong" size="xlarge" />
	</div>
);
