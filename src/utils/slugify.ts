import kebabCase from "lodash.kebabcase";

export const slugifyStr = (str: string) => kebabCase(str);

export const slugifyAll = (arr: string[]) => arr.map(str => slugifyStr(str));
