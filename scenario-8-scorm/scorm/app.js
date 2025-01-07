// Initialize SCORM
pipwerks.SCORM.version = "1.2"; // or "2004"
let isInitialized = pipwerks.SCORM.init();

if (isInitialized) {
  console.log("SCORM initialized successfully.");

  // Track Start Time
  const startTime = new Date();

  // Set Lesson Status to "incomplete" on launch
  let lessonStatus = pipwerks.SCORM.get("cmi.core.lesson_status");
  if (lessonStatus === "not attempted" || lessonStatus === "unknown") {
    pipwerks.SCORM.set("cmi.core.lesson_status", "incomplete");
  }



  // Save Time Tracking on Exit
  window.addEventListener("beforeunload", () => {
    const endTime = new Date();
    const timeSpent = (endTime - startTime) / 1000; // Time in seconds
    pipwerks.SCORM.set("cmi.core.session_time", formatTime(timeSpent));
    pipwerks.SCORM.quit();
  });
} else {
  console.error("Failed to initialize SCORM.");
}

const completeSession = () => {
  let result = pipwerks.SCORM.set("cmi.core.lesson_status", "passed");
  pipwerks.SCORM.save();
  window.close();
}
// Format time for SCORM
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours}:${minutes}:${secs}`;
}


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
    // let result = pipwerks.SCORM.set("cmi.core.lesson_status", "passed");
    // console.log(result);
    // pipwerks.SCORM.save();
    loadPage("./page-7.html");
    return;
  } else {
    // let result = pipwerks.SCORM.set("cmi.core.lesson_status", "passed");
    // console.log(result);
    // pipwerks.SCORM.save();
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
