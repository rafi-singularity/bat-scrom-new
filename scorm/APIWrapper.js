var pipwerks = {}; // pipwerks 'namespace' to avoid conflicts
pipwerks.SCORM = {
  version: "1.2", // Default SCORM version
  handleCompletionStatus: true,
  handleExitMode: true,
  API: {
    handle: null,
    isFound: false,
  },
  connection: {
    isActive: false,
  },
  data: {
    completionStatus: null,
    exitStatus: null,
  },
  debug: {
    isActive: true,
    display: function (msg) {
      if (pipwerks.debug.isActive) {
        console.log(msg);
      }
    },
  },
};

pipwerks.SCORM.init = function () {
  var success = false;
  if (!pipwerks.SCORM.connection.isActive) {
    var API = pipwerks.SCORM.API.getHandle();
    if (API !== null) {
      if (pipwerks.SCORM.version === "1.2") {
        success = API.LMSInitialize("") === "true";
      }
    }
    if (success) {
      pipwerks.SCORM.connection.isActive = true;
      pipwerks.SCORM.data.completionStatus = pipwerks.SCORM.get(
        "cmi.core.lesson_status"
      );
      if (pipwerks.SCORM.handleCompletionStatus) {
        if (
          pipwerks.SCORM.data.completionStatus === "not attempted" ||
          pipwerks.SCORM.data.completionStatus === "unknown"
        ) {
          pipwerks.SCORM.set("cmi.core.lesson_status", "incomplete");
        }
      }
    }
  }
  return success;
};

pipwerks.SCORM.get = function (parameter) {
  var value = null;
  if (pipwerks.SCORM.connection.isActive) {
    var API = pipwerks.SCORM.API.getHandle();
    if (API !== null) {
      if (pipwerks.SCORM.version === "1.2") {
        value = API.LMSGetValue(parameter);
      }
    }
  }
  return value;
};

pipwerks.SCORM.set = function (parameter, value) {
  var success = false;
  if (pipwerks.SCORM.connection.isActive) {
    var API = pipwerks.SCORM.API.getHandle();
    if (API !== null) {
      if (pipwerks.SCORM.version === "1.2") {
        success = API.LMSSetValue(parameter, value) === "true";
      }
    }
  }
  return success;
};

pipwerks.SCORM.save = function () {
  var success = false;
  if (pipwerks.SCORM.connection.isActive) {
    var API = pipwerks.SCORM.API.getHandle();
    if (API !== null) {
      if (pipwerks.SCORM.version === "1.2") {
        success = API.LMSCommit("") === "true";
      }
    }
  }
  return success;
};

pipwerks.SCORM.quit = function () {
  var success = false;
  if (pipwerks.SCORM.connection.isActive) {
    var API = pipwerks.SCORM.API.getHandle();
    if (API !== null) {
      if (pipwerks.SCORM.version === "1.2") {
        success = API.LMSFinish("") === "true";
      }
      if (success) {
        pipwerks.SCORM.connection.isActive = false;
      }
    }
  }
  return success;
};

pipwerks.SCORM.API.getHandle = function () {
  if (!pipwerks.SCORM.API.isFound) {
    pipwerks.SCORM.API.find();
  }
  return pipwerks.SCORM.API.handle;
};

pipwerks.SCORM.API.find = function (win) {
  win = win || window;
  var API = null;
  while (win.API === undefined && win.parent !== null && win.parent !== win) {
    win = win.parent;
  }
  if (win.API !== undefined) {
    API = win.API;
  } else {
    console.log("SCORM API not found.");
  }
  pipwerks.SCORM.API.handle = API;
  pipwerks.SCORM.API.isFound = API !== null;
};

// Scenario 1

// MCQ
let answer = ["b", "c"];
let response = [];
const selectHandler = (selected) => {
  console.log(selected.id);
  // const options = document.querySelectorAll(".mcq-main");

  // check selected or not selected
  if (response.includes(selected.id)) {
    selected.classList.remove("selected");
    response.splice(response.indexOf(selected.id), 1);
  } else {
    selected.classList.add("selected");
    response.push(selected.id);
  }
};

function isMatch(inputArray) {
  // Check if the input array has the same length and elements as the correct answer
  return (
    inputArray.length === answer.length &&
    inputArray.every((value, index) => value === answer[index])
  );
}
const handleSubmit = async () => {
  const ascResponse = response.sort();
  console.log(ascResponse);
  const isValid = isMatch(ascResponse);
  console.log(isValid);
  if (isValid) {
    loadPage("./page-7.html");
    return;
  } else {
    const newDocument = await loadPage("./page-6.html");
    response.map((elem) => {
      return newDocument.getElementById(elem).classList.add("wrong");
    });
    return;
  }
};

let isSummery = false;

const handleSummery = (data) => {
  if (data == "btn1") {
    isSummery = true;
    loadPage("./page-9.html");
  } else if (data == "btn2") {
    if (isSummery) {
      loadPage("./page-10.html");
    } else return;
  }
};
document.addEventListener("fullscreenchange", () => {
  console.log("fullscreenchange event fired");
  console.log("Current full-screen element:", document.fullscreenElement);
});
document.addEventListener("fullscreenchange", function () {
  output.innerHTML = "fullscreenchange event fired!";
  console.log("Current 2full-screen element:", document.fullscreenElement);
});
function detectFullScreenAndZoom() {
  // Check if document.body exists
  if (!document.body) {
    console.error("Error: document.body is not available.");
    return;
  }

  // Cross-browser full-screen detection
  const isFullScreen =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement;

  console.log("Full-screen element (cross-browser):", document);

  // Store full-screen state in localStorage for consistency
  if (isFullScreen) {
    localStorage.setItem("isFullScreen", "true");
  } else {
    localStorage.removeItem("isFullScreen");
  }

  // Detect zoom level
  const zoomLevel = Math.round(window.devicePixelRatio * 100);
  console.log("Zoom level:", zoomLevel);

  // Remove previously applied classes
  document.body.classList.remove("zoom-100", "zoom-125", "fullscreen");

  // Apply zoom-level classes
  if (zoomLevel === 100) {
    document.body.classList.add("zoom-100");
  } else if (zoomLevel === 125) {
    document.body.classList.add("zoom-125");
  }

  // Apply full-screen class
  if (isFullScreen || localStorage.getItem("isFullScreen") === "true") {
    document.body.classList.add("fullscreen");
  }

  console.log("Updated body classList:", document.body.classList);
}

// Ensure DOM is loaded before calling the function
document.addEventListener("DOMContentLoaded", () => {
  detectFullScreenAndZoom();
});

// Optional: Add event listeners for fullscreen changes
document.addEventListener("fullscreenchange", detectFullScreenAndZoom);
document.addEventListener("webkitfullscreenchange", detectFullScreenAndZoom);
document.addEventListener("mozfullscreenchange", detectFullScreenAndZoom);
document.addEventListener("MSFullscreenChange", detectFullScreenAndZoom);
