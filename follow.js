document.addEventListener("DOMContentLoaded", () => {
  const customers = [
    {
      id: 1,
      branch: "ลพบุรี",
      date: "14/08/2568",
      name: "สมชาย ใจดี",
      phone: "0812345678",
      salesType: "ขายสด",
      carModel: "Wave 110",
    },
    {
      id: 2,
      branch: "ลพบุรี",
      date: "14/08/2568",
      name: "สมศรี มีสุข",
      phone: "0823456789",
      salesType: "ขายผ่อน",
      carModel: "Scoopy i",
    },
    {
      id: 3,
      branch: "ลพบุรี",
      date: "13/08/2568",
      name: "มานะ อดทน",
      phone: "0834567890",
      salesType: "ขายไฟแนนซ์",
      carModel: "Forza",
    },
    {
      id: 4,
      branch: "สระบุรี",
      date: "13/08/2568",
      name: "ปิติ ยินดี",
      phone: "0845678901",
      salesType: "ขายสด",
      carModel: "Click 160",
    },
  ];

  let selectedCustomer = null;
  let followUpState = {};

  const elements = {
    tableBody: document.getElementById("customerTableBody"),
    searchNameInput: document.getElementById("searchName"),
    searchPhoneInput: document.getElementById("searchPhone"),
    selectedCustomerName: document.getElementById("selectedCustomerName"),
    followUpForm: document.getElementById("followUpForm"),
    saveFollowUpButton: document.getElementById("saveFollowUpButton"),
    followUpNotes: document.getElementById("followUpNotes"),
    notesGroup: document.getElementById("notesGroup"),
    appointmentSection: document.getElementById("appointmentSection"),
    appointmentFollowUpSection: document.getElementById(
      "appointmentFollowUpSection"
    ),
    showedUpSection: document.getElementById("showedUpSection"),
    noShowSection: document.getElementById("noShowSection"),
    appointmentDate: document.getElementById("appointmentDate"),
    // เพิ่มส่วนของ Modal ที่หายไป
    confirmModal: document.getElementById("followUpConfirmModal"),
    cancelButton: document.getElementById("followUpCancelButton"),
    confirmButton: document.getElementById("followUpConfirmButton"),
    successMessage: document.getElementById("followUpSuccessMessage"),
  };

  const resetFollowUpForm = () => {
    followUpState = {
      callStatus: "ลูกค้าสะดวกคุย",
      appointmentDate: "",
      timeSlot: "ช่วงเช้า",
      appointmentStatus: "",
      customerStatus: "",
      salesType: "",
      furtherFollowUp: "",
      notes: "",
    };
    elements.followUpForm.reset();
    document.querySelector(
      'input[name="callStatus"][value="ลูกค้าสะดวกคุย"]'
    ).checked = true;
  };

  const updateFormLogic = () => {
    if (!selectedCustomer) {
      elements.saveFollowUpButton.disabled = true;
      return;
    }

    const {
      callStatus,
      notes,
      appointmentDate,
      appointmentStatus,
      customerStatus,
      salesType,
      furtherFollowUp,
    } = followUpState;
    const nonConvenientStatuses = [
      "ลูกค้าไม่สะดวกคุย",
      "โทรติด/ไม่รับสาย",
      "โทรไม่ติด",
      "เบอร์ผิด",
    ];

    const isConvenient = callStatus === "ลูกค้าสะดวกคุย";
    elements.appointmentSection.disabled = !isConvenient;
    elements.appointmentFollowUpSection.disabled = !(
      isConvenient && appointmentDate
    );
    elements.showedUpSection.disabled = !(
      isConvenient && appointmentStatus === "มาตามนัด"
    );
    elements.noShowSection.disabled = !(
      isConvenient && appointmentStatus === "ไม่มาตามนัด"
    );

    let isSaveButtonDisabled = true;

    if (nonConvenientStatuses.includes(callStatus)) {
      isSaveButtonDisabled = notes.trim().length <= 15;
    } else if (isConvenient) {
      if (appointmentStatus === "มาตามนัด") {
        isSaveButtonDisabled = !(
          appointmentDate &&
          customerStatus &&
          salesType
        );
      } else if (appointmentStatus === "ไม่มาตามนัด") {
        isSaveButtonDisabled = !(
          appointmentDate &&
          furtherFollowUp &&
          notes.trim().length > 15
        );
      }
    }

    elements.saveFollowUpButton.disabled = isSaveButtonDisabled;

    const isNotesRequired =
      nonConvenientStatuses.includes(callStatus) ||
      appointmentStatus === "ไม่มาตามนัด";
    elements.notesGroup.classList.toggle("highlight-notes", isNotesRequired);
  };

  const renderTable = (customerList) => {
    elements.tableBody.innerHTML = "";
    customerList.forEach((customer, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${index + 1}</td><td>${customer.branch}</td><td>${
        customer.date
      }</td><td>${customer.name}</td><td>${customer.phone}</td><td>${
        customer.salesType
      }</td><td>${customer.carModel}</td>`;
      row.dataset.customerId = customer.id;
      row.addEventListener("click", () => selectCustomer(customer));
      elements.tableBody.appendChild(row);
    });
  };

  const selectCustomer = (customer) => {
    selectedCustomer = customer;
    elements.selectedCustomerName.textContent = `- ${customer.name}`;
    document.querySelectorAll("#customerTableBody tr").forEach((r) => {
      r.classList.toggle("selected-row", r.dataset.customerId == customer.id);
    });
    resetFollowUpForm();
    updateFormLogic();
  };

  const handleSearch = () => {
    const nameQuery = elements.searchNameInput.value.trim().toLowerCase();
    const phoneQuery = elements.searchPhoneInput.value.trim();
    const filtered = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(nameQuery) && c.phone.includes(phoneQuery)
    );
    renderTable(filtered);
  };

  elements.searchNameInput.addEventListener("input", handleSearch);
  elements.searchPhoneInput.addEventListener("input", handleSearch);

  // แก้ไข `submit` event listener ให้เรียก Modal
  elements.followUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!elements.saveFollowUpButton.disabled) {
      elements.confirmModal.style.display = "flex";
    }
  });

  // เพิ่ม event listener สำหรับปุ่มใน Modal
  elements.cancelButton.addEventListener("click", () => {
    elements.confirmModal.style.display = "none";
  });

  elements.confirmButton.addEventListener("click", () => {
    elements.confirmModal.style.display = "none";
    elements.successMessage.style.display = "block";
    console.log("บันทึกข้อมูล:", {
      customer: selectedCustomer,
      followUp: followUpState,
    });
    setTimeout(() => {
      elements.successMessage.style.display = "none";
    }, 3000);
    selectCustomer(selectedCustomer);
  });

  elements.followUpForm.addEventListener("input", (e) => {
    const { name, value, id } = e.target;
    if (id === "followUpNotes") {
      followUpState.notes = value;
    } else if (name) {
      followUpState[name] = value;
    }
    updateFormLogic();
  });

  // ใช้ 'change' สำหรับ radio buttons และ date picker
  elements.followUpForm.addEventListener("change", (e) => {
    const { name, value } = e.target;
    if (name) {
      followUpState[name] = value;
      if (name === "appointmentStatus") {
        if (value === "มาตามนัด") {
          followUpState.furtherFollowUp = "";
          const furtherFollowUpRadio = document.querySelector(
            'input[name="furtherFollowUp"]:checked'
          );
          if (furtherFollowUpRadio) furtherFollowUpRadio.checked = false;
        } else if (value === "ไม่มาตามนัด") {
          followUpState.customerStatus = "";
          followUpState.salesType = "";
          const customerStatusRadio = document.querySelector(
            'input[name="customerStatus"]:checked'
          );
          const salesTypeRadio = document.querySelector(
            'input[name="salesType"]:checked'
          );
          if (customerStatusRadio) customerStatusRadio.checked = false;
          if (salesTypeRadio) salesTypeRadio.checked = false;
        }
      }
    }
    updateFormLogic();
  });

  renderTable(customers);
  updateFormLogic();
});
