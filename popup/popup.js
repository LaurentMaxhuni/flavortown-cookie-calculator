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
const goalsContainer = document.getElementById("goalsContainer");
const refreshButton = document.getElementById("refresh");
const browseStoreItemsButton = document.getElementById("browseStoreItems");
const actionButtons = document.getElementById("actionButtons");
const storeContainer = document.getElementById("storeContainer");
let apiKey;

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
refreshButton.addEventListener("click", refresh);

// Function to load the API key if it exists

function loadApiKey() {
  chrome.storage.sync.get(["apiKey"], (result) => {
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
      apiKey = result.apiKey;
      showMainContainer(result.apiKey);
    }
  });
}

// Function to showMainContainer and hide startContainer

async function showMainContainer(apiKey) {
  startContainer.classList.add("hidden");
  startContainer.classList.remove("visible");
  if (apiKey) {
    mainContainer.classList.remove("hidden");
    mainContainer.classList.add("visible");
    actionButtons.classList.remove("hidden");
    storeContainer.classList.remove("hidden");
  }

  await fetchUserData(apiKey);
}

// Function to call API and fetch user data

async function fetchUserData(apiKey) {
  return await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "X-Flavortown-Ext-10884": true,
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
    },
  );
}

// Function render goal to list
function renderGoalToList(goal, userAmountOverride) {
  const goalItem = document.createElement("div");
  const userAmount =
    typeof userAmountOverride === "number"
      ? userAmountOverride
      : Number(cookieCount.textContent.trim()) || 0;
  const goalAmount = Number(goal.amount) || 0;
  const progressPercent =
    goalAmount > 0 ? Math.min(100, (userAmount / goalAmount) * 100) : 0;
  goalItem.className = "goal padding-medium card";
  goalItem.innerHTML = `
    <div class="goal-header">
      <div class="goal-info">
        <span class="goal-name">${goal.name}</span> -
        <span class="goal-amount">${goal.amount} Cookies</span>
      </div>
      <button class="delete-goal-button">x</button>
    </div>
    <div class="progress-container">
      <span class="goal-progress">${userAmount}/${goal.amount}</span>
      <div class="progress-bar">
        <div class="progress-bar-filled" style="width: ${progressPercent}%;"></div>
      </div>
    </div>
  `;
  goalsContainer.appendChild(goalItem);

  // Delete button function

  const deleteButton = goalItem.querySelector(".delete-goal-button");
  deleteButton.addEventListener("click", () => {
    goalsContainer.removeChild(goalItem);
    removeGoalsFromStorage(goal);
  });
}

// Function to add a new to goal to goal container
const addGoalButtonClick = addGoalButton.addEventListener("click", addGoal);
async function addGoal() {
  const name = goalName.value.trim();
  const amount = cookieAmount.value.trim();
  if (!name || !amount || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid goal name and amount.");
    return;
  }

  const goal = {
    name,
    amount,
  };

  renderGoalToList(goal, Number(cookieCount.textContent.trim()) || 0);

  // Clear input fields
  goalName.value = "";
  cookieAmount.value = "";

  // Optionally, save goals to storage here
  saveGoalsToStorage();
}

// Function to save goals to storage
function saveGoalsToStorage() {
  const goals = [];
  const goalItems = goalsContainer.getElementsByClassName("goal");
  for (let item of goalItems) {
    const name = item.querySelector(".goal-name").textContent;
    const amountText = item.querySelector(".goal-amount").textContent;
    const amount = parseInt(amountText.split(" ")[0]);
    goals.push({ name, amount });
  }
  chrome.storage.sync.set({ goals: goals });
}

// Function to remove goals from storage
function removeGoalsFromStorage(goalToRemove) {
  if (!goalToRemove) return;
  chrome.storage.sync.get(["goals"], (result) => {
    const goals = result.goals || [];
    let removed = false;
    const updatedGoals = goals.filter((goal) => {
      if (removed) return true;
      const isMatch =
        goal.name === goalToRemove.name &&
        Number(goal.amount) === Number(goalToRemove.amount);
      if (isMatch) {
        removed = true;
        return false;
      }
      return true;
    });
    chrome.storage.sync.set({ goals: updatedGoals });
  });
}

// Function to load goals from storage
function loadGoalsFromStorage() {
  chrome.storage.sync.get(["goals", "cookieCount"], (result) => {
    const goals = result.goals || [];
    const userAmount = Number(result.cookieCount) || 0;
    for (let goal of goals) {
      renderGoalToList(goal, userAmount);
    }
  });
}

// Function to refresh

function refresh() {
  chrome.storage.sync.get(["apiKey"], (result) => {
    if (!result.apiKey) return;
    fetchUserData(result.apiKey).then(() => {
      goalsContainer.innerHTML = "";
      loadGoalsFromStorage();
    });
  });
}

// Function to open browseStoreItemsContainer

browseStoreItemsButton.addEventListener("click", toggleStoreItems);

const STORE_BUTTON_LABEL_OPEN = "🛒 Browse Store Items";
const STORE_BUTTON_LABEL_BACK = "⬅️ Go Back";

function setStoreView(isOpen) {
  mainContainer.classList.toggle("hidden", isOpen);
  mainContainer.classList.toggle("visible", !isOpen);
  storeContainer.classList.toggle("hidden", !isOpen);
  storeContainer.classList.toggle("visible", isOpen);
  browseStoreItemsButton.innerText = isOpen
    ? STORE_BUTTON_LABEL_BACK
    : STORE_BUTTON_LABEL_OPEN;
}

async function toggleStoreItems() {
  const isOpen = storeContainer.classList.contains("visible");
  if (isOpen) {
    setStoreView(false);
    return;
  }
  await openStoreItems();
}

async function openStoreItems() {
  setStoreView(true);
  storeContainer.innerHTML = "";
  const userAmount = Number(cookieCount.textContent.trim()) || 0;
  let storeItems = [];
  try {
    const res = await fetch(`${API_BASE_URL}/store`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-Flavortown-Ext-10884": true,
      },
    });
    if (!res.ok) {
      throw new Error("Response is not OK");
    }
    const data = await res.json();
    storeItems = data;
  } catch (error) {
    console.error("Failed to load store items", error);
  }

  console.log(storeItems);
  storeItems.forEach((item, index) => {
    const storeItem = document.createElement("div");
    const goal = {
      name: item.name,
      amount: item.ticket_cost.base_cost,
    };
    storeItem.classList.add("card");
    storeItem.innerHTML = `<div id=${index} class="store-card">
      <div>
        <img src=${item.image_url} style="max-width: 75px !important; height: auto !important;">
      </div>
      <div>
        <h3 id="storeItemName-${index}">${item.name}</h3>
        <p id="storeItemDesc-${index}">${item.description}</p>
        <div id="storeItemPrice-${index}">🍪 ${item.ticket_cost.base_cost}</div>
        <button class="store-add-goal-button">Add Goal</button>
      </div>
    </div>`;
    storeContainer.append(storeItem);
    const storeAddGoalButton = storeItem.querySelector(
      ".store-add-goal-button",
    );
    storeAddGoalButton.addEventListener("click", () => {
      renderGoalToList(goal, userAmount);
      saveGoalsToStorage();
    });
  });
}

// Function to open startContainer and hide mainContainer

loadApiKey();
loadGoalsFromStorage();
