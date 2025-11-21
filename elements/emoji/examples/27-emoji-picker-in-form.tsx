import React, { useState } from 'react';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
// eslint-disable-next-line import/no-extraneous-dependencies
import { loggedUser } from '@atlaskit/util-data-test/logged-user';
import { IntlProvider } from 'react-intl-next';
import EmojiPicker, { type EmojiId, type OnEmojiEvent, ResourcedEmoji } from '../src';
import { EmojiPickerPopup } from './26-emoji-common-provider-with-real-backend';

import Form, { Field, FormFooter } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import Button from '@atlaskit/button/new';

const EmojiPickerWithUpload = (): React.JSX.Element => {
	const [formSubmitted, setFormSubmitted] = useState(false);
	const [selectedEmoji, setSelectedEmoji] = useState<EmojiId>();
	const [enablePopup, setEnablePopup] = useState(false);
	const [formSubmittedData, setFormSubmittedData] = useState({});

	const emojiProvider = getEmojiResource({
		uploadSupported: true,
		currentUser: { id: loggedUser },
	});

	const onSelection: OnEmojiEvent = (emojiId, emoji) => {
		setSelectedEmoji(emojiId);
	};

	const onTogglePopup = () => {
		setEnablePopup(!enablePopup);
	};

	return (
		<IntlProvider locale="en">
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ padding: '10px' }}>
				<p>click to toggle emoji popup mode</p>
				<button onClick={onTogglePopup}>
					{enablePopup ? 'emoji picker in popup' : 'emoji picker with no popup'}
				</button>
				<Form
					onSubmit={(data) => {
						console.log('form data', data);
						setFormSubmitted(true);
						setFormSubmittedData(data);
					}}
					name="submit-form"
				>
					<p>Press enter after search emoji, form should not be submitted automatically.</p>
					<Field testId="input-title" name="title" label="title" defaultValue="">
						{({ fieldProps }) => <TextField autoComplete="off" {...fieldProps} />}
					</Field>
					<Field name="emoji" label="emoji" defaultValue={selectedEmoji?.shortName}>
						{({ fieldProps: { value, ...rest } }) => (
							<div>
								{enablePopup ? (
									<EmojiPickerPopup emojiProvider={emojiProvider} onSelected={onSelection} />
								) : (
									<div data-testid="selected-emoji">
										<EmojiPicker emojiProvider={emojiProvider} onSelection={onSelection} />
										{selectedEmoji && (
											<ResourcedEmoji emojiProvider={emojiProvider} emojiId={selectedEmoji} />
										)}
									</div>
								)}
							</div>
						)}
					</Field>
					<FormFooter>
						<Button type="button" appearance="subtle" onClick={() => setFormSubmitted(false)}>
							Reset
						</Button>
						<Button type="submit" appearance="primary">
							Submit
						</Button>
					</FormFooter>
				</Form>

				<div data-testid="form-message">
					{formSubmitted && 'You have successfully submitted!'}
					{!formSubmitted && 'You have not submitted yet'}
				</div>

				<div data-testid="form-submitted-data">
					{formSubmitted && JSON.stringify(formSubmittedData)}
				</div>
			</div>
		</IntlProvider>
	);
};

export default EmojiPickerWithUpload;
