function observeElement(element, callback) {
  const observer = new MutationObserver(callback);
  observer.observe(element, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });
}

function onMutationsInBody(mutations) {
  for (const mutation of mutations) {
    if (mutation.type === "childList" &&
        mutation.addedNodes.length > 0 &&
        mutation.target.tagName === "DIV" &&
        mutation.target.classList.contains("c-message_kit__actions")) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode.nodeType === Node.ELEMENT_NODE &&
            addedNode.classList.contains("c-message__actions")) {
            addClickListeners(addedNode);
        }
      }
    }
  }
}

function addClickListeners(container) {
  container.querySelectorAll("button.c-message_actions__button").forEach((button) => {
    if (button.getAttribute("activitai-hooked")) return; // skip if already hooked
    button.addEventListener("click", onClickActionButton);
    button.setAttribute("activitai-hooked", "true");
    // console.log("hooked", button); // DEBUG
  });
}

function onClickActionButton(event) {
  const viewTitle = document.querySelector("body div.p-view_header__text");
  const button = event.target.closest("button");
  const action = button.getAttribute("data-qa");
  const message = button.closest("div.c-message_kit__message");
  const sender = message.querySelector("button.c-message__sender_button");
  const ts = message.querySelector("a.c-timestamp");
  const text = message.querySelector("div.c-message_kit__blocks");
  const later = message.querySelector("div.c-message_kit__labels--later");
  let savesForLater = later?.textContent ? true : false;
  if (action === "later") {
    savesForLater = !savesForLater;
  }
  const data = {
    viewTitle: viewTitle?.textContent,
    action: action,
    message: {
      datetime: ts?.getAttribute("aria-label") || ts?.textContent,
      ts: ts?.getAttribute("data-ts"),
      sender: sender?.textContent,
      text: text?.textContent,
      forLater: savesForLater,
    }
  }
  chrome.runtime.sendMessage({
    type: "API_REPORT",
    method: "POST",
    payload: {
      url: window.location.href,
      title: document.title,
      event: "slack:message_action",
      data,
    },
  });
}

// entry point
observeElement(document.body, onMutationsInBody);
