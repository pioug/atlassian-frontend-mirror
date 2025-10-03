import { useEffect } from 'react';

import { useDebounce } from 'use-debounce';

import { normalizeUrl } from '@atlaskit/linking-common/url';

interface AutoSubmitOnChangeProps {
	url: string;
	isSubmitting: boolean;
	isSelectedItem: boolean;
	onSubmit: () => void;
	onClearInvalidUrl: () => void;
}

const AutoSubmitOnChange = ({
	url,
	isSubmitting,
	isSelectedItem,
	onSubmit,
	onClearInvalidUrl,
}: AutoSubmitOnChangeProps) => {
	// Debounce the URL to avoid rapid successive submissions during typing
	const [debouncedUrl] = useDebounce(url, 300);
	const isBlank = url === '';
	// Auto-submit when URL changes
	useEffect(() => {
		//prevents misalignment between url and debounced url when clear button is clicked
		if (isBlank) {
			onClearInvalidUrl();
			return;
		}
		// Only auto-submit if debouncedUrl is not empty and not already submitting
		if (debouncedUrl.trim() && !isSubmitting && !isSelectedItem) {
			const normalized = normalizeUrl(debouncedUrl);
			if (normalized) {
				onSubmit();
			}
		}
		//onSubmit() left out to prevent infinite loop
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedUrl, isSubmitting, isSelectedItem, onClearInvalidUrl, isBlank]);

	// This component renders nothing
	return null;
};

export default AutoSubmitOnChange;
