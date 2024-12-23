/**
 *
 *
 * PLEASE DO NOT REMOVE THIS STORY
 * IT'S USED FOR developer.atlassian.com documentation playground
 *
 *
 */
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { initialize } from '@atlaskit/editor-test-helpers/ajv';
import React, { PureComponent } from 'react';
import type { ChangeEvent } from 'react';

import Renderer from '../src/ui/Renderer';

import { token } from '@atlaskit/tokens';

export interface State {
	value: string;
	validator?: (...args: any[]) => any;
	fetchingSchema: boolean;
	err?: Error;
}

const defaultDocument = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Hello world',
				},
			],
		},
	],
};

const providerFactory = ProviderFactory.create({
	emojiProvider: getEmojiResource(),
});

const ajv = initialize();

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class Example extends PureComponent<{}, State> {
	state: State = {
		value: JSON.stringify(defaultDocument, null, 2),
		fetchingSchema: false,
	};

	private onChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
		this.setState({ value: evt.target.value });
	};

	private getRendererContent() {
		const { err, fetchingSchema, validator, value } = this.state;

		let json;
		let textMessage;

		try {
			json = JSON.parse(value);
		} catch (ex) {
			return <span>This is invalid JSON.</span>;
		}

		if (err) {
			textMessage = `Error occured while fetching the latest JSON schema for Atlassian Document Format: ${err.message}`;
		} else if (fetchingSchema) {
			textMessage = 'Fetching latest JSON schema for Atlassian Document Format. Please wait...';
		} else if (validator && !validator(json)) {
			textMessage =
				'This JSON doesn\'t comply with Atlassian Document format. You can get the latest JSON schema <a href="http://go.atlassian.com/adf-json-schema">here</a>.';
		}

		if (textMessage) {
			return <span dangerouslySetInnerHTML={{ __html: textMessage }} />;
		}

		return <Renderer document={json} dataProviders={providerFactory} />;
	}

	componentDidMount() {
		this.setState({ fetchingSchema: true });

		fetch('https://unpkg.com/@atlaskit/adf-schema@latest/dist/json-schema/v1/full.json')
			.then((res) => {
				return res.json();
			})
			.then((v1schema) => {
				this.setState({
					fetchingSchema: false,
					validator: ajv.compile(v1schema),
				});
			})
			.catch((err) => {
				this.setState({
					err,
					fetchingSchema: false,
				});
			});
	}

	render() {
		const renderedContent = this.getRendererContent();

		return (
			<div>
				<textarea
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						boxSizing: 'border-box',
						border: `1px solid ${token('color.border', 'lightgray')}`,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						fontFamily: 'monospace',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						fontSize: 16,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						padding: token('space.150', '12px'),
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						width: '100%',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						height: 320,
					}}
					// eslint-disable-next-line react/no-string-refs  -- Ignored via go/ED-25883
					ref="input"
					onChange={this.onChange}
					value={this.state.value}
				/>
				<div
					style={{
						margin: `${token('space.100', '8px')} 0`,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						maxHeight: '300px',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						overflow: 'auto',
					}}
				>
					{renderedContent}
				</div>
			</div>
		);
	}
}
