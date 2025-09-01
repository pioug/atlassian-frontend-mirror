import { useInteractionContext } from '../interaction-context';
import {
	addError,
	addErrorToAll,
	getActiveInteraction,
	type InteractionError,
} from '../interaction-metrics';

/**
 * Usage:
 * ```
 * import { useUFOReportError } from '@atlaskit/react-ufo/use-error-handler';
 *
 * const reportError = useUFOReportError();
 *
 * try {
 *   // something that can throw an error
 * } catch (error) {
 *   reportError(error)
 * }
 * ```
 * @returns `reportError` function
 */
export function useUFOReportError() {
	const interaction = getActiveInteraction();
	const ufoContext = useInteractionContext();

	const reportError = (error: InteractionError) => {
		if (interaction?.id) {
			addError(
				interaction.id,
				error.name,
				ufoContext?.labelStack || null,
				error.name,
				error.errorMessage,
				error.errorStack,
				error.forcedError,
			);
		} else {
			addErrorToAll(
				error.name,
				ufoContext?.labelStack || null,
				error.name,
				error.errorMessage,
				error.errorStack,
			);
		}
	};

	return reportError;
}
