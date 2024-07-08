import { CSSProperties, useCallback } from "react"
import { ImagePreviewer } from "./image-core.ts";
import { MaximizeIcon, MinimizeIcon, CloseIcon } from "./icons";

export type ImageCanvasProps = {
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
export const ImageCanvas = ({ url, show, onClose, variant = "inherit" }: ImageCanvasProps) => {
	const n = ImagePreviewer.createInstance;
	const canvasRef = useCallback((node: HTMLDivElement) => {
		if (node !== null) {
			const canvasEle = node.children[0] as unknown as HTMLCanvasElement;
			canvasEle.width = node.getBoundingClientRect().width;
			canvasEle.height = node.getBoundingClientRect().height;
			n.initializeCanvas(canvasEle, url)!;
		}
	}, [url]);

	return (
		<div ref={canvasRef} id="canvasId" style={{ background: "rgba(0,0,0,.9)", ...cssMap({ variant }), visibility: show ? "visible" : "hidden", pointerEvents: "auto" }}>
			<canvas id="myCanvas" width={0} height={0} style={{ position: "fixed", border: "1px solid #000000" }}>
				Your browser does not support the HTML canvas tag.
			</canvas>
			{n !== null &&
				<div
					style={{
						position: "absolute",
						display: "flex",
						top: "10px",
						right: "20px",
						borderRadius: "15px",
						overflow: "hidden"
					}}>
					<MaximizeIcon
						onClick={() => { n.upScale() }}
					/>
					<MinimizeIcon
						onClick={() => { n.downScale() }}
					/>
					<CloseIcon
						onClick={() => { n.downScale(); onClose(); }}
					/>
				</div>}
		</div >
	)
}

