// =====================================
// Admin Login
// =====================================

// يمكنك تغيير كلمة المرور هنا
const ADMIN_PASSWORD = "admin123";

// =====================================

function loginAdmin() {

    const password = document
        .getElementById("adminPassword")
        .value
        .trim();

    // التحقق من كلمة المرور

    if (password === "") {

        showToast("من فضلك أدخل كلمة المرور", "#d94343");

        return;

    }

    if (password !== ADMIN_PASSWORD) {

        showToast("كلمة المرور غير صحيحة", "#d94343");

        return;

    }

    // حفظ حالة تسجيل الدخول

    localStorage.setItem("adminLogged", "true");

    showToast("تم تسجيل الدخول ✅");

    setTimeout(() => {

        window.location.href = "admin.html";

    }, 800);

}

// =====================================
// Enter Key
// =====================================

document
    .getElementById("adminPassword")
    .addEventListener("keypress", function (e) {

        if (e.key === "Enter") {

            loginAdmin();

        }

    });