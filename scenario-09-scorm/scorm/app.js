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
  });
} else {
  console.error("Failed to initialize SCORM.");
}

const courseInit = () => {
  pipwerks.SCORM.init();
  var status = pipwerks.SCORM.get("cmi.core.lesson_status");
  if (status === "not attempted") {
    pipwerks.SCORM.set("cmi.core.lesson_status", "incomplete");
  }
}
const completeSession = () => {
  pipwerks.SCORM.set("cmi.core.lesson_status", "completed");
  // pipwerks.SCORM.set("cmi.success_status", "passed");
  pipwerks.SCORM.save();
  if (window.API) {
    API.LMSSetValue("cmi.core.exit", "logout");  // Valid: "logout", "suspend", ""
    API.LMSCommit("");
    API.LMSFinish(""); // Signals the course is finished
  }
  // loadPage('./page-1.html')
  window.close()
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
let answer = ['b', 'c'];
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
  return inputArray.length === answer.length &&
    inputArray.every((value, index) => value === answer[index]);
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
    loadPage("./page-6.html");
    return;
  } else {
    // let result = pipwerks.SCORM.set("cmi.core.lesson_status", "failed");
    // console.log(result);
    // pipwerks.SCORM.save();
    const newDocument = await loadPage("./page-5.html");
    response.map(elem => {
      return newDocument.getElementById(elem).classList.add("wrong");
    })
    return;
  }
};

let isSummery = false;

const handleSummery = (data) => {
  if (data == 'btn1') {
    isSummery = true;
    loadPage('./page-8.html');
  } else if (data == 'btn2') {
    if (isSummery) {
      loadPage('./page-9.html');
    } else return;
  }
}