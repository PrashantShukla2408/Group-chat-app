document.addEventListener("DOMContentLoaded", () => {
  const sendButton = document.getElementById("sendButton");
  const messageStatus = document.getElementById("messageStatus");
  const messageContainer = document.getElementById("messageContainer");
  const userContainer = document.getElementById("userContainer");

  const backendURL = "http://localhost:5500";
  const recentMessagesKey = "recentMessages";
  let oldestMessageId = Number.MAX_SAFE_INTEGER;
  let isFetchingOlderMessages = false;
  let displayedMessages = new Set();

  async function getUser() {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${backendURL}/users/user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const user = response.data.user;
      userContainer.innerHTML = `Welcome <p>${user.name}</p>`;
    } catch (error) {
      console.log(error);
    }
  }

  sendButton.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    const message = document.getElementById("message").value;

    try {
      const response = await axios.post(
        `${backendURL}/send`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newMessage = {
        User: { name: "You" },
        message: message,
        messageId: response.data.messageId,
      };

      console.log(response.data.message);
      storeMessageInsideLocalStorage(newMessage);
      displayMessages([newMessage]); // Add new message without refreshing everything
      messageStatus.innerHTML = `<p>✔️</p>`;
      document.getElementById("message").value = "";
      scrollToBottom();
    } catch (error) {
      console.error(error);
      messageStatus.innerHTML = `<p>${
        error.response ? error.response.data.message : "Internal server error"
      }</p>`;
    }
  });

  function storeMessageInsideLocalStorage(message) {
    let recentMessagesArray =
      JSON.parse(localStorage.getItem(recentMessagesKey)) || [];
    recentMessagesArray.push(message);
    if (recentMessagesArray.length > 10) {
      recentMessagesArray.shift();
    }
    localStorage.setItem(
      recentMessagesKey,
      JSON.stringify(recentMessagesArray)
    );
  }

  async function getOlderMessages() {
    if (isFetchingOlderMessages) return [];

    isFetchingOlderMessages = true;
    const token = localStorage.getItem("token");

    try {
      console.log(
        `Fetching older messages, oldestMessageId:${oldestMessageId}`
      );
      const response = await axios.get(
        `${backendURL}/olderMessages?oldestMessageId=${oldestMessageId}`,
        {
          headers: {
            "Content-Type": "application/JSON",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const olderMessages = response.data.olderMessages || [];
      if (olderMessages.length > 0) {
        oldestMessageId = olderMessages[olderMessages.length - 1].messageId;
        displayMessages(olderMessages, true); // Prepend old messages
      } else {
        console.log("No older messages found");
      }
      return olderMessages;
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      isFetchingOlderMessages = false;
    }
  }

  async function loadMessages() {
    let scrollPosition = messageContainer.scrollTop;

    let recentMessagesArray =
      JSON.parse(localStorage.getItem(recentMessagesKey)) || [];

    let olderMessages = await getOlderMessages();

    let allMessages = [...olderMessages, ...recentMessagesArray];

    let uniqueMessages = Array.from(
      new Map(
        allMessages.map((message) => [message.messageId, message])
      ).values()
    );

    uniqueMessages.sort((a, b) => a.messageId - b.messageId);

    displayedMessages.clear();
    messageContainer.innerHTML = "";
    displayMessages(uniqueMessages);

    messageContainer.scrollTop = scrollPosition;
  }

  function displayMessages(messages, prepend = false) {
    if (!messages || messages.length === 0) return;

    messages.forEach((message) => {
      if (!displayedMessages.has(message.messageId)) {
        displayedMessages.add(message.messageId);

        const messageDiv = document.createElement("div");
        messageDiv.innerHTML = `<p>${message.User.name}: ${message.message}</p>`;

        if (prepend) {
          messageContainer.prepend(messageDiv);
        } else {
          messageContainer.appendChild(messageDiv);
          scrollToBottom();
        }
      }
    });
  }

  function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  messageContainer.addEventListener("scroll", async () => {
    if (messageContainer.scrollTop === 0) {
      let olderMessages = await getOlderMessages();
      displayMessages(olderMessages, true);
    }
  });

  getUser();
  loadMessages();

  setInterval(async () => {
    let recentMessagesArray =
      JSON.parse(localStorage.getItem(recentMessagesKey)) || [];

    let olderMessages = await getOlderMessages();

    let allMessages = [...olderMessages, ...recentMessagesArray];

    let uniqueMessages = Array.from(
      new Map(
        allMessages.map((message) => [message.messageId, message])
      ).values()
    );

    uniqueMessages.sort((a, b) => a.messageId - b.messageId);

    displayMessages(uniqueMessages);
  }, 3000);
});
