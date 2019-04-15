document.replayData = null;
document.tick = 0;

function renderHeader() {
    document.getElementById("replay-header").innerHTML = JSON.stringify(
        document.replayData['header'], null, 4)
}

function renderBody() {
    document.getElementById("replay-body").innerHTML = JSON.stringify(
        document.replayData['body'][document.tick], null, 4);
    document.getElementById("replay-tick").value = document.tick;
    document.getElementById("replay-max-tick").innerText = document.replayData['body'].length - 1;
}

function render() {
    renderHeader();
    renderBody();
}

function loadReplay(e) {
    e.stopPropagation();
    e.preventDefault();
    let formData = new FormData();
    let replayFile = document.querySelector("#replay-file");
    formData.append("replay", replayFile.files[0]);

    axios.post(
        e.target.getAttribute("action"),
        formData,
        {headers: {"Content-Type": "multipart/form-data"}}
    ).then(response => {
        document.replayData = response.data;
        document.tick = 0;
        render();
    }).catch(() => {
        alert("something goes wrong!");
    });
    return false;
}

function onStepChange(step) {
    return (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!document.replayData ||
            document.tick + step < 0 ||
            document.tick + step >= document.replayData['body'].length) {
            return;
        }

        document.tick += step;
        renderBody();
        return false;
    }
}

function onChangeListener(e) {
    e.preventDefault();
    document.tick = parseInt(e.target.value);
    renderBody();
}


window.onkeyup = function(e) {
   let key = e.keyCode ? e.keyCode : e.which;

   if (key === 39) { // left
       onStepChange(1)(e);
   } else if (key === 37) { // right
       onStepChange(-1)(e);
   } else if (key === 32) {
       onStepChange(10)(e); // space
   } else if (key === 8) {
       onStepChange(-10)(e); // backspace
   }
};

(function () {
    document.getElementById("replay-upload").addEventListener("submit",  loadReplay);
    document.getElementById("replay-step-left").addEventListener("click",  onStepChange(-1));
    document.getElementById("replay-step-right").addEventListener("click",  onStepChange(1));
    document.getElementById("replay-tick").addEventListener("change", onChangeListener);
})();

