document.addEventListener("DOMContentLoaded", () => {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let draggedItem = null;
  
    const appContainer = document.createElement("div");
    appContainer.className = "todo-app";
  
    const title = document.createElement("h1");
    title.textContent = "ToDo List";
  
    const form = document.createElement("form");
    form.className = "todo-form";
  
    const inputTitle = document.createElement("input");
    inputTitle.type = "text";
    inputTitle.placeholder = "Введите задачу...";
    inputTitle.required = true;
    inputTitle.className = "task-input";
  
    const inputDate = document.createElement("input");
    inputDate.type = "date";
    inputDate.className = "task-date";
  
    const addButton = document.createElement("button");
    addButton.type = "submit";
    addButton.textContent = "Добавить";
    addButton.className = "task-add-btn";
  
    form.append(inputTitle, inputDate, addButton);
  
    const filtersContainer = document.createElement("div");
    filtersContainer.className = "filters";
  
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Поиск...";
    searchInput.className = "search-input";
  
    const statusFilter = document.createElement("select");
    statusFilter.className = "status-filter";
    statusFilter.innerHTML = `
      <option value="all">Все</option>
      <option value="done">Выполненные</option>
      <option value="undone">Невыполненные</option>
    `;
  
    const sortByDateBtn = document.createElement("button");
    sortByDateBtn.type = "button";
    sortByDateBtn.textContent = "Сортировать по дате";
    sortByDateBtn.className = "sort-btn";
  
    filtersContainer.append(searchInput, statusFilter, sortByDateBtn);
  
    const taskList = document.createElement("ul");
    taskList.className = "task-list";
  
    appContainer.append(title, form, filtersContainer, taskList);
    document.body.appendChild(appContainer);
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const taskTitle = inputTitle.value.trim();
      const taskDate = inputDate.value;
  
      if (!taskTitle) return;
  
      const newTask = {
        id: Date.now(),
        title: taskTitle,
        date: taskDate,
        completed: false,
      };
  
      tasks.push(newTask);
      saveTasks();
      renderTasks(tasks);
  
      form.reset();
    });
  
    searchInput.addEventListener("input", filterTasks);
    statusFilter.addEventListener("change", filterTasks);
  
    sortByDateBtn.addEventListener("click", () => {
      tasks.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
      saveTasks();
      renderTasks(tasks);
    });
  
    taskList.addEventListener("dragstart", (e) => {
      if (e.target && e.target.matches("li.task")) {
        draggedItem = e.target;
        e.dataTransfer.effectAllowed = "move";
      }
    });
  
    taskList.addEventListener("dragover", (e) => {
      e.preventDefault();
      const target = e.target.closest("li.task");
      if (target && target !== draggedItem) {
        const bounding = target.getBoundingClientRect();
        const offset = e.clientY - bounding.top;
        if (offset > bounding.height / 2) {
          target.after(draggedItem);
        } else {
          target.before(draggedItem);
        }
      }
    });
  
    taskList.addEventListener("drop", () => {
      const ids = [...taskList.children].map((li) => +li.dataset.id);
      tasks.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
      saveTasks();
      renderTasks(tasks);
    });
  
    function renderTasks(taskArray) {
      taskList.innerHTML = "";
  
      taskArray.forEach((task) => {
        const li = document.createElement("li");
        li.className = "task";
        li.draggable = true;
        li.dataset.id = task.id;
        if (task.completed) li.classList.add("completed");
  
        const titleSpan = document.createElement("span");
        titleSpan.className = "task-title";
        titleSpan.textContent = task.title;
  
        const dateSpan = document.createElement("span");
        dateSpan.className = "task-date-display";
        dateSpan.textContent = task.date || "";
  
        const completeBtn = document.createElement("button");
        completeBtn.textContent = "✓";
        completeBtn.title = "Выполнено";
        completeBtn.addEventListener("click", () => {
          task.completed = !task.completed;
          saveTasks();
          renderTasks(tasks);
        });
  
        const editBtn = document.createElement("button");
        editBtn.textContent = "✎";
        editBtn.title = "Редактировать";
        editBtn.addEventListener("click", () => editTask(task));
  
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑";
        deleteBtn.title = "Удалить";
        deleteBtn.addEventListener("click", () => {
          tasks = tasks.filter((t) => t.id !== task.id);
          saveTasks();
          renderTasks(tasks);
        });
  
        li.append(titleSpan, dateSpan, completeBtn, editBtn, deleteBtn);
        taskList.appendChild(li);
      });
    }
  
    function filterTasks() {
      const searchValue = searchInput.value.toLowerCase();
      const status = statusFilter.value;
  
      const filtered = tasks.filter((task) => {
        const matchesTitle = task.title.toLowerCase().includes(searchValue);
        const matchesStatus =
          status === "all" ||
          (status === "done" && task.completed) ||
          (status === "undone" && !task.completed);
        return matchesTitle && matchesStatus;
      });
  
      renderTasks(filtered);
    }
  
    function editTask(task) {
      const newTitle = prompt("Изменить название задачи:", task.title);
      const newDate = prompt("Изменить дату (гггг-мм-дд):", task.date);
  
      if (newTitle !== null) task.title = newTitle.trim() || task.title;
      if (newDate !== null) task.date = newDate;
  
      saveTasks();
      renderTasks(tasks);
    }
  
    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  
    renderTasks(tasks);
  });