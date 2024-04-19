// Create a simple to-do list app that
//  allows users to search, add, edit, and delete items.
//   Use local storage to store the data.

const TODO_ITEMS = [];

function TodoItem(content, date) {
  // Human friendly Date String
  this.sanitizeDate = function (date) {
    date = date.toString().split(" ");
    const weekDay = date[0];
    const hour = date[4].split(":").slice(0, 2).join(":");
    const month = date[1];
    const dayOfMonth = date[2] + getOrdinal(Number(date[2]));
    const year = date[3];

    const sanitized = `${weekDay} ${hour}, ${month} ${dayOfMonth}, ${year}`;

    return sanitized;

    function getOrdinal(n) {
      let ord = "th";

      if (n % 10 == 1 && n % 100 != 11) {
        ord = "st";
      } else if (n % 10 == 2 && n % 100 != 12) {
        ord = "nd";
      } else if (n % 10 == 3 && n % 100 != 13) {
        ord = "rd";
      }

      return ord;
    }
  };

  // Generates a todo div to be appended
  this.generateMarkup = function () {
    const todo = document.createElement("div");
    todo.classList.add(
      "my-2",
      "flex",
      "rounded-xl",
      "border-4",
      "border-lime-400",
      "shadow",
    );
    todo.innerHTML = `            
    <div
    class="flex w-[85%] flex-col px-10 py-4 text-left md:w-[90%] md:text-center"
    >
    <p id='todo-content'
    class="break-words pb-2 font-medium md:text-lg md:tracking-wide"
    >
    </p>
    <p id='todo-date' class="text-xs opacity-90">
    </p>
    </div>
    <div
    class="flex w-[15%] items-center justify-center p-2 md:w-[10%]"
    >
    <button
    id="delete-btn"
    class="rounded-md border border-red-500 bg-red-200 p-1.5 text-[8px] opacity-80 transition-transform duration-100 hover:scale-110 active:contrast-200 md:text-xs"
    >
    ❌
    </button>
    </div>`;

    const contentField = todo.querySelector("#todo-content");
    const dateField = todo.querySelector("#todo-date");

    contentField.innerText = this.content;
    dateField.innerText = this.todoDate;

    return todo;
  };

  this.id = TODO_ITEMS.length;
  this.content = content;
  this.todoDate = this.sanitizeDate(date);
  this.markup = this.generateMarkup();

  this.markup.querySelector("#delete-btn").addEventListener("click", (e) => {
    deleteTodo(this.id);
  });

  TODO_ITEMS.push(this);
}

// Grab All necessary elements
const todoField = document.getElementById("todo-field");
const addBtn = document.getElementById("add-btn");
const notifier = document.getElementById("notifier");
const todoContainer = document.getElementById("todo-container");

addBtn.addEventListener("click", (e) => {
  addTodo();
});

todoField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo();
});

function addTodo() {
  const todo = getTodoItem();

  if (todo === null) {
    notifier.classList.replace("text-green-600", "text-red-600");
    notifier.innerHTML =
      "<span class='font-bold'>&#x292B;</span> Cant add empty ToDo!";
    return null;
  }

  todoContainer.appendChild(todo.markup);
  notifier.classList.replace("text-red-600", "text-green-600");
  notifier.innerHTML = "&checkmark; New Todo Added!";

  function getTodoItem() {
    const content = todoField.value.trim();
    todoField.value = null;
    if (!content) return null;
    else {
      return new TodoItem(content, new Date());
    }
  }
}

function deleteTodo(id) {
  todoContainer.children[id].remove();
  TODO_ITEMS.splice(id, 1);
  updateIds();

  function updateIds() {
    for (let i = 0; i < TODO_ITEMS.length; i++) {
      TODO_ITEMS[i].id = i;
    }
  }
}
