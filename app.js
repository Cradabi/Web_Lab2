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
  
    const taskList = document.createElement("ul");
    taskList.className = "task-list";
  
    appContainer.append(title, form, taskList);
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
  
    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  
    function renderTasks() {
      taskList.innerHTML = "";
  
      tasks.forEach(task => {
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
          renderTasks();
        });
  
        const editBtn = document.createElement("button");
        editBtn.textContent = "✎";
        editBtn.addEventListener("click", () => {
          const newTitle = prompt("Изменить название задачи:", task.title);
          const newDate = prompt("Изменить дату (гггг-мм-дд):", task.date);
  
          if (newTitle !== null) task.title = newTitle.trim() || task.title;
          if (newDate !== null) task.date = newDate;
  
          saveTasks();
          renderTasks();
        });
  
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑";
        deleteBtn.addEventListener("click", () => {
          tasks = tasks.filter(t => t.id !== task.id);
          saveTasks();
          renderTasks();
        });
  
        li.append(titleSpan, completeBtn, editBtn, deleteBtn);
        taskList.appendChild(li);
      });
    }
  
    renderTasks();
  });