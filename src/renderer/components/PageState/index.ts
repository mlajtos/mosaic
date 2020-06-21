import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

const defaultUrl = "about:blank";
const defaultTitle = "New tile";

export default atom({
    key: "pageState",
    default: {
      title: defaultTitle,
      url: "",
      query: "",
      loading: false,
      favicons: []
    },
  });