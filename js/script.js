let todos = [];

// Menyeleksi
const todoForm = document.querySelector('.container form');
const todoInput = document.getElementById('todo-input');
const dateInput = document.getElementById('date-input');
const dataContents = document.querySelector('.container .data-contents');
const filterButton = document.querySelector('.container .function .btn-filter')
const deleteAllButton = document.querySelector('.container .function .btn-delete');

// Menambahkan function tugas (create)
function addTodo(event) {
    event.preventDefault() //Mencegah reload halaman

    const text = todoInput.value.trim();
    const date = dateInput.value;

    // Validasi
    if (text === '' || date === '') {
        alert('Mohon isi deskripsi tugas dan tanggal');
        return;
    };

    const newTodo = {
        id: Date.now(), //ID unik
        text: text,
        date: date,
        completed: false //Status awal belum selesai
    };

    todos.push(newTodo);
    saveTodos(); // Simpan ke local storage
    renderTodos(); // Perbarui tampilan seperti menambah, menghapus, dan mengubah tugas(todo)

    //Bersihkan Input
    todoInput.value = '';
    dateInput.value = '';
};

// MENAMPILKAN UNTUK TUGAS (READ / DISPLAY)
function renderTodos(filterMode = 'all') {
    dataContents.innerHTML = ''; //Kosongkan tampilan saat ini

    // 1. Filter Tugas
    const filteredTodos = todos.filter(todo => {
        if (filterMode === 'all') return true;
        if (filterMode === 'pending') return !todo.completed;
        if (filterMode === 'completed') return todo.completed;
    });

    //Tampilkan pesan "No task found" jika ada tugas
    if (filteredTodos.length === 0) {
        dataContents.innerHTML = '<h5>No task found</h5>';
        return;
    };

    //2. Buat element HTML untuk setiap tugas
    filteredTodos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('data-row');
        //Tambahkan class 'completed' untuk styling CSS
        if (todo.completed) {
            todoItem.classList.add('completed');
        };
    

        //Tampilkan tanggal dalam format yang lebih mudah dibaca
        const displayDate = new Date(todo.date).toLocaleDateString('id-ID', {
            day: 'numeric',    // <-- Tambahkan ini
    month: 'long',     
    year: 'numeric' 
        });

        // Struktur HTML untuk satu baris tugas
        todoItem.innerHTML = `
                <div class="task-text">${todo.text}</div>
                <div class="task-date">${displayDate}</div>
                <div class="task-status">
                    <input type="checkbox" 
                        data-id="${todo.id}" 
                        ${todo.completed ? 'checked' : ''}>
                    <span>${todo.completed ? 'Selesai' : 'Belum'}</span>
                </div>
                <div class="task-actions">
                    <button class="btn-delete-item" data-id="${todo.id}">Hapus</button>
                </div>
        `;

        dataContents.appendChild(todoItem);
    });
};

// C. Fungsi untuk mengubah status (update/toggle)
function toggleComplete(id) {
    // Cari index berdasarkan ID
    const todoIndex = todos.findIndex(todo => todo.id == id);

    if (todoIndex > -1) {
        // Balik status completed
        todos[todoIndex].completed = !todos[todoIndex].completed;
        saveTodos();
        renderTodos(currentFilterState); // Gunakan filter saat ini agar tampilan tidak berubah
    };
};

// D. Fungsi untuk menghapus tugas (delete)
function deleteTodo(id) {
    // Buat array baru yang tidak menyertakan tugas dengan ID tersebut
    todos = todos.filter(todo => todo.id != id);
    saveTodos();
    renderTodos(currentFilterState);
};

// E. FUNGSI UNTUK MENGHAPUS SEMUA TUGAS
function deleteAllTodos() {
    if (confirm("Apakah Anda yakin ingin menghapus SEMUA tugas?")) {
        todos = [];
        saveTodos();
        renderTodos();
    }
}

// ===================================
// III. PENANGANAN EVENT (LISTENERS)
// ===================================

// State Filter saat ini
let currentFilterState = 'all';

// Event: Menambahkan Tugas
todoForm.addEventListener('submit', addTodo);

// Event: Menghapus Semua Tugas
deleteAllButton.addEventListener('click', deleteAllTodos);

// Event: Filtering (Mengganti state filter)
filterButton.addEventListener('click', () => {
    if (currentFilterState === 'all') {
        currentFilterState = 'pending';
        filterButton.textContent = 'FILTER: BELUM';
    } else if (currentFilterState === 'pending') {
        currentFilterState = 'completed';
        filterButton.textContent = 'FILTER: SELESAI';
    } else {
        currentFilterState = 'all';
        filterButton.textContent = 'FILTER: SEMUA';
    }
    renderTodos(currentFilterState);
});


// Event Delegation: Toggle Status & Hapus Satu Tugas
// Kita tambahkan listener di parent (.data-contents)
dataContents.addEventListener('click', (e) => {
    const target = e.target;
    const id = target.dataset.id;
    
    // Toggle Status Selesai/Belum
    if (target.type === 'checkbox' && id) {
        toggleComplete(id);
    }
    
    // Hapus Satu Tugas
    if (target.classList.contains('btn-delete-item') && id) {
        deleteTodo(id);
    }
});


// ===================================
// IV. LOCAL STORAGE & INICIALISASI
// ===================================

function saveTodos() {
    localStorage.setItem('todoList', JSON.stringify(todos));
}

function loadTodos() {
    const storedTodos = localStorage.getItem('todoList');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
    }
    renderTodos();
}

// Mulai aplikasi dengan memuat data dan menampilkan tugas
loadTodos();