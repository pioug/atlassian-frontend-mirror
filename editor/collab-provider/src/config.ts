/**
 * https://socket.io/docs/v4/client-options/#randomizationfactor
 * 1st reconnection attempt happens between 100 - 300 ms
 * 2nd reconnection attempt happens between 200 - 600 ms
 * 3rd reconnection attempt happens between 400 - 1200 ms
 * 4th 800 - 2400 ms
 * 5th 1600 - 4800 ms
 * 6th 3200 - 9600 ms
 * 7th 6400 - 19200 ms
 * 8th 12800 - 38400 ms
 * 9th 25600 - 76800 ms
 * 10th 51200 - 128000 ms (capped at max delay)
 * nth 128000 ms
 */
export const SOCKET_IO_OPTIONS = {
	RECONNECTION_DELAY_MAX: 128 * 1000,
	RECONNECTION_DELAY: 200,
	RANDOMIZATION_FACTOR: 0.5,
};

/**
 * 1st reconnection attempt happens between 250 - 1750 ms
 * 2nd reconnection attempt happens between 500 - 3500 ms
 * 3rd reconnection attempt happens between 1000 - 7000 ms
 * 4th 2000 - 14000 ms
 * 5th 4000 - 28000 ms
 * 6th 8000 - 56000 ms
 * 7th 16000 - 112000 ms
 * 8th 32000 - 128000 ms (capped at max delay)
 * nth 128000 ms
 */
export const SOCKET_IO_OPTIONS_WITH_HIGH_JITTER = {
	RECONNECTION_DELAY_MAX: 128 * 1000,
	RECONNECTION_DELAY: 1000,
	RANDOMIZATION_FACTOR: 0.75,
};
