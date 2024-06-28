import { ImageCanvasProps, ImageCanvas } from './image';
import { PDFCanvas } from './pdf';
const DocPreviewer = ({
	type,
	...rest
}: ImageCanvasProps & { type: "image" | "pdf" }) => {
	return (
		<div style={{
			position: "relative",
			overflow: "hidden",
			width: "400px",
			height: "400px"
		}} >
			{
				type === "image" ?
					<ImageCanvas {...rest} /> :
					<PDFCanvas {...rest} />
			}

		</div>
	)
}

export default DocPreviewer;
