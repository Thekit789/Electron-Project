// รอให้ HTML โหลดเสร็จสมบูรณ์ก่อนเริ่มทำงาน
document.addEventListener("DOMContentLoaded", () => {
  // --- STATE MANAGEMENT (เก็บข้อมูลฟอร์ม) ---
  const formState = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    sourceOfNumber: "เดินมาหน้าร้าน",
    brand: "Honda",
    carModel: "",
    salesType: "ขายสด",
    notes: "",
  };

  // --- MOCKUP DATA ---
  const hondaModels = [
    "Wave 110",
    "Wave 125",
    "Scoopy i",
    "Click 160",
    "Click 125",
    "Giorno",
    "Lead",
    "Forza",
    "ADV160",
    "ADV350",
  ];
  const yamahaModels = [
    "Finn",
    "Exciter",
    "NMAX",
    "XSR155",
    "MT-15",
    "R15",
    "Fazzio",
    "Grand Filano",
  ];

  // --- DOM ELEMENTS (เชื่อมต่อกับ HTML) ---
  const elements = {
    form: document.getElementById("customerForm"),
    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    phoneNumber: document.getElementById("phoneNumber"),
    notes: document.getElementById("notes"),
    carModel: document.getElementById("carModel"),
    submitButton: document.getElementById("submitButton"),
    brandRadios: document.querySelectorAll('input[name="brand"]'),
    sourceRadios: document.querySelectorAll('input[name="sourceOfNumber"]'),
    salesTypeRadios: document.querySelectorAll('input[name="salesType"]'),

    // Errors
    firstNameError: document.getElementById("firstNameError"),
    phoneNumberError: document.getElementById("phoneNumberError"),
    carModelError: document.getElementById("carModelError"),
    notesError: document.getElementById("notesError"),

    // Modals
    confirmModal: document.getElementById("confirmModal"),
    cancelButton: document.getElementById("cancelButton"),
    confirmButton: document.getElementById("confirmButton"),
    successMessage: document.getElementById("successMessage"),
  };

  // --- VALIDATION LOGIC (ตรรกะการตรวจสอบข้อมูล) ---
  const validators = {
    isFirstNameValid: () =>
      /^[a-zA-Zก-ฮะ-์\s]+$/.test(formState.firstName.trim()) &&
      formState.firstName.trim().length > 0,
    isPhoneNumberValid: () => /^\d{10}$/.test(formState.phoneNumber.trim()),
    isCarModelValid: () =>
      formState.carModel !== "" && formState.carModel !== null,
    isNotesValid: () => formState.notes.trim().length >= 15,
  };

  // --- CORE FUNCTIONS (ฟังก์ชันหลัก) ---

  // ฟังก์ชันอัปเดตสถานะของปุ่ม Submit
  function updateFormValidity() {
    // ตรวจสอบเงื่อนไขทั้ง 4 ข้อ
    const isFormValid =
      validators.isFirstNameValid() &&
      validators.isPhoneNumberValid() &&
      validators.isCarModelValid() &&
      validators.isNotesValid();

    // เปิด/ปิด ปุ่ม submit ตามผลลัพธ์
    elements.submitButton.disabled = !isFormValid;
  }

  // ฟังก์ชันจัดการการแสดงผล error และเรียก updateFormValidity
  function handleValidation(inputElement, errorElement, validator) {
    const isValid = validator();
    if (errorElement) {
      errorElement.style.display = isValid ? "none" : "block";
    }
    if (inputElement) {
      inputElement.classList.toggle("error-border", !isValid);
    }
    updateFormValidity();
  }

  // ฟังก์ชันอัปเดตตัวเลือกรุ่นรถตามยี่ห้อ
  function updateCarModels() {
    elements.carModel.innerHTML =
      '<option disabled selected value="">-- เลือกรุ่นรถ --</option>'; // ล้างของเก่า
    const models = formState.brand === "Honda" ? hondaModels : yamahaModels;
    models.forEach((model) => {
      const option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      elements.carModel.appendChild(option);
    });
    elements.carModel.disabled = false;
    formState.carModel = ""; // Reset ค่าที่เลือก
    elements.carModel.value = ""; // Reset ที่หน้าจอ
    // เมื่อยี่ห้อเปลี่ยน รุ่นรถจะถูกล้างค่า ทำให้ฟอร์มไม่สมบูรณ์ ต้องตรวจสอบใหม่
    handleValidation(
      elements.carModel,
      elements.carModelError,
      validators.isCarModelValid
    );
  }

  // ฟังก์ชันรีเซ็ตฟอร์มทั้งหมด
  function resetForm() {
    elements.form.reset();
    Object.assign(formState, {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      sourceOfNumber: "เดินมาหน้าร้าน",
      brand: "Honda",
      carModel: "",
      salesType: "ขายสด",
      notes: "",
    });
    updateCarModels();
    // ซ่อน error ทั้งหมด
    document
      .querySelectorAll(".error-message")
      .forEach((el) => (el.style.display = "none"));
    document
      .querySelectorAll(".form-input, .form-textarea, .form-select")
      .forEach((el) => el.classList.remove("error-border"));
    // ปิดการใช้งานปุ่ม Submit หลังจากรีเซ็ต
    updateFormValidity();
  }

  // --- EVENT LISTENERS (ตัวดักจับเหตุการณ์) ---

  // ชื่อจริง
  elements.firstName.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Zก-ฮะ-์\s]/g, "");
    formState.firstName = e.target.value;
    handleValidation(
      elements.firstName,
      elements.firstNameError,
      validators.isFirstNameValid
    );
  });

  // นามสกุล
  elements.lastName.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Zก-ฮะ-์\s]/g, "");
    formState.lastName = e.target.value;
  });

  // เบอร์โทร
  elements.phoneNumber.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
    formState.phoneNumber = e.target.value;
    handleValidation(
      elements.phoneNumber,
      elements.phoneNumberError,
      validators.isPhoneNumberValid
    );
  });

  // หมายเหตุ
  elements.notes.addEventListener("input", (e) => {
    formState.notes = e.target.value;
    handleValidation(
      elements.notes,
      elements.notesError,
      validators.isNotesValid
    );
  });

  // รุ่นรถ
  elements.carModel.addEventListener("change", (e) => {
    formState.carModel = e.target.value;
    handleValidation(
      elements.carModel,
      elements.carModelError,
      validators.isCarModelValid
    );
  });

  // ยี่ห้อรถ
  elements.brandRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      formState.brand = e.target.value;
      updateCarModels(); // ฟังก์ชันนี้จะเรียก handleValidation ให้อยู่แล้ว
    });
  });

  // อัปเดตค่าเมื่อเลือก Radio อื่นๆ
  elements.sourceRadios.forEach((r) =>
    r.addEventListener(
      "change",
      (e) => (formState.sourceOfNumber = e.target.value)
    )
  );
  elements.salesTypeRadios.forEach((r) =>
    r.addEventListener("change", (e) => (formState.salesType = e.target.value))
  );

  // จัดการการ Submit ฟอร์ม
  elements.form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!elements.submitButton.disabled) {
      elements.confirmModal.style.display = "flex";
    }
  });

  // จัดการปุ่มใน Modal
  elements.cancelButton.addEventListener("click", () => {
    elements.confirmModal.style.display = "none";
  });

  elements.confirmButton.addEventListener("click", () => {
    const leadData = { ...formState, submissionDate: new Date().toISOString() };
    console.log("--- Data Saved ---");
    console.log(JSON.stringify(leadData, null, 2));

    elements.confirmModal.style.display = "none";
    elements.successMessage.style.display = "block";

    setTimeout(() => {
      elements.successMessage.style.display = "none";
    }, 3000);

    resetForm();
  });

  // --- INITIALIZATION (การตั้งค่าเริ่มต้น) ---
  updateCarModels();
});
