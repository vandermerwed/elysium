import fs from "fs";
import path from "path";
import matter from "gray-matter";

// recursively get all files in a directory
const recursiveGetFiles = (dir: string) => {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    const files = dirents
        .filter((dirent) => dirent.isFile())
        .map((dirent) => path.join(dir, dirent.name));
    const dirs = dirents
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => path.join(dir, dirent.name));
    for (const d of dirs) {
        files.push(...recursiveGetFiles(d));
    }

    return files;
};

export const getPermalinks = (
    markdownFolder: string,
    ignorePatterns: Array<RegExp> = [],
    func: (str: any, ...args: any[]) => string = defaultPathToPermalinkFunc
) => {
    const files = recursiveGetFiles(markdownFolder);
    const filesFiltered = files.filter((file) => {
        return !ignorePatterns.some((pattern) => file.match(pattern));
    });

    var r =  filesFiltered.map((file) => func(file, markdownFolder));
    return r
};

const defaultPathToPermalinkFunc = (
    filePath: string,
    markdownFolder: string
) => {
    const permalink = filePath
        .replace(markdownFolder, "") // make the permalink relative to the markdown folder
        .replace(/\.(mdx|md)/, "")
        .replace(/\\/g, "/") // replace windows backslash with forward slash
        .replace(/\/index$/, ""); // remove index from the end of the permalink
    return permalink.length > 0 ? permalink : "/"; // for home page
};

// Get a map of slugs to page titles for wikilink display
export const getTitleMap = (
    markdownFolder: string,
    ignorePatterns: Array<RegExp> = []
): Record<string, string> => {
    const files = recursiveGetFiles(markdownFolder);
    const filesFiltered = files.filter((file) => {
        return !ignorePatterns.some((pattern) => file.match(pattern));
    });

    const titleMap: Record<string, string> = {};

    for (const file of filesFiltered) {
        if (!file.match(/\.(md|mdx)$/)) continue;

        try {
            const content = fs.readFileSync(file, "utf-8");
            const { data } = matter(content);

            if (data.title) {
                // Get the slug (filename without extension)
                const slug = path.basename(file).replace(/\.(md|mdx)$/, "");
                titleMap[slug] = data.title;
            }
        } catch (e) {
            // Skip files that can't be parsed
        }
    }

    return titleMap;
};