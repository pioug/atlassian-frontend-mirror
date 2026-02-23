import React, { Fragment } from 'react';

import '@atlaskit/reduced-ui-pack';

import Warning from './utils/warning';

export default () => (
	<Fragment>
		<Warning />
		<form onSubmit={(e) => e.preventDefault()}>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="search">Search</label>
				<input
					type="search"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-search"
					id="search"
					name="search"
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="email">Email</label>
				<input
					type="email"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-email"
					id="email"
					name="email"
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="url">Url</label>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<input type="url" className="ak-field-url" id="url" name="url" />
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="tel">Tel</label>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<input type="tel" className="ak-field-tel" id="tel" name="tel" />
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="number">Number</label>
				<input
					type="number"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-number"
					id="number"
					name="number"
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="range">Range</label>
				<input
					type="range"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-range"
					id="range"
					name="range"
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="date">Date</label>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<input type="date" className="ak-field-date" id="date" name="date" />
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="month">Month</label>
				<input
					type="month"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-month"
					id="month"
					name="month"
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="week">Week</label>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<input type="week" className="ak-field-week" id="week" name="week" />
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="time">Time</label>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<input type="time" className="ak-field-time" id="time" name="time" />
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="datetime-local">Datetime-local</label>
				<input
					type="datetime-local"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-datetime-local"
					id="datetime-local"
					name="datetime-local"
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="color">Color</label>
				<input
					type="color"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-color"
					id="color"
					name="color"
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
