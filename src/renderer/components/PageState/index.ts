import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

const defaultUrl = "https://google.com/";
const defaultTitle = "New tile";

export default atom({
    key: "pageState",
    default: {
      title: defaultTitle,
      url: defaultUrl,
      query: defaultUrl,
      loading: false,
      favicons: []
    },
  });