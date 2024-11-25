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

// Question Section
let answer = [0, 0, 1, 1];
let selectedValues = [];


function isMatch(inputArray) {
  // Check if the input array has the same length and elements as the correct answer
  return inputArray.length === answer.length &&
    inputArray.every((value, index) => value === answer[index]);
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
  const isValid = isMatch(selectedValues);
  if (isValid) {
    await loadPage('./page-6.html');

    checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox, index) => {

      const parentDiv = checkbox.closest(".mcq");
      if (selectedValues[index] !== answer[index]) {
        parentDiv.classList.add("wrongBorder");
      } else {
        parentDiv.classList.add("rightBorder");
      }
      // checkbox.checked = selectedValues[index] === 0;
      console.log(checkbox.checked, selectedValues[index] === 0 ? false : true);
    });
    return (selectedValues = []);

  } else {
    await loadPage('./page-7.html');
    checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox, index) => {

      const parentDiv = checkbox.closest(".mcq");
      if (selectedValues[index] !== answer[index]) {
        parentDiv.classList.add("wrongBorder");
      } else {
        parentDiv.classList.add("rightBorder");
      }
      // checkbox.checked = selectedValues[index] === 0;
      console.log(checkbox.checked, selectedValues[index] === 0 ? false : true);
    });
    return (selectedValues = []);
  }
}


// function isFullScreen() {
//   return window.innerWidth === screen.width && window.innerHeight === screen.height;
// }

// window.addEventListener('resize', () => {
//   let image = document.getElementsByClassName('respimg')
//   if (isFullScreen()) {
//     image.style.width = '835px'
//     // User is in fullscreen mode
//     console.log('Full screen detected');
//   } else {
//     image.style.width = '735px'
//     // User is not in fullscreen mode
//     console.log('Not full screen');
//   }
// });