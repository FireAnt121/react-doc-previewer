export type Axis = [number, number];

export class ImagePreviewer {
	static instance: ImagePreviewer = new ImagePreviewer();
	private canvasEle: any;
	private image: HTMLImageElement = new Image();
	// private _imageLoaded: boolean = false;

	private Context2d: any;
	private canvasSize: Axis = [0, 0];

	private isDragging: boolean = false;
	private isMouseDown: boolean = false;
	private scale: number = 1;
	private imageSize: Axis = [0, 0];
	private shiftingSize: Axis = [0, 0];
	private tempImageSize: Axis = [0, 0];
	private tempImagePos: Axis = [0, 0];
	private lastMouseMove: Axis = [0, 0];

	private constructor() { }

	public get imagePosition() {
		return this.tempImagePos;
	}

	public get imageLoaded(): boolean { return this.imageLoaded }

	public static get createInstance(): ImagePreviewer {
		if (!ImagePreviewer.instance) {
			ImagePreviewer.instance = new ImagePreviewer();
		}

		return ImagePreviewer.instance;
	}

	public async initializeCanvas(canvas: any, imageUrl: string) {
		this.canvasEle = canvas;
		this.Context2d = canvas.getContext('2d')!;
		this.canvasSize = [canvas.offsetWidth, canvas.offsetHeight];

		this.initializeImage(imageUrl);
		this.mouseMoveListener();
		this.mouseUpListener();
		this.mouseDownListener();
	}

	private initializeImage(imageUrl: string) {
		const nI = new Image();
		nI.src = imageUrl;
		this.image = nI;
		// loading
		this.Context2d.font = "16px Arial";
		this.Context2d.fillStyle = "white";
		this.Context2d.fillText("Loading Image...", (this.canvasSize[0] / 2) - 50, this.canvasSize[1] / 2);

		//after loading
		const loadedImage = () => {
			const { naturalHeight, naturalWidth } = this.image;
			this.setImageSize = [naturalWidth, naturalHeight];
			this.calculateInitialSize();
			this.calculateInitialPos();
			this.drawGraph();
		}
		const errorImage = () => {
			this.Context2d!.clearRect(0, 0, this.canvasEle.offsetWidth, this.canvasEle.offsetHeight);
			this.Context2d.font = "16px Arial";
			this.Context2d.fillStyle = "white";
			this.Context2d.fillText("Could not load image", (this.canvasSize[0] / 2) - 50, this.canvasSize[1] / 2);
		}
		this.image.onerror = errorImage;
		this.image.onload = loadedImage;
	}

	public set setImage(newImage: HTMLImageElement) {
		this.image = newImage;
	}
	public get getImage() {
		return this.image;
	}

	public upScale() {
		const newScale = this.scale + .5
		this.scale = newScale > 3 || newScale < 1 ? this.scale : newScale;
		this.shiftingSize = [0, 0];
		if (this.canvasEle) this.calculateInitialSize().calculateInitialPos().drawGraph();
	}

	public downScale() {
		const newScale = this.scale - .5;
		this.scale = newScale > 3 || newScale < 1 ? this.scale : newScale;
		this.shiftingSize = [0, 0];
		if (this.canvasEle && this.imageSize[0] > 0) this.calculateInitialSize().calculateInitialPos().drawGraph();
	}

	public set setImageSize(newImageSize: Axis) {
		this.imageSize = newImageSize;
	}

	//	private isMouseIntersecting = (e: MouseEvent) => {
	//		const mouseX = e.clientX - this.canvasEle.offsetLeft;
	//		const mouseY = e.clientY - this.canvasEle.offsetTop;
	//		return this.Context2d.isPointInPath(mouseX, mouseY);
	//	}

	private mouseUpListener() {
		(this.canvasEle as HTMLCanvasElement).addEventListener("mouseup", () => {
			this.isMouseDown = false;
			this.isDragging = false;
			this.canvasEle.style.cursor = 'default';
		}, false);
		(this.canvasEle as HTMLCanvasElement).addEventListener("touchend", () => {
			this.isMouseDown = false;
			this.isDragging = false;
			this.canvasEle.style.cursor = 'default';
		}, false);
	}

	private mouseDownCore(point: Axis) {
		let mouseX = point[0] - this.canvasEle.offsetLeft;
		let mouseY = point[1] - this.canvasEle.offsetTop;
		this.isMouseDown = true;
		this.lastMouseMove = [mouseX, mouseY];
	}

