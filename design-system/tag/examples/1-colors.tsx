import React from 'react';

import { token } from '@atlaskit/tokens';

import RemovableTag from '../src/tag/removable-tag';
import Tag from '../src/tag/simple-tag';
import type { TagColor } from '../src/types';

const colors: TagColor[] = [
	'blue',
	'red',
	'yellow',
	'green',
	'teal',
	'purple',
	'orange',
	'magenta',
	'lime',
	'grey',
];

export default () => (
	<div data-testid="wrapper">
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<table style={{ maxWidth: 700, margin: token('space.400', '32px') }}>
			<caption>Non-interactive tags</caption>
			<tr>
				<td></td>
				<th>Standard</th>
				{colors.map((color) => (
					<th key={color}>{color!.charAt(0).toUpperCase() + color!.slice(1)}</th>
				))}
			</tr>
			<tr>
				<th>Default</th>
				<td>
					<Tag text="Tag" color="standard" testId="nonInteractiveStandard" />
				</td>

				{colors.map((color) => (
					<td key={`${color}-default`}>
						<Tag text="Tag" color={color} />
					</td>
				))}
				<td></td>
			</tr>
			<tr>
				<th>Light</th>
				<td></td>

				{colors.map((color) => (
					<td key={`${color}-light-default`}>
						<Tag text="Tag" color={`${color}Light` as TagColor} />
					</td>
				))}
			</tr>
		</table>

		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<table style={{ maxWidth: 700, margin: token('space.400', '32px') }}>
			<caption>Link tags</caption>
			<tr>
				<td></td>
				<th>Standard</th>
				{colors.map((color) => (
					<th key={`${color}-link-title`}>{color!.charAt(0).toUpperCase() + color!.slice(1)}</th>
				))}
			</tr>
			<tr>
				<th>Default</th>
				<td>
					<Tag
						href="https://www.atlassian.com/search?query=Carrot%20cake"
						text="Tag"
						color="standard"
						testId="linkStandard"
					/>
				</td>

				{colors.map((color) => (
					<td key={`${color}-link`}>
						<Tag
							href="https://www.atlassian.com/search?query=Carrot%20cake"
							text="Tag"
							color={color}
						/>
					</td>
				))}
				<td></td>
			</tr>
			<tr>
				<th>Light</th>
				<td></td>

				{colors.map((color) => (
					<td key={`${color}-light-link`}>
						<Tag
							href="https://www.atlassian.com/search?query=Carrot%20cake"
							text="Tag"
							color={`${color}Light` as TagColor}
						/>
					</td>
				))}
			</tr>
		</table>

		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<table style={{ maxWidth: 700, margin: token('space.400', '32px') }}>
			<caption>Removable tags</caption>
			<tr>
				<td></td>
				<th>Standard</th>
				{colors.map((color) => (
					<th key={`${color}-removable-title`}>
						{color!.charAt(0).toUpperCase() + color!.slice(1)}
					</th>
				))}
			</tr>
			<tr>
				<th>Default</th>
				<td>
					<RemovableTag removeButtonLabel="Remove" text="Tag" color="standard" />
				</td>

				{colors.map((color) => (
					<td key={`${color}-removable`}>
						<RemovableTag removeButtonLabel="Remove" text="Tag" color={color} />
					</td>
				))}
				<td></td>
			</tr>
			<tr>
				<th>Light</th>
				<td></td>

				{colors.map((color) => (
					<td key={`${color}-removable-light`}>
						<RemovableTag
							removeButtonLabel="Remove"
							text="Tag"
							color={`${color}Light` as TagColor}
						/>
					</td>
				))}
			</tr>
		</table>

		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<table style={{ maxWidth: 700, margin: token('space.400', '32px') }}>
			<caption>Removable + link tags</caption>
			<tr>
				<td></td>
				<th>Standard</th>
				{colors.map((color) => (
					<th key={`${color}-removable-link-title`}>
						{color!.charAt(0).toUpperCase() + color!.slice(1)}
					</th>
				))}
			</tr>
			<tr>
				<th>Default</th>
				<td>
					<RemovableTag
						removeButtonLabel="Remove"
						href="https://www.atlassian.com/search?query=Carrot%20cake"
						text="Tag"
						color="standard"
					/>
				</td>

				{colors.map((color) => (
					<td key={`${color}-removable-link`}>
						<RemovableTag
							removeButtonLabel="Remove"
							href="https://www.atlassian.com/search?query=Carrot%20cake"
							text="Tag"
							color={color}
						/>
					</td>
				))}
				<td></td>
			</tr>
			<tr>
				<th>Light</th>
				<td></td>

				{colors.map((color) => (
					<td key={`${color}-removable-link-light`}>
						<RemovableTag
							removeButtonLabel="Remove"
							href="https://www.atlassian.com/search?query=Carrot%20cake"
							text="Tag"
							color={`${color}Light` as TagColor}
						/>
					</td>
				))}
			</tr>
		</table>

		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<table style={{ maxWidth: 700, margin: token('space.400', '32px') }}>
			<caption>Link + Element before tags</caption>
			<tr>
				<td></td>
				<th>Standard</th>
				{colors.map((color) => (
					<th key={`${color}-link-element-before-title`}>
						{color!.charAt(0).toUpperCase() + color!.slice(1)}
					</th>
				))}
			</tr>
			<tr>
				<th>Default</th>
				<td>
					<Tag
						elemBefore={
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							<span style={{ paddingLeft: token('space.075', '6px') }}>#</span>
						}
						href="https://www.atlassian.com/search?query=Carrot%20cake"
						text="Tag"
						color="standard"
						testId="elemBeforeBlue"
					/>
				</td>

				{colors.map((color) => (
					<td key={`${color}-link-element-before`}>
						<RemovableTag
							elemBefore={
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								<span style={{ paddingLeft: token('space.075', '6px') }}>#</span>
							}
							href="https://www.atlassian.com/search?query=Carrot%20cake"
							text="Tag"
							color={color}
						/>
					</td>
				))}
				<td></td>
			</tr>
			<tr>
				<th>Light</th>
				<td></td>

				{colors.map((color) => (
					<td key={`${color}-link-element-before-light`}>
						<RemovableTag
							elemBefore={
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								<span style={{ paddingLeft: token('space.075', '6px') }}>#</span>
							}
							href="https://www.atlassian.com/search?query=Carrot%20cake"
							text="Tag"
							color={`${color}Light` as TagColor}
						/>
					</td>
				))}
			</tr>
		</table>

		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<table style={{ maxWidth: 700, margin: token('space.400', '32px') }}>
			<caption>Removable + Link + Element before tags</caption>
			<tr>
				<td></td>
				<th>Standard</th>
				{colors.map((color) => (
					<th key={`${color}-removable-link-element-before-title`}>
						{color!.charAt(0).toUpperCase() + color!.slice(1)}
					</th>
				))}
			</tr>
			<tr>
				<th>Default</th>
				<td>
					<RemovableTag
						elemBefore={
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							<span style={{ paddingLeft: token('space.075', '6px') }}>#</span>
						}
						href="https://www.atlassian.com/search?query=Carrot%20cake"
						text="Tag"
						color="standard"
						testId="elemBeforeBlue"
					/>
				</td>

				{colors.map((color) => (
					<td key={`${color}-removable-link-element-before`}>
						<RemovableTag
							elemBefore={
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								<span style={{ paddingLeft: token('space.075', '6px') }}>#</span>
							}
							href="https://www.atlassian.com/search?query=Carrot%20cake"
							text="Tag"
							color={color}
						/>
					</td>
				))}
				<td></td>
			</tr>
			<tr>
				<th>Light</th>
				<td></td>

				{colors.map((color) => (
					<td key={`${color}-removable-link-element-before-light`}>
						<RemovableTag
							elemBefore={
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								<span style={{ paddingLeft: token('space.075', '6px') }}>#</span>
							}
							href="https://www.atlassian.com/search?query=Carrot%20cake"
							text="Tag"
							color={`${color}Light` as TagColor}
						/>
					</td>
				))}
			</tr>
		</table>
	</div>
);
