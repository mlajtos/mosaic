import React, { useEffect, useState, useCallback } from "react";
import fetch from "cross-fetch";

export const useSuggestions = (query: string) => {
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchSuggestions = async (query: string) => {
      if (query === "") {
        setSuggestions([]);
        return;
      }

      const response = await fetch(`https://ac.duckduckgo.com/ac/?q=${query}&type=list`);

      if (response.ok) {
        const [echo, results] = await response.json();
        if (echo === query) {
          setSuggestions(results);
          setFocusedSuggestionIndex(-1);
        }
      } else {
        setSuggestions([]);
        setFocusedSuggestionIndex(-1);
      }
    };

    fetchSuggestions(query);
  }, [query]);

  const focusPrevious = useCallback(
    () => setFocusedSuggestionIndex((index) => (suggestions.length + index - 1) % suggestions.length),
    [suggestions]
  );
  const focusNext = useCallback(
    () => setFocusedSuggestionIndex((index) => (suggestions.length + index + 1) % suggestions.length),
    [suggestions]
  );

  return {
    suggestions,
    focusNext,
    focusPrevious,
    focusedSuggestionIndex,
    focusedSuggestion: suggestions[focusedSuggestionIndex],
  };
};

export const highlightSuggestion = (query: string, suggestion: string) => {
  const [head, tail] = suggestion.split(query);
  if (tail) {
    return [
      <strong key="head">{head}</strong>,
      <span key="query">{query}</span>,
      <strong key="tail">{tail}</strong>,
    ];
  }

  if (head) {
    return <strong key="head">{head}</strong>;
  }

  return <span key="query">{query}</span>;
};
