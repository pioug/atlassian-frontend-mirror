import React from 'react';
import AudioCircleIcon from '@atlaskit/icon/core/audio';
import LegacyAudioCircleIcon from '@atlaskit/icon/glyph/audio-circle';
import { ResultBase, ResultItemGroup } from '../src';

const defaultProps = {
	resultId: 'result_id',
	type: 'base',
};

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component {
	render() {
		return (
			<div>
				<h3>Custom result types</h3>
				<p>
					If the preset result types do not support the shape required, ResultBase can be used
					directly or composed to help create QuickSearch compatible results. Fully custom result
					types can be created from scratch and still be QuickSearch compatible as long as they
					implement the required props.
				</p>

				<ResultItemGroup title="Object examples">
					<ResultBase {...defaultProps} text="I don't even have an icon or subText" />
					<ResultBase
						{...defaultProps}
						caption="#:notsureif:"
						icon={
							<AudioCircleIcon
								label="a"
								LEGACY_size="large"
								color="currentColor"
								LEGACY_primaryColor="#FFEBE5"
								LEGACY_secondaryColor="RebeccaPurple"
								LEGACY_fallbackIcon={LegacyAudioCircleIcon}
							/>
						}
						text="Cronenberg result"
						subText="Anything goes!"
					/>
				</ResultItemGroup>
			</div>
		);
	}
}
