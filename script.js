document.addEventListener('DOMContentLoaded', () => {
    const newTaskInput = document.getElementById('new-task');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const progressBar = document.querySelector('.progress');
    const taskCount = document.querySelector('.task-count');

    // New fields for due date, category, and priority
    const dueDateInput = document.createElement('input');
    dueDateInput.type = 'date';
    dueDateInput.id = 'due-date';
    document.querySelector('.add-task').insertBefore(dueDateInput, newTaskInput);

    const categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.id = 'category';
    categoryInput.placeholder = 'Category';
    document.querySelector('.add-task').insertBefore(categoryInput, newTaskInput);

    const prioritySelect = document.createElement('select');
    prioritySelect.id = 'priority';
    const priorityOptions = ['Low', 'Medium', 'High'];
    priorityOptions.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        prioritySelect.appendChild(opt);
    });
    document.querySelector('.add-task').appendChild(prioritySelect);

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        const filteredTasks = filterTasks(tasks);
        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <span class="task-category">${task.category || 'No category'}</span>
                <span class="task-priority">Priority: ${task.priority || 'Low'}</span>
                <span class="task-due-date">Due: ${task.dueDate || 'No due date'}</span>
                <div class="task-actions">
                    <button class="edit-btn">✎</button>
                    <button class="delete-btn">🗑</button>
                </div>
            `;
            taskList.appendChild(li);

            const checkbox = li.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => toggleTask(index));

            const editBtn = li.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => editTask(index));

            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteTask(index));
        });
        updateProgress();
    }

    function addTask() {
        const text = newTaskInput.value.trim();
        const dueDate = dueDateInput.value;
        const category = categoryInput.value.trim();
        const priority = prioritySelect.value;

        if (text) {
            tasks.push({ text, completed: false, dueDate, category, priority });
            newTaskInput.value = '';
            dueDateInput.value = '';
            categoryInput.value = '';
            prioritySelect.value = 'Low';
            saveTasks();
            renderTasks();
        }
    }

    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    function editTask(index) {
        const task = tasks[index];
        const newText = prompt('Edit task:', task.text);
        const newCategory = prompt('Edit category:', task.category || '');
        const newDueDate = prompt('Edit due date:', task.dueDate || '');
        const newPriority = prompt('Edit priority (Low, Medium, High):', task.priority || 'Low');

        if (newText !== null) task.text = newText.trim();
        if (newCategory !== null) task.category = newCategory.trim();
        if (newDueDate !== null) task.dueDate = newDueDate;
        if (newPriority !== null) task.priority = newPriority;

        saveTasks();
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function filterTasks(tasks) {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        switch (activeFilter) {
            case 'active':
                return tasks.filter(task => !task.completed);
            case 'completed':
                return tasks.filter(task => task.completed);
            default:
                return tasks;
        }
    }

    function updateProgress() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
        progressBar.style.width = `${progress}%`;
        taskCount.textContent = `${completedTasks} / ${totalTasks}`;
    }

    addTaskBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTasks();
        });
    });

    renderTasks();
});
