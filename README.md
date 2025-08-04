# Project 9: L'Oréal Routine Builder

A web application that allows users to browse L'Oréal brand products, select the ones they want, and generate personalized beauty routines using AI. Users can also ask follow-up questions about their routine—just like chatting with a real advisor.

## Features

- **Product Browsing**: Filter products by category (cleansers, moisturizers, makeup, etc.)
- **Product Selection**: Select multiple products to build a personalized routine
- **Persistent Selection**: Selected products persist after page reload using localStorage
- **AI-Powered Routines**: Generate step-by-step routines using OpenAI's GPT-4o
- **Interactive Chat**: Ask follow-up questions about products and routines with conversation memory
- **Evidence-Based Advice**: Responses include credible sources, citations, and clickable links
- **Current Research**: Get up-to-date information based on 2024-2025 skincare research
- **Secure API**: Uses Cloudflare Worker to protect API keys
- **Real Product Data**: Uses actual L'Oréal brand product information

## Setup Instructions

**No API Key Required!**

This application uses a Cloudflare Worker (https://orange-chatbot.jmo8657.workers.dev/) to securely handle API requests, so you don't need to set up your own OpenAI API key.

1. **Run the Application**:
   - Open `index.html` in a web browser
   - Or use a local server (recommended for development)

## How to Use

1. **Select a Category**: Choose a product category from the dropdown menu
2. **Browse Products**: View products with descriptions and images
3. **Select Products**: Click "Select" on products you want to include in your routine
4. **Generate Routine**: Click "Generate Routine" to create a personalized routine with AI
5. **Ask Questions**: Use the chat feature to ask follow-up questions about your routine
6. **Clear Selection**: Use the "Clear All" button to start over

## Code Structure

- `index.html` - Main HTML structure with product grid and chat interface
- `script.js` - JavaScript functionality for product selection and AI integration
- `style.css` - Styling for the entire application
- `products.json` - Database of L'Oréal brand products

## Key Learning Concepts

- **API Integration**: Making requests to external services using `fetch()`
- **Local Storage**: Persisting data between browser sessions
- **JSON Data**: Working with product data from JSON files
- **DOM Manipulation**: Dynamically updating the UI based on user interactions
- **Event Handling**: Responding to user clicks and form submissions
- **Async/Await**: Handling asynchronous operations with modern JavaScript
- **Conversation Context**: Maintaining chat history for better AI responses

## API Usage

The application uses a Cloudflare Worker proxy to securely access OpenAI's Chat Completions API with the `gpt-4o` model to:

- Generate personalized beauty routines based on selected products
- Answer user questions about products and skincare with conversation context

## Note for Students

This project demonstrates real-world web development practices:

- Working with external APIs through secure proxy services
- Managing application state (selected products) with localStorage
- Creating interactive user interfaces with real-time feedback
- Handling user input and providing contextual responses
- Implementing data persistence across browser sessions

The use of Cloudflare Worker shows how to protect sensitive API keys in production applications!oject 9: L'Oréal Routine Builder
L’Oréal is expanding what’s possible with AI, and now your chatbot is getting smarter. This week, you’ll upgrade it into a product-aware routine builder.

Users will be able to browse real L’Oréal brand products, select the ones they want, and generate a personalized routine using AI. They can also ask follow-up questions about their routine—just like chatting with a real advisor.
