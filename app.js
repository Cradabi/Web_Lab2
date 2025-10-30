document.addEventListener("DOMContentLoaded", () => {
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
  });