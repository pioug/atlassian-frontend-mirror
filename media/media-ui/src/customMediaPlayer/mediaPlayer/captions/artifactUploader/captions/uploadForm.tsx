import React, { useEffect, useState } from 'react';
import { type IntlShape, injectIntl, type WrappedComponentProps } from 'react-intl-next';
import Button from '@atlaskit/button/new';
import Modal, {
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import LocaleSelect, { defaultLocales, type Locale } from '@atlaskit/locale/LocaleSelect';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline } from '@atlaskit/primitives/compiled';
import FileIcon from '@atlaskit/icon/core/file';
import { token } from '@atlaskit/tokens';
import { Label } from '@atlaskit/form';
import Spinner from '@atlaskit/spinner';
import { messages } from '../../../../../messages';
import { formatLocale } from '../../formatLocale';
import { detectLanguage } from './languageDetector';

const detectLocale = async (file: File, intl: IntlShape) => {
	const detectedLocale = await detectLanguage(file);

	if (detectedLocale) {
		const defaultLocale = defaultLocales.find((l) => l.value === detectedLocale);
		if (defaultLocale) {
			return { selectedLocale: defaultLocale, locales: defaultLocales };
		}

		const customLocale = customLocaleOption(intl, detectedLocale);
		return { selectedLocale: customLocale, locales: [...defaultLocales, customLocale] };
	}

	return { selectedLocale: defaultLocales[0], locales: defaultLocales };
};

type UploadCaptionsFormProps = {
	isOpen: boolean;
	onClose: () => void;
	uploadFn: (file: File, locale: string) => Promise<void>;
	file?: File;
};

const customLocaleOption = (intl: IntlShape, detectedLocale: string) => {
	return {
		label: formatLocale(intl.locale, detectedLocale),
		value: detectedLocale,
	};
};

function UploadCaptionsForm({
	isOpen,
	uploadFn,
	onClose,
	file,
	intl,
}: UploadCaptionsFormProps & WrappedComponentProps) {
	const [selectedLocale, setSelectedLocale] = useState<Locale>();
	const [locales, setLocales] = useState<Locale[]>([]);
	const [isUploading, setIsUploading] = useState(false);

	const close = () => {
		onClose();
		setSelectedLocale(undefined);
		setLocales([]);
	};

	const submit = async () => {
		if (selectedLocale && file) {
			setIsUploading(true);
			try {
				await uploadFn(file, selectedLocale.value);
			} finally {
				setIsUploading(false);
				close();
			}
		}
	};

	useEffect(() => {
		file &&
			detectLocale(file, intl).then(({ selectedLocale, locales }) => {
				setLocales(locales);
				setSelectedLocale(selectedLocale);
			});
	}, [file, intl]);

	return (
		<ModalTransition>
			{isOpen && (
				<Modal onClose={close}>
					<ModalHeader hasCloseButton>
						<ModalTitle>
							{intl.formatMessage(messages.video_captions_upload_captions_form_header)}
						</ModalTitle>
					</ModalHeader>
					<Box paddingBlock="space.100" paddingInline="space.400">
						<Inline space="space.100">
							<FileIcon label="file" color={token('color.icon.accent.purple')} />
							{file?.name}
							{isUploading && (
								<Spinner
									testId="spinner"
									interactionName="uploading"
									label="Uploading"
									size="small"
								/>
							)}
						</Inline>
					</Box>
					<Box paddingBlock="space.100" paddingInline="space.400">
						<Label htmlFor="captions-upload-language-picker">
							{intl.formatMessage(messages.video_captions_upload_captions_form_language_picker)}
						</Label>
						<LocaleSelect
							id="captions-upload-language-picker"
							defaultLocale={selectedLocale}
							locale={selectedLocale}
							locales={locales}
							onLocaleChange={(locale) => setSelectedLocale(locale)}
						/>
					</Box>
					<ModalFooter>
						<Button appearance="subtle" onClick={close}>
							{intl.formatMessage(messages.cancel)}
						</Button>
						<Button appearance="primary" onClick={submit}>
							{intl.formatMessage(messages.upload)}
						</Button>
					</ModalFooter>
				</Modal>
			)}
		</ModalTransition>
	);
}
export default injectIntl(UploadCaptionsForm);
