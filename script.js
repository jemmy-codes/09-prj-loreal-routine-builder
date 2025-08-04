/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearch");
const productsContainer = document.getElementById("productsContainer");
const selectedProductsList = document.getElementById("selectedProductsList");
const generateRoutineBtn = document.getElementById("generateRoutine");
const clearAllBtn = document.getElementById("clearAll");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");

/* Array to store selected products */
let selectedProducts = [];

/* Array to store conversation history for context */
let conversationHistory = [];

/* Load selected products from localStorage */
function loadSelectedProductsFromStorage() {
  const stored = localStorage.getItem("selectedProducts");
  if (stored) {
    try {
      selectedProducts = JSON.parse(stored);
      updateSelectedProductsDisplay();
      console.log("Loaded", selectedProducts.length, "products from storage");
    } catch (error) {
      console.error("Error loading selected products from storage:", error);
      selectedProducts = [];
    }
  }
}

/* Save selected products to localStorage */
function saveSelectedProductsToStorage() {
  try {
    localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
    console.log("Saved", selectedProducts.length, "products to storage");
  } catch (error) {
    console.error("Error saving selected products to storage:", error);
  }
}

/* Show initial placeholder until user selects a category */
productsContainer.innerHTML = `
  <div class="placeholder-message">
    Select a category or search for products
  </div>
`;

/* Load product data from JSON file */
async function loadProducts() {
  const response = await fetch("products.json");
  const data = await response.json();
  return data.products;
}

/* Filter products based on category and search term */
function filterProducts(products, category, searchTerm) {
  let filteredProducts = products;

  /* Filter by category if selected */
  if (category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === category
    );
  }

  /* Filter by search term if provided */
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filteredProducts = filteredProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    });
  }

  return filteredProducts;
}

/* Update product display based on current filters */
async function updateProductDisplay() {
  const products = await loadProducts();
  const selectedCategory = categoryFilter.value;
  const searchTerm = searchInput.value.trim();

  /* Show/hide clear search button */
  if (searchTerm) {
    clearSearchBtn.classList.add("visible");
  } else {
    clearSearchBtn.classList.remove("visible");
  }

  /* If no category selected and no search term, show placeholder */
  if (!selectedCategory && !searchTerm) {
    productsContainer.innerHTML = `
      <div class="placeholder-message">
        Select a category or search for products
      </div>
    `;
    return;
  }

  const filteredProducts = filterProducts(
    products,
    selectedCategory,
    searchTerm
  );

  /* Show "no results" message if no products match */
  if (filteredProducts.length === 0) {
    const message = searchTerm
      ? `No products found matching "${searchTerm}"${
          selectedCategory ? ` in ${selectedCategory} category` : ""
        }`
      : `No products found in ${selectedCategory} category`;

    productsContainer.innerHTML = `
      <div class="placeholder-message">
        ${message}
      </div>
    `;
    return;
  }

  displayProducts(filteredProducts);
}

/* Create HTML for displaying product cards */
function displayProducts(products) {
  productsContainer.innerHTML = products
    .map((product) => {
      const isSelected = selectedProducts.some((p) => p.id === product.id);
      return `
    <div class="product-card ${
      isSelected ? "selected" : ""
    }" data-product-id="${product.id}">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-brand">${product.brand}</p>
        <div class="description-container">
          <p class="product-description collapsed" id="desc-${product.id}">
            ${product.description}
          </p>
          <button class="description-toggle" onclick="toggleDescription(${
            product.id
          })" aria-label="Toggle description">
            <i class="fa-solid fa-chevron-down"></i>
            <span class="toggle-text">Read more</span>
          </button>
        </div>
        <button class="select-product-btn" onclick="toggleProductSelection(${
          product.id
        })">
          ${isSelected ? "Remove" : "Select"}
        </button>
      </div>
    </div>
  `;
    })
    .join("");
}

/* Toggle product description visibility */
function toggleDescription(productId) {
  const description = document.getElementById(`desc-${productId}`);
  const toggleBtn = description.parentElement.querySelector(
    ".description-toggle"
  );
  const icon = toggleBtn.querySelector("i");
  const text = toggleBtn.querySelector(".toggle-text");

  if (description.classList.contains("collapsed")) {
    /* Expand description */
    description.classList.remove("collapsed");
    description.classList.add("expanded");
    icon.className = "fa-solid fa-chevron-up";
    text.textContent = "Read less";
  } else {
    /* Collapse description */
    description.classList.remove("expanded");
    description.classList.add("collapsed");
    icon.className = "fa-solid fa-chevron-down";
    text.textContent = "Read more";
  }
}

/* Filter and display products when category changes */
categoryFilter.addEventListener("change", async (e) => {
  await updateProductDisplay();
});

