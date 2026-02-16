import Fuse from "fuse.js";
import { useEffect, useRef, useState, useMemo, type FormEvent } from "react";

export type SearchItem = {
  title: string;
  description: string;
  href: string;
  collection: "notes" | "writing" | "journal";
};

interface Props {
  searchList: SearchItem[];
}

interface SearchResult {
  item: SearchItem;
  refIndex: number;
}

const collectionLabel: Record<string, string> = {
  notes: "Note",
  writing: "Writing",
  journal: "Journal",
};

export default function SearchBar({ searchList }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null
  );

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.value);
  };

  const fuse = useMemo(
    () =>
      new Fuse(searchList, {
        keys: ["title", "description"],
        includeMatches: true,
        minMatchCharLength: 2,
        threshold: 0.5,
      }),
    [searchList]
  );

  useEffect(() => {
    const searchUrl = new URLSearchParams(window.location.search);
    const searchStr = searchUrl.get("q");
    if (searchStr) setInputVal(searchStr);

    // Focus the input after mount
    setTimeout(() => {
      if (inputRef.current) {
        const len = searchStr?.length || 0;
        inputRef.current.selectionStart = len;
        inputRef.current.selectionEnd = len;
      }
    }, 50);
  }, []);

  useEffect(() => {
    const inputResult = inputVal.length > 1 ? fuse.search(inputVal) : [];
    setSearchResults(inputResult);

    if (inputVal.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("q", inputVal);
      const newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      history.replaceState(history.state, "", newRelativePathQuery);
    } else {
      history.replaceState(history.state, "", window.location.pathname);
    }
  }, [inputVal]);

  return (
    <>
      <label className="search-input-wrap">
        <span className="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z" />
          </svg>
        </span>
        <input
          className="search-input"
          placeholder="Search for anything..."
          type="text"
          name="search"
          value={inputVal}
          onChange={handleChange}
          autoComplete="off"
          ref={inputRef}
        />
      </label>

      {inputVal.length > 1 && (
        <div className="search-result-count">
          Found {searchResults?.length ?? 0}
          {searchResults?.length === 1 ? " result" : " results"} for &lsquo;
          {inputVal}&rsquo;
        </div>
      )}

      <ul className="search-results">
        {searchResults &&
          searchResults.map(({ item, refIndex }) => (
            <li key={`${refIndex}-${item.href}`} className="search-result-item">
              <div className="search-result-row">
                <a href={item.href} className="search-result-title">
                  {item.title}
                </a>
                <span className="search-result-dots" aria-hidden="true" />
                <span className="search-result-type">
                  {collectionLabel[item.collection] ?? item.collection}
                </span>
              </div>
              {item.description && (
                <p className="search-result-desc">{item.description}</p>
              )}
            </li>
          ))}
      </ul>
    </>
  );
}
