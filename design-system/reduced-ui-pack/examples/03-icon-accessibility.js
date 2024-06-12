import React from 'react';
// eslint-disable-next-line
import icons from '!!raw-loader!../src/icons-sprite.svg';
// eslint-disable-next-line
import stuff from '!!style-loader!css-loader!../src/bundle.css';
import Warning from './utils/warning';
// eslint-disable-next-line react/no-danger
const Spritemap = () => <div dangerouslySetInnerHTML={{ __html: icons }} />;

export default () => (
	<div>
		<Warning />
		<Spritemap />
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
		<div className="ak-field-group">
			<label htmlFor="dummy">Dummy input</label>
			<input
				type="text"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className="ak-field-text ak-field__size-medium"
				id="dummy"
				placeholder="Focus on this field then tab to the button"
			/>
		</div>
		<p>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<button type="button" className="ak-button ak-button__appearance-default">
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<svg focusable="false" className="ak-icon" aria-label="Add">
					<use xlinkHref="#ak-icon-add" />
				</svg>
			</button>
		</p>
	</div>
);
