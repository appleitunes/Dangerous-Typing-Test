var i, start, countDown, interval, elements, finished;

window.onload = () => {
    elements = {
        "menu": document.getElementById("menu_area"),
        "content": document.getElementById("content_area"),
        "message": document.getElementById("message"),
        "text": document.getElementById("text_area"),
        "count": document.getElementById("count_down"),
        "warning": document.getElementById("warning"),
        "context": document.getElementById("warning_context"),
        "prompt": document.getElementById("prompt"),
        "stop": document.getElementById("stop_button")
    };

    // Allow indents
    elements["text"].onkeydown = function(e) {
        if (e.keyCode === 9 || e.which === 9) {
            e.preventDefault();

            let s = this.selectionStart;
            this.value = this.value.substring(0, this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
            this.selectionEnd = s + 1; 
        }
    }
};

function startTyping() {
    finished = false;
    start = false;
    i = 0;

    elements["menu"].style.display = "none";
    elements["content"].style.display = "block";
    elements["message"].style.visibility = "hidden";
    elements["stop"].innerHTML = "Stop";
    elements["text"].value = "";
    elements["text"].focus();
    
    countDown = 300;
    elements["count"].innerHTML = convertTime(countDown);
    elements["warning"].innerHTML = 5 - i;
    elements["context"].style.color = "black";

    elements["text"].addEventListener("keypress", startInterval);
}

function startInterval() {
    if (!start) {
        start = true;
        interval = setInterval(updateCounter, 1000);
    }
    
    updateTimeout(false);
}

function stopTyping(failed=false) {
    if (interval) clearInterval(interval);

    elements["menu"].style.display = "block";
    elements["content"].style.display = "none";

    if (failed) {
        elements["message"].style.visibility = "visible";
    }
}

function updateTimeout(increment) {
    if (!finished) {
        if (increment) i++;
        else i = 0;

        elements["warning"].innerHTML = 5 - i;

        if (2 < i) {
            elements["context"].style.color = "red";
        }
        else {
            elements["context"].style.color = "black";
        }

        if (5 <= i) {
            stopTyping(true);
        }
    }
}

function updateCounter() {
    countDown--;
    updateTimeout(true);

    elements["count"].innerHTML = convertTime(countDown);

    if (countDown <= 0) {
        finish();
    }
}

function convertTime(integer) {
    let minutes = Math.floor(integer / 60);
    let seconds = Math.round(integer % 60, 2);

    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes+ ":" + seconds
}

function download() {
    finish();

    let text = elements["text"].value;

    let element = document.createElement('a');
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", "dangerous_story");
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

function finish() {
    if (interval) clearInterval(interval);
    elements["count"].innerHTML = "Done"; 
    elements["warning"].innerHTML = "--";

    if (!finished) {
        finished = true;
        elements["stop"].innerHTML = "Reset";
    }
    else {
        stopTyping();
        startTyping();
    }
}