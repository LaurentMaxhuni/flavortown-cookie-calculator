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

// Function to save the API key to storage

function saveApiKey() {
  const apiKey = apiKeyInput.value;
  chrome.storage.sync.set({ apiKey: apiKey }, () => {
    showMainContainer(apiKey);
  });
}

// Event listener for the save API key button
saveApiKeyButton.addEventListener("click", saveApiKey);

// Function to load the API key if it exists

function loadApiKey() {
  chrome.storage.sync.get(["apiKey"], (result) => {
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
      showMainContainer(result.apiKey);
    }
  });
}

// Function to showMainContainer and hide startContainer

async function showMainContainer(apiKey) {
  startContainer.classList.remove("visible");
  startContainer.classList.add("hidden");

  mainContainer.classList.remove("hidden");
  mainContainer.classList.add("visible");

  await fetchUserData(apiKey);
}

// Function to call API and fetch user data

async function fetchUserData(apiKey) {
  return await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }
      return res.json();
    })
    .then((data) => {
      const res = loadUserData();
      if (res) return saveUserData(data);
      return loadUserData();
    });
}

// Function to load user data (cookie count and username)

function loadUserData() {
  chrome.storage.sync.get(["cookieCount", "username"], (result) => {
    cookieCount.textContent = result.cookieCount || 0;
    username.textContent = result.username || "Guest";
  });
  return Promise.resolve();
}

// Save user data to storage

function saveUserData(data) {
  if (!data) return;
  chrome.storage.sync.set(
    {
      cookieCount: data.cookies,
      username: data.display_name,
    },
    () => {
      loadUserData();
    }
  );
}

// Function to open storeContainer and hide mainContainer

loadApiKey();