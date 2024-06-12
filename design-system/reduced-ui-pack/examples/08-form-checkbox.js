import React, { Fragment } from 'react';
// eslint-disable-next-line
import stuff from '!!style-loader!css-loader!../src/bundle.css';
import Warning from './utils/warning';

export default () => (
	<Fragment>
		<Warning />
		<form onSubmit={(e) => e.preventDefault()}>
			<h2>Settings</h2>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<fieldset className="ak-field-group">
				<legend>
					<span>Account options</span>
				</legend>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<div className="ak-field-checkbox">
					<input type="checkbox" name="option1" id="option1" value="option1" />
					<label htmlFor="option1">Keep me logged in</label>
				</div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<div className="ak-field-checkbox">
					<input type="checkbox" name="option2" id="option2" value="option2" defaultChecked />
					<label htmlFor="option2">Check for updates automatically</label>
				</div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<div className="ak-field-checkbox">
					<input
						type="checkbox"
						name="option3"
						id="option3"
						value="option3"
						defaultChecked
						disabled
					/>
					<label htmlFor="option3">Enable two-factor authentication</label>
				</div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<div className="ak-field-checkbox">
					<input type="checkbox" name="option4" id="option4" value="option4" disabled />
					<label htmlFor="option4">Autoplay videos</label>
				</div>
			</fieldset>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<button className="ak-button ak-button__appearance-primary">Save</button>
			</div>
		</form>
	</Fragment>
);
