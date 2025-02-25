document.addEventListener("DOMContentLoaded", () => {
  const sendButton = document.getElementById("sendButton");
  const messageStatus = document.getElementById("messageStatus");
  const messageContainer = document.getElementById("messageContainer");
  const userContainer = document.getElementById("userContainer");

  const backendURL = "http://localhost:5500";

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
      console.log(response.data.message);
      getMessages();
      messageStatus.innerHTML = `<p>✔️</p>`;
      document.getElementById("message").value = "";
    } catch (error) {
      console.error(error);
      messageStatus.innerHTML = `<p>${
        error.response ? error.response.data.message : "Internal server error"
      }</p>`;
    }
  });

  async function getMessages() {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${backendURL}/messages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.allMessages);
      const allMessages = response.data.allMessages;
      messageContainer.innerHTML = "";
      allMessages.forEach((message) => {
        const messageDiv = document.createElement("div");
        messageDiv.innerHTML = `<p>${message.User.name} - ${message.message}</p>`;
        messageContainer.appendChild(messageDiv);
      });
    } catch (error) {
      console.log(error);
    }
  }
  getUser();
  getMessages();
  setInterval(getMessages, 1000);
});
