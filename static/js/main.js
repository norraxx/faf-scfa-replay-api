document.replayData = null;
document.replayTick = 0;
document.replayFilter = [];
document.replayTicksCount = 0;

function renderHeader() {
    if (!document.replayData || !document.replayData.hasOwnProperty("body")) {
        return;
    }

    document.getElementById("replay-header").innerHTML = JSON.stringify(
        document.replayData['header'], null, 4)
}

function renderBody() {
    if (!document.replayData || !document.replayData.hasOwnProperty("body")) {
        return;
    }
    renderReplayContent();
    document.getElementById("replay-tick").value = document.replayTick;
    document.getElementById("replay-max-tick").innerText = document.replayData['body'].length - 1;
    document.getElementById("replay-desync-ticks").innerText = document.replayData['desync_ticks'].join(", ");
}

function renderReplayContent() {
    let ticks = [];
    let around = Math.abs(parseInt(document.getElementById("replay-ticks-count").value) || 0);
    for(let i = Math.max(document.replayTick - around, 0);
        i <= document.replayTick + around && i < document.replayData['body'].length;
        i++
    ) {
        ticks.push(i, document.replayData['body']["" + i]);
    }
    document.getElementById("replay-body").innerHTML = JSON.stringify(ticks, null, 4);
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
        if (response.data.hasOwnProperty("body")) {
            document.replayData = response.data;
            document.replayTick = 0;
        } else {
            alert("Choose the *.scfareplay or *.fafreplay");
        }
        render();
    }).catch((e) => {
        console.log(e);
        alert("something goes wrong!");
    });
    return false;
}

function getNextTickWithFilter(lookWhere) {
    for (let i = document.replayTick + lookWhere; i >= 0 && i < document.replayData['body'].length; i += lookWhere) {
        let tick = document.replayData['body'][i];
        let tickStr = JSON.stringify(tick, null, 4); // dirty ugly hack :-)
        for (let filter of document.replayFilter) {
            if (tickStr.indexOf("type\": \"" + filter) !== -1) {
                return i;
            }
        }
    }

    alert("There is no " + document.replayFilter.join(","));

    return document.replayTick;
}

function onTickChangeListener(e) {
    e.preventDefault();
    document.replayTick = parseInt(document.getElementById("replay-tick").value);
    renderBody();
}

function onFilterChangeListener(e) {
    e.preventDefault();
    document.replayFilter = [];
    for (let option of e.target.options) {
        if (option.selected) {
            document.replayFilter.push(option.value);
        }
    }

    if (document.replayData && document.replayFilter.length > 0) {
        document.replayTick = getNextTickWithFilter(1);
    }
    renderBody();
}

function onStepChange(step) {
    return (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!document.replayData ||
            document.replayTick + step < 0 ||
            document.replayTick + step >= document.replayData['body'].length) {
            return;
        }

        if (document.replayFilter.length > 0) {
            document.replayTick = getNextTickWithFilter(step);
        } else
        {
            document.replayTick += step;
        }

        renderBody();
        return false;
    }
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
    document.getElementById("replay-tick").addEventListener("change", onTickChangeListener);
    document.getElementById("replay-filter").addEventListener("change", onFilterChangeListener);
    document.getElementById("replay-ticks-count").addEventListener("change", onTickChangeListener);
})();

