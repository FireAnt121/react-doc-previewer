import { useEffect } from 'react';
import { createRoot } from 'react-dom/client'
import { ImageCanvasProps, ImageCanvas } from './image';
import { PDFCanvas } from './pdf';
const DocPreviewer = ({
	type,
	...rest
}: ImageCanvasProps & { type: "image" | "pdf" }) => {
	const { show, variant, onClose } = rest;
	let close = onClose;

	useEffect(() => {
		if (show && variant === 'full') {
			const ele = document.createElement('div');
			ele.id = "react-doc-previwer-121";
			ele.setAttribute('style', 'position:fixed')

			const root = createRoot(ele);
			close = () => { root.unmount(); onClose() };
			root.render(
				type === "image" ?
					<ImageCanvas {...rest} onClose={close} /> :
					<PDFCanvas {...rest} onClose={close} />
			);
			document.body.appendChild(ele);
			console.log("here");

		}
	}, [show])

	variant !== 'full' &&
		<div
			id="react-doc-previewer-121"
			style={{
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
}

export default DocPreviewer;
