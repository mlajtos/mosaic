import DockItem from "../DockItem";

import "./style.css";

import mosaicIcon from "./mosaic.png";
import googleIcon from "./google.png";
import duckDuckGoIcon from "./duckDuckGo.png";
import redditIcon from "./reddit.png";
import wikipediaIcon from "./wikipedia.png";

const launchers = [
  { url: "https://github.com/mlajtos/mosaic", icon: mosaicIcon },
  { url: "https://google.com/", icon: googleIcon },
  { url: "https://duckduckgo.com/", icon: duckDuckGoIcon },
  { url: "https://reddit.com", icon: redditIcon },
  { url: "https://wikipedia.org", icon: wikipediaIcon },
];

export default ({ onLaunch }: { onLaunch: (url: string, from: Element) => void }) => {
  return (
    <div id="Dock">
      {launchers.map(({ url, icon }) => (
        <DockItem key={url} icon={icon} onClick={(e) => onLaunch(url, e.currentTarget)} />
      ))}
    </div>
  );
};
