import React, { useCallback, useEffect, useRef } from "react";
import isUrl from "is-url";

import "./style.scss";
import { useSuggestions, highlightSuggestion } from "./utils";

const search = {
  google: (query: string) => `https://www.google.com/search?q=${query}`,
  duckDuckGo: (query: string) => `https://duckduckgo.com/?q=${query}`,
};

export default ({
  value,
  onChange,
  onConfirm,
  focused,
  onBlur,
}: {
  value: string;
  onChange: (query: string) => void;
  onConfirm: (url: string) => void;
  focused: boolean;
  onBlur: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const t = e.target;
    t.select();
    t.scrollLeft = 0;
  }, []);

  useEffect(() => {
    if (focused) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [focused]);

  const { suggestions, focusPrevious, focusNext, focusedSuggestion, focusedSuggestionIndex } = useSuggestions(
    value
  );

  return (
    <div ref={containerRef} className="QueryField">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onMouseUp={(e) => e.preventDefault()}
        onFocus={onFocus}
        onBlur={(e) => {
          const outside = !containerRef.current?.contains(e.relatedTarget as HTMLElement);
          // console.log(e.relatedTarget, outside);
          if (outside) {
            onBlur?.();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            let url: string;
            const hasSuggestion = focusedSuggestionIndex !== -1;

            if (isUrl(value)) {
              url = value;
            } else {
              url = search.duckDuckGo(value);
            }

            if (hasSuggestion) {
              url = search.duckDuckGo(focusedSuggestion);
            }

            onConfirm(url);
            return;
          }

          if (e.key === "ArrowDown") {
            e.preventDefault();
            focusNext();
          }

          if (e.key === "ArrowUp") {
            e.preventDefault();
            focusPrevious();
          }
        }}
      />
      <div className="Suggestions">
        {suggestions.map((suggestion, i) => (
          <div
            key={suggestion}
            className={`Suggestion ${focusedSuggestionIndex === i ? "focused" : ""}`}
            onClickCapture={() => {
              onChange(suggestion);
              onConfirm(search.duckDuckGo(suggestion));
            }}
          >
            {highlightSuggestion(value, suggestion)}
          </div>
        ))}
      </div>
    </div>
  );
};
