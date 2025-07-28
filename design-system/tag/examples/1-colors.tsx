/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import { css } from '@atlaskit/css';
import { RemovableTag, SimpleTag as Tag, type TagColor } from '@atlaskit/tag';
import { token } from '@atlaskit/tokens';

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

const tableStyles = css({
	maxWidth: '700px',
	marginBlockEnd: token('space.100', '8px'),
	marginBlockStart: token('space.100', '8px'),
	marginInlineEnd: token('space.100', '8px'),
	marginInlineStart: token('space.100', '8px'),
});

const elemBeforeStyles = css({
	paddingInlineStart: token('space.075', '6px'),
});

interface TagRowProps {
	title: string;
	renderTag: (color: TagColor, isLight?: boolean) => React.ReactNode;
}

function TagRow({ title, renderTag }: TagRowProps) {
	return (
		<tr>
			<th>{title}</th>
			<td>{renderTag('standard')}</td>
			{colors.map((color) => (
				<td key={`${color}-default`}>{renderTag(color)}</td>
			))}
			<td></td>
		</tr>
	);
}

function LightTagRow({ title, renderTag }: TagRowProps) {
	return (
		<tr>
			<th>{title}</th>
			<td></td>
			{colors.map((color) => (
				<td key={`${color}-light`}>{renderTag(color, true)}</td>
			))}
		</tr>
	);
}

function TagTable({
	caption,
	renderTag,
}: {
	caption: string;
	renderTag: (color: TagColor, isLight?: boolean) => React.ReactNode;
}) {
	return (
		<table css={tableStyles}>
			<caption>{caption}</caption>
			<thead>
				<tr>
					<td></td>
					<th>Standard</th>
					{colors.map((color) => (
						<th key={color}>{color!.charAt(0).toUpperCase() + color!.slice(1)}</th>
					))}
				</tr>
			</thead>
			<tbody>
				<TagRow title="Default" renderTag={renderTag} />
				<LightTagRow title="Light" renderTag={renderTag} />
			</tbody>
		</table>
	);
}

const elemBefore = <span css={elemBeforeStyles}>#</span>;

export default () => (
	<div data-testid="wrapper">
		<TagTable
			caption="Non-interactive tags"
			renderTag={(color, isLight) => (
				<Tag
					text="Tag"
					color={isLight ? (`${color}Light` as TagColor) : color}
					testId={color === 'standard' ? 'nonInteractiveStandard' : undefined}
				/>
			)}
		/>

		<TagTable
			caption="Link tags"
			renderTag={(color, isLight) => (
				<Tag
					href="https://www.atlassian.com/search?query=Carrot%20cake"
					text="Tag"
					color={isLight ? (`${color}Light` as TagColor) : color}
					testId={color === 'standard' ? 'linkStandard' : undefined}
				/>
			)}
		/>

		<TagTable
			caption="Removable tags"
			renderTag={(color, isLight) => (
				<RemovableTag
					removeButtonLabel="Remove"
					text="Tag"
					color={isLight ? (`${color}Light` as TagColor) : color}
				/>
			)}
		/>

		<TagTable
			caption="Removable + link tags"
			renderTag={(color, isLight) => (
				<RemovableTag
					removeButtonLabel="Remove"
					href="https://www.atlassian.com/search?query=Carrot%20cake"
					text="Tag"
					color={isLight ? (`${color}Light` as TagColor) : color}
				/>
			)}
		/>

		<TagTable
			caption="Link + Element before tags"
			renderTag={(color, isLight) => (
				<Tag
					elemBefore={elemBefore}
					href="https://www.atlassian.com/search?query=Carrot%20cake"
					text="Tag"
					color={isLight ? (`${color}Light` as TagColor) : color}
					testId={color === 'standard' ? 'elemBeforeBlue' : undefined}
				/>
			)}
		/>

		<TagTable
			caption="Removable + Link + Element before tags"
			renderTag={(color, isLight) => (
				<RemovableTag
					elemBefore={elemBefore}
					href="https://www.atlassian.com/search?query=Carrot%20cake"
					text="Tag"
					color={isLight ? (`${color}Light` as TagColor) : color}
					testId={color === 'standard' ? 'elemBeforeBlue' : undefined}
				/>
			)}
		/>
	</div>
);
