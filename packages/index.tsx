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
			width: rest.variant === "inherit" ? 'inherit' : rest.variant === "full" ? '100%' : rest.variant[0],
			height: rest.variant === "inherit" ? 'inherit' : rest.variant === "full" ? '100%' : rest.variant[1],
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
