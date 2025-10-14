// fancyTextMap.js

interface FancyTextStyle {
  base?: number;
  map?: Record<string, string>;
  transform?: (char: string) => string;
  combineMarks?: string[];
}

export const fancyTextMap: Record<string, FancyTextStyle> = {
    bold: {
      base: "𝐚".codePointAt(0)! - "a".codePointAt(0)!,
      transform: (char: string) => {
        if (/[a-z]/.test(char)) return String.fromCodePoint("𝐚".codePointAt(0)! + (char.charCodeAt(0) - 97));
        if (/[A-Z]/.test(char)) return String.fromCodePoint("𝐀".codePointAt(0)! + (char.charCodeAt(0) - 65));
        return char;
      },
    },
    italic: {
      transform: (char: string) => {
        if (/[a-z]/.test(char)) return String.fromCodePoint("𝑎".codePointAt(0)! + (char.charCodeAt(0) - 97));
        if (/[A-Z]/.test(char)) return String.fromCodePoint("𝐴".codePointAt(0)! + (char.charCodeAt(0) - 65));
        return char;
      },
    },
    boldItalic: {
      transform: (char: string) => {
        if (/[a-z]/.test(char)) return String.fromCodePoint("𝒂".codePointAt(0)! + (char.charCodeAt(0) - 97));
        if (/[A-Z]/.test(char)) return String.fromCodePoint("𝑨".codePointAt(0)! + (char.charCodeAt(0) - 65));
        return char;
      },
    },
    script: {
      map: {
        a: "𝓪", b: "𝓫", c: "𝓬", d: "𝓭", e: "𝓮", f: "𝓯", g: "𝓰", h: "𝓱",
        i: "𝓲", j: "𝓳", k: "𝓴", l: "𝓵", m: "𝓶", n: "𝓷", o: "𝓸", p: "𝓹",
        q: "𝓺", r: "𝓻", s: "𝓼", t: "𝓽", u: "𝓾", v: "𝓿", w: "𝔀", x: "𝔁",
        y: "𝔂", z: "𝔃"
      }
    },
    boldScript: {
      map: { a: "𝓪", b: "𝓫", c: "𝓬", d: "𝓭", e: "𝓮", f: "𝓯", g: "𝓰", h: "𝓱" /* extend as needed */ }
    },
    fraktur: {
      map: {
        a: "𝔞", b: "𝔟", c: "𝔠", d: "𝔡", e: "𝔢", f: "𝔣", g: "𝔤",
        h: "𝔥", i: "𝔦", j: "𝔧", k: "𝔨", l: "𝔩", m: "𝔪", n: "𝔫",
        o: "𝔬", p: "𝔭", q: "𝔮", r: "𝔯", s: "𝔰", t: "𝔱", u: "𝔲",
        v: "𝔳", w: "𝔴", x: "𝔵", y: "𝔶", z: "𝔷"
      }
    },
    doubleStruck: {
      map: {
        A: "𝔸", B: "𝔹", C: "ℂ", D: "𝔻", E: "𝔼", F: "𝔽", G: "𝔾",
        H: "ℍ", I: "𝕀", J: "𝕁", K: "𝕂", L: "𝕃", M: "𝕄", N: "ℕ",
        O: "𝕆", P: "ℙ", Q: "ℚ", R: "ℝ", S: "𝕊", T: "𝕋", U: "𝕌",
        V: "𝕍", W: "𝕎", X: "𝕏", Y: "𝕐", Z: "ℤ",
        a: "𝕒", b: "𝕓", c: "𝕔", d: "𝕕", e: "𝕖", f: "𝕗", g: "𝕘"
      }
    },
    boldFraktur: {
      map: { a: "𝖆", b: "𝖇", c: "𝖈", d: "𝖉", e: "𝖊", f: "𝖋" /* extend */ }
    },
    monospace: {
      transform: (char: string) => {
        if (/[a-z]/.test(char)) return String.fromCodePoint("𝚊".codePointAt(0)! + (char.charCodeAt(0) - 97));
        if (/[A-Z]/.test(char)) return String.fromCodePoint("𝙰".codePointAt(0)! + (char.charCodeAt(0) - 65));
        return char;
      }
    },
    fullwidth: {
      transform: (char: string) => {
        if (/[A-Za-z0-9]/.test(char))
          return String.fromCharCode(char.charCodeAt(0) + 0xFEE0);
        return char;
      }
    },
    circled: {
      map: { A: "Ⓐ", B: "Ⓑ", C: "Ⓒ", a: "ⓐ", b: "ⓑ", c: "ⓒ" /* extend */ }
    },
    negativeCircled: {
      map: { A: "🅐", B: "🅑", C: "🅒", D: "🅓" /* extend */ }
    },
    squared: {
      map: { A: "🄰", B: "🄱", C: "🄲", D: "🄳" /* extend */ }
    },
    negativeSquared: {
      map: { A: "🅰️", B: "🅱️", C: "🅲", D: "🅳" /* extend */ }
    },
    tinycaps: {
      map: { a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ғ", g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ", s: "s", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ" }
    },
    oldEnglish: {
      map: { a: "𝔞", b: "𝔟", c: "𝔠", d: "𝔡", e: "𝔢" /* reuse fraktur base */ }
    },
    upsideDown: {
      map: { a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ", j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ", s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z" }
    },
    zalgo: {
      combineMarks: [
        "\u0300", "\u0301", "\u0302", "\u0303", "\u0304", "\u0305",
        "\u0306", "\u0307", "\u0308", "\u0309", "\u030A", "\u030B",
        "\u030C", "\u030D", "\u030E", "\u030F", "\u0310", "\u0311",
      ],
      transform: (char: string) => {
        const marks = Array.from({ length: Math.floor(Math.random() * 5) + 1 })
          .map(() => fancyTextMap.zalgo.combineMarks![Math.floor(Math.random() * fancyTextMap.zalgo.combineMarks!.length)])
          .join('');
        return char + marks;
      }
    }
  };
  