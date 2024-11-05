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
let answer = "";

const selectHandler = (selected) => {
  const options = document.querySelectorAll(".mcq");
  options.forEach((option) => {
    option.classList.remove("correct");
  });
  selected.classList.add("correct");
  answer = selected.id;
};

const handleSubmit = async () => {
  if (answer !== "") {
    if (answer === "d") {
      loadPage("./page-10.html");
      return;
    } else {
      const newDocument = await loadPage("./page-9.html");
      newDocument.getElementById(answer).classList.add("wrong");
      return;
    }
  } else {
    return;
  }
};

const handlePlayButton = () => {
  console.log("check handlePlayButton");
  let video = document.getElementById("videoPlay");
  console.log("check video", video);
  video.play();
  let thumbnailWrapper = document.getElementById("thumbnail-wrapper");

  thumbnailWrapper.style.display = "flex";

  thumbnailWrapper.addEventListener("click", () => {
    console.log("check click");
    video.play();
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
};
