// ===== BIẾN TOÀN CỤC =====
var danhSachTask = [];
var priorityDangChon = "High"; // mặc định chọn High
var idMoi = 6; // id tự tăng (vì đã có 5 cái mẫu)

// ===== LẤY DỮ LIỆU TỪ data.json =====
function loadData() {
    var dataLocal = localStorage.getItem("danhSachTask");
    if (dataLocal != null) {
        danhSachTask = JSON.parse(dataLocal);
        renderTasks();
    } else {
        fetch("data.json")
            .then(function(res) {
                return res.json();
            })
            .then(function(json) {
                danhSachTask = json;
                saveData();
                renderTasks();
            })
            .catch(function(err) {
                console.log("Lỗi đọc data.json:", err);
            });
    }
}

// ===== LƯU XUỐNG LOCALSTORAGE =====
function saveData() {
    localStorage.setItem("danhSachTask", JSON.stringify(danhSachTask));
}

// ===== RENDER DANH SÁCH TASK =====
function renderTasks() {
    var container = document.getElementById("taskList");
    container.innerHTML = "";

    if (danhSachTask.length == 0) {
        container.innerHTML = '<p class="text-muted text-center py-3">No tasks yet.</p>';
        return;
    }

    for (var i = 0; i < danhSachTask.length; i++) {
        var t = danhSachTask[i];
        var html = "";
        html += '<div class="task-item d-flex align-items-center gap-3">';

        // Cột Task name
        html += '<div style="min-width:140px;">';
        html += '<div class="task-label">Task</div>';
        html += '<div class="task-name">' + t.task + '</div>';
        html += '</div>';

        // Cột Priority
        html += '<div style="min-width:80px;">';
        html += '<div class="task-label">Priority</div>';
        html += '<div class="priority-' + t.priority + '">' + t.priority + '</div>';
        html += '</div>';

        // Badge Status
        html += '<div class="me-auto">';
        html += '<span class="badge-status">' + t.status + '</span>';
        html += '</div>';

        // Nút sửa
        html += '<button class="btn-icon text-warning" title="Edit" onclick="suaTask(' + i + ')">';
        html += '<i class="bi bi-pencil-square"> Sửa </i>';
        html += '</button>';

        // Nút xóa
        html += '<button class="btn-icon text-danger" title="Delete" onclick="xoaTask(' + i + ')">';
        html += '<i class="bi bi-trash"> Xóa </i>';
        html += '</button>';

        html += '</div>';
        container.innerHTML += html;
    }
}

// ===== MỞ / ĐÓNG FORM =====
document.getElementById("btnMoForm").onclick = function() {
    document.getElementById("formCard").style.display = "block";
    document.getElementById("formTask").reset();
    document.getElementById("errorTask").style.display = "none";
    chonPriority("High");
};

document.getElementById("btnDongForm").onclick = function() {
    document.getElementById("formCard").style.display = "none";
};

// ===== CHỌN PRIORITY =====
function chonPriority(p) {
    priorityDangChon = p;
    document.getElementById("btnHigh").classList.remove("active-priority");
    document.getElementById("btnMedium").classList.remove("active-priority");
    document.getElementById("btnLow").classList.remove("active-priority");
    document.getElementById("btn" + p).classList.add("active-priority");
}

// ===== SUBMIT FORM THÊM TASK =====
document.getElementById("formTask").onsubmit = function(e) {
    e.preventDefault();

    var tenTask = document.getElementById("inputTask").value.trim();
    var errorDiv = document.getElementById("errorTask");

    // ===== VALIDATION (Câu 2) =====
    if (tenTask == "") {
        errorDiv.innerText = "Tên task không được để trống!";
        errorDiv.style.display = "block";
        return;
    }
    if (tenTask.length > 100) {
        errorDiv.innerText = "Tên task không được vượt quá 100 ký tự! (Hiện tại: " + tenTask.length + " ký tự)";
        errorDiv.style.display = "block";
        return;
    }

    // Dữ liệu hợp lệ, ẩn lỗi
    errorDiv.style.display = "none";

    // Tạo task mới
    var taskMoi = {
        id: idMoi,
        task: tenTask,
        priority: priorityDangChon,
        status: "To Do"
    };
    idMoi++;

    danhSachTask.push(taskMoi);
    saveData();
    renderTasks();

    // Đóng form và reset
    document.getElementById("formCard").style.display = "none";
    document.getElementById("formTask").reset();
};

// ===== TOGGLE DONE =====
function toggleDone(index) {
    if (danhSachTask[index].status == "Done") {
        danhSachTask[index].status = "To Do";
    } else {
        danhSachTask[index].status = "Done";
    }
    saveData();
    renderTasks();
}

// ===== SỬA TASK (đơn giản: dùng prompt) =====
function suaTask(index) {
    var tenCu = danhSachTask[index].task;
    var tenMoi = prompt("Sửa tên task:", tenCu);

    if (tenMoi == null) return; // bấm Cancel

    tenMoi = tenMoi.trim();

    if (tenMoi == "") {
        alert("Tên task không được để trống!");
        return;
    }
    if (tenMoi.length > 100) {
        alert("Tên task không được vượt quá 100 ký tự!");
        return;
    }

    danhSachTask[index].task = tenMoi;
    saveData();
    renderTasks();
}

// ===== XÓA TASK =====
function xoaTask(index) {
    var xacNhan = confirm("Bạn có chắc muốn xóa task \"" + danhSachTask[index].task + "\" không?");
    if (xacNhan) {
        danhSachTask.splice(index, 1);
        saveData();
        renderTasks();
    }
}

// ===== KHỞI CHẠY =====
loadData();