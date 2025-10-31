document.addEventListener("DOMContentLoaded", () => {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let draggedItem = null;

  const appContainer = document.createElement("div");
  appContainer.className = "todo-app";
  Object.assign(appContainer.style, {
    maxWidth: "700px",
    margin: "auto",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    fontFamily: "sans-serif",
  });

  const title = document.createElement("h1");
  title.textContent = "ToDo List";
  title.style.textAlign = "center";

  const form = document.createElement("form");
  form.className = "todo-form";
  Object.assign(form.style, {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "20px",
  });

  const inputTitle = document.createElement("input");
  inputTitle.type = "text";
  inputTitle.required = true;
  inputTitle.placeholder = "Введите задачу...";
  inputTitle.className = "task-input";
  Object.assign(inputTitle.style, {
    flex: "2",
    padding: "8px",
    fontSize: "1rem",
  });

  const inputDate = document.createElement("input");
  inputDate.type = "date";
  inputDate.className = "task-date";
  Object.assign(inputDate.style, {
    flex: "1",
    padding: "8px",
    fontSize: "1rem",
  });

  const addButton = document.createElement("button");
  addButton.type = "submit";
  addButton.textContent = "Добавить";
  addButton.className = "task-add-btn";
  Object.assign(addButton.style, {
    flex: "1",
    fontSize: "1rem",
    padding: "8px",
    background: "#eee",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
  });

  form.append(inputTitle, inputDate, addButton);

  const filtersContainer = document.createElement("div");
  filtersContainer.className = "filters";
  Object.assign(filtersContainer.style, {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "16px",
    marginBottom: "20px",
  });

  function createFilterGroup(labelText, control) {
    const group = document.createElement("div");
    group.className = "filter-group";
    Object.assign(group.style, {
      display: "flex",
      flexDirection: "column",
      fontSize: "0.9rem",
    });

    const label = document.createElement("label");
    label.textContent = labelText;
    Object.assign(label.style, {
      marginBottom: "5px",
      fontWeight: "bold",
      color: "#444",
    });

    group.append(label, control);
    return group;
  }

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Поиск по задачам";
  Object.assign(searchInput.style, { padding: "8px" });

  const statusFilter = document.createElement("select");
  ["Все задачи", "Выполненные", "Невыполненные"].forEach((text, index) => {
    const opt = document.createElement("option");
    opt.value = ["all", "done", "undone"][index];
    opt.textContent = text;
    statusFilter.appendChild(opt);
  });
  statusFilter.style.padding = "8px";

  const sortBtn = document.createElement("button");
  sortBtn.type = "button";
  sortBtn.textContent = "Сортировать по дате";
  Object.assign(sortBtn.style, {
    padding: "8px",
    background: "#eee",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
  });

  filtersContainer.append(
    createFilterGroup("Поиск", searchInput),
    createFilterGroup("Статус", statusFilter),
    createFilterGroup("Сортировка", sortBtn)
  );

  const taskList = document.createElement("ul");
  taskList.className = "task-list";
  Object.assign(taskList.style, {
    listStyle: "none",
    padding: "0",
  });

  appContainer.append(title, form, filtersContainer, taskList);
  document.body.style.background = "#f4f4f4";
  document.body.style.padding = "20px";
  document.body.appendChild(appContainer);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = inputTitle.value.trim();
    let date = inputDate.value;

    if (!title) return;
    if (!date) date = getTodayISO();

    tasks.push({ id: Date.now(), title, date, completed: false });
    saveTasks();
    renderTasks(tasks);
    form.reset();
  });

  searchInput.addEventListener("input", filterTasks);
  statusFilter.addEventListener("change", filterTasks);
  sortBtn.addEventListener("click", () => {
    tasks.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
    saveTasks();
    renderTasks(tasks);
  });

  taskList.addEventListener("dragstart", (e) => {
    if (e.target && e.target.matches("li.task")) {
      draggedItem = e.target;
    }
  });

  taskList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const target = e.target.closest("li.task");
    if (target && target !== draggedItem) {
      const rect = target.getBoundingClientRect();
      const offset = e.clientY - rect.top;
      if (offset > rect.height / 2) {
        target.after(draggedItem);
      } else {
        target.before(draggedItem);
      }
    }
  });

  taskList.addEventListener("drop", () => {
    const order = [...taskList.children].map((li) => +li.dataset.id);
    tasks.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    saveTasks();
    renderTasks(tasks);
  });

  function renderTasks(list = tasks) {
    taskList.innerHTML = "";
    list.forEach((task) => {
      const li = document.createElement("li");
      li.className = "task";
      li.draggable = true;
      li.dataset.id = task.id;

      Object.assign(li.style, {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px",
        borderBottom: "1px solid #ccc",
        background: task.completed ? "#d4fdd4" : "#fff",
      });

      const title = document.createElement("span");
      title.textContent = task.title;
      Object.assign(title.style, { flex: "2" });

      const date = document.createElement("span");
      date.textContent = formatDate(task.date);
      Object.assign(date.style, {
        flex: "1",
        minWidth: "100px",
        textAlign: "center",
      });

      const btnWrap = document.createElement("div");
      btnWrap.style.display = "flex";
      btnWrap.style.gap = "5px";

      const completeBtn = createStyledBtn("Выполнено", () => {
        task.completed = !task.completed;
        saveTasks();
        renderTasks(tasks);
      });

      const editBtn = createStyledBtn("Редактировать", () => editTask(task));

      const deleteBtn = createStyledBtn("Удалить", () => {
        tasks = tasks.filter((t) => t.id !== task.id);
        saveTasks();
        renderTasks(tasks);
      });

      btnWrap.append(completeBtn, editBtn, deleteBtn);
      li.append(title, date, btnWrap);
      taskList.appendChild(li);
    });
  }

  function createStyledBtn(text, onClick) {
    const btn = document.createElement("button");
    btn.textContent = text;
    Object.assign(btn.style, {
      padding: "4px 6px",
      border: "1px solid #ccc",
      background: "#f2f2f2",
      cursor: "pointer",
      borderRadius: "4px",
    });
    btn.addEventListener("click", onClick);
    return btn;
  }

  function filterTasks() {
    const text = searchInput.value.toLowerCase();
    const status = statusFilter.value;

    const filtered = tasks.filter((t) => {
      const matchesText = t.title.toLowerCase().includes(text);
      const matchesStatus =
        status === "all" ||
        (status === "done" && t.completed) ||
        (status === "undone" && !t.completed);
      return matchesText && matchesStatus;
    });

    renderTasks(filtered);
  }

  function editTask(task) {
    const currentFormatted = formatDate(task.date);
    const newTitle = prompt("Новое название задачи:", task.title);
    const newDate = prompt("Новая дата (дд-мм-гггг):", currentFormatted);

    if (newTitle !== null) task.title = newTitle.trim() || task.title;

    if (newDate && validateDDMMYYYY(newDate) && isValidDDMMYYYY(newDate)) {
      task.date = convertToISO(newDate);
    } else if (newDate) {
      alert("Неверный формат даты. Используйте ДД-ММ-ГГГГ");
    }

    saveTasks();
    renderTasks(tasks);
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function formatDate(iso) {
    const date = new Date(iso);
    if (isNaN(date)) return "";
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  }

  function convertToISO(ddmmyyyy) {
    const [d, m, y] = ddmmyyyy.split("-");
    return `${y}-${m}-${d}`;
  }

  function validateDDMMYYYY(str) {
    return /^\d{2}-\d{2}-\d{4}$/.test(str);
  }

  function isValidDDMMYYYY(str) {
    const [d, m, y] = str.split("-");
    const date = new Date(`${y}-${m}-${d}`);
    return (
      !isNaN(date.getTime()) &&
      Number(d) === date.getDate() &&
      Number(m) === date.getMonth() + 1 &&
      Number(y) === date.getFullYear()
    );
  }

  function getTodayISO() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  renderTasks(tasks);
});
