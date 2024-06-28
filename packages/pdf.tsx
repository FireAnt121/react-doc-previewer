import { CSSProperties, useCallback, useState } from "react"
import { MaximizeIcon, MinimizeIcon, CloseIcon } from "./icons";
import pdfjs from "@bundled-es-modules/pdfjs-dist/build/pdf";

type ImageCanvasProps = {
	url: string,
	show: boolean,
	variant: [number, number] | "full" | "inherit",
	onClose: () => void
}

const cssMap = ({ variant }: Pick<ImageCanvasProps, 'variant'>): CSSProperties => {
	switch (variant) {
		case "full":
			return {
				width: "100vw",
				height: "100vh",
				position: "fixed",
				top: 0,
				paddingTop: 40,
				zIndex: 20
			}
		case "inherit":
			return {
				width: "inherit",
				position: "relative",
				height: "inherit"
			}
		default:
			return {
				position: "relative",
				width: variant[0] ?? 100,
				height: variant[1] ?? 100
			}

	}
}
export const PDFCanvas = ({ url, show, onClose, variant = "inherit" }: ImageCanvasProps) => {

	const [pageNo, setPageNo] = useState(1);
	const [pageScale, setPageScale] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	let isMouseDown = false;

	const canvasRef = useCallback(async (node: HTMLDivElement) => {
		if (node !== null) {
			pdfjs.GlobalWorkerOptions.workerSrc =
				"./packages/pdf.worker.js";
			const loadingTask = pdfjs.getDocument(url);
			const pdf = await loadingTask.promise;
			const page = await pdf.getPage(pageNo);
			const scale = pageScale;
			setTotalPages(pdf.numPages);
			const viewport = page.getViewport({ scale });
			// Support HiDPI-screens.
			const outputScale = window.devicePixelRatio || 1;
			const canvas = node.children[0] as unknown as HTMLCanvasElement;
			const context = canvas.getContext("2d")!;

			canvas.width = Math.floor(viewport.width * outputScale);
			canvas.height = Math.floor(viewport.height * outputScale);
			canvas.style.background = "#000";
			canvas.style.width = Math.floor(viewport.width) + "px";
			canvas.style.height = Math.floor(viewport.height) + "px";
			const transform = outputScale !== 1
				? [outputScale, 0, 0, outputScale, 0, 0]
				: [];

			//
			// Render PDF page into canvas context
			//
			const renderContext = {
				canvasContext: context,
				transform,
				viewport,
			};
			page.render(renderContext);
			let x = 0, y = 0;
			function handleMouse(e: MouseEvent) {
				if (x && y && isMouseDown) {
					// Scroll window by difference between current and previous positions
					node.scrollBy(e.clientX - x, e.clientY - y);
				}

				// Store current position
				x = e.clientX;
				y = e.clientY;
			}
			document.onmousedown = () => { isMouseDown = true }
			document.onmouseup = () => { isMouseDown = false }
			document.onmousemove = handleMouse;
		}
	}, [url, pageNo, pageScale]);

	return (
		<div ref={canvasRef} id="canvasId" style={{
			...cssMap({ variant }), visibility: show ? "visible" : "hidden",
			display: 'block',
			textAlign: 'center',
			background: 'rgba(0, 0, 0, 0.8)',
			overflow: "scroll",
			overflowX: "scroll"
		}}>
			<canvas id="myCanvas" width={0} height={0} style={{ border: "1px solid #000000" }}>
				Your browser does not support the HTML canvas tag.
			</canvas>
			<div
				style={{
					position: "fixed",
					display: "flex",
					top: "10px",
					right: "20px",
					borderRadius: "15px",
					overflow: "hidden"
				}}>
				<MaximizeIcon
					disabled={pageScale >= 4}
					onClick={() => setPageScale(prev => prev <= 4 ? prev + 1 : prev)}
				/>
				<MinimizeIcon
					disabled={pageScale === 1}
					onClick={() => setPageScale(prev => prev > 1 ? prev - 1 : prev)}
				/>
				<CloseIcon
					onClick={onClose}
				/>
			</div>
			<div
				style={{
					position: "fixed",
					bottom: 20,
					display: "flex",
					right: "20px",
					gap: "20px",
					borderRadius: "15px",
					overflow: "hidden"
				}}>
				<button disabled={pageNo === 1} onClick={() => setPageNo(prev => prev !== 1 ? prev - 1 : prev)}>prev</button>
				<button disabled={pageNo === totalPages} onClick={() => setPageNo(prev => totalPages ? prev + 1 : prev)}>next</button>
			</div>
		</div >
	)
}
