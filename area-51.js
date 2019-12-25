const fs = require('fs');

// W1252
// Control chars: 0 - 8, 11, 12, 14 - 31
// Non-printable: 127
// Void positions: 129, 141, 143, 144, 157

const w1252blob = (() => {
	const printableMap = {};
	for (let i=0; i<256; ++i) {
		printableMap[i] = true;
	}
	let n = 256;
	const remove = (a, b) => {
		if (b == null) {
			b = a;
		}
		while (a <= b) {
			printableMap[a] = false;
			++ a;
			-- n;
		}
	};
	
	// Remove ASCII
	remove(0, 127);
	
	// Remove void positions
	remove(129);
	remove(141);
	remove(143);
	remove(144);
	remove(157);
	const buffer = Buffer.alloc(n);
	for (let i=0, c=0; i<256; ++i) {
		if (printableMap[i]) {
			buffer.writeUInt8(i, c++);
		}
	}
	return buffer;
})();

// Writing w1252blob into a binary file the following string came up:
const str = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛ'
	+ 'ÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ';
const pairs = [];
const toHex2 = val => {
	val = val.toString(16);
	return '0x' + '0'.repeat(2 - val.length) + val;
};
const toHex4 = val => {
	val = val.toString(16);
	return '0x' + '0'.repeat(4 - val.length) + val;
};
str.split('').forEach((chr, i) => {
	const a = w1252blob.readUInt8(i);
	const b = chr.charCodeAt(0);
	if (a !== b) {
		pairs.push('['+toHex2(a)+', '+toHex4(b)+']');
	}
});
console.log('[' + pairs.join(', ') + ']');