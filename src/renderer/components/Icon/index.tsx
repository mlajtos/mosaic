import "./style.css";

// a single-color image, drawn in the current text color
export default ({ src }: { src: string }) => <span className="Icon" style={{ maskImage: `url(${JSON.stringify(src)})` }} />;
