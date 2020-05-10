const container = document.querySelector('.boxes');
const jsResizer = container.querySelector('.js-editor-resizer');
const cssResizer = container.querySelector('.css-editor-resizer');
const hbsResizer = container.querySelector('.hbs-editor-resizer');
const hbsBox = container.querySelector('.hbs-box');
const jsBox = container.querySelector('.js-box');
const cssBox = container.querySelector('.css-box');

let initCssClientX,
	initJsClientX,
	cssRectBox,
	jsRectBox,
	hbsRectBox,
	dualClientX,
	movingBoxWidth,
	jsResizerRectBox,
	cssResizerRectBox,
	hbsResizerRectBox,
	jsBoxLastWidth;

let oldPosition = 0;
let lastDblClicked = '';
const windowWidth = window.innerWidth;

jsResizer.addEventListener('dblclick', expandJs);
cssResizer.addEventListener('dblclick', expandCss);
hbsResizer.addEventListener('dblclick', expandHbs);

function validateSizes() {
	getPresentDimensions();
	return cssRectBox.width && jsRectBox.width && hbsRectBox.width;
}

function getPresentDimensions() {
	cssRectBox = cssBox.getBoundingClientRect();
	jsRectBox = jsBox.getBoundingClientRect();
	hbsRectBox = hbsBox.getBoundingClientRect();
	updateResizers();
}

function updateResizers() {
	jsResizerRectBox = jsResizer.getBoundingClientRect();
	cssResizerRectBox = cssResizer.getBoundingClientRect();
	hbsResizerRectBox = hbsResizer.getBoundingClientRect();
}

function adjustBoxes(h, j, c) {
	hbsBox.style.width = `${h}%`;
	jsBox.style.width = `${j}%`;
	cssBox.style.width = `${c}%`;
	addTransition();
}

function addTransition() {
	hbsBox.style.transition = '.3s ease';
	jsBox.style.transition = '.3s ease';
	cssBox.style.transition = '.3s ease';
}

function removeTransition() {
	hbsBox.style.transition = 'none';
	jsBox.style.transition = 'none';
	cssBox.style.transition = 'none';
}

function convertPercentToNum(whoseWidth) {
	const widthStr = whoseWidth;
	const widthNum = widthStr.substring(0, widthStr.length - 1);
	return Number(widthNum);
}

function expandHbs() {
	if (validateSizes()) {
		adjustBoxes(98.5, 0, 0);
		lastDblClicked = 'hbs';
		return;
	}
	if (lastDblClicked !== 'hbs') {
		adjustBoxes(98.5, 0, 0);
		lastDblClicked = 'hbs';
		return;
	}
	adjustBoxes(32.833, 32.833, 32.833);
}

function expandJs() {
	if (validateSizes()) {
		adjustBoxes(0, 98.5, 0);
		lastDblClicked = 'js';
		return;
	}
	if (lastDblClicked !== 'js') {
		adjustBoxes(0, 98.5, 0);
		lastDblClicked = 'js';
		return;
	}
	adjustBoxes(32.833, 32.833, 32.833);
}

function expandCss() {
	if (validateSizes()) {
		adjustBoxes(0, 0, 98.5);
		lastDblClicked = 'css';
		return;
	}
	if (lastDblClicked !== 'css') {
		adjustBoxes(0, 0, 98.5);
		lastDblClicked = 'css';
		return;
	}
	adjustBoxes(32.833, 32.833, 32.833);
}

function convertToPercent(val, totalVal) {
	return (val / totalVal) * 100;
}

function holdCssHandler(e) {
	e.preventDefault();
	getPresentDimensions();
	removeTransition();
	initCssClientX = e.clientX;
	container.addEventListener('mousemove', movingCSS);
	container.addEventListener('mouseup', removeCssEvents);
}

function movingCSS(e) {
	e.preventDefault();
	const cssRectBoxCon = convertToPercent(cssRectBox.width, windowWidth);
	const jsRectBoxCon = convertToPercent(jsRectBox.width, windowWidth);
	const clientXCond = convertToPercent(e.clientX, windowWidth);
	const diff = clientXCond - convertToPercent(initCssClientX, windowWidth);
	if (Math.ceil(cssResizerRectBox.x + cssResizerRectBox.width) === windowWidth && e.pageX < oldPosition) {
		// If css resizer is at the edge of the screen and the user is moving the arrow right
		return;
	} else {
		let sumJs = jsRectBoxCon + diff;
		let sumcss = cssRectBoxCon - diff;
		sumJs < 0 ? sumJs = 0 : sumJs;
		sumcss < 0 ? sumcss = 0 : sumcss;
		cssBox.style.width = `${sumcss}%`;
		jsBox.style.width = `${sumJs}%`;
	}
	
	if (
		Math.round(jsResizerRectBox.right) ===
			Math.round(cssResizerRectBox.left) &&
		e.pageX < oldPosition
	) {
		let hbsSum = 99 - convertPercentToNum(cssBox.style.width);
		hbsSum < 0 ? hbsSum = 0: hbsSum;
		hbsBox.style.width = `${hbsSum}%`;
	}
	if (e.pageX > oldPosition) {
		// Going Backwards, reinitialize.
		getPresentDimensions();
		initCssClientX = e.clientX;
	}
	oldPosition = e.pageX; // Keep track of mouse direction
	updateResizers();
}

function holdJSHandler(e) {
	e.preventDefault();
	getPresentDimensions();
	removeTransition();
	initJsClientX = e.clientX;
	console.log(initJsClientX)
	container.addEventListener('mousemove', movingJS);
	container.addEventListener('mouseup', removeJsEvents);
}

function movingJS(e) {
	e.preventDefault();
	const hbsRectBoxCon = convertToPercent(hbsRectBox.width, windowWidth);
	const clientXCond = convertToPercent(e.clientX, windowWidth);
	const jsRectBoxCon = convertToPercent(jsRectBox.width, windowWidth);
	let diff = clientXCond - convertToPercent(initJsClientX, windowWidth);
	if (e.clientX < 10 && e.pageX < oldPosition) {
		hbsBox.style.cursor = 'col-resize';
	} else {
		let sum = jsRectBoxCon - diff;
		sum < 0 ? sum = 0: sum;
		hbsBox.style.width = `${hbsRectBoxCon + diff}%`;
		jsBox.style.width = `${sum}%`;
		jsBoxLastWidth = jsBox.style.width;
	}

	if (
		Math.round(jsResizerRectBox.right) ===
			Math.round(cssResizerRectBox.left) &&
		e.pageX > oldPosition
	) {
		cssBox.style.width = `${99 - convertPercentToNum(hbsBox.style.width)}%`;
		if (e.clientX > (windowWidth - 2)) {
			cssBox.style.width = '0%';
		}
	}
	if (e.pageX < oldPosition) {
		// Going Backwards, reinitialize.
		getPresentDimensions();
		initJsClientX = e.clientX;
	}
	oldPosition = e.pageX; // Keep track of mouse direction
	updateResizers();
}

function removeCssEvents() {
	container.removeEventListener('mousemove', movingCSS);
}

function removeJsEvents() {
	container.removeEventListener('mousemove', movingJS);
}

jsResizer.addEventListener('mousedown', holdJSHandler);

cssResizer.addEventListener('mousedown', holdCssHandler);

hbsBox.addEventListener('click', () => {
	console.log('[hbsbox]');
});

jsBox.addEventListener('click', () => {
	console.log('[jsBox]');
});

cssBox.addEventListener('click', () => {
	console.log('[cssBox]');
});
