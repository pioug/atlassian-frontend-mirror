/*
 * XXH3-64, adapted from hash-wasm's scalar implementation:
 * https://github.com/Daninet/hash-wasm/blob/867bb9764fbff6dc4808a54f40e3249f474678f9/src/xxhash3.c
 * Copyright (C) 2012-2020 Yann Collet
 * Modified for hash-wasm by Dani Biró. JavaScript adaptation, 2026.
 *
 * BSD 2-Clause License
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
const MASK64 = BigInt('0xffffffffffffffff');
const MASK32 = BigInt('0xffffffff');
const PRIME32_1 = BigInt('0x9e3779b1');
const PRIME32_2 = BigInt('0x85ebca77');
const PRIME32_3 = BigInt('0xc2b2ae3d');
const PRIME64_1 = BigInt('0x9e3779b185ebca87');
const PRIME64_2 = BigInt('0xc2b2ae3d27d4eb4f');
const PRIME64_3 = BigInt('0x165667b19e3779f9');
const PRIME64_4 = BigInt('0x85ebca77c2b2ae63');
const PRIME64_5 = BigInt('0x27d4eb2f165667c5');
const SECRET_BYTES = new Uint8Array([
	0xb8, 0xfe, 0x6c, 0x39, 0x23, 0xa4, 0x4b, 0xbe, 0x7c, 0x01, 0x81, 0x2c, 0xf7, 0x21, 0xad, 0x1c,
	0xde, 0xd4, 0x6d, 0xe9, 0x83, 0x90, 0x97, 0xdb, 0x72, 0x40, 0xa4, 0xa4, 0xb7, 0xb3, 0x67, 0x1f,
	0xcb, 0x79, 0xe6, 0x4e, 0xcc, 0xc0, 0xe5, 0x78, 0x82, 0x5a, 0xd0, 0x7d, 0xcc, 0xff, 0x72, 0x21,
	0xb8, 0x08, 0x46, 0x74, 0xf7, 0x43, 0x24, 0x8e, 0xe0, 0x35, 0x90, 0xe6, 0x81, 0x3a, 0x26, 0x4c,
	0x3c, 0x28, 0x52, 0xbb, 0x91, 0xc3, 0x00, 0xcb, 0x88, 0xd0, 0x65, 0x8b, 0x1b, 0x53, 0x2e, 0xa3,
	0x71, 0x64, 0x48, 0x97, 0xa2, 0x0d, 0xf9, 0x4e, 0x38, 0x19, 0xef, 0x46, 0xa9, 0xde, 0xac, 0xd8,
	0xa8, 0xfa, 0x76, 0x3f, 0xe3, 0x9c, 0x34, 0x3f, 0xf9, 0xdc, 0xbb, 0xc7, 0xc7, 0x0b, 0x4f, 0x1d,
	0x8a, 0x51, 0xe0, 0x4b, 0xcd, 0xb4, 0x59, 0x31, 0xc8, 0x9f, 0x7e, 0xc9, 0xd9, 0x78, 0x73, 0x64,
	0xea, 0xc5, 0xac, 0x83, 0x34, 0xd3, 0xeb, 0xc3, 0xc5, 0x81, 0xa0, 0xff, 0xfa, 0x13, 0x63, 0xeb,
	0x17, 0x0d, 0xdd, 0x51, 0xb7, 0xf0, 0xda, 0x49, 0xd3, 0x16, 0x55, 0x26, 0x29, 0xd4, 0x68, 0x9e,
	0x2b, 0x16, 0xbe, 0x58, 0x7d, 0x47, 0xa1, 0xfc, 0x8f, 0xf8, 0xb8, 0xd1, 0x7a, 0xd0, 0x31, 0xce,
	0x45, 0xcb, 0x3a, 0x8f, 0x95, 0x16, 0x04, 0x28, 0xaf, 0xd7, 0xfb, 0xca, 0xbb, 0x4b, 0x40, 0x7e,
]);
const SECRET = new DataView(SECRET_BYTES.buffer);
const STRIPE_LENGTH = 64;
const SECRET_CONSUME_RATE = 8;
const STRIPES_PER_BLOCK = (SECRET.byteLength - STRIPE_LENGTH) / SECRET_CONSUME_RATE;
const BLOCK_LENGTH = STRIPE_LENGTH * STRIPES_PER_BLOCK;
function read64(view: DataView, offset: number): bigint {
	return (
		BigInt(view.getUint32(offset, true)) | (BigInt(view.getUint32(offset + 4, true)) << BigInt(32))
	);
}
function swap32(value: number): number {
	return (
		((value >>> 24) | ((value >>> 8) & 0xff00) | ((value << 8) & 0xff0000) | (value << 24)) >>> 0
	);
}
function swap64(value: bigint): bigint {
	return (
		(BigInt(swap32(Number(value & MASK32))) << BigInt(32)) |
		BigInt(swap32(Number(value >> BigInt(32))))
	);
}
function rotateLeft(value: bigint, bits: bigint): bigint {
	return ((value << bits) | (value >> (BigInt(64) - bits))) & MASK64;
}
function multiplyFold64(left: bigint, right: bigint): bigint {
	const product = left * right;
	return (product & MASK64) ^ (product >> BigInt(64));
}
function avalanche64(value: bigint): bigint {
	value &= MASK64;
	value ^= value >> BigInt(33);
	value = (value * PRIME64_2) & MASK64;
	value ^= value >> BigInt(29);
	value = (value * PRIME64_3) & MASK64;
	return value ^ (value >> BigInt(32));
}
function avalanche3(value: bigint): bigint {
	value &= MASK64;
	value ^= value >> BigInt(37);
	value = (value * BigInt('0x165667919e3779f9')) & MASK64;
	return value ^ (value >> BigInt(32));
}
function rrmxmx(value: bigint, length: number): bigint {
	value ^= rotateLeft(value, BigInt(49)) ^ rotateLeft(value, BigInt(24));
	value = (value * BigInt('0x9fb21c651e98df25')) & MASK64;
	value ^= (value >> BigInt(35)) + BigInt(length);
	value = (value * BigInt('0x9fb21c651e98df25')) & MASK64;
	return value ^ (value >> BigInt(28));
}
function mix16(input: DataView, inputOffset: number, secretOffset: number, seed: bigint): bigint {
	const low = read64(input, inputOffset) ^ ((read64(SECRET, secretOffset) + seed) & MASK64);
	const high =
		read64(input, inputOffset + 8) ^ ((read64(SECRET, secretOffset + 8) - seed) & MASK64);
	return multiplyFold64(low, high);
}
function hashShort(input: DataView, length: number, seed: bigint): bigint {
	if (length > 8) {
		const low = read64(input, 0) ^ (((read64(SECRET, 24) ^ read64(SECRET, 32)) + seed) & MASK64);
		const high =
			read64(input, length - 8) ^ (((read64(SECRET, 40) ^ read64(SECRET, 48)) - seed) & MASK64);
		return avalanche3(BigInt(length) + swap64(low) + high + multiplyFold64(low, high));
	}
	if (length >= 4) {
		seed ^= BigInt(swap32(Number(seed & MASK32))) << BigInt(32);
		const first = BigInt(input.getUint32(0, true));
		const last = BigInt(input.getUint32(length - 4, true));
		const flip = ((read64(SECRET, 8) ^ read64(SECRET, 16)) - seed) & MASK64;
		return rrmxmx(((first << BigInt(32)) | last) ^ flip, length);
	}
	if (length > 0) {
		const first = input.getUint8(0);
		const middle = input.getUint8(length >> 1);
		const last = input.getUint8(length - 1);
		const combined = ((first << 16) | (middle << 24) | last | (length << 8)) >>> 0;
		const flip =
			(BigInt((SECRET.getUint32(0, true) ^ SECRET.getUint32(4, true)) >>> 0) + seed) & MASK64;
		return avalanche64(BigInt(combined) ^ flip);
	}
	return avalanche64(seed ^ read64(SECRET, 56) ^ read64(SECRET, 64));
}
function hashMedium(input: DataView, length: number, seed: bigint): bigint {
	let accumulator = BigInt(length) * PRIME64_1;
	if (length <= 128) {
		const pairs = Math.ceil(length / 32);
		for (let pair = 0; pair < pairs; pair++) {
			accumulator += mix16(input, pair * 16, pair * 32, seed);
			accumulator += mix16(input, length - (pair + 1) * 16, pair * 32 + 16, seed);
		}
		return avalanche3(accumulator);
	}
	const rounds = Math.floor(length / 16);
	for (let round = 0; round < 8; round++) {
		accumulator += mix16(input, round * 16, round * 16, seed);
	}
	accumulator = avalanche3(accumulator);
	for (let round = 8; round < rounds; round++) {
		accumulator += mix16(input, round * 16, (round - 8) * 16 + 3, seed);
	}
	accumulator += mix16(input, length - 16, 119, seed);
	return avalanche3(accumulator);
}
function secretForSeed(seed: bigint): DataView {
	if (seed === BigInt(0)) return SECRET;
	const secret = new DataView(new ArrayBuffer(SECRET.byteLength));
	for (let offset = 0; offset < secret.byteLength; offset += 16) {
		secret.setBigUint64(offset, (read64(SECRET, offset) + seed) & MASK64, true);
		secret.setBigUint64(offset + 8, (read64(SECRET, offset + 8) - seed) & MASK64, true);
	}
	return secret;
}
function accumulateStripe(
	accumulators: bigint[],
	input: DataView,
	inputOffset: number,
	secret: DataView,
	secretOffset: number,
): void {
	for (let lane = 0; lane < 8; lane++) {
		const data = read64(input, inputOffset + lane * 8);
		const keyed = data ^ read64(secret, secretOffset + lane * 8);
		// @ts-ignore - TS2532 - Object is possibly 'undefined'.
		accumulators[lane ^ 1] = (accumulators[lane ^ 1] + data) & MASK64;
		// @ts-ignore - TS2532 - Object is possibly 'undefined'.
		accumulators[lane] = (accumulators[lane] + (keyed & MASK32) * (keyed >> BigInt(32))) & MASK64;
	}
}
function scramble(accumulators: bigint[], secret: DataView): void {
	const secretOffset = secret.byteLength - STRIPE_LENGTH;
	for (let lane = 0; lane < 8; lane++) {
		let value = accumulators[lane];
		// @ts-ignore - TS18048 - 'value' is possibly 'undefined'.
		value ^= value >> BigInt(47);
		// @ts-ignore - TS18048 - 'value' is possibly 'undefined'.
		value ^= read64(secret, secretOffset + lane * 8);
		// @ts-ignore - TS18048 - 'value' is possibly 'undefined'.
		accumulators[lane] = (value * PRIME32_1) & MASK64;
	}
}
function hashLong(input: DataView, length: number, seed: bigint): bigint {
	const secret = secretForSeed(seed);
	const accumulators = [
		PRIME32_3,
		PRIME64_1,
		PRIME64_2,
		PRIME64_3,
		PRIME64_4,
		PRIME32_2,
		PRIME64_5,
		PRIME32_1,
	];
	const blocks = Math.floor((length - 1) / BLOCK_LENGTH);
	for (let block = 0; block < blocks; block++) {
		for (let stripe = 0; stripe < STRIPES_PER_BLOCK; stripe++) {
			accumulateStripe(
				accumulators,
				input,
				block * BLOCK_LENGTH + stripe * STRIPE_LENGTH,
				secret,
				stripe * SECRET_CONSUME_RATE,
			);
		}
		scramble(accumulators, secret);
	}
	const partialOffset = blocks * BLOCK_LENGTH;
	const stripes = Math.floor((length - 1 - partialOffset) / STRIPE_LENGTH);
	for (let stripe = 0; stripe < stripes; stripe++) {
		accumulateStripe(
			accumulators,
			input,
			partialOffset + stripe * STRIPE_LENGTH,
			secret,
			stripe * SECRET_CONSUME_RATE,
		);
	}
	accumulateStripe(
		accumulators,
		input,
		length - STRIPE_LENGTH,
		secret,
		secret.byteLength - STRIPE_LENGTH - 7,
	);
	let result = BigInt(length) * PRIME64_1;
	for (let pair = 0; pair < 4; pair++) {
		const secretOffset = 11 + pair * 16;
		result += multiplyFold64(
			// @ts-ignore - TS2532 - Object is possibly 'undefined'.
			accumulators[pair * 2] ^ read64(secret, secretOffset),
			// @ts-ignore - TS2532 - Object is possibly 'undefined'.
			accumulators[pair * 2 + 1] ^ read64(secret, secretOffset + 8),
		);
	}
	return avalanche3(result);
}
function xxh3_64(input: string | Uint8Array, seed: bigint = BigInt(0)): bigint {
	if (typeof seed !== 'bigint') throw new TypeError('seed must be a bigint');
	if (seed < BigInt(0) || seed > MASK64)
		throw new RangeError('seed must be an unsigned 64-bit integer');
	const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
	if (!(bytes instanceof Uint8Array)) throw new TypeError('input must be a string or Uint8Array');
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const length = bytes.byteLength;
	if (length <= 16) return hashShort(view, length, seed);
	if (length <= 240) return hashMedium(view, length, seed);
	return hashLong(view, length, seed);
}
function xxh3_64Hex(input: string | Uint8Array, seed: bigint = BigInt(0)): string {
	return xxh3_64(input, seed).toString(16).padStart(16, '0');
}
/** XXH3-64 with the standard secret and seed zero, matching the WASM exposure hasher. */
export function localHash64(bytes: Uint8Array): string {
	return xxh3_64Hex(bytes);
}
