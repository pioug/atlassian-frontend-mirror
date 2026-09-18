import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { Checkbox } from '@atlaskit/checkbox/checkbox';
import { CheckboxField } from '@atlaskit/form/checkbox-field';
import Field from '@atlaskit/form/field';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import type { Appearance } from '@atlaskit/modal-dialog/types';
import { Box } from '@atlaskit/primitives/compiled';
import RadioGroup from '@atlaskit/radio/radio-group';

import PlaceholderContent from './placeholder-content';

const longNonBreakableTitle = `ThisIs${'long'.repeat(20)}NonBreakableTitle`;
const longBreakableTitle = `This is ${'long '.repeat(20)} breakable title`;
const shortTitle = 'This is a short title';

const titles = [
	{
		name: 'title',
		value: longNonBreakableTitle,
		label: 'long non-breakable title',
		defaultSelected: true,
	},
	{
		name: 'title',
		value: longBreakableTitle,
		label: 'long breakable title',
	},
	{ name: 'title', value: shortTitle, label: 'short title' },
];

export default function MultiLineTitles(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	const [title, setTitle] = useState(longNonBreakableTitle);
	const [isTitleMultiline, setIsTitleMultiline] = useState(false);
	const [appearance, setAppearance] = useState<Appearance | undefined>('warning');

	return (
		<Box padding="space.200">
			<Button aria-haspopup="dialog" appearance="primary" testId="modal-trigger" onClick={open}>
				Open modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<ModalDialog onClose={close} testId="modal" width="medium">
						<ModalHeader hasCloseButton>
							<ModalTitle appearance={appearance} isMultiline={isTitleMultiline}>
								{title}
							</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Field name="hd" label="Title">
								{() => (
									<RadioGroup
										options={titles}
										value={title}
										onChange={(e) => setTitle(e.target.value)}
									/>
								)}
							</Field>

							<CheckboxField name="hs" label="Toggle multi-line">
								{() => (
									<Checkbox
										label="Is title multi-line?"
										name="multiline"
										testId="multiline"
										onChange={(e) => setIsTitleMultiline(e.target.checked)}
										isChecked={isTitleMultiline}
									/>
								)}
							</CheckboxField>

							<CheckboxField name="hs" label="Toggle appearance">
								{() => (
									<Checkbox
										label="Set warning appearance?"
										name="appearance"
										testId="appearance"
										onChange={(e) => setAppearance(e.target.checked ? 'warning' : undefined)}
										isChecked={Boolean(appearance)}
									/>
								)}
							</CheckboxField>

							<br />
							<PlaceholderContent count="5" />
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle">Secondary Action</Button>
							<Button appearance={appearance || 'primary'} onClick={close}>
								Close
							</Button>
						</ModalFooter>
					</ModalDialog>
				)}
			</ModalTransition>
		</Box>
	);
}
