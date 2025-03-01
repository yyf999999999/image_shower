const canvas = document.getElementById("preview");
const ctx = canvas.getContext("2d");
const scaleSlider = document.getElementById("scaleSlider");
const scaleValue = document.getElementById("scaleValue");
let img;
let isDragging = false;
let mousePosX = 0;
let mousePosY = 0;
let mouseMoveX = 0;
let mouseMoveY = 0;
let minMagnification = 0;
let imageX = 0;
let imageY = 0;
let imageScale = 1;

const loadImage = (input) => {
    const file = input.files[0];
    if (file){
        const reader = new FileReader();
        reader.onload = function (e) {
            img = new Image();
            img.onload = function () {
                const screenWidth = window.innerWidth;
                const screenHeight = window.innerHeight * 0.8;
                minMagnification = Math.ceil(Math.min(screenWidth / img.width, screenHeight / img.height) * 100);
                scaleSlider.min = minMagnification;
                scaleSliderChange(minMagnification);
                canvas.width = img.width * imageScale;
                canvas.height = img.height * imageScale;

                imageX = img.width * imageScale / 2;
                imageY = img.height * imageScale / 2;
                drawImage();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

const drawImage = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let x = imageX - img.width * imageScale / 2;
    let y = imageY - img.height * imageScale / 2;
    ctx.drawImage(img, x, y, img.width * imageScale, img.height * imageScale);
}

const scaleSliderChange = (v) => {
    scaleSlider.value = v;
    scaleValue.textContent = v;
    imageScale = v / 100;
    if (imageX - img.width * imageScale / 2 > 0) {
        imageX = img.width * imageScale / 2;
    }
    if (imageY - img.height * imageScale / 2 > 0) {
        imageY = img.height * imageScale / 2;
    }
    if (imageX + img.width * imageScale / 2 < canvas.width) {
        imageX = canvas.width - img.width * imageScale / 2;
    }
    if (imageY + img.height * imageScale / 2 < canvas.height) {
        imageY = canvas.height - img.height * imageScale / 2;
    }
    drawImage();
};

const openCanvasInNewTab = () => {
    const imageURL = canvas.toDataURL("image/png");
    sessionStorage.setItem("canvasImage", imageURL);
    window.open("viewer.html", "_blank");
};

canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    mousePosX = e.clientX;
    mousePosY = e.clientY;
});

document.addEventListener("mousemove", (e) => {
    if (isDragging){
        moveImage(e.clientX, e.clientY);
    }
});

document.addEventListener("mouseup", (e) => {
    isDragging = false;
});

canvas.addEventListener("touchstart", (e) => {
    e.preventDefault(); // スクロールを防ぐ
    isDragging = true;
    mousePosX = e.touches[0].clientX;
    mousePosY = e.touches[0].clientY;
});

document.addEventListener("touchmove", (e) => {
    if (isDragging) {
        e.preventDefault(); // スクロールを防ぐ
        moveImage(e.touches[0].clientX, e.touches[0].clientY);
    }
});

document.addEventListener("touchend", () => {
    isDragging = false;
});

const moveImage = (x, y) => {
    mouseMoveX = x - mousePosX;  
    mouseMoveY = y - mousePosY;
    mousePosX = x;
    mousePosY = y;
    imageX += mouseMoveX;
    imageY += mouseMoveY;
    if (imageX - img.width * imageScale / 2 > 0){
        imageX = img.width * imageScale / 2;
    }
    if (imageY - img.height * imageScale / 2 > 0){
        imageY = img.height * imageScale / 2;
    }
    if (imageX + img.width * imageScale / 2 < canvas.width){
        imageX = canvas.width - img.width * imageScale / 2;
    }
    if (imageY + img.height * imageScale / 2 < canvas.height){
        imageY = canvas.height - img.height * imageScale / 2;
    }
    drawImage();
}