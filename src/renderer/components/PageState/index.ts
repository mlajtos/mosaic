import { atom } from "recoil";

export default atom({
  key: "pageState",
  default: {
    title: "New tab",
    url: "about:blank",
    query: "",
    loading: false,
    favicons: [],
  },
});
