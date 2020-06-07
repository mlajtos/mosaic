import React, { useCallback, useImperativeHandle, useEffect, useRef } from "react";
import isUrl from "is-url";

import "./style.scss";

const search = {
  google: (query: string) => `https://www.google.com/search?q=${query}`,
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

  return (
    <input
      ref={inputRef}
      className="QueryField"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onMouseUp={(e) => e.preventDefault()}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          let url: string;

          if (isUrl(value)) {
            url = value;
          } else {
            url = search.google(value);
          }

          onConfirm(url);
        }
      }}
    />
  );
};
