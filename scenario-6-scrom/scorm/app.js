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


const selectHandler = (selected) => {
  const options = document.querySelectorAll(".mcq");
  options.forEach((option) => {
    option.classList.remove("correct");
  });
  selected.classList.add("correct");
  answer = selected.id;
};

let answer = [0, 1, 1, 1];
let selectedValues = [];

function isMatch(inputArray) {
  // Check if the input array has the same length and elements as the correct answer
  return (
    inputArray.length === answer.length &&
    inputArray.every((value, index) => value === answer[index])
  );
}

const handleSubmit = async () => {
  // Select all checkboxes
  let checkboxes = document.querySelectorAll('input[type="checkbox"]');
  // Loop through checkboxes to check which are selected
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedValues.push(0);
    } else {
      selectedValues.push(1);
    }
  });
  console.log("input value", selectedValues);
  const isValid = isMatch(selectedValues);
  if (isValid) {

    selectedValues = [];
    return loadPage("./page-5.html");
  } else {

    await loadPage("./page-6.html");
    checkboxes = document.querySelectorAll('input[type="checkbox"]');
    console.log(checkboxes);
    checkboxes.forEach((checkbox, index) => {
      checkbox.checked = selectedValues[index] === 0;
      console.log(checkbox.checked, selectedValues[index] === 0 ? false : true);
    });
    return (selectedValues = []);
  }
};

const handleDragOver = async (event) => {
  event.preventDefault();
};

let appropriateCorrectAnswer = ["answer1", "answer3", "answer5"];
let potentialCorrectAnswer = ["answer2", "answer4", "answer6"];

const handleDragStart = async (event) => {
  event.dataTransfer.setData("text/plain", event.target.id);
};
const handleDrop = async (event) => {
  event.preventDefault();
  const appropriateElement = document
    .getElementById("droppedAppropriate")
    .querySelectorAll(".answer");

  const potentialElement = document
    .getElementById("droppedPotential")
    .querySelectorAll(".answer");

  for (let i = 0; i < appropriateElement.length; i++) {
    appropriateElement[i].parentElement.classList = "dragDropInitialColor ";
  }
  for (let i = 0; i < potentialElement.length; i++) {
    potentialElement[i].parentElement.classList = "dragDropInitialColor ";
  }
  const draggedElementId = event.dataTransfer.getData("text/plain");

  const draggedElement = document.getElementById(draggedElementId);

  const targetElement = event.target.closest("div");

  if (targetElement && draggedElement !== targetElement) {
    const tempContent = `${draggedElement.innerHTML}`;
    draggedElement.innerHTML = targetElement.innerHTML;
    targetElement.innerHTML = tempContent;
    const newElement = document.createElement("div");
    newElement.innerHTML = tempContent.trim();
  }
};
function correctAnswer(inputArray, rightArray) {
  return (
    inputArray.length === rightArray.length &&
    inputArray.every((value, index) => value === rightArray[index])
  );
}

const handleAnswerSubmit = async () => {
  let correctValue = 0;
  const appropriateElement = document
    .getElementById("droppedAppropriate")
    .querySelectorAll(".answer");
  const potentialElement = document
    .getElementById("droppedPotential")
    .querySelectorAll(".answer");
  if (appropriateElement.length !== 3 && potentialElement.length !== 3) {
    return;
  }
  for (let i = 0; i < potentialElement.length; i++) {
    potentialElement[i].parentElement.classList = "dragDropInitialColor ";

    if (potentialCorrectAnswer.includes(potentialElement[i].id)) {
      correctValue++
    }
  }
  for (let i = 0; i < appropriateElement.length; i++) {
    appropriateElement[i].parentElement.classList = "dragDropInitialColor ";
    if (appropriateCorrectAnswer.includes(appropriateElement[i].id)) {
      correctValue++
    }
  }

  if (correctValue === 6) {
    // let result = pipwerks.SCORM.set("cmi.core.lesson_status", "passed");
    // console.log(result);
    // pipwerks.SCORM.save();
    await loadPage("./page-7.html");
    appropriateElement.forEach((item, index) => {
      const targetDiv = document.getElementById(`droppedItem${index + 1}`);
      targetDiv.appendChild(item);
      console.log(targetDiv);
    });
    potentialElement.forEach((item, index) => {
      const targetDiv = document.getElementById(`droppedItem${index + 4}`);
      targetDiv.appendChild(item);
    });
  } else {
    // let result = pipwerks.SCORM.set("cmi.core.lesson_status", "failed");
    // console.log(result);
    // pipwerks.SCORM.save();
    await loadPage("./page-6.html");
    appropriateElement.forEach((item, index) => {
      const targetDiv = document.getElementById(`droppedItem${index + 1}`);
      targetDiv.appendChild(item);
      console.log(item);
    });
    potentialElement.forEach((item, index) => {
      const targetDiv = document.getElementById(`droppedItem${index + 4}`);
      targetDiv.appendChild(item);
    });
  }

  for (let i = 0; i < potentialElement.length; i++) {
    potentialElement[i].parentElement.classList = "dragDropInitialColor ";

    if (potentialCorrectAnswer.includes(potentialElement[i].id)) {
      potentialElement[i].parentElement.classList.add("dragDropApprovedColor");
    } else {
      potentialElement[i].parentElement.classList.add("dragDropBreachColor");
    }
  }
  for (let i = 0; i < appropriateElement.length; i++) {
    appropriateElement[i].parentElement.classList = "dragDropInitialColor ";
    if (appropriateCorrectAnswer.includes(appropriateElement[i].id)) {
      appropriateElement[i].parentElement.classList.add(
        "dragDropApprovedColor"
      );
    } else {
      appropriateElement[i].parentElement.classList.add("dragDropBreachColor");
    }
  }
};
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
