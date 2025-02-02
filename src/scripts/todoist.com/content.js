let editingTaskName = null;

function observeElement(element, callback) {
  const observer = new MutationObserver(callback);
  observer.observe(element, {
    childList: true,
    subtree: true,
  });
}

function onMutationsInBody(mutations) {
  for (const mutation of mutations) {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode.nodeType === Node.ELEMENT_NODE) {
          if (addedNode.querySelector("li[data-item-id]")) {
            addClickListeners(addedNode);
          } else if (addedNode.querySelector("div[contenteditable]")) {
            editBegins(addedNode.querySelector("div[contenteditable]"));
          }
        }
      }
    } else if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
      for (const removedNode of mutation.removedNodes) {
        if (removedNode.nodeType === Node.ELEMENT_NODE) {
          if (removedNode.getAttribute("contenteditable") === "true" &&
              removedNode.getAttribute("aria-label") === "Task name") {
            editEnds(removedNode);
          }
        }
      }
    }
  }
}

function addClickListeners(container) {
  container.querySelectorAll("button.task_checkbox").forEach((button) => {
    if (button.getAttribute("activitai-hooked")) return; // skip if already hooked
    button.addEventListener("click", onClickTaskCheckbox);
    button.setAttribute("activitai-hooked", "true");
  });
}

function onClickTaskCheckbox(event) {
  let taskElement = event.target.closest("li");
  if (!taskElement) {
    taskElement = event.target.closest("div[data-index]");
  }
  if (taskElement) {
    const checkboxButton = taskElement.querySelector("button.task_checkbox");
    if (checkboxButton.getAttribute("aria-checked") === "false") {
      reportTaskCompleted(taskElement);
      setTimeout(() => {
        addClickListeners(document.body);
      }, 500);
    } else {
      reportTaskAdded(taskElement);
      setTimeout(() => {
        addClickListeners(document.body);
      }, 500);
    }
    return;
  }
  console.warn("task checkbox click not handled", event); // DEBUG
}

function editBegins(element) {
  editingTaskName = element.textContent;
}

function editEnds(element) {
  if (editingTaskName === "" && element.textContent !== "") {
    reportTaskAdded(element);
  } else if (editingTaskName != element.textContent) {
    reportTaskUpdated(editingTaskName, element.textContent);
  }
  editingTaskName = null;
}

function getProjectName() {
  const projectHeaderH1 = document.querySelector("main header h1");
  return projectHeaderH1.textContent;
}

function getTaskSection(taskElement) {
  let taskSection = taskElement.closest("section");
  if (!taskSection) {
    taskSection = taskElement.closest("div[data-wide-modal]");
  }
  if (!taskSection) return null;
  let taskSectionContent = taskSection.querySelector(".simple_content");
  if (!taskSectionContent) {
    taskSectionContent = taskSection.querySelector("header a:last-child");
  }
  if (taskSectionContent) {
    return taskSectionContent.textContent;
  }
  return null;
}

function getTaskContent(taskElement) {
  const taskContent = taskElement.querySelector(".task_content");
  if (taskContent) {
    return taskContent.textContent;
  }
  return taskElement.textContent;
}

function reportTaskAdded(taskElement) {
  const projectName = getProjectName();
  const taskContent = getTaskContent(taskElement);
  const taskSection = getTaskSection(taskElement);
  const data = {
    projectName,
    taskSection,
    taskContent,
  }
  chrome.runtime.sendMessage({
    type: "API_REPORT",
    method: "POST",
    payload: {
      url: window.location.href,
      event: "todoist:task_added",
      data,
    },
  });
}

function reportTaskUpdated(oldVal, newVal) {
  const projectName = getProjectName();
  const data = {
    projectName,
    oldVal,
    newVal,
  }
  chrome.runtime.sendMessage({
    type: "API_REPORT",
    method: "POST",
    payload: {
      url: window.location.href,
      event: "todoist:task_updated",
      data,
    },
  });
}

function reportTaskCompleted(taskElement) {
  const projectName = getProjectName();
  const taskContent = getTaskContent(taskElement);
  const taskSection = getTaskSection(taskElement);
  const data = {
    projectName,
    taskSection,
    taskContent,
  }
  chrome.runtime.sendMessage({
    type: "API_REPORT",
    method: "POST",
    payload: {
      url: window.location.href,
      title: document.title,
      event: "todoist:task_completed",
      data,
    },
  });
}

// entry point
setTimeout(() => {
  addClickListeners(document.body);
  observeElement(document.body, onMutationsInBody);
}, 1000);
