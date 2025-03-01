document.addEventListener("DOMContentLoaded", async () => {
  const groupUserscontainer = document.getElementById("groupUsersContainer");
  const groupChatWindow = document.getElementById("groupChatWindow");
  const groupMessageInput = document.getElementById("groupMessageInput");
  const sendGroupMessageButton = document.getElementById(
    "sendGroupMessageButton"
  );

  const backendURL = "http://localhost:5500";

  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get("groupId");
  const groupName = urlParams.get("groupName");

  document.getElementById("groupName").innerHTML = `${groupName}`;

  async function getGroupUsers() {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${backendURL}/groups/groupUsers/${groupId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      groupUserscontainer.innerHTML = "In this group:";
      const groupUsers = response.data.groupUsers;
      groupUsers.forEach((groupUser) => {
        const groupUserElement = document.createElement("div");
        groupUserElement.innerHTML = `
            <p>${groupUser.name}`;
        groupUserscontainer.appendChild(groupUserElement);
      });
    } catch (error) {
      console.log(error);
    }
  }

  sendGroupMessageButton.addEventListener("click", async (req, res) => {
    const token = localStorage.getItem("token");
    const groupMessage = groupMessageInput.value;
    const groupMessageData = {
      groupId: groupId,
      groupMessage: groupMessage,
    };

    try {
      const response = await axios.post(
        `${backendURL}/groups/sendGroupMessage`,
        groupMessageData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.message);
      alert("Message sent successfully");
      getGroupMessages();
      groupMessageInput.value = "";
    } catch (error) {
      console.log(error);
    }
  });

  async function getGroupMessages() {
    try {
      const response = await axios.get(
        `${backendURL}/groups/getGroupMessages/${groupId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const groupMessages = response.data.groupMessages;
      groupMessages.forEach((groupMessage) => {
        const groupMessageElement = document.createElement("div");
        groupMessageElement.innerHTML = `
            <p>${groupMessage.sender.name}: ${groupMessage.message}</p>
            `;
        groupChatWindow.appendChild(groupMessageElement);
      });
    } catch (error) {
      console.log(error);
    }
  }

  getGroupUsers();
  getGroupMessages();
});
