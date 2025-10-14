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
        y: "𝔂", z: "𝔃",
        A: "𝓐", B: "𝓑", C: "𝓒", D: "𝓓", E: "𝓔", F: "𝓕", G: "𝓖", H: "𝓗",
        I: "𝓘", J: "𝓙", K: "𝓚", L: "𝓛", M: "𝓜", N: "𝓝", O: "𝓞", P: "𝓟",
        Q: "𝓠", R: "𝓡", S: "𝓢", T: "𝓣", U: "𝓤", V: "𝓥", W: "𝓦", X: "𝓧",
        Y: "𝓨", Z: "𝓩"
      }
    },
    boldScript: {
      map: { 
        a: "𝓪", b: "𝓫", c: "𝓬", d: "𝓭", e: "𝓮", f: "𝓯", g: "𝓰", h: "𝓱",
        i: "𝓲", j: "𝓳", k: "𝓴", l: "𝓵", m: "𝓶", n: "𝓷", o: "𝓸", p: "𝓹",
        q: "𝓺", r: "𝓻", s: "𝓼", t: "𝓽", u: "𝓾", v: "𝓿", w: "𝔀", x: "𝔁",
        y: "𝔂", z: "𝔃",
        A: "𝓐", B: "𝓑", C: "𝓒", D: "𝓓", E: "𝓔", F: "𝓕", G: "𝓖", H: "𝓗",
        I: "𝓘", J: "𝓙", K: "𝓚", L: "𝓛", M: "𝓜", N: "𝓝", O: "𝓞", P: "𝓟",
        Q: "𝓠", R: "𝓡", S: "𝓢", T: "𝓣", U: "𝓤", V: "𝓥", W: "𝓦", X: "𝓧",
        Y: "𝓨", Z: "𝓩"
      }
    },
    fraktur: {
      map: {
        a: "𝔞", b: "𝔟", c: "𝔠", d: "𝔡", e: "𝔢", f: "𝔣", g: "𝔤",
        h: "𝔥", i: "𝔦", j: "𝔧", k: "𝔨", l: "𝔩", m: "𝔪", n: "𝔫",
        o: "𝔬", p: "𝔭", q: "𝔮", r: "𝔯", s: "𝔰", t: "𝔱", u: "𝔲",
        v: "𝔳", w: "𝔴", x: "𝔵", y: "𝔶", z: "𝔷",
        A: "𝔄", B: "𝔅", C: "ℭ", D: "𝔇", E: "𝔈", F: "𝔉", G: "𝔊",
        H: "ℌ", I: "ℑ", J: "𝔍", K: "𝔎", L: "𝔏", M: "𝔐", N: "𝔑",
        O: "𝔒", P: "𝔓", Q: "𝔔", R: "ℜ", S: "𝔖", T: "𝔗", U: "𝔘",
        V: "𝔙", W: "𝔚", X: "𝔛", Y: "𝔜", Z: "ℨ"
      }
    },
    doubleStruck: {
      map: {
        A: "𝔸", B: "𝔹", C: "ℂ", D: "𝔻", E: "𝔼", F: "𝔽", G: "𝔾",
        H: "ℍ", I: "𝕀", J: "𝕁", K: "𝕂", L: "𝕃", M: "𝕄", N: "ℕ",
        O: "𝕆", P: "ℙ", Q: "ℚ", R: "ℝ", S: "𝕊", T: "𝕋", U: "𝕌",
        V: "𝕍", W: "𝕎", X: "𝕏", Y: "𝕐", Z: "ℤ",
        a: "𝕒", b: "𝕓", c: "𝕔", d: "𝕕", e: "𝕖", f: "𝕗", g: "𝕘",
        h: "𝕙", i: "𝕚", j: "𝕛", k: "𝕜", l: "𝕝", m: "𝕞", n: "𝕟",
        o: "𝕠", p: "𝕡", q: "𝕢", r: "𝕣", s: "𝕤", t: "𝕥", u: "𝕦",
        v: "𝕧", w: "𝕨", x: "𝕩", y: "𝕪", z: "𝕫"
      }
    },
    boldFraktur: {
      map: { 
        a: "𝖆", b: "𝖇", c: "𝖈", d: "𝖉", e: "𝖊", f: "𝖋", g: "𝖌", h: "𝖍",
        i: "𝖎", j: "𝖏", k: "𝖐", l: "𝖑", m: "𝖒", n: "𝖓", o: "𝖔", p: "𝖕",
        q: "𝖖", r: "𝖗", s: "𝖘", t: "𝖙", u: "𝖚", v: "𝖛", w: "𝖜", x: "𝖝",
        y: "𝖞", z: "𝖟",
        A: "𝕬", B: "𝕭", C: "𝕮", D: "𝕯", E: "𝕰", F: "𝕱", G: "𝕲", H: "𝕳",
        I: "𝕴", J: "𝕵", K: "𝕶", L: "𝕷", M: "𝕸", N: "𝕹", O: "𝕺", P: "𝕻",
        Q: "𝕼", R: "𝕽", S: "𝕾", T: "𝕿", U: "𝖀", V: "𝖁", W: "𝖂", X: "𝖃",
        Y: "𝖄", Z: "𝖅"
      }
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
      map: { 
        A: "Ⓐ", B: "Ⓑ", C: "Ⓒ", D: "Ⓓ", E: "Ⓔ", F: "Ⓕ", G: "Ⓖ", H: "Ⓗ",
        I: "Ⓘ", J: "Ⓙ", K: "Ⓚ", L: "Ⓛ", M: "Ⓜ", N: "Ⓝ", O: "Ⓞ", P: "Ⓟ",
        Q: "Ⓠ", R: "Ⓡ", S: "Ⓢ", T: "Ⓣ", U: "Ⓤ", V: "Ⓥ", W: "Ⓦ", X: "Ⓧ",
        Y: "Ⓨ", Z: "Ⓩ",
        a: "ⓐ", b: "ⓑ", c: "ⓒ", d: "ⓓ", e: "ⓔ", f: "ⓕ", g: "ⓖ", h: "ⓗ",
        i: "ⓘ", j: "ⓙ", k: "ⓚ", l: "ⓛ", m: "ⓜ", n: "ⓝ", o: "ⓞ", p: "ⓟ",
        q: "ⓠ", r: "ⓡ", s: "ⓢ", t: "ⓣ", u: "ⓤ", v: "ⓥ", w: "ⓦ", x: "ⓧ",
        y: "ⓨ", z: "ⓩ"
      }
    },
    negativeCircled: {
      map: { 
        A: "🅐", B: "🅑", C: "🅒", D: "🅓", E: "🅔", F: "🅕", G: "🅖", H: "🅗",
        I: "🅘", J: "🅙", K: "🅚", L: "🅛", M: "🅜", N: "🅝", O: "🅞", P: "🅟",
        Q: "🅠", R: "🅡", S: "🅢", T: "🅣", U: "🅤", V: "🅥", W: "🅦", X: "🅧",
        Y: "🅨", Z: "🅩",
        // Use same for lowercase since no dedicated lowercase negative circled
        a: "🅐", b: "🅑", c: "🅒", d: "🅓", e: "🅔", f: "🅕", g: "🅖", h: "🅗",
        i: "🅘", j: "🅙", k: "🅚", l: "🅛", m: "🅜", n: "🅝", o: "🅞", p: "🅟",
        q: "🅠", r: "🅡", s: "🅢", t: "🅣", u: "🅤", v: "🅥", w: "🅦", x: "🅧",
        y: "🅨", z: "🅩"
      }
    },
    squared: {
      map: { 
        A: "🄰", B: "🄱", C: "🄲", D: "🄳", E: "🄴", F: "🄵", G: "🄶", H: "🄷",
        I: "🄸", J: "🄹", K: "🄺", L: "🄻", M: "🄼", N: "🄽", O: "🄾", P: "🄿",
        Q: "🅀", R: "🅁", S: "🅂", T: "🅃", U: "🅄", V: "🅅", W: "🅆", X: "🅇",
        Y: "🅈", Z: "🅉",
        // Use same for lowercase since no dedicated lowercase squared
        a: "🄰", b: "🄱", c: "🄲", d: "🄳", e: "🄴", f: "🄵", g: "🄶", h: "🄷",
        i: "🄸", j: "🄹", k: "🄺", l: "🄻", m: "🄼", n: "🄽", o: "🄾", p: "🄿",
        q: "🅀", r: "🅁", s: "🅂", t: "🅃", u: "🅄", v: "🅅", w: "🅆", x: "🅇",
        y: "🅈", z: "🅉"
      }
    },
    negativeSquared: {
      map: { 
        A: "🅰️", B: "🅱️", C: "🅲", D: "🅳", E: "🅴", F: "🅵", G: "🅶", H: "🅷",
        I: "🅸", J: "🅹", K: "🅺", L: "🅻", M: "🅼", N: "🅽", O: "🅾️", P: "🅿️",
        Q: "🆀", R: "🆁", S: "🆂", T: "🆃", U: "🆄", V: "🆅", W: "🆆", X: "🆇",
        Y: "🆈", Z: "🆉",
        // Use same for lowercase since no dedicated lowercase negative squared
        a: "🅰️", b: "🅱️", c: "🅲", d: "🅳", e: "🅴", f: "🅵", g: "🅶", h: "🅷",
        i: "🅸", j: "🅹", k: "🅺", l: "🅻", m: "🅼", n: "🅽", o: "🅾️", p: "🅿️",
        q: "🆀", r: "🆁", s: "🆂", t: "🆃", u: "🆄", v: "🆅", w: "🆆", x: "🆇",
        y: "🆈", z: "🆉"
      }
    },
    tinycaps: {
      map: { 
        a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ғ", g: "ɢ", h: "ʜ", 
        i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", 
        q: "ǫ", r: "ʀ", s: "s", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", 
        y: "ʏ", z: "ᴢ",
        // Use same for uppercase since tinycaps are inherently small caps
        A: "ᴀ", B: "ʙ", C: "ᴄ", D: "ᴅ", E: "ᴇ", F: "ғ", G: "ɢ", H: "ʜ", 
        I: "ɪ", J: "ᴊ", K: "ᴋ", L: "ʟ", M: "ᴍ", N: "ɴ", O: "ᴏ", P: "ᴘ", 
        Q: "ǫ", R: "ʀ", S: "s", T: "ᴛ", U: "ᴜ", V: "ᴠ", W: "ᴡ", X: "x", 
        Y: "ʏ", Z: "ᴢ"
      }
    },
    oldEnglish: {
      map: { 
        a: "𝔞", b: "𝔟", c: "𝔠", d: "𝔡", e: "𝔢", f: "𝔣", g: "𝔤", h: "𝔥",
        i: "𝔦", j: "𝔧", k: "𝔨", l: "𝔩", m: "𝔪", n: "𝔫", o: "𝔬", p: "𝔭",
        q: "𝔮", r: "𝔯", s: "𝔰", t: "𝔱", u: "𝔲", v: "𝔳", w: "𝔴", x: "𝔵",
        y: "𝔶", z: "𝔷",
        A: "𝔄", B: "𝔅", C: "ℭ", D: "𝔇", E: "𝔈", F: "𝔉", G: "𝔊", H: "ℌ",
        I: "ℑ", J: "𝔍", K: "𝔎", L: "𝔏", M: "𝔐", N: "𝔑", O: "𝔒", P: "𝔓",
        Q: "𝔔", R: "ℜ", S: "𝔖", T: "𝔗", U: "𝔘", V: "𝔙", W: "𝔚", X: "𝔛",
        Y: "𝔜", Z: "ℨ"
      }
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
  