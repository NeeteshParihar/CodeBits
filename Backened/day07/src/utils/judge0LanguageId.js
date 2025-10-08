const latestLanguageIds = {
  "assembly": 45,
  "bash": 46,
  "basic": 47,
  "c": 110,           // prefers clang over gcc
  "c++": 105,         // latest GCC version
  "clojure": 86,
  "c#": 51,
  "cobol": 77,
  "common lisp": 55,
  "dart": 90,
  "d": 56,
  "elixir": 57,
  "erlang": 58,
  "executable": 44,
  "f#": 87,
  "fortran": 59,
  "go": 107,
  "groovy": 88,
  "haskell": 61,
  "java": 91,         // dropped javafx
  "javascript": 102,
  "kotlin": 111,
  "lua": 64,
  "multi-file program": 89,
  "objective-c": 79,
  "ocaml": 65,
  "octave": 66,
  "pascal": 67,
  "perl": 85,
  "php": 98,
  "plain text": 43,
  "prolog": 69,
  "python": 109,
  "r": 99,
  "ruby": 72,
  "rust": 108,
  "scala": 112,
  "sql": 82,
  "swift": 83,
  "typescript": 101,
  "visual basic.net": 84
};


function getLanguageId(lang){
  return latestLanguageIds[lang.toLowerCase()];
}

export default getLanguageId;