/* Toggle product selection when user clicks select/remove button */
async function toggleProductSelection(productId) {
  const products = await loadProducts();
  const product = products.find((p) => p.id === productId);

  /* Check if product is already selected */
  const isSelected = selectedProducts.some((p) => p.id === productId);

  if (isSelected) {
    /* Remove product from selection */
    selectedProducts = selectedProducts.filter((p) => p.id !== productId);
  } else {
    /* Add product to selection */
    selectedProducts.push(product);
  }

  /* Update the display */
  updateSelectedProductsDisplay();
  clearConversationIfNeeded();

  /* Save to localStorage */
  saveSelectedProductsToStorage();

  /* Re-display current products with updated selection state */
  await updateProductDisplay();
}

/* Update the selected products display */
function updateSelectedProductsDisplay() {
  if (selectedProducts.length === 0) {
    selectedProductsList.innerHTML = "<p>No products selected yet</p>";
    return;
  }

  selectedProductsList.innerHTML = selectedProducts
    .map(
      (product) => `
      <div class="selected-product">
        <span>${product.brand} - ${product.name}</span>
        <button onclick="toggleProductSelection(${product.id})" class="remove-btn">Remove</button>
      </div>
    `
    )
    .join("");
}

/* Clear conversation history when product selection changes significantly */
function clearConversationIfNeeded() {
  /* Clear conversation history if no products are selected or if it's getting too long */
  if (selectedProducts.length === 0) {
    conversationHistory = [];
    /* Add a helpful message to the chat */
    if (chatWindow.children.length > 0) {
      addMessageToChat(
        "assistant",
        "I see you've cleared your product selection. Feel free to select new products and ask me anything about building a routine! 😊"
      );
    }
  }
}

/* Clear all selected products */
async function clearAllProducts() {
  selectedProducts = [];
  updateSelectedProductsDisplay();
  saveSelectedProductsToStorage();
  clearConversationIfNeeded();

  /* Update any currently displayed products to remove selected state */
  await updateProductDisplay();
}

/* Generate routine using OpenAI API */
async function generateRoutine() {
  if (selectedProducts.length === 0) {
    addMessageToChat(
      "assistant",
      "Please select some products first before generating a routine!"
    );
    return;
  }

  /* Show loading message */
  addMessageToChat("assistant", "Creating your personalized routine... ✨");

  /* Create the prompt for OpenAI */
  const productList = selectedProducts
    .map((p) => `- ${p.brand} ${p.name}: ${p.description}`)
    .join("\n");

  const prompt = `You are a professional skincare and beauty advisor for L'Oréal. Create a personalized routine using these selected products:

${productList}

Please provide:
1. A step-by-step routine (morning and/or evening as appropriate)
2. The order of application and why (include scientific reasoning)
3. Any tips for best results based on current dermatological research
4. How often to use each product with safety considerations

Additional requirements:
- Include credible sources and citations where appropriate
- Reference current 2024-2025 skincare research when relevant
- Format links as [Source Name](URL) for readability
- Mention any important safety considerations or patch testing recommendations
- Keep the advice friendly, professional, and beginner-friendly

IMPORTANT FORMATTING RULES:
- Use only plain text and markdown-style links [text](url)
- DO NOT use HTML tags like <div>, <span>, <br>, <strong>, etc.
- Use asterisks for *emphasis* and double asterisks for **bold**
- Use numbered lists (1. 2. 3.) or bullet points (- item)
- Separate paragraphs with double line breaks

When discussing ingredient benefits or application methods, cite authoritative sources like the American Academy of Dermatology, peer-reviewed studies, or L'Oréal Research when possible.`;

  try {
    /* Make API call to Cloudflare Worker */
    const response = await fetch(
      "https://orange-chatbot.jmo8657.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    if (data.choices && data.choices[0] && data.choices[0].message) {
      /* Display the routine */
      const routineContent = data.choices[0].message.content;
      addMessageToChat("assistant", routineContent);

      /* Add routine to conversation history */
      conversationHistory.push({
        role: "user",
        content: prompt,
      });
      conversationHistory.push({
        role: "assistant",
        content: routineContent,
      });
    } else {
      addMessageToChat(
        "assistant",
        "Sorry, I had trouble generating your routine. Please try again."
      );
    }
  } catch (error) {
    console.error("Error generating routine:", error);
    addMessageToChat(
      "assistant",
      "Sorry, there was an error connecting to the AI service. Please check your API key and try again."
    );
  }
}

