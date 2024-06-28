import { ReactNode } from "react";

export type CanvasIconProps = {
	width?: string,
	height?: string,
	fill?: string,
	props?: any,
	onClick: () => void,
	disabled?: boolean
}


const CanvasIcon = ({ onClick, disabled, props, children }: CanvasIconProps & { children: ReactNode }) => {
	return (
		<div   {...props} aria-disabled={disabled} style={{ cursor: "pointer", background: "rgba(0,0,0,0.6)", padding: "10px 16px", ...props?.style }} onClick={onClick}>
			{children}
		</div>
	)
};

export const MaximizeIcon = ({ width = "38px", height = "38px", fill = "#fff", disabled = false, onClick, ...props }: CanvasIconProps) => {
	const color = disabled ? "#575757" : fill;
	return (
		<CanvasIcon {...props} onClick={onClick}>
			<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M11 5C7.68629 5 5 7.68629 5 11C5 14.3137 7.68629 17 11 17C14.3137 17 17 14.3137 17 11C17 7.68629 14.3137 5 11 5ZM3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11C19 12.8487 18.3729 14.551 17.3199 15.9056L20.7071 19.2929C21.0976 19.6834 21.0976 20.3166 20.7071 20.7071C20.3166 21.0976 19.6834 21.0976 19.2929 20.7071L15.9056 17.3199C14.551 18.3729 12.8487 19 11 19C6.58172 19 3 15.4183 3 11ZM11 7C11.5523 7 12 7.44772 12 8V10H14C14.5523 10 15 10.4477 15 11C15 11.5523 14.5523 12 14 12H12V14C12 14.5523 11.5523 15 11 15C10.4477 15 10 14.5523 10 14V12H8C7.44772 12 7 11.5523 7 11C7 10.4477 7.44772 10 8 10H10V8C10 7.44772 10.4477 7 11 7Z" fill={color} />
			</svg>

		</CanvasIcon>
	)
}

export const MinimizeIcon = ({ width = "38px", height = "38px", fill = "#fff", disabled = false, onClick, ...props }: CanvasIconProps) => {
	const color = disabled ? "#575757" : fill;
	return (
		<CanvasIcon {...props} disabled={disabled} onClick={onClick}>
			<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M11 5C7.68629 5 5 7.68629 5 11C5 14.3137 7.68629 17 11 17C14.3137 17 17 14.3137 17 11C17 7.68629 14.3137 5 11 5ZM3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11C19 12.8487 18.3729 14.551 17.3199 15.9056L20.7071 19.2929C21.0976 19.6834 21.0976 20.3166 20.7071 20.7071C20.3166 21.0976 19.6834 21.0976 19.2929 20.7071L15.9056 17.3199C14.551 18.3729 12.8487 19 11 19C6.58172 19 3 15.4183 3 11ZM7 11C7 10.4477 7.44772 10 8 10H14C14.5523 10 15 10.4477 15 11C15 11.5523 14.5523 12 14 12H8C7.44772 12 7 11.5523 7 11Z" fill={color} />
			</svg>
		</CanvasIcon>
	)
}

export const CloseIcon = ({ width = "38px", height = "38px", fill = "#fff", disabled, onClick, ...props }: CanvasIconProps) => {
	const color = disabled ? "#575757" : fill;
	return (
		<CanvasIcon {...props} onClick={onClick}>
			<svg width={width} height={height} viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path fill={color} d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z" /></svg>

		</CanvasIcon>
	)
}

