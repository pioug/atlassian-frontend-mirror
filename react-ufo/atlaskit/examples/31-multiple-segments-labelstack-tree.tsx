/* eslint-disable @compiled/no-exported-css */
/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */

import { useCallback, useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';

import UFOLabel from '../src/label';

const container = css({
	display: 'flex',
	flexDirection: 'column',
	gap: '10px',
	padding: '10px',
	margin: '10px',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: '#ccc',
	borderRadius: '5px',
});

export default function Example() {
	const [showNewSegments, setShowNewSegments] = useState(false);
	const [showHold, setShowHold] = useState(false);

	const handleClick = useCallback(() => {
		setShowHold(true);
		setTimeout(() => {
			setShowHold(false);
			setShowNewSegments(!showNewSegments);
		}, 1000);
	}, [showNewSegments, setShowHold]);

	return (
		<div css={container} data-testid="page-container">
			<UFOSegment name="level0">
				<p>level0</p>
				<Button onClick={handleClick} id="show-new-segments" interactionName="show-new-segments">
					Toggle new segments
				</Button>
				<div css={container}>
					<UFOSegment name="level1-1">
						<p>level1-1</p>
						<div css={container}>
							<UFOLabel name="level1-2">
								<p>level1-2</p>
								<div css={container}>
									<UFOSegment name="level1-3">
										<p>level1-3</p>
										<UFOSegment name="level1-4">
											<p>level1-4</p>
										</UFOSegment>
									</UFOSegment>
									<UFOSegment name="level1-3">
										<p>level1-3</p>
										<UFOSegment name="level1-4">
											<p>level1-4</p>
										</UFOSegment>
									</UFOSegment>
									<UFOSegment name="level1-3">
										<p>level1-3</p>
										<UFOSegment name="level1-4">
											<p>level1-4</p>
										</UFOSegment>
									</UFOSegment>
									<UFOSegment name="level1-3">
										<p>level1-3</p>
										<UFOSegment name="level1-4">
											<p>level1-4</p>
										</UFOSegment>
									</UFOSegment>
									<UFOSegment name="level1-3">
										<p>level1-3</p>
										<UFOSegment name="level1-4">
											<p>level1-4</p>
										</UFOSegment>
									</UFOSegment>
									<UFOSegment name="level1-3">
										<p>level1-3</p>
										<UFOSegment name="level1-4">
											<p>level1-4</p>
										</UFOSegment>
									</UFOSegment>
								</div>
							</UFOLabel>
						</div>
					</UFOSegment>
				</div>

				<div css={container}>
					<UFOSegment name="level2-1">
						<p>level2-1</p>
						<div css={container}>
							<UFOLabel name="level2-2">
								<p>level2-2</p>
								<div css={container}>
									<UFOSegment name="level2-3">
										<p>level2-3</p>
									</UFOSegment>
									<UFOSegment name="level2-3">
										<p>level2-3</p>
									</UFOSegment>
								</div>
							</UFOLabel>
						</div>
					</UFOSegment>
				</div>
				{showHold && <UFOLoadHold name="show-hold">Loading</UFOLoadHold>}
				{showNewSegments && (
					<div css={container}>
						<UFOSegment name="new-level2-1">
							<p>new-level2-1</p>
							<div css={container}>
								<UFOLabel name="new-level2-2">
									<p>new-level2-2</p>
									<div css={container}>
										<UFOSegment name="new-level2-3">
											<p>new-level2-3</p>
										</UFOSegment>
										<UFOSegment name="new-level2-3">
											<p>new-level2-3</p>
										</UFOSegment>
									</div>
								</UFOLabel>
							</div>
						</UFOSegment>
					</div>
				)}
			</UFOSegment>
		</div>
	);
}
