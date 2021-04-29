// document.querySelector(".coursebox").innerHTML += `<iframe src="http://127.0.0.1:5501/index.html" width="1000" height="750"></iframe>`;
// chạy code này bằng localhost=>copy link localhost thay vào src => thay element trong querySelector bằng element mà bạn muốn nhúng vào => paste vào console web => quẩy

const BadAppleSound = new Audio();
BadAppleSound.src = "./BadAppleSound.mp3";
BadAppleSound.play();

const MAXIMUM_WIDTH = 70;
const MAXIMUM_HEIGHT = 40;
const asciiImage = document.querySelector("#ascii");
const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
const FPS = 30;

const toGrayScale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b;

const clampDimensions = (width, height) => {
    if (height > MAXIMUM_HEIGHT) {
        const reducedWidth = Math.floor((width * MAXIMUM_HEIGHT) / height);
        return [reducedWidth, MAXIMUM_HEIGHT];
    }

    if (width > MAXIMUM_WIDTH) {
        const reducedHeight = Math.floor((height * MAXIMUM_WIDTH) / width);
        return [MAXIMUM_WIDTH, reducedHeight];
    }

    return [width, height];
};

const convertToPixelData = (context, width, height) => {
    const imageData = context.getImageData(0, 0, width, height);

    const PixelData = [];

    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];

        PixelData.push(toGrayScale(r, g, b));
    }

    return PixelData;
};

const grayRamp =
    "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
const rampLength = grayRamp.length;

const getCharacterForGrayScale = (grayScale) =>
    grayRamp[Math.ceil(((rampLength - 1) * grayScale) / 255)];

const drawAscii = (grayScales, width) => {
    const ascii = grayScales.reduce((asciiImage, grayScale, index) => {
        let nextChars = getCharacterForGrayScale(grayScale);

        if ((index + 1) % width === 0) {
            nextChars += "\n";
        }

        if (index == 0) {
            return " " + asciiImage + nextChars + " ";
        } else {
            return asciiImage + nextChars + " ";
        }
    }, "");

    asciiImage.textContent = ascii;
};

let counter = 1;

let img = new Image();
let imgCounter;
img.onload = () => {
    const [width, height] = clampDimensions(img.width, img.height);

    canvas.width = width;
    canvas.height = height;

    context.drawImage(img, 0, 0, width, height);

    const pixelData = convertToPixelData(context, width, height);

    drawAscii(pixelData, width);
};
let drawLoop = setInterval(() => {
    if (counter < 10) {
        imgCounter = `000${counter}`;
    } else if (counter < 100) {
        imgCounter = `00${counter}`;
    } else if (counter < 1000) {
        imgCounter = `0${counter}`;
    } else {
        imgCounter = `${counter}`;
    }

    img.src = `./frames/BadApple ` + imgCounter + `.jpg`;

    if (counter === 6493) {
        clearInterval(drawLoop);
    }

    counter++;
}, 1000 / FPS);
