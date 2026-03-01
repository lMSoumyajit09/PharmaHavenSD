const scriptURL = "https://script.google.com/macros/s/AKfycbw1eOK2B0onnaKNNd8XitnFmMuy_3kayAbUy4fgkYNjhjnkIjr-TDfKihEvA-jJyk2a/exec";

// Generate 8 digit random bill number
function generateBillNumber() {
    return Math.floor(10000000 + Math.random() * 90000000);
}

let currentBillNo = generateBillNumber();

document.getElementById("date").innerText = new Date().toLocaleDateString();
document.getElementById("billNo").innerText = currentBillNo;

document.addEventListener("input", calculateTotal);

function addMedicine() {
    const div = document.createElement("div");
    div.classList.add("medicineRow");
    div.innerHTML = `
        <input type="text" class="medName" placeholder="Medicine Name">
        <input type="number" class="medPrice" placeholder="Price">
        <input type="number" class="medQty" placeholder="Qty">
    `;
    document.getElementById("medicineContainer").appendChild(div);
}

function calculateTotal() {
    let total = 0;
    document.querySelectorAll(".medicineRow").forEach(row => {
        const price = row.querySelector(".medPrice").value;
        const qty = row.querySelector(".medQty").value;
        total += (price * qty) || 0;
    });
    document.getElementById("totalAmount").innerText = total;
}

function saveRecord() {

    const total = document.getElementById("totalAmount").innerText;

    let medicineText = "";
    document.querySelectorAll(".medicineRow").forEach(row => {
        const name = row.querySelector(".medName").value;
        const price = row.querySelector(".medPrice").value;
        const qty = row.querySelector(".medQty").value;

        if(name){
            medicineText += `${name} (₹${price} x ${qty}), `;
        }
    });

    const data = {
        billNo: currentBillNo,
        customerName: customerName.value,
        address: address.value,
        age: age.value,
        mobile: mobile.value,
        doctorName: doctorName.value,
        regNo: regNo.value,
        medicine: medicineText,
        total: total
    };

    fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(data)
    })
    .then(res => {
        alert("Record Saved Successfully!");

        // Generate new bill number for next bill
        currentBillNo = generateBillNumber();
        document.getElementById("billNo").innerText = currentBillNo;
    })
    .catch(err => alert("Error Saving Data"));
}

function generatePDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("PharmaHaven SD", 20, 20);

    doc.setFontSize(11);
    doc.text("Soumyajit Seal", 20, 28);
    doc.text("Halisahar | +91-9836061563", 20, 34);

    doc.line(20, 38, 190, 38);

    doc.text("Bill No: " + currentBillNo, 20, 45);
    doc.text("Date: " + new Date().toLocaleDateString(), 140, 45);

    doc.text("Customer: " + customerName.value, 20, 55);
    doc.text("Doctor: " + doctorName.value, 20, 62);

    doc.line(20, 68, 190, 68);

    let y = 75;
    doc.text("Medicine", 20, y);
    doc.text("Price", 120, y);
    doc.text("Qty", 150, y);

    y += 5;
    doc.line(20, y, 190, y);
    y += 8;

    document.querySelectorAll(".medicineRow").forEach(row => {
        const name = row.querySelector(".medName").value;
        const price = row.querySelector(".medPrice").value;
        const qty = row.querySelector(".medQty").value;

        if(name){
            doc.text(name, 20, y);
            doc.text("₹" + price, 120, y);
            doc.text(qty, 150, y);
            y += 8;
        }
    });

    doc.line(20, y, 190, y);
    y += 10;

    doc.setFontSize(13);
    doc.text("Total: ₹ " + document.getElementById("totalAmount").innerText, 140, y);

    doc.save("PharmaHaven_Bill.pdf");
}