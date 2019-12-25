const w1252_unicode = [
	[0x80, 0x20ac], [0x82, 0x201a], [0x83, 0x0192], [0x84, 0x201e], [0x85, 0x2026], [0x86, 0x2020],
	[0x87, 0x2021], [0x88, 0x02c6], [0x89, 0x2030], [0x8a, 0x0160], [0x8b, 0x2039], [0x8c, 0x0152],
	[0x8e, 0x017d], [0x91, 0x2018], [0x92, 0x2019], [0x93, 0x201c], [0x94, 0x201d], [0x95, 0x2022],
	[0x96, 0x2013], [0x97, 0x2014], [0x98, 0x02dc], [0x99, 0x2122], [0x9a, 0x0161], [0x9b, 0x203a],
	[0x9c, 0x0153], [0x9e, 0x017e], [0x9f, 0x0178]
];

// Void positions at Windows 1252
const w1252_void = [129, 141, 143, 144, 157];

const wByteToChar = {};
const charToUByte = {};
const charToWByte = {};
const wByteToUByte = {};
const uByteToWByte = {};

const map = (wByte, uByte) => {
	const char = String.fromCharCode(uByte);
	wByteToChar[wByte] = char;
	charToUByte[char] = uByte;
	charToWByte[char] = wByte;
	wByteToUByte[wByte] = uByte;
	uByteToWByte[uByte] = wByte;
};

// Map printable control characters
map(9, 9);
map(10, 10);
map(13, 13);

// Map printable characters
for (let i=32; i<=255; ++i) {
	if (w1252_void.indexOf(i) === -1) {
		map(i, i);
	}
}

// Map unicode and windows 1252 differences
w1252_unicode.forEach(pair => {
	map(...pair);
});

module.exports.encode = (string, buffer) => {
	const n = string.length;
	const res = buffer? buffer: Buffer.alloc(string.length);
	for (let i=0; i<n; ++i) {
		const uByte = string.charCodeAt(i);
		const wByte = uByteToWByte[uByte];
		if (wByte === undefined) {
			throw `Character ${uByte} can't be encoded into Windows 1252`;
		}
		res.writeUInt8(wByte, i);
	}
	return res;
};

module.exports.decode = buffer => {
	const n = buffer.length;
	let res = '';
	for (let i=0; i<n; ++i) {
		const wByte = buffer.readUInt8(i);
		const char = wByteToChar[wByte];
		if (char === undefined) {
			throw `Character ${wByte} is not at Windows 1252 charset`;
		}
		res += char;
	}
	return res;
};