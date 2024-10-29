function handleFormSubmit(event) {
  event.preventDefault();

  const userId = event.target.dataset.userId; // Get user ID if editing
  const userDetails = {
    username: event.target.username.value,
    email: event.target.email.value,
    phone: event.target.phone.value,
  };

  if (userId) {
    // If userId exists, we are editing
    axios
      .put(`https://crudcrud.com/api/ed4e0ba18aca409c9258da909d1dfa82/data/${userId}`, userDetails)
      .then((response) => {
        updateUserOnScreen(response.data); // Update user on the screen
      })
      .catch((error) => console.log(error));
  } else {
    // If no userId, we are adding a new user
    axios
      .post("https://crudcrud.com/api/ed4e0ba18aca409c9258da909d1dfa82/data", userDetails)
      .then((response) => displayUserOnScreen(response.data))
      .catch((error) => console.log(error));
  }

  // Clearing the input fields
  document.getElementById("username").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  delete event.target.dataset.userId; // Clear userId after processing
}

window.addEventListener("DOMContentLoaded", () => {
  axios
    .get("https://crudcrud.com/api/ed4e0ba18aca409c9258da909d1dfa82/data")
    .then((response) => {
      response.data.forEach(user => displayUserOnScreen(user));
    })
    .catch((error) => console.log(error));
});

function deleteUser(userId) {
  axios
    .delete(`https://crudcrud.com/api/ed4e0ba18aca409c9258da909d1dfa82/data/${userId}`)
    .then(() => removeUserFromScreen(userId))
    .catch((error) => console.log(error));
}

function displayUserOnScreen(userDetails) {
  const userItem = document.createElement("li");
  userItem.setAttribute("data-id", userDetails._id);
  userItem.appendChild(
    document.createTextNode(
      `${userDetails.username} - ${userDetails.email} - ${userDetails.phone}`
    )
  );

  const deleteBtn = document.createElement("button");
  deleteBtn.appendChild(document.createTextNode("Delete"));
  userItem.appendChild(deleteBtn);

  const editBtn = document.createElement("button");
  editBtn.appendChild(document.createTextNode("Edit"));
  userItem.appendChild(editBtn);

  const userList = document.querySelector("ul");
  userList.appendChild(userItem);

  deleteBtn.addEventListener("click", function () {
    deleteUser(userDetails._id);
  });

  editBtn.addEventListener("click", function () {
    document.getElementById("username").value = userDetails.username;
    document.getElementById("email").value = userDetails.email;
    document.getElementById("phone").value = userDetails.phone;
    document.getElementById("form").dataset.userId = userDetails._id; // Set user ID for editing
  });
}

function updateUserOnScreen(userDetails) {
  const userList = document.querySelector("ul");
  const userItem = userList.querySelector(`li[data-id="${userDetails._id}"]`);

  console.log("Updating user:", userDetails);
  console.log("User item found:", userItem);

  if (userItem) {
    userItem.firstChild.textContent = `${userDetails.username} - ${userDetails.email} - ${userDetails.phone}`;
  } else {
    console.error("User item not found for update. Check if the ID matches.");
  }
}

function removeUserFromScreen(userId) {
  const userList = document.querySelector("ul");
  const userItem = userList.querySelector(`li[data-id="${userId}"]`);

  if (userItem) {
    userList.removeChild(userItem);
  }
}