/* Add message to chat window */
function addMessageToChat(sender, message) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `chat-message ${sender}`;

  /* First escape any HTML tags to prevent unwanted rendering */
  let formattedMessage = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  /* Format the message with proper line breaks */
  formattedMessage = formattedMessage.replace(/\n/g, "<br>");

  /* Convert markdown-style links [text](url) to HTML links */
  formattedMessage = formattedMessage.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>'
  );

  /* Convert plain URLs to clickable links (simpler approach to avoid browser compatibility issues) */
  const linkRegex = /(^|[^">])(https?:\/\/[^\s<]+)/g;
  formattedMessage = formattedMessage.replace(
    linkRegex,
    (match, prefix, url) => {
      /* Don't convert if it's already inside an href attribute */
      if (prefix.includes("href=")) {
        return match;
      }
      return (
        prefix +
        '<a href="' +
        url +
        '" target="_blank" rel="noopener noreferrer" class="chat-link">' +
        url +
        "</a>"
      );
    }
  );

  messageDiv.innerHTML = `
    <div class="message-content">
      ${formattedMessage}
    </div>
  `;

  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Handle chat form submission for follow-up questions */
async function handleChatSubmission(userMessage) {
  /* Add user message to chat */
  addMessageToChat("user", userMessage);

  /* Show thinking message */
  addMessageToChat("assistant", "Let me help you with that... 🤔");

  /* Create context about selected products for the AI */
  const productContext =
    selectedProducts.length > 0
      ? `Selected products: ${selectedProducts
          .map((p) => `${p.brand} ${p.name}`)
          .join(", ")}`
      : "No products currently selected";

  /* Build messages array with conversation history */
  const messages = [
    {
      role: "system",
      content: `You are a professional skincare and beauty advisor for L'Oréal. You help customers with product recommendations, routines, and beauty advice. 

Current context:
- ${productContext}

Guidelines for responses:
- Always provide helpful, friendly, and safe beauty advice
- Reference previous conversation when relevant
- Include credible sources and links when providing factual information
- Use authoritative beauty and dermatology sources like:
  * American Academy of Dermatology (aad.org)
  * Journal of Clinical and Aesthetic Dermatology
  * Dermatology research publications
  * L'Oréal Research & Innovation
- Format links as [Source Name](URL) for better readability
- When discussing ingredients, cite peer-reviewed studies when possible
- Stay current with 2024-2025 beauty trends and scientific findings
- Always prioritize skin safety and recommend patch testing for new products

IMPORTANT FORMATTING RULES:
- Use only plain text and markdown-style links [text](url)
- DO NOT use HTML tags like <div>, <span>, <br>, <strong>, etc.
- Use asterisks for *emphasis* and double asterisks for **bold**
- Use numbered lists (1. 2. 3.) or bullet points (- item)
- Separate paragraphs with double line breaks
- Keep responses clear, readable, and properly formatted`,
    },
  ];

  /* Add conversation history to maintain context */
  messages.push(...conversationHistory);

  /* Add current user message */
  messages.push({
    role: "user",
    content: userMessage,
  });

  try {
    /* Make API call to Cloudflare Worker with full conversation context */
    const response = await fetch(
      "https://orange-chatbot.jmo8657.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    /* Remove the thinking message */
    const chatMessages = chatWindow.querySelectorAll(".chat-message");
    const lastMessage = chatMessages[chatMessages.length - 1];
    if (
      lastMessage &&
      lastMessage.textContent.includes("Let me help you with that")
    ) {
      lastMessage.remove();
    }

    if (data.choices && data.choices[0] && data.choices[0].message) {
      /* Display the AI response */
      const assistantResponse = data.choices[0].message.content;
      addMessageToChat("assistant", assistantResponse);

      /* Add this exchange to conversation history */
      conversationHistory.push({
        role: "user",
        content: userMessage,
      });
      conversationHistory.push({
        role: "assistant",
        content: assistantResponse,
      });

      /* Keep conversation history manageable (last 10 exchanges) */
      if (conversationHistory.length > 20) {
        conversationHistory = conversationHistory.slice(-20);
      }
    } else {
      addMessageToChat(
        "assistant",
        "Sorry, I had trouble understanding your question. Could you try rephrasing it?"
      );
    }
  } catch (error) {
    console.error("Error getting AI response:", error);
    addMessageToChat(
      "assistant",
      "Sorry, there was an error getting a response. Please check your connection and try again."
    );
  }
}

/* Event listeners */
generateRoutineBtn.addEventListener("click", generateRoutine);
clearAllBtn.addEventListener("click", clearAllProducts);

/* Search functionality event listeners */
searchInput.addEventListener("input", async () => {
  await updateProductDisplay();
});

clearSearchBtn.addEventListener("click", async () => {
  searchInput.value = "";
  clearSearchBtn.classList.remove("visible");
  await updateProductDisplay();
});

/* Initialize the application */
loadSelectedProductsFromStorage();
updateSelectedProductsDisplay();

/* Add welcome message to chat */
addMessageToChat(
  "assistant",
  "Welcome to L'Oréal's Smart Routine Builder! 🌟\n\nSelect products from different categories, and I'll help you create a personalized routine based on the latest skincare research. You can also ask me follow-up questions about your routine, product usage, or any beauty concerns.\n\n💡 I provide evidence-based advice with sources and links to credible research when possible!"
);

/* Add helpful prompts */
setTimeout(() => {
  addMessageToChat(
    "assistant",
    '💬 Try asking me questions like:\n• "What\'s the latest research on retinol use?"\n• "How often should I use vitamin C serum according to dermatologists?"\n• "What do studies say about layering skincare products?"\n\nI\'ll provide answers with credible sources and citations! 📚'
  );
}, 2000);

/* Chat form submission handler */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  /* Clear the input */
  userInput.value = "";

  /* Handle the chat message */
  await handleChatSubmission(message);
});
