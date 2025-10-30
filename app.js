document.addEventListener("DOMContentLoaded", () => {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
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
  
    const statusFilter = document.createElement("select");
    statusFilter.innerHTML = `
      <option value="all">Все</option>
      <option value="done">Выполненные</option>
      <option value="undone">Невыполненные</option>
    `;
  
    const sortBtn = document.createElement("button");
    sortBtn.textContent = "Сортировать по дате";
    sortBtn.type = "button";
  
    filtersContainer.append(searchInput, statusFilter, sortBtn);
  
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
      renderTasks();
      form.reset();
    });
  
    searchInput.addEventListener("input", filterTasks);
    statusFilter.addEventListener("change", filterTasks);
  
    sortBtn.addEventListener("click", () => {
      tasks.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
      saveTasks();
      filterTasks();
    });
  
    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  
    function renderTasks(filteredTasks = tasks) {
      taskList.innerHTML = "";
  
      filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task";
        li.dataset.id = task.id;
        if (task.completed) li.classList.add("completed");
  
        const titleSpan = document.createElement("span");
        titleSpan.textContent = `${task.title} ${task.date || ""}`;
  
        const completeBtn = document.createElement("button");
        completeBtn.textContent = "✓";
        completeBtn.addEventListener("click", () => {
          task.completed = !task.completed;
          saveTasks();
          filterTasks();
        });
  
        const editBtn = document.createElement("button");
        editBtn.textContent = "✎";
        editBtn.addEventListener("click", () => {
          const newTitle = prompt("Изменить название задачи:", task.title);
          const newDate = prompt("Изменить дату (гггг-мм-дд):", task.date);
          if (newTitle !== null) task.title = newTitle.trim() || task.title;
          if (newDate !== null) task.date = newDate;
          saveTasks();
          filterTasks();
        });
  
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑";
        deleteBtn.addEventListener("click", () => {
          tasks = tasks.filter(t => t.id !== task.id);
          saveTasks();
          filterTasks();
        });
  
        li.append(titleSpan, completeBtn, editBtn, deleteBtn);
        taskList.appendChild(li);
      });
    }
  
    function filterTasks() {
      const searchVal = searchInput.value.toLowerCase();
      const status = statusFilter.value;
  
      const filtered = tasks.filter(task => {
        const matchesTitle = task.title.toLowerCase().includes(searchVal);
        const matchesStatus =
          status === "all" ||
          (status === "done" && task.completed) ||
          (status === "undone" && !task.completed);
        return matchesTitle && matchesStatus;
      });
  
      renderTasks(filtered);
    }
  
    renderTasks();
  });