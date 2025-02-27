// Lấy phần tử <canvas> qua id
const ctx = document.getElementById("timeChart").getContext("2d");

// Mảng lưu thời gian (labels) và giá trị (data)
let labels = [];
let dataPoints = [];

// Tạo biểu đồ
const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Giá trị theo thời gian",
        data: dataPoints,
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        fill: true,
        tension: 0.1,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Thời gian (HH:mm:ss)",
          font: { size: 14, weight: "bold" },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Giá trị đo",
          font: { size: 14, weight: "bold" },
        },
      },
    },
  },
});

// Hàm tiện ích lấy giờ-phút-giây (HH:mm:ss)
function getCurrentTimeString() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

// Kết nối WebSocket tới Node-RED
const socket = new WebSocket('wss://iotbro.hopto.org:1880/ws/potentiostat');

// Khi kết nối thành công
socket.onopen = function () {
  console.log('Connected to Node-RED via WebSocket okeeeeee');
};

// Nhận dữ liệu từ Node-RED
socket.onmessage = function (event) {
  const data = JSON.parse(event.data);
  labels.push(data.time || getCurrentTimeString());
  dataPoints.push(data.value);

  if (labels.length > 60) {
    labels.shift();
    dataPoints.shift();
  }
  myChart.update();
};

// Xử lý lỗi
socket.onerror = function (error) {
  console.error('WebSocket Error:', error);
};

// Gửi dữ liệu từ giao diện tới Node-RED
function sendToNodeRed(message) {
  if (socket.readyState === WebSocket.OPEN) {
    console.log('Gửi:', message); // Thêm log để kiểm tra
    socket.send(JSON.stringify(message));
  } else {
    console.log('WebSocket chưa sẵn sàng:', socket.readyState);
  }
}

// Nút Apply
document.querySelector('.btn--success').addEventListener('click', function () {
  console.log('Nút Apply được nhấn');
  const params = {
    voltage1: parseInt(document.getElementById('voltage1').value, 10),
    voltage2: parseInt(document.getElementById('voltage2').value, 10),
    action: 'apply' // Thêm action để Node-RED biết đây là lệnh Apply
  };
  sendToNodeRed(params);
});




// Xử lý nút "Measure"
document.querySelector('.btn--go').addEventListener('click', function () {
  console.log('Nút Measure được nhấn');
  const params = {
    port: document.getElementById('port-select').value,
   // voltage1: parseInt(document.getElementById('voltage1').value, 10),
   // voltage2: parseInt(document.getElementById('voltage2').value, 10),
    method: document.getElementById('detection-method').value,
    start: document.getElementById('start-voltage').value,
    end: document.getElementById('end-voltage').value,
    step: document.getElementById('step-voltage').value,
    repeat: document.getElementById('repeat-times').value,
    sweepEnable: document.getElementById('sweepEnable').checked,
    logarithmic: document.getElementById('logarithmic').checked,
    action: 'measure'
  };
  sendToNodeRed(params);
});

// Xử lý thay đổi detection method
document.getElementById('detection-method').addEventListener('change', function () {
  var method = this.value;
  if (method === 'eis') {
    document.getElementById('start-label').textContent = 'Start Fred(Hz):';
    document.getElementById('end-label').textContent = 'End Fred(Hz):';
    document.getElementById('step-label').textContent = 'Sweep Points:';
    document.getElementById('repeat-label').textContent = 'Repeat Times :';
  } else {
    document.getElementById('start-label').textContent = 'Start Voltage (mV):';
    document.getElementById('end-label').textContent = 'End Voltage (mV):';
    document.getElementById('step-label').textContent = 'Step (mV):';
    document.getElementById('repeat-label').textContent = 'Repeat Times:';
  }
});

// Xử lý checkbox
document.getElementById('sweepEnable').addEventListener('change', function (e) {
  console.log('Sweep enable:', e.target.checked);
});

document.getElementById('logarithmic').addEventListener('change', function (e) {
  console.log('Logarithmic:', e.target.checked);
});




////////