	private mouseUpCore(point: Axis) {
		let mouseX = point[0] - this.canvasEle.offsetLeft;
		let mouseY = point[1] - this.canvasEle.offsetTop;
		if (this.isMouseDown) {
			this.isDragging = true;
		}
		if (this.scale > 1 && this.isDragging) {

			const movingRight = this.lastMouseMove[0] - mouseX < 0;
			const movingUp = this.lastMouseMove[1] - mouseY < 0;
			const leftBoundaryHit = this.tempImagePos[0] < 0 && this.tempImagePos[0] > -10;
			const enoughSpaceInLeft = this.tempImageSize[0] < this.canvasSize[0];
			const enoughSpaceTopDown = this.tempImageSize[1] < this.canvasSize[1];
			const rightBoundaryHit = this.tempImagePos[0] < -(this.tempImageSize[0] - this.canvasSize[0]) && this.tempImagePos[0] > -(this.tempImageSize[0] - this.canvasSize[0] + 20);
			const topBoundaryHit = this.tempImagePos[1] < 0 && this.tempImagePos[1] > -10;
			const bottomBoundaryHit = this.tempImagePos[1] < -(this.tempImageSize[1] - this.canvasSize[1]) && this.tempImagePos[1] > -(this.tempImageSize[1] - this.canvasSize[1] + 20);

			this.shiftingSize = this.shiftingSize[0] === 0 ? [...this.tempImagePos] : this.shiftingSize;
			this.shiftingSize[0] = this.shiftingSize[0] + (!movingRight && leftBoundaryHit || movingRight && rightBoundaryHit || enoughSpaceInLeft ? 0 : this.moveValue(this.lastMouseMove[0], mouseX)!)
			this.shiftingSize[1] = this.shiftingSize[1] + (!movingUp && topBoundaryHit || movingUp && bottomBoundaryHit || enoughSpaceTopDown ? 0 : this.moveValue(this.lastMouseMove[1], mouseY)!)
			this.calculateInitialSize().calculateInitialPos([...this.shiftingSize]).drawGraph();
			this.lastMouseMove = [mouseX, mouseY];
		}
	}

	private mouseDownListener() {
		if (this.canvasSize[0] < 800) {
			(this.canvasEle as HTMLCanvasElement).addEventListener("touchstart", (e) => {
				this.mouseDownCore([e.touches[0].clientX, e.touches[0].clientY]);
			}, false);
		} else {
			(this.canvasEle as HTMLCanvasElement).addEventListener("mousedown", (e) => {
				this.mouseDownCore([e.clientX, e.clientY]);
			}, false);
		}
	}

	private mouseMoveListener() {
		if (this.canvasSize[0] < 800) {
			(this.canvasEle as HTMLCanvasElement).addEventListener("touchmove", (e) => {
				this.mouseUpCore([e.touches[0].clientX, e.touches[0].clientY]);
			});

		} else {
			(this.canvasEle as HTMLCanvasElement).addEventListener("mousemove", (e) => {
				this.mouseUpCore([e.clientX, e.clientY]);
			}, false);
		}
	}

	public calculateInitialPos = (pivot: Axis = [0, 0]) => {
		// TODO: need to change this logic
		const [canvasX, canvasY] = this.canvasSize;
		const [imageX, imageY] = this.tempImageSize;
		const [pivotX, pivotY] = [...pivot];
		const tuneY = imageY <= canvasY ? imageY / 2 : 0;
		const positionX = (canvasX / 2) - (pivotX === 0 ? (imageX / 2) : pivotX);
		const positionY = (canvasY / 2) - (pivotY === 0 ? (imageY / 2) : pivotY - tuneY);
		this.tempImagePos = [
			pivotX === 0 ? positionX : pivotX,
			pivotY === 0 ? positionY : pivotY
		];
		return this;
	}

	public calculateInitialSize = () => {
		const newSize: Axis = [...this.imageSize];
		const [imageX, imageY] = this.imageSize;
		let changeable = { firstToChange: 0, secondToChange: 1 };
		if (imageX < imageY) {
			changeable = { firstToChange: 1, secondToChange: 0 }
		}

		const { firstToChange, secondToChange } = changeable;
		newSize[firstToChange] = (this.canvasSize[firstToChange] - (this.scale > 1 ? 0 : 100)) * this.scale;
		const ratio = this.imageSize[secondToChange] / this.imageSize[firstToChange];
		let temp = (ratio * newSize[firstToChange]);
		if (temp > this.canvasSize[secondToChange] && this.scale === 1) {
			newSize[secondToChange] = temp - (temp - this.canvasSize[secondToChange]);
			newSize[firstToChange] = (this.imageSize[firstToChange] / this.imageSize[secondToChange]) * newSize[secondToChange];
		} else {
			newSize[secondToChange] = temp;
		}
		this.tempImageSize = [...newSize];
		return this;
	}

	private moveValue = (previous: number, current: number) => {
		// const moveOffset = (ix > iy ? (ix / iy) : iy / ix);
		if (current - previous === 0) return 0;
		if (current - previous <= .5) return 10;
		if (current - previous > .5) return -10;
	}

	public drawGraph = () => {
		const [posX, posY] = [...this.tempImagePos];
		const [sizeX, sizeY] = [...this.tempImageSize];
		this.Context2d!.clearRect(0, 0, this.canvasEle.offsetWidth, this.canvasEle.offsetHeight);
		this.Context2d!.drawImage(this.image, posX, posY, sizeX, sizeY);
		this.Context2d!.beginPath();
		this.Context2d!.rect(posX, posY, sizeX, sizeY);
		this.Context2d!.stroke();
	}
}
