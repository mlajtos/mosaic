// Golden Layout 1.x reads jQuery from `window.$`
import jQuery from "jquery";

Object.assign(window, { $: jQuery, jQuery });
