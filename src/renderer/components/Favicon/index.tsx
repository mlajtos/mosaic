import React, { useState, useEffect, useCallback } from "react";

import "./style.scss";
import defaultFavicon from "./default-favicon.png";

export default ({ source }: { source: string[] }) => {
  const [url, setUrl] = useState(defaultFavicon);

  useEffect(() => {
    const hasFavicon = source.length > 0;
    if (hasFavicon) {
      setUrl(source[0]);
    } else {
      setUrl(defaultFavicon);
    }
  }, [source]);

  const handleError = useCallback(() => {
    setUrl(defaultFavicon);
  }, []);

  return (
    <img className={`Favicon ${url === defaultFavicon ? "default" : ""}`} src={url} onError={handleError} />
  );
};
