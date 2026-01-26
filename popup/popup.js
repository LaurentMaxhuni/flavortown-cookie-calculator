// Get references to the start container and its elements
const startContainer = document.getElementById("startContainer");
const apiKeyInput = document.getElementById("apiKeyField");
const saveApiKeyButton = document.getElementById("saveApiKeyButton");

// Get reference to the main container and its elements
const mainContainer = document.getElementById("mainContainer");
const cookieCount = document.getElementById("cookieCount");
const username = document.getElementById("username");
const cookieAmount = document.getElementById("cookieAmount");
const goalName = document.getElementById("goalName");
const addGoalButton = document.getElementById("addGoalButton");
const goalsList = document.getElementById("goalsList");

// Flavortown API base URL
const API_BASE_URL = "https://flavortown.hackclub.com/api/v1";

// Function to load the API key from storage
function loadApiKey() {
  chrome.storage.sync.get(["apiKey"], (result) => {
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
      showMainContainer(result.apiKey);
    }
  });
}

// Function to save the API key to storage
function saveApiKey() {
  const apiKey = apiKeyInput.value;
  chrome.storage.sync.set({ apiKey: apiKey }, () => {
    showMainContainer();
  });
}

// Function to call API and fetch user data
async function fetchUserData(apiKey) {
  return await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      return response.json();
    })
    .then((data) => {
      return saveUserData(data);
    });
}

// Function to save user data to storage
function saveUserData(data) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({
      cookieCount: data.cookies,
      username: data.display_name,
    }, resolve);
  });
}

// Function to call API and get store items
function fetchStoreItems(apiKey) {
  return fetch(`${API_BASE_URL}/store`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch store items");
    }
    return response.json();
  });
}

// Function to show the main container and hide the start container
async function showMainContainer(apiKey) {
  startContainer.style.display = "none";
  mainContainer.style.display = "block";
  await fetchUserData(apiKey);
  await fetchStoreItems(apiKey);
  loadUserData();
  loadGoals();
}

// Event listener for the save API key button
saveApiKeyButton.addEventListener("click", saveApiKey);

// Load the API key when the popup is opened
loadApiKey();

// Function to load user data (cookie count and username)
function loadUserData() {
  chrome.storage.sync.get(["cookieCount", "username"], (result) => {
    cookieCount.textContent = result.cookieCount || 0;
    username.textContent = result.username || "Guest";
  });
}

// Function to load goals from storage and display them
function loadGoals() {
  chrome.storage.sync.get(["goals"], (result) => {
    const goals = result.goals || [];
    goalsList.innerHTML = "";
    goals.forEach((goal, index) => {
      const li = document.createElement("li");
      li.textContent = `${goal.name}: ${goal.amount} cookies`;
      goalsList.appendChild(li);
    });
  });
}

// Event listener for the add goal button
addGoalButton.addEventListener("click", () => {
  const name = goalName.value;
  const amount = parseInt(cookieAmount.value, 10);
  if (name && !isNaN(amount)) {
    chrome.storage.sync.get(["goals"], (result) => {
      const goals = result.goals || [];
      goals.push({ name, amount });
      chrome.storage.sync.set({ goals: goals }, () => {
        loadGoals();
        goalName.value = "";
        cookieAmount.value = "";
      });
    });
  } else {
    alert("Please enter a valid goal name and cookie amount.");
  }
});

// Initial load of user data and goals if API key is already set
chrome.storage.sync.get(["apiKey"], (result) => {
  if (result.apiKey) {
    showMainContainer(result.apiKey);
  }
});
