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

  if (correctValue === 6) {
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
