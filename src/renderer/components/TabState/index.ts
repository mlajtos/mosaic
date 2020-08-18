import { atom } from "recoil";

export default atom({
  key: "tabState",
  default: {
    hasFocus: false,
  },
});
