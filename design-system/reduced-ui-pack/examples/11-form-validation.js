import React, { Fragment } from 'react';
// eslint-disable-next-line
import stuff from '!!style-loader!css-loader!../src/bundle.css';
import Warning from './utils/warning';

export default () => (
	<Fragment>
		<Warning />
		<form onSubmit={(e) => e.preventDefault()}>
			<h1>All fields required</h1>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="username">Username</label>
				<input
					type="text"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-text"
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
					className="ak-field-password"
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
					className="ak-field-textarea"
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
					className="ak-field-select"
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
				<label htmlFor="fruit">Fruit</label>
				<select
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-select"
					multiple
					id="fruit"
					name="fruit"
					required
				>
					<option>Apple</option>
					<option>Banana</option>
					<option>Cherry</option>
					<option>Orange</option>
					<option>Pear</option>
					<option>Strawberry</option>
					<option>Watermelon</option>
				</select>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="search">Search</label>
				<input
					type="search"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-search"
					id="search"
					name="search"
					required
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
					required
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="url">Url</label>
				<input
					type="url"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-url"
					id="url"
					name="url"
					required
					value="asewrkjasdflkj"
					disabled
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="tel">Tel</label>
				<input
					type="tel"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-tel"
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
					className="ak-field-number"
					id="number"
					name="number"
					placeholder="between 10 and 20 only"
					min="10"
					max="20"
					required
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
				<input
					type="date"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-date"
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
					className="ak-field-month"
					id="month"
					name="month"
					required
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="week">Week</label>
				<input
					type="week"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-week"
					id="week"
					name="week"
					required
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				<label htmlFor="time">Time</label>
				<input
					type="time"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="ak-field-time"
					id="time"
					name="time"
					required
				/>
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
					required
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
					required
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="ak-field-group">
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<button className="ak-button ak-button__appearance-primary">Submit</button>
			</div>
		</form>
	</Fragment>
);
