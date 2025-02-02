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
// let answer = "";

const selectHandler = (selected) => {
    const options = document.querySelectorAll(".mcq");
    options.forEach((option) => {
        option.classList.remove("correct");
    });
    selected.classList.add("correct");
    answer = selected.id;
};


let answer = [0, 0, 1, 1];
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
        // let result = pipwerks.SCORM.set("cmi.core.lesson_status", "passed");
        // console.log(result);
        // pipwerks.SCORM.save();
        return loadPage("./page-6.html");
    } else {
        // let result = pipwerks.SCORM.set("cmi.core.lesson_status", "failed");
        // console.log(result);
        // pipwerks.SCORM.save();
        await loadPage("./page-5.html");
        checkboxes = document.querySelectorAll('input[type="checkbox"]');
        console.log(checkboxes);
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
};
