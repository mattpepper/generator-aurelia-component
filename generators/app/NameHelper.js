module.exports = class NameHelper {
  constructor() {
    this.regExPatterns = {
      'PascalCase': '^([A-Z][a-z0-9]+)([A-Z])([a-z0-9]+)*$',
      'camelCase': '^([a-z]+[A-Z0-9])([a-z0-9]+)*$',
      'hyphen-delimited': '^([A-Za-z0-9]+)-([A-Za-z0-9]+)$'
    };
  }

  isPascalCase(text) {
    return new RegExp(this.regExPatterns.PascalCase).test(text);
  }

  isCamelCase(text) {
    return new RegExp(this.regExPatterns.camelCase).test(text);
  }

  isHypenDelimitedCase(text) {
    return new RegExp(this.regExPatterns['hyphen-delimited']).test(text);
  }

  convertString(text, convention) {
    let changedText = text;

    switch(convention) {
      case 'PascalCase': {
        if (!this.isPascalCase(text)) {
          changedText = text.replace(/^(.)(.+)$/, (m, m1, m2) => {
            return `${m1.toUpperCase()}${m2.replace(/[^a-z0-9]/gi, '')}`;
          });
        }
        break;
      }
      case 'camelCase': {
        if (!this.isCamelCase(text)) {
          changedText = text.replace(/^(.)(.+)$/, (m, m1, m2) => {
            return `${m1.toLowerCase()}${m2.replace(/[^a-z0-9]/gi, '')}`;
          });
        }
        break;
      }
      case 'hyphen-delimited': {
        if (!this.isHypenDelimitedCase(text)) {
          changedText = text.replace(/^([A-Za-z0-9_]+)([A-Z0-9_].+)$/, (m, m1, m2) => {
            return (`${m1.replace(/[^a-z0-9]/gi, '')}-${m2}`).toLowerCase();
          });
        }
        break;
      }
    }

    return changedText;
  }
}
