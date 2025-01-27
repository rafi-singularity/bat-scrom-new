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

  // Event listener to complete the lesson
  // document.getElementById("completeLesson").addEventListener("click", () => {
  //   pipwerks.SCORM.set("cmi.core.lesson_status", "completed");
  //   pipwerks.SCORM.save();
  //   console.log("Lesson marked as completed.");
  // });

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
  let lessonStatus = pipwerks.SCORM.set("cmi.core.lesson_status", "completed");
  let successStatus = pipwerks.SCORM.set("cmi.success_status", "passed");
  console.log(lessonStatus);
  console.log(successStatus);
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
let answer = ["c"];
let selectedOptions = []
const selectHandler = (selected) => {

  const isSelected = selectedOptions.includes(selected.id);
  if (isSelected) {
    selected.classList.remove("correct");
    selectedOptions = selectedOptions.filter((option) => option !== selected.id);
  } else {
    selected.classList.add("correct");
    selectedOptions.push(selected.id);
  }
  // selected.id
};

function isMatch(inputArray) {
  // Check if the input array has the same length and elements as the correct answer
  return (
    inputArray.length === answer.length &&
    inputArray.every((value, index) => value === answer[index])
  );
}
const handleSubmit = async () => {
  if (selectedOptions.length === 0) {
    return;
  }
  const ascResponse = selectedOptions.sort();
  const isValid = isMatch(ascResponse);
  if (isValid) {
    // let result = pipwerks.SCORM.set("cmi.core.lesson_status", "passed");
    // console.log(result);
    // pipwerks.SCORM.save();
    loadPage("./page-12.html");
    return;
  } else {
    // let result = pipwerks.SCORM.set("cmi.core.lesson_status", "failed");
    // console.log(result);
    // pipwerks.SCORM.save();
    const newDocument = await loadPage("./page-11.html");
    selectedOptions.map((elem) => {
      return newDocument.getElementById(elem).classList.add("wrong");
    });
    return;
  }
};

// const handleSubmit = async () => {
//   if (answer !== "") {
//     if (answer === "c") {
//       loadPage("./page-12.html");
//       return;
//     } else {
//       const newDocument = await loadPage("./page-11.html");
//       newDocument.getElementById(answer).classList.add("wrong");
//       return;
//     }
//   } else {
//     return;
//   }
// };

const handlePlayButton = () => {
  console.log("check handlePlayButton");
  let video = document.getElementById("videoPlay");
  console.log("check video", video);
  video.play();
  let thumbnailWrapper = document.getElementById("thumbnail-wrapper");
  let startButton = document.getElementById("startButton");

  thumbnailWrapper.style.display = "flex";

  thumbnailWrapper.addEventListener("click", () => {
    console.log("check click");
    video.play();
    startButton.style.display = "none";
  });
  video.addEventListener("play", () => {
    thumbnailWrapper.style.display = "none";
  });
  video.addEventListener("mouseover", () => {
    video.controls = true;
  });
  video.addEventListener("mouseout", () => {
    video.controls = false;
  });

  video.addEventListener("pause", () => {
    thumbnailWrapper.style.display = "flex";
  });
  video.addEventListener("ended", () => {
    startButton.style.display = "flex";
  });
};
const handleSummery = (data) => {
  if (data == "btn1") {
    isSummery = true;
    loadPage("./page-14.html");
  } else if (data == "btn2") {
    if (isSummery) {
      loadPage("./page-15.html");
    } else return;
  }
};
