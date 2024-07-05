import { useEffect } from 'react';
import { createRoot } from 'react-dom/client'
import { ImageCanvasProps, ImageCanvas } from './image';
import { PDFCanvas } from './pdf';
const DocPreviewer = ({
	type,
	...rest
}: ImageCanvasProps & { type: "image" | "pdf" }): JSX.Element => {
	const { show, variant, onClose } = rest;
	let close = onClose;

	useEffect(() => {
		if (show && variant === 'full') {
			const ele = document.createElement('div');
			ele.id = "react-doc-previwer-121";
			ele.setAttribute('style', `'position:fixed,overflow:hidden,pointer-events:auto,width:' ${rest.variant === "inherit" ? 'inherit' : rest.variant === "full" ? '100%' : rest.variant[0]}',height: '${rest.variant === "inherit" ? 'inherit' : rest.variant === "full" ? '100%' : rest.variant[1]}`)

			const root = createRoot(ele);
			close = () => { root.unmount(); ele.remove(); onClose() };
			root.render(
				type === "image" ?
					<ImageCanvas {...rest} onClose={close} /> :
					<PDFCanvas {...rest} onClose={close} />
			);
			document.body.appendChild(ele);
			console.log("here");

		}
	}, [show])

	return (
		variant !== 'full' ?
			<div
				id="react-doc-previewer-121"
				style={{
					position: "fixed",
					overflow: "hidden",
					pointerEvents: "auto",
					width: rest.variant === "inherit" ? 'inherit' : rest.variant === "full" ? '100%' : rest.variant[0],
					height: rest.variant === "inherit" ? 'inherit' : rest.variant === "full" ? '100%' : rest.variant[1],
				}} >
				{
					type === "image" ?
						<ImageCanvas {...rest} /> :
						<PDFCanvas {...rest} />
				}

			</div> :
			<></>
	)
}

export default DocPreviewer;
