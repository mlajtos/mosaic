import { atom } from "recoil";

export default atom({
  key: "tileState",
  default: {
    hasFocus: false,
  },
});
