import React, { Fragment } from 'react';

import '@atlaskit/reduced-ui-pack';

import Warning from './utils/warning';

export default () => (
	<Fragment>
		<Warning />
		<form onSubmit={(e) => e.preventDefault()}>
			<h1>Example form to show field widths</h1>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="username">Username</label>
				<input
					type="text"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-text ak-field__width-medium"
					id="username"
					name="username"
					placeholder="eg. you@yourcompany.com"
					required
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="password">Password</label>
				<input
					type="password"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-password ak-field__width-medium"
					id="password"
					name="password"
					required
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="description">Description</label>
				<textarea
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-textarea ak-field__width-xlarge"
					rows="3"
					id="description"
					name="description"
					required
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="fav-movie">Favourite movie</label>
				<select
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-select ak-field__width-large"
					id="fav-movie"
					name="fav-movie"
					required
				>
					<option value="">Choose a favourite</option>
					<option value="sw">Star Wars</option>
					<option value="hp">Harry Potter and the Half-Blood Prince</option>
					<option value="lotr">The Lord of the Rings</option>
				</select>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="email">Email</label>
				<input
					type="email"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-email ak-field__width-medium"
					id="email"
					name="email"
					required
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="url">Url</label>
				<input
					type="url"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-url ak-field__width-medium"
					id="url"
					name="url"
					required
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="tel">Tel</label>
				<input
					type="tel"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-tel ak-field__width-small"
					id="tel"
					name="tel"
					required
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="number">Number</label>
				<input
					type="number"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-number ak-field__width-xsmall"
					maxLength="1"
					id="number"
					name="number"
					placeholder="1-5"
					min="1"
					max="5"
					required
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="date">Date</label>
				<input
					type="date"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-date ak-field__width-small"
					id="date"
					name="date"
					required
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="month">Month</label>
				<input
					type="month"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-month ak-field__width-small"
					id="month"
					name="month"
					required
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<button type="submit" className="ak-button ak-button__appearance-primary">
					Submit
				</button>
			</div>
		</form>
	</Fragment>
);
