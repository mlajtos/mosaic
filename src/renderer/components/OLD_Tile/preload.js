console.log("muuu")

const zoomToFit = (el = document.documentElement) =>
  (el.style.zoom = (el.clientWidth / el.scrollWidth).toString());

const MosaicInternal = {
  zoomToFit,
};
