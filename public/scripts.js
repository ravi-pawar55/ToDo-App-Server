const submitTodoNode = document.getElementById("submitTodo");
const userInputNode = document.getElementById("userInput");
const prioritySelectorNode = document.getElementById("priority");
const todoListNode = document.getElementById("todoList");

function fetchAndDisplayTodos() {
  fetch("/todo-data")
    .then(function (response) {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Unable to fetch todo data.");
      }
    })
    .then(function (data) {
      todoListNode.innerHTML = "";
      data.forEach(function (todo) {
        showTodoInUI(todo);
      });
    })
    .catch(function (error) {
      console.error("Error fetching todo data:", error);
      alert("Something went wrong while fetching todos. Please try again later.");
    });
}

// Show a todo in the UI
function showTodoInUI(todo) {
  const todoItem = document.createElement("div");
  todoItem.classList.add("p-2", "rounded-lg");

  const todoItemContent = document.createElement("div");
  todoItemContent.classList.add("flex", "align-middle", "flex-row", "justify-between");

  const checkboxDiv = document.createElement("div");
  checkboxDiv.classList.add("p-2");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("h-6", "w-6");
  checkbox.checked = todo.completed;

  const todoTextDiv = document.createElement("div");
  todoTextDiv.classList.add("p-2");

  const todoText = document.createElement("p");
  todoText.classList.add("text-lg", todo.completed ? "line-through" : "text-black-400","break-all");
  todoText.innerText = todo.todoText;

  const todoPriorityDiv = document.createElement("div");
  todoPriorityDiv.classList.add("p-2");

  const todoPriority = document.createElement("p");
  todoPriority.classList.add("text-lg", "text-black-400");
  todoPriority.innerText = todo.priority;

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("flex", "text-red-500", "border-2", "border-red-500", "p-2", "rounded-lg" ,"hover:text-white","hover:bg-red-500");

  const deleteIcon = document.createElement("span");
  deleteIcon.innerText = "Delete";

  checkbox.addEventListener("change", function () {
    updateTodoStatus(todo.id, this.checked);
  });

  deleteButton.addEventListener("click", function () {
    deleteTodo(todo.id);
  });

  checkboxDiv.appendChild(checkbox);
  todoTextDiv.appendChild(todoText);
  todoPriorityDiv.appendChild(todoPriority);
  deleteButton.appendChild(deleteIcon);

  todoItemContent.appendChild(checkboxDiv);
  todoItemContent.appendChild(todoTextDiv);
  todoItemContent.appendChild(todoPriorityDiv);
  todoItemContent.appendChild(deleteButton);

  todoItem.appendChild(todoItemContent);

  todoListNode.appendChild(todoItem);

}

document.getElementById("todoForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const todoText = userInputNode.value;
  const priority = prioritySelectorNode.value;

  if (!todoText || !priority) {
    alert("Please enter a todo");
    return;
  }

  const todo = {
    id: Date.now().toString(),   
    todoText,
    priority,
    completed: false,
  };

  fetch("/todo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  })
    .then(function (response) {
      if (response.status === 200) {
        fetchAndDisplayTodos(); 
        userInputNode.value = "";
      } else {
        throw new Error("Unable to add todo.");
      }
    })
    .catch(function (error) {
      console.error("Error adding todo:", error);
      alert("Something went wrong while adding the todo. Please try again later.");
    });
});

function updateTodoStatus(todoId, completed) {
  fetch(`/todo/${todoId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed }),
  })
    .then(function (response) {
      if (response.status === 200) {
        fetchAndDisplayTodos(); 
      } else {
        throw new Error("Unable to update todo status.");
      }
    })
    .catch(function (error) {
      console.error("Error updating todo status:", error);
      alert("Something went wrong while updating the todo status. Please try again later.");
    });
}

function deleteTodo(todoId) {
  fetch(`/todo/${todoId}`, {
    method: "DELETE",
  })
    .then(function (response) {
      if (response.status === 200) {
        fetchAndDisplayTodos();
      } else {
        throw new Error("Unable to delete todo.");
      }
    })
    .catch(function (error) {
      console.error("Error deleting todo:", error);
      alert("Something went wrong while deleting the todo. Please try again later.");
    });
}

fetchAndDisplayTodos();
