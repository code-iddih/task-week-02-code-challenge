document.addEventListener("DOMContentLoaded", function() {
    const itemInput = document.getElementById("itemInput"); // Get the item input element
    const addItemBtn = document.getElementById("addItemBtn"); // Get the add item button element
    const clearListBtn = document.getElementById("clearListBtn"); // Get the clear list button element
    const itemList = document.getElementById("itemList"); // Get the item list element

    let shoppingList = []; // Initialize an empty array to store shopping list items

    // Load items from localStorage if available
    if (localStorage.getItem("shoppingList")) {
        shoppingList = JSON.parse(localStorage.getItem("shoppingList")); // Parse stored JSON data into shoppingList array
        renderShoppingList(); // Render the shopping list items from localStorage
    }

    // Function to render shopping list items
    function renderShoppingList() {
        itemList.innerHTML = ""; // Clear existing HTML content in itemList
        shoppingList.forEach((item, index) => {
            const li = createListItem(item, index); // Create a new list item element
            itemList.appendChild(li); // Append the created list item to itemList
        });
        // Save current shoppingList state to localStorage whenever it changes
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
    }

    // Function to create list item element
    function createListItem(item, index) {
        const li = document.createElement("li"); // Create a new list item element
        li.dataset.index = index; // Set the dataset index attribute to the current index

        const itemName = document.createElement("span"); // Create a new span element for item name
        itemName.textContent = item.name; // Set the text content to the item name
        itemName.classList.add("item-name"); // Add 'item-name' class to span element

        const markBtn = document.createElement("button"); // Create a new button element for marking item
        markBtn.textContent = item.completed ? "Unmark" : "Mark as Purchased"; // Set button text based on item completion status
        markBtn.classList.add("mark-btn"); // Add 'mark-btn' class to button element
        markBtn.addEventListener("click", () => {
            toggleCompleted(index); // Toggle completion status on button click
        });

        const editInput = document.createElement("input"); // Create a new input element for editing item name
        editInput.type = "text"; // Set input type to text
        editInput.value = item.name; // Set input value to item name
        editInput.style.display = "none"; // Initially hide input element
        editInput.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                updateItem(index, editInput.value.trim()); // Update item name on Enter key press
            } else if (event.key === "Escape") {
                cancelEdit(index); // Cancel editing on Escape key press
            }
        });

        const tickSpan = document.createElement("span"); // Create a new span element for tick mark
        tickSpan.textContent = " ✓ Purchased"; // Set text content for tick mark
        tickSpan.classList.add("tick-name"); // Add 'tick-name' class to span element
        tickSpan.style.display = item.completed ? "inline" : "none"; // Display tick mark if item is completed

        const editBtn = document.createElement("button"); // Create a new button element for editing item
        editBtn.textContent = "Edit"; // Set button text to Edit
        editBtn.classList.add("edit-btn"); // Add 'edit-btn' class to button element
        editBtn.addEventListener("click", () => {
            startEdit(index); // Start editing item on button click
        });

        const deleteBtn = document.createElement("button"); // Create a new button element for deleting item
        deleteBtn.textContent = "Delete"; // Set button text to Delete
        deleteBtn.classList.add("delete-btn"); // Add 'delete-btn' class to button element
        deleteBtn.addEventListener("click", (event) => {
            const indexToDelete = event.target.closest("li").dataset.index; // Find the index of item to delete
            deleteItem(indexToDelete); // Delete item on button click
        });

        const actionContainer = document.createElement("div"); // Create a new div element for action buttons
        actionContainer.appendChild(markBtn); // Append mark button to action container
        actionContainer.appendChild(editBtn); // Append edit button to action container
        actionContainer.appendChild(deleteBtn); // Append delete button to action container

        li.appendChild(itemName); // Append item name span to list item
        li.appendChild(editInput); // Append edit input to list item
        li.appendChild(actionContainer); // Append action container to list item
        li.appendChild(tickSpan); // Append tick span to list item

        if (item.completed) {
            itemName.style.textDecoration = "line-through"; // Apply line-through decoration if item is completed
            itemName.style.color = "#808080"; // Set text color to gray for completed items
        }

        return li; // Return the created list item element
    }

    // Function to add new item
    addItemBtn.addEventListener("click", () => {
        const itemName = itemInput.value.trim(); // Get trimmed value of item input
        if (itemName !== "") {
            shoppingList.push({ name: itemName, completed: false }); // Add new item to shopping list array
            renderShoppingList(); // Render updated shopping list
            itemInput.value = ""; // Clear item input field
        }
    });

    // Function to start editing item
    function startEdit(index) {
        const li = itemList.querySelector(`li[data-index="${index}"]`); // Find list item by index
        const itemName = li.querySelector("span"); // Find item name span within list item
        const editInput = li.querySelector("input[type=text]"); // Find edit input within list item

        itemName.style.display = "none"; // Hide item name span
        editInput.style.display = "inline-block"; // Display edit input
        editInput.focus(); // Set focus on edit input
    }

    // Function to update item after editing
    function updateItem(index, newName) {
        if (newName !== "") {
            shoppingList[index].name = newName; // Update item name in shopping list array
            renderShoppingList(); // Render updated shopping list
        }
    }

    // Function to cancel editing
    function cancelEdit(index) {
        renderShoppingList(); // Simply re-render to revert changes
    }

    // Function to delete item
    function deleteItem(index) {
        shoppingList.splice(index, 1); // Remove item from shopping list array
        renderShoppingList(); // Render updated shopping list
    }

    // Function to toggle completed status
    function toggleCompleted(index) {
        shoppingList[index].completed = !shoppingList[index].completed; // Toggle completed status of item
        renderShoppingList(); // Render updated shopping list
    }

    // Function to clear the list
    clearListBtn.addEventListener("click", () => {
        shoppingList = []; // Clear shopping list array
        renderShoppingList(); // Render updated shopping list
    });

});
