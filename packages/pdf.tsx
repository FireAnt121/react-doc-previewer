import { CSSProperties, useCallback, useState } from "react"
import { MaximizeIcon, MinimizeIcon, CloseIcon } from "./icons";
// @ts-ignore Import module
// import * as pdfjs from './pdfjs-dist';
import * as pdfjs from 'pdfjs-dist';

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
				zIndex: 100
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
	const [totalPages, setTotalPages] = useState(1);
	let isMouseDown = false;

	const canvasRef = useCallback(async (node: HTMLDivElement) => {
		if (node !== null && pdfjs !== null) {
			const canvas = node.children[0] as unknown as HTMLCanvasElement;
			const context = canvas.getContext("2d")!;
			pdfjs.GlobalWorkerOptions.workerSrc =
				"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";
			const loadingTask = pdfjs.getDocument(url);
			canvas.setAttribute("width", node.offsetWidth.toString());
			canvas.setAttribute("height", node.offsetHeight.toString());
			context!.clearRect(0, 0, node.offsetWidth, node.offsetHeight);
			context.font = "16px Arial";
			context.fillStyle = "white";
			context.fillText("Loading pdf...", (node.offsetWidth / 2) - 50, node.offsetHeight / 2);
			loadingTask.promise.then(async (pdf) => {
				const page = await pdf.getPage(pageNo);
				let initialViewport = page.getViewport({ scale: pageScale });

				let scale = pageScale;
				if (window.innerWidth < initialViewport.width) {
					let desiredWidth = window.innerWidth - 10;
					scale = pageScale === 1 ? desiredWidth / initialViewport.width : pageScale;
				}
				let viewport = page.getViewport({ scale: scale });

				setTotalPages(pdf.numPages);
				// const viewport = page.getViewport({ scale });
				// Support HiDPI-screens.
				const outputScale = window.devicePixelRatio || 1;

				canvas.width = Math.floor(viewport.width * outputScale);
				canvas.height = Math.floor(viewport.height * outputScale);
				canvas.style.background = "#000";
				canvas.style.width = Math.floor(viewport.width) + "px";
				canvas.style.height = Math.floor(viewport.height) + "px";
				const transform = outputScale !== 1
					? [outputScale, 0, 0, outputScale, 0, 0]
					: null as unknown as undefined;

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
				function handleTouch(e: TouchEvent) {
					if (x && y && isMouseDown) {
						// Scroll window by difference between current and previous positions
						node.scrollBy(e.touches[0].clientX - x, e.touches[0].clientY - y);
					}

					// Store current position
					x = e.touches[0].clientX;
					y = e.touches[0].clientY;
				}
				document.onmousedown = () => { isMouseDown = true }
				document.onmouseup = () => { isMouseDown = false }
				document.onmousemove = handleMouse;
				document.ontouchmove = handleTouch;
			}).catch((e: any) => {
				console.log(e)
				canvas.setAttribute("width", node.offsetWidth.toString());
				canvas.setAttribute("height", node.offsetHeight.toString());
				context!.clearRect(0, 0, node.offsetWidth, node.offsetHeight);
				context.font = "16px Arial";
				context.fillStyle = "white";
				context.fillText("Could not load pdf", (node.offsetWidth / 2) - 50, node.offsetHeight / 2);
			}
			);
		}
	}, [url, pageNo, pageScale, pdfjs]);

	return (
		<div ref={canvasRef} style={{
			...cssMap({ variant }), visibility: show ? "visible" : "hidden",
			display: 'ruby',
			textAlign: 'center',
			background: 'rgba(0, 0, 0, 0.8)',
			overflow: "auto",
			pointerEvents: "auto",
			touchAction: "auto"
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
					onClick={() => setPageScale(prev => prev <= 4 ? prev + .5 : prev)}
				/>
				<MinimizeIcon
					disabled={pageScale === 1}
					onClick={() => setPageScale(prev => prev > 1 ? prev - .5 : prev)}
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
				<button
					style={{
						padding: "8px 18px",
						background: pageNo === 1 ? "#575757" : "rgba(0, 0, 0, .8)",
						color: "#fff",
						fontSize: "18px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
					disabled={pageNo === 1} onClick={() => setPageNo(prev => prev !== 1 ? prev - 1 : prev)}>prev</button>
				<button
					style={{

						padding: "8px 18px",
						background: pageNo === totalPages ? "#575757" : "rgba(0, 0, 0, .8)",
						color: "#fff",
						fontSize: "18px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
					disabled={pageNo === totalPages} onClick={() => setPageNo(prev => totalPages ? prev + 1 : prev)}>next</button>
			</div>
		</div >
	)
}

