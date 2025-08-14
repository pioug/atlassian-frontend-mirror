import { type MessageDescriptor } from 'react-intl-next';

/**
 * Retrieves the appropriate internationalization message for a given color
 * @param messages - Record of color values to message descriptors
 * @param color - The color value to look up
 * @returns The message descriptor or undefined if not found
 */
export default function getColorMessage(
	messages: Record<string | number, MessageDescriptor>,
	color: string,
): MessageDescriptor | undefined {
	const message = messages[color as keyof typeof messages];

	if (!message) {
		// eslint-disable-next-line no-console
		console.warn(
			`Color palette does not have an internationalization message for color ${color.toUpperCase()}.
You must add a message description to properly translate this color.
Using current label as default message.
This could have happened when someone changed the 'colorPalette' from 'adf-schema' without updating this file.
`,
		);
	}

	return message;
}
