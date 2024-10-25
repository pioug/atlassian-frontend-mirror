import { addError, getActiveInteraction, type InteractionError } from '../interaction-metrics';

type InteractionErrorManual = Pick<InteractionError, 'errorMessage' | 'name'>;

export function setInteractionError(interactionName: string, error: InteractionErrorManual) {
	const interaction = getActiveInteraction();
	if (!interaction) {
		return;
	}
	if (interaction.ufoName !== interactionName) {
		return;
	}
	addError(
		interaction.id,
		error.name,
		null,
		'Manual interaction error',
		error.errorMessage,
		undefined,
		true,
	);
}